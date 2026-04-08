import { useState } from "react";
import ReactMarkdown from "react-markdown";

const QAItem = ({ item, onPin, onExplain, explainingId }) => {
  const [open, setOpen] = useState(Boolean(item.answer?.trim()));
  const isExplaining = explainingId === item._id;
  const hasAnswer = Boolean(item.answer?.trim());

  return (
    <div
      className={`mb-4 rounded-xl border bg-night-900 p-4 transition hover:shadow-md ${item.isPinned ? "border-yellow-400/50 shadow-yellow-400/10" : "border-night-700"
        }`}
    >
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <button
          type="button"
          className="cursor-pointer text-left font-medium text-slate-50"
          onClick={() => setOpen((current) => !current)}
        >
          {item.question}
        </button>

        <div className="flex items-center gap-2">
          {onExplain && (
            <button
              type="button"
              onClick={() => onExplain(item._id, item.question)}
              disabled={isExplaining}
              className="rounded-lg border border-night-700 bg-night-850 px-3 py-1.5 text-sm text-slate-100 hover:border-yellow-400/40 hover:bg-night-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isExplaining ? "Generating" : hasAnswer ? "Regenerate answer" : "Generate answer"}
            </button>
          )}

          {onPin && (
            <button
              type="button"
              onClick={() => onPin(item._id)}
              className="rounded-lg border border-night-700 bg-night-850 px-3 py-1.5 text-sm text-slate-100 hover:border-yellow-400/40 hover:bg-night-800"
            >
              {item.isPinned ? "Unsave" : "Save"}
            </button>
          )}
        </div>
      </div>

      {open && (
        <div className="mt-3 text-slate-200">
          {hasAnswer ? (
            <ReactMarkdown>{item.answer}</ReactMarkdown>
          ) : (
            <p className="text-sm text-slate-400">
              No answer yet. Generate an answer to add a structured explanation.
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default QAItem;
