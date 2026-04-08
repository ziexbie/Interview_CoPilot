import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

const QUESTION_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];
const EXPLANATION_MODELS = ["gemini-2.5-flash", "gemini-2.5-flash-lite"];

const getAiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in backend/.env");
  }

  return new GoogleGenAI({ apiKey });
};

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const parseAiError = (error) => {
  try {
    const parsed = JSON.parse(error.message);
    return parsed.error || parsed;
  } catch {
    return null;
  }
};

const getRetryDelayMs = (parsedError, attempt) => {
  const retryDelay = parsedError?.details?.find(
    (detail) => detail?.["@type"] === "type.googleapis.com/google.rpc.RetryInfo",
  )?.retryDelay;

  const seconds = Number.parseFloat(retryDelay);
  if (Number.isFinite(seconds) && seconds > 0) {
    return Math.min(seconds * 1000, 3000);
  }

  return 1000 * (attempt + 1);
};

const isRetryableAiError = (parsedError) => {
  const code = parsedError?.code;
  const status = parsedError?.status;

  return (
    code === 429 ||
    code === 500 ||
    code === 503 ||
    status === "RESOURCE_EXHAUSTED" ||
    status === "UNAVAILABLE" ||
    status === "INTERNAL"
  );
};

const createServiceBusyError = (parsedError, lastError) => {
  const friendlyError = new Error(
    "The AI service is busy right now. Please try again in a few seconds.",
  );

  friendlyError.statusCode =
    parsedError?.code === 429 || parsedError?.status === "RESOURCE_EXHAUSTED"
      ? 429
      : 503;
  friendlyError.details = parsedError?.message || lastError?.message;

  return friendlyError;
};

const generateContentWithFallback = async ({
  models,
  contents,
  maxAttemptsPerModel = 2,
}) => {
  const ai = getAiClient();
  let lastError = null;
  let lastParsedError = null;

  for (const model of models) {
    for (let attempt = 0; attempt < maxAttemptsPerModel; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
        });

        return { model, response };
      } catch (error) {
        lastError = error;
        lastParsedError = parseAiError(error);

        if (!isRetryableAiError(lastParsedError)) {
          throw error;
        }

        const hasMoreAttemptsForModel = attempt < maxAttemptsPerModel - 1;
        const hasFallbackModel = model !== models[models.length - 1];

        if (!hasMoreAttemptsForModel && !hasFallbackModel) {
          throw createServiceBusyError(lastParsedError, error);
        }

        if (hasMoreAttemptsForModel) {
          await wait(getRetryDelayMs(lastParsedError, attempt));
        }
      }
    }
  }

  if (lastParsedError) {
    throw createServiceBusyError(lastParsedError, lastError);
  }

  throw lastError || new Error("Failed to generate AI response");
};

const cleanJsonText = (rawText) =>
  rawText
    .replace(/^```json\s*/, "")
    .replace(/^```\s*/, "")
    .replace(/```$/, "")
    .replace(/^json\s*/, "")
    .trim();

const extractTextFromResponse = (response) => {
  if (typeof response?.text === "function") {
    const text = response.text();
    if (typeof text === "string" && text.trim()) {
      return text.trim();
    }
  }

  if (typeof response?.text === "string" && response.text.trim()) {
    return response.text.trim();
  }

  const parts = response?.candidates?.[0]?.content?.parts ?? [];

  return parts
    .filter((part) => !part.thought)
    .map((part) => part.text ?? "")
    .join("")
    .trim();
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const prompt = questionAnswerPrompt(
      session.role,
      session.experience,
      session.topicsToFocus,
      10,
    );

    const { response } = await generateContentWithFallback({
      models: QUESTION_MODELS,
      contents: prompt,
    });

    const rawText = extractTextFromResponse(response);
    if (!rawText) {
      throw new Error("AI returned an empty response");
    }

    const cleanedText = cleanJsonText(rawText);

    let questions;
    try {
      questions = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        questions = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error("Response is not an array");
    }

    const normalizedQuestions = questions
      .filter((item) => typeof item?.question === "string" && item.question.trim())
      .map((item) => ({
        session: sessionId,
        question: item.question.trim(),
        answer: typeof item.answer === "string" ? item.answer.trim() : "",
        note: "",
        isPinned: false,
      }));

    if (normalizedQuestions.length === 0) {
      throw new Error("AI did not return any valid questions");
    }

    await Question.deleteMany({ session: sessionId });

    const saved = await Question.insertMany(normalizedQuestions);

    session.questions = saved.map((question) => question._id);
    await session.save();

    return res.status(201).json({ success: true, questions: saved });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
      details: error.details,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const { response } = await generateContentWithFallback({
      models: EXPLANATION_MODELS,
      contents: prompt,
    });

    const rawText = extractTextFromResponse(response);
    if (!rawText) {
      throw new Error("AI returned an empty response");
    }

    const cleanedText = cleanJsonText(rawText);

    let explanation;
    try {
      explanation = JSON.parse(cleanedText);
    } catch {
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    if (!explanation.title || !explanation.explanation) {
      throw new Error(
        "Response missing required fields: title and explanation",
      );
    }

    return res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    return res.status(error.statusCode || 500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
      details: error.details,
    });
  }
};
