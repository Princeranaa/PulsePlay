import express from "express";
const app = express();
import sendEmail from "./utils/email.js";

/* sendEmail(
  "ranaprince45may@gmail.com", // Receiver email
  "Welcome to My App!", // Email subject
  "Hello Prince,\nYour account was created successfully.", // Plain text content
  "<h1>Hello Prince!</h1><p>Your account was created successfully.</p>" // HTML content
); */

export default app;
