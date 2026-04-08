import { useCallback, useEffect, useMemo, useState } from "react";
import {
  HiArrowPath,
  HiBars3BottomLeft,
  HiBolt,
  HiChevronDown,
  HiChevronLeft,
  HiChevronRight,
  HiChevronUp,
  HiClock,
  HiOutlineBookmark,
  HiMagnifyingGlass,
  HiOutlineSparkles,
  HiSparkles,
} from "react-icons/hi2";
import ReactMarkdown from "react-markdown";
import { useNavigate, useParams } from "react-router-dom";
import remarkGfm from "remark-gfm";
import EmptyState from "../components/EmptyState";
import ErrorBanner from "../components/ErrorBanner";
import Footer from "../components/Footer";
import GenerateButton from "../components/GenerateButton";
import Navbar from "../components/Navbar";
import SkeletonCard from "../components/SkeletonCard";
import axios from "../utils/axiosInstance";
import { API_PATHS } from "../utils/apiPaths";

const InterviewPrep = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [explainingId, setExplainingId] = useState("");
  const [error, setError] = useState("");
  const [activeQuestionId, setActiveQuestionId] = useState("");
  const [showAnswer, setShowAnswer] = useState(true);
  const [questionSearch, setQuestionSearch] = useState("");

  const getErrorMessage = useCallback(
    (requestError, fallbackMessage) =>
      requestError.response?.data?.message ||
      requestError.response?.data?.error ||
      fallbackMessage,
    []
  );

  const handleUnauthorized = useCallback((statusCode) => {
    if (statusCode === 401) {
      localStorage.removeItem("token");
      navigate("/login");
      return true;
    }

    return false;
  }, [navigate]);

  const fetchSession = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${API_PATHS.SESSION.GET_ONE}/${id}`);
      setSession(res.data.session);
      setQuestions(res.data.questions || []);
    } catch (requestError) {
      console.log(requestError.response || requestError);
      if (handleUnauthorized(requestError.response?.status)) {
        return;
      }

      setError(getErrorMessage(requestError, "Unable to load this workspace."));
    } finally {
      setLoading(false);
    }
  }, [id, handleUnauthorized, getErrorMessage]);

  const generateQuestions = async () => {
    try {
      setGenerating(true);
      setError("");

      await axios.post(API_PATHS.AI.GENERATE, { sessionId: id });
      await fetchSession();
    } catch (requestError) {
      console.log(requestError.response || requestError);
      if (handleUnauthorized(requestError.response?.status)) {
        return;
      }

      setError(getErrorMessage(requestError, "Unable to generate questions."));
    } finally {
      setGenerating(false);
    }
  };

  const handleExplain = async (questionId, questionText) => {
    try {
      setExplainingId(questionId);
      setError("");

      const explanationRes = await axios.post(API_PATHS.AI.EXPLAIN, {
        question: questionText,
      });

      const explanation = explanationRes.data.data;
      const answer = explanation?.title
        ? `## ${explanation.title}\n\n${explanation.explanation}`
        : explanation.explanation;

      const updateRes = await axios.patch(
        `${API_PATHS.QUESTION.BASE}/${questionId}`,
        { answer },
      );

      setQuestions((currentQuestions) =>
        currentQuestions.map((item) =>
          item._id === questionId ? updateRes.data.question : item,
        ),
      );
      setShowAnswer(true);
    } catch (requestError) {
      console.log(requestError.response || requestError);
      if (handleUnauthorized(requestError.response?.status)) {
        return;
      }

      setError(getErrorMessage(requestError, "Unable to generate an answer."));
    } finally {
      setExplainingId("");
    }
  };

  const handlePin = async (questionId) => {
    try {
      setError("");

      const res = await axios.patch(`${API_PATHS.QUESTION.BASE}/${questionId}/pin`);

      setQuestions((currentQuestions) =>
        currentQuestions.map((item) =>
          item._id === questionId ? res.data.question : item,
        ),
      );
    } catch (requestError) {
      console.log(requestError.response || requestError);
      if (handleUnauthorized(requestError.response?.status)) {
        return;
      }

      setError(getErrorMessage(requestError, "Unable to update this question."));
    }
  };

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    if (!questions.length) {
      setActiveQuestionId("");
      return;
    }

    const hasActiveQuestion = questions.some((item) => item._id === activeQuestionId);
    if (!hasActiveQuestion) {
      setActiveQuestionId(questions[0]._id);
    }
  }, [questions, activeQuestionId]);

  const orderedQuestions = useMemo(
    () =>
      [...questions].sort((left, right) => {
        if (left.isPinned === right.isPinned) {
          return 0;
        }

        return left.isPinned ? -1 : 1;
      }),
    [questions],
  );

  const visibleQuestions = useMemo(() => {
    const normalizedSearch = questionSearch.trim().toLowerCase();

    if (!normalizedSearch) {
      return orderedQuestions;
    }

    return orderedQuestions.filter((item) =>
      item.question.toLowerCase().includes(normalizedSearch),
    );
  }, [orderedQuestions, questionSearch]);

  const activeQuestion =
    visibleQuestions.find((item) => item._id === activeQuestionId) ||
    visibleQuestions[0] ||
    null;
  const isExplaining = explainingId === activeQuestion?._id;
  const hasAnswer = Boolean(activeQuestion?.answer?.trim());
  const activeQuestionIndex = visibleQuestions.findIndex(
    (item) => item._id === activeQuestion?._id,
  );
  const previousQuestion =
    activeQuestionIndex > 0 ? visibleQuestions[activeQuestionIndex - 1] : null;
  const nextQuestion =
    activeQuestionIndex >= 0 && activeQuestionIndex < visibleQuestions.length - 1
      ? visibleQuestions[activeQuestionIndex + 1]
      : null;

  return (
    <div className="app-shell ambient-grid">
      <div className="ambient-orb -left-32 top-20 h-80 w-80 bg-yellow-400/10" />
      <div className="ambient-orb -right-28 top-28 h-80 w-80 bg-slate-400/10" />

      <Navbar compact />

      <main className="section-wrap relative py-10 sm:py-12">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="pill fade-up mb-4">
              <HiOutlineSparkles className="h-3.5 w-3.5" />
              Session Workspace
            </span>
            <h1 className="fade-up-delay-1 text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
              {session ? `${session.role} interview workspace` : "Interview workspace"}
            </h1>
            <p className="fade-up-delay-2 mt-3 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
              {session
                ? `${session.experience} experience level with tailored questions, generated explanations, and pinned topics.`
                : "Generate tailored questions and expand answers on demand."}
            </p>
          </div>

          <GenerateButton
            onClick={generateQuestions}
            generating={generating}
            loading={loading}
            label="Generate question set"
          />
        </div>

        {error && <ErrorBanner message={error} onRetry={fetchSession} />}

        {loading ? (
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="glass-panel p-5">
              <div className="mb-4 h-5 w-36 rounded-full bg-night-700" />
              <div className="space-y-3">
                <SkeletonCard compact />
                <SkeletonCard compact />
                <SkeletonCard compact />
              </div>
            </aside>
            <section className="glass-panel p-6 sm:p-8">
              <SkeletonCard />
              <div className="mt-4">
                <SkeletonCard />
              </div>
            </section>
          </div>
        ) : questions.length === 0 ? (
          <EmptyState onGenerate={generateQuestions} generating={generating} />
        ) : (
          <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
            <aside className="glass-panel surface-outline h-fit p-5 xl:sticky xl:top-24">
              <div className="mb-6 flex items-center justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                    Questions
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-50">
                    Question list
                  </h2>
                </div>
                <div className="rounded-full border border-night-700 bg-night-850 px-3 py-1 text-xs font-semibold text-yellow-200">
                  {orderedQuestions.length}
                </div>
              </div>

              <label className="mb-4 block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                  <HiMagnifyingGlass className="h-4 w-4" />
                  Search
                </span>
                <input
                  value={questionSearch}
                  onChange={(e) => setQuestionSearch(e.target.value)}
                  placeholder="Search questions"
                  className="pink-input"
                />
              </label>

              <div className="mb-4 grid grid-cols-2 gap-3">
                <div className="metric-card">
                  <div className="flex items-center gap-2 text-slate-300">
                    <HiClock className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Experience
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-50">
                    {session?.experience} experience
                  </p>
                </div>
                <div className="metric-card">
                  <div className="flex items-center gap-2 text-slate-300">
                    <HiOutlineBookmark className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      Saved
                    </span>
                  </div>
                  <p className="mt-3 text-sm font-semibold text-slate-50">
                    {orderedQuestions.filter((item) => item.isPinned).length}
                  </p>
                </div>
              </div>

              {questionSearch && (
                <p className="mb-4 text-xs uppercase tracking-[0.18em] text-slate-400">
                  Showing {visibleQuestions.length} of {orderedQuestions.length}
                </p>
              )}

              {visibleQuestions.length === 0 ? (
                <div className="soft-panel px-4 py-6 text-center">
                  <p className="text-sm font-semibold text-slate-50">No results</p>
                  <p className="mt-2 text-sm text-slate-300">
                    Try another keyword or clear the search.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {visibleQuestions.map((question, index) => {
                    const active = question._id === activeQuestion?._id;

                    return (
                      <button
                        type="button"
                        key={question._id}
                        onClick={() => {
                          setActiveQuestionId(question._id);
                          setShowAnswer(true);
                        }}
                        className={`w-full rounded-2xl border p-4 text-left transition duration-300 ${active
                          ? "border-yellow-400/45 bg-night-800 shadow-sm shadow-black/25"
                          : "border-night-700 bg-night-900 hover:border-yellow-400/30 hover:bg-night-850"
                          }`}
                      >
                        <div className="mb-3 flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
                            Q{index + 1}
                          </span>
                          {question.isPinned && (
                            <span className="rounded-full border border-yellow-400/20 bg-yellow-400/10 px-2.5 py-1 text-[11px] font-semibold text-yellow-200">
                              Saved
                            </span>
                          )}
                        </div>
                        <p className="text-sm leading-6 text-slate-100">
                          {question.question}
                        </p>
                      </button>
                    );
                  })}
                </div>
              )}
            </aside>

            <section className="glass-panel overflow-hidden">
              <div className="border-b border-night-700/70 px-6 py-5 sm:px-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <div className="mb-3 flex flex-wrap items-center gap-3 text-slate-300">
                      <span className="pill">
                        <HiBars3BottomLeft className="h-3.5 w-3.5" />
                        Selected Question
                      </span>
                      {activeQuestion?.isPinned && (
                        <span className="rounded-full border border-night-700 bg-night-850 px-3 py-1 text-xs font-semibold text-yellow-200">
                          Saved
                        </span>
                      )}
                      {activeQuestion && (
                        <span className="rounded-full border border-night-700 bg-night-900 px-3 py-1 text-xs font-semibold text-slate-400">
                          {activeQuestionIndex + 1} / {visibleQuestions.length}
                        </span>
                      )}
                    </div>
                    <h2 className="max-w-4xl text-2xl font-semibold leading-9 text-slate-50">
                      {activeQuestion?.question}
                    </h2>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => previousQuestion && setActiveQuestionId(previousQuestion._id)}
                      disabled={!previousQuestion}
                      className="ghost-button px-4! py-2.5!"
                    >
                      <HiChevronLeft className="h-4 w-4" />
                      Previous
                    </button>
                    <button
                      type="button"
                      onClick={() => nextQuestion && setActiveQuestionId(nextQuestion._id)}
                      disabled={!nextQuestion}
                      className="ghost-button px-4! py-2.5!"
                    >
                      Next
                      <HiChevronRight className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => activeQuestion && handlePin(activeQuestion._id)}
                      disabled={!activeQuestion}
                      className="ghost-button px-4! py-2.5!"
                    >
                      <HiOutlineBookmark className="h-4 w-4" />
                      {activeQuestion?.isPinned ? "Unsave" : "Save"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAnswer((current) => !current)}
                      disabled={!activeQuestion}
                      className="ghost-button px-4! py-2.5!"
                    >
                      {showAnswer ? <HiChevronUp className="h-4 w-4" /> : <HiChevronDown className="h-4 w-4" />}
                      {showAnswer ? "Hide Answer" : "Show Answer"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        activeQuestion &&
                        handleExplain(activeQuestion._id, activeQuestion.question)
                      }
                      disabled={isExplaining || !activeQuestion}
                      className="pink-button px-4! py-2.5!"
                    >
                      {isExplaining ? (
                        <>
                          <HiArrowPath className="h-4 w-4 animate-spin" />
                          Generating
                        </>
                      ) : (
                        <>
                          <HiBolt className="h-4 w-4" />
                          {hasAnswer ? "Regenerate answer" : "Generate answer"}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6 sm:px-8 sm:py-8">
                {generating && !activeQuestion && (
                  <div className="mb-5">
                    <SkeletonCard />
                  </div>
                )}

                {!activeQuestion ? (
                  <div className="soft-panel flex min-h-65 flex-col items-center justify-center px-6 py-10 text-center">
                    <p className="text-lg font-semibold text-slate-50">No question selected</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Clear the search or select a question from the list.
                    </p>
                  </div>
                ) : showAnswer ? (
                  hasAnswer ? (
                    <div className="soft-panel p-6">
                      <div className="mb-4 flex items-center gap-3 text-slate-300">
                        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-yellow-400 text-night-950">
                          <HiSparkles className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">
                            Generated Answer
                          </p>
                          <p className="text-sm text-slate-300">
                            Structured response with markdown formatting
                          </p>
                        </div>
                      </div>
                      <div className="markdown-body max-w-none">
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {activeQuestion.answer}
                        </ReactMarkdown>
                      </div>
                    </div>
                  ) : isExplaining ? (
                    <div className="space-y-4">
                      <SkeletonCard />
                      <SkeletonCard />
                    </div>
                  ) : (
                    <div className="soft-panel flex min-h-75 flex-col items-center justify-center px-6 py-10 text-center">
                      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] border border-night-700 bg-night-850 text-yellow-300">
                        <HiSparkles className="h-8 w-8" />
                      </div>
                      <h3 className="text-2xl font-semibold text-slate-50">No answer generated</h3>
                      <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
                        Generate an answer to turn this question into a structured study note.
                      </p>
                    </div>
                  )
                ) : (
                  <div className="soft-panel flex min-h-55 flex-col items-center justify-center px-6 py-10 text-center">
                    <p className="text-lg font-semibold text-slate-50">Answer hidden</p>
                    <p className="mt-2 text-sm text-slate-300">
                      Toggle the answer back on whenever you want to review it.
                    </p>
                  </div>
                )}
              </div>
            </section>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default InterviewPrep;
