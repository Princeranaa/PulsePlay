import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
};

export default _config;
