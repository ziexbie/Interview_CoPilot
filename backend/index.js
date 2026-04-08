import dotenv from "dotenv";
import { fileURLToPath } from "node:url";
import path from "node:path";

dotenv.config({
  path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env"),
  quiet: true,
});

import cors from "cors";
import express from "express";
import { connectDB } from "./config/database-config.js";

import {
  generateConceptExplanation,
  generateInterviewQuestions,
} from "./controller/ai-controller.js";
import { protect } from "./middlewares/auth-middleware.js";
import authRoutes from "./routes/auth-route.js";
import authQuestions from "./routes/question-route.js";
import authSessions from "./routes/session-route.js";

const app = express();
const PORT = process.env.PORT || 9000;

app.use(
  cors({
    origin: true,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Access-Control-Allow-Origin",
    ],
  }),
);

app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/sessions", authSessions);
app.use("/api/questions", authQuestions);

app.post("/api/ai/generate-questions", protect, generateInterviewQuestions);
app.post("/api/ai/generate-explanation", protect, generateConceptExplanation);

app.use(
  "/uploads",
  express.static(path.join(import.meta.dirname, "uploads"), {}),
);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, (err) => {
      if (err) {
        console.log(err);
        return;
      }

      console.log("server running at port, ", PORT);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
