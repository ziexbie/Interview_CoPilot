import { HiArrowPath, HiExclamationTriangle } from "react-icons/hi2";

const ErrorBanner = ({ message, onRetry }) => (
  <div className="soft-panel flex flex-col gap-4 border-night-700/70 bg-night-900 p-4 sm:flex-row sm:items-center sm:justify-between">
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-yellow-400/12 text-yellow-300">
        <HiExclamationTriangle className="h-5 w-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-slate-50">Request failed</p>
        <p className="mt-1 text-sm text-slate-300">{message}</p>
      </div>
    </div>
    {onRetry && (
      <button type="button" onClick={onRetry} className="ghost-button px-4! py-2.5!">
        <HiArrowPath className="h-4 w-4" />
        Try again
      </button>
    )}
  </div>
);

export default ErrorBanner;
