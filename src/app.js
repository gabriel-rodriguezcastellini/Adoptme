import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import usersRouter from "./routes/users.router.js";
import petsRouter from "./routes/pets.router.js";
import adoptionsRouter from "./routes/adoption.router.js";
import sessionsRouter from "./routes/sessions.router.js";
import mocksRouter from "./routes/mocks.router.js";
import logger from "./utils/logger.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

try {
  mongoose.connect(process.env.URL_MONGO);
  logger.info("Connected to MongoDB");
} catch (error) {
  logger.error(`MongoDB connection error: ${error}`);
}

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", usersRouter);
app.use("/api/pets", petsRouter);
app.use("/api/adoptions", adoptionsRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/api/mocks", mocksRouter);

app.get("/loggerTest", (_req, res) => {
  logger.debug("Debug log");
  logger.http("HTTP log");
  logger.info("Info log");
  logger.warning("Warning log");
  logger.error("Error log");
  logger.fatal("Fatal log");
  res.send("Logger test completed");
});

app.listen(PORT, () => logger.info(`Listening on ${PORT}`));
