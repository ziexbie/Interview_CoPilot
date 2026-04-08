import { HiOutlineChatBubbleBottomCenterText, HiSparkles } from "react-icons/hi2";
import { ImSpinner8 } from "react-icons/im";

const EmptyState = ({ onGenerate, generating }) => (
  <div className="glass-panel flex min-h-105 flex-col items-center justify-center px-6 py-12 text-center">
    <div className="mb-6 flex h-18 w-18 items-center justify-center rounded-[26px] border border-night-700 bg-night-850 text-yellow-300">
      <HiOutlineChatBubbleBottomCenterText className="h-9 w-9" />
    </div>
    <span className="pill mb-5">
      <HiSparkles className="h-3.5 w-3.5" />
      Question Generation
    </span>
    <h3 className="mb-3 text-2xl font-semibold text-slate-50">
      No questions generated
    </h3>
    <p className="mb-8 max-w-md text-sm leading-6 text-slate-300">
      Generate a tailored question set for this role to populate the workspace.
    </p>
    <button onClick={onGenerate} disabled={generating} className="pink-button">
      {generating ? (
        <>
          <ImSpinner8 className="h-4 w-4 animate-spin" />
          Generating
        </>
      ) : (
        <>
          <HiSparkles className="h-5 w-5" />
          Generate question set
        </>
      )}
    </button>
  </div>
);

export default EmptyState;
