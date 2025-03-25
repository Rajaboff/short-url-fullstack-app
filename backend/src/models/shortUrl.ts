import { v4 as uuidv4 } from "uuid";
import dotenv from "dotenv";
import Link from "../db/models/Link";

dotenv.config();

const url = "http://localhost";
const port = process.env.PORT || 5000;

export interface ShortUrl {
  originalUrl: string;
  shortUrl: string;
  alias?: string;
  expiresAt?: Date;
  createdAt: Date;
  clickCount: number;
}

export interface ShortUrlAnalytic {
  ip: string;
  date: Date;
}

export const createShortUrl = async (
  originalUrl: string,
  expiresAt?: string,
  alias?: string
): Promise<string> => {
  const id = alias || uuidv4();
  const shortUrl = `${url}:${port}/${id}`;

  // Проверка корректности даты
  const parsedExpiresAt = expiresAt ? new Date(expiresAt) : null;
  if (expiresAt && parsedExpiresAt && isNaN(parsedExpiresAt.getTime())) {
    throw new Error("Некорректная дата истечения срока действия");
  }

  try {
    await Link.create({
      originalUrl,
      shortUrl,
      alias: id,
      expiresAt: parsedExpiresAt,
      createdAt: new Date(),
      clickCount: 0,
    });

    return shortUrl;
  } catch (error) {
    console.error("Ошибка при создании короткой ссылки:", error);
    throw new Error("Не удалось создать короткую ссылку");
  }
};
