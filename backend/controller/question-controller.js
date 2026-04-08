import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

const getOwnedSession = async (sessionId, userId) => {
  const session = await Session.findById(sessionId).populate("questions");

  if (!session) {
    return { status: 404, body: { success: false, message: "Session not found" } };
  }

  if (session.user.toString() !== userId.toString()) {
    return { status: 403, body: { success: false, message: "Not authorized" } };
  }

  return { session };
};

const getOwnedQuestion = async (questionId, userId) => {
  const question = await Question.findById(questionId).populate("session", "user");

  if (!question) {
    return {
      status: 404,
      body: { success: false, message: "Question not found" },
    };
  }

  if (!question.session || question.session.user.toString() !== userId.toString()) {
    return { status: 403, body: { success: false, message: "Not authorized" } };
  }

  return { question };
};

export const getQuestionsBySession = async (req, res) => {
  try {
    const result = await getOwnedSession(req.params.sessionId, req.user._id);

    if (!result.session) {
      return res.status(result.status).json(result.body);
    }

    return res.status(200).json({
      success: true,
      questions: result.session.questions,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch questions",
      error: error.message,
    });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const result = await getOwnedQuestion(req.params.id, req.user._id);

    if (!result.question) {
      return res.status(result.status).json(result.body);
    }

    const allowedUpdates = ["question", "answer", "note", "isPinned"];

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        result.question[key] = req.body[key];
      }
    }

    await result.question.save();

    return res.status(200).json({
      success: true,
      question: result.question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update question",
      error: error.message,
    });
  }
};

export const toggleQuestionPin = async (req, res) => {
  try {
    const result = await getOwnedQuestion(req.params.id, req.user._id);

    if (!result.question) {
      return res.status(result.status).json(result.body);
    }

    result.question.isPinned = !result.question.isPinned;
    await result.question.save();

    return res.status(200).json({
      success: true,
      question: result.question,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to update question pin",
      error: error.message,
    });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const result = await getOwnedQuestion(req.params.id, req.user._id);

    if (!result.question) {
      return res.status(result.status).json(result.body);
    }

    await Session.findByIdAndUpdate(result.question.session._id, {
      $pull: { questions: result.question._id },
    });
    await result.question.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Question deleted",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete question",
      error: error.message,
    });
  }
};
