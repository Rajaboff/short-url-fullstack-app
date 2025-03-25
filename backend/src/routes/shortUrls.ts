import express, { Application, Request, Response } from "express";
import { createShortUrl, ShortUrl } from "../models/shortUrl";
import {
  isValidUrl,
  isLinkExpired,
  generateAlias,
} from "../utils/shortUrlUtils";
import Link from "../db/models/Link";
import Analytic from "../db/models/Analytic";
import rateLimit from "express-rate-limit";

const app: Application = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000,
  max: 50,
  message: { error: "Слишком много запросов, попробуйте позже." },
});

app.use(limiter);

app.post("/shorten", async (req: Request, res: Response) => {
  const { originalUrl, expiresAt, alias } = req.body;

  if (!isValidUrl(originalUrl)) {
    res.status(400).json({ error: "Неверный формат URL" });
    return;
  }

  if (expiresAt && isLinkExpired(expiresAt)) {
    res.status(400).json({ error: "Дата истечения срока действия уже прошла" });
    return;
  }

  const generatedAlias = generateAlias(alias);

  try {
    const shortened = await createShortUrl(
      originalUrl,
      expiresAt,
      generatedAlias
    );
    res.json({ shortenedUrl: shortened });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при создании сокращенного URL" });
  }
});

app.get("/:shortUrl", async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const link = await Link.findOne({
      where: {
        alias: shortUrl,
      },
    });

    if (link && isLinkExpired(link.dataValues.expiresAt)) {
      res.status(410).json({ error: "Срок действия ссылки истек" });
      return;
    }

    if (!link?.dataValues) {
      res.status(404).json({ error: "Ссылка не найдена" });
      return;
    }

    const updatedData = await Link.update(
      {
        clickCount: link.dataValues.clickCount + 1,
      },
      {
        where: { alias: shortUrl },
        returning: true,
      }
    );

    if (!updatedData) {
      res.status(500).json({ error: "Ошибка при обновлении данных" });
      return;
    }

    updateAnalytics(link.dataValues, req, res);

    res.redirect(link.dataValues.originalUrl);
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обработке запроса" });
  }
});

app.get("/info/:shortUrl", async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const link = await Link.findOne({
      where: {
        alias: shortUrl,
      },
    });

    if (!link) {
      res.status(404).json({ error: "Ссылка не найдена" });
      return;
    }

    const { originalUrl, createdAt, clickCount } = link.dataValues;

    res.json({ originalUrl, createdAt, clickCount });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обработке запроса" });
  }
});

app.delete("/delete/:shortUrl", async (req: Request, res: Response) => {
  const { shortUrl } = req.params;

  try {
    const result = await Link.destroy({
      where: {
        alias: shortUrl,
      },
    });

    if (result === 0) {
      res.status(404).json({ error: "Ссылка не найдена или уже удалена" });
      return;
    }

    res.json({ message: "Ссылка успешно удалена" });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при удалении ссылки" });
  }
});

app.get("/analytics/:shortUrl", async (req: Request, res: Response) => {
  const { shortUrl } = req.params;
  const { limit } = req.query;

  const sliceLimit = parseInt(limit as string, 10) || 5;

  try {
    const items = await Analytic.findAll({
      where: { alias: shortUrl },
      limit: sliceLimit,
      order: [["createdAt", "DESC"]],
    });

    if (!items) {
      res.status(404).json({ error: "Ссылка не найдена" });
      return;
    }

    res.json({
      data: items.map((i) => i.dataValues),
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка при обработке запроса" });
  }
});

const updateAnalytics = async (
  shortData: ShortUrl,
  req: Request,
  res: Response
) => {
  let ip = (req.headers["x-forwarded-for"] ||
    req.socket.remoteAddress) as string;

  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }

  ip = ip.replace("::ffff:", "-");

  try {
    const analytic = await Analytic.findOne({
      where: {
        ip,
        alias: shortData.alias,
      },
    });

    if (!analytic) {
      const data = await Analytic.create({
        shortUrl: shortData.shortUrl,
        alias: shortData.alias,
        ip,
        clickCount: 1,
      });

      if (!data) {
        console.error("Ошибка при создании аналитики");
        res.status(404).json({ error: "Ссылка не найдена" });
        return;
      }
    } else {
      const { ip, clickCount } = analytic!.dataValues;

      await Analytic.update(
        { clickCount: clickCount + 1 },
        {
          where: { ip, shortUrl: shortData.shortUrl },
        }
      );
    }
  } catch (error) {
    console.error("Ошибка при обновлении аналитики:", error);
  }
};

export default app;
