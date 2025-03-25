import express from "express";
import shortUrlRouter from "./routes/shortUrls";
import dotenv from "dotenv";
import cors from "cors";
import sequelize from "./db/db";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

sequelize
  .authenticate()
  .then(() => {
    console.log("Соединение с базой данных установлено");
    return sequelize.sync({ alter: true })
  })
  .then(() => {
    console.log("Таблицы синхронизированы");
  })
  .catch((err) => {
    console.error("Невозможно подключиться к базе данных:", err);
  });

const port = process.env.PORT || 5000;

app.use("/", shortUrlRouter);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
