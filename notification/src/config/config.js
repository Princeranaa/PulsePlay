import { config as dotenvConfig } from "dotenv";
dotenvConfig();

const _config = {
  // CLIENT_ID: process.env.CLIENT_ID,
  // CLIENT_SECRET: process.env.CLIENT_SECRET,
  // REFRESH_TOKEN: process.env.REFRESH_TOKEN,
  // EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URL: process.env.MONGO_URL,
  RABBITMQ_URI: process.env.RABBITMQ_URI,
};

export default Object.freeze(_config);
