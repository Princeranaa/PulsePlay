import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  PORT: process.env.PORT,
  MONGO_URL: process.env.MONGO_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  Client_Secret: process.env.Client_Secret,
  Client_ID: process.env.Client_ID,
};

export default _config;
