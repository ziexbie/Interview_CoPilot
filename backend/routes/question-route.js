import express from "express";

import {
  deleteQuestion,
  getQuestionsBySession,
  toggleQuestionPin,
  updateQuestion,
} from "../controller/question-controller.js";
import { protect } from "../middlewares/auth-middleware.js";

const router = express.Router();

router.get("/session/:sessionId", protect, getQuestionsBySession);
router.patch("/:id", protect, updateQuestion);
router.patch("/:id/pin", protect, toggleQuestionPin);
router.delete("/:id", protect, deleteQuestion);

export default router;
