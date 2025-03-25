import { Sequelize } from "sequelize-typescript";
import Link from "./models/Link";
import Analytic from "./models/Analytic";
import dotenv from "dotenv";

dotenv.config();

const dbName = process.env.DB_NAME || "postgres";
const username = process.env.DB_USERNAME || "postgres";
const password = process.env.DB_PASSWORD || "postgres";

const sequelize = new Sequelize(dbName, username, password, {
  host: "localhost",
  port: 5432,
  dialect: "postgres",
  logging: false,
});

sequelize.addModels([Link, Analytic]);

export default sequelize;
