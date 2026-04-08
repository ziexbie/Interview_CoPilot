import { HiSparkles } from "react-icons/hi2";
import { ImSpinner8 } from "react-icons/im";

const GenerateButton = ({ onClick, generating, loading, label = "Generate" }) => (
  <button onClick={onClick} disabled={generating || loading} className="pink-button">
    {generating ? (
      <>
        <ImSpinner8 className="h-4 w-4 animate-spin" />
        Generating
      </>
    ) : (
      <>
        <HiSparkles className="h-5 w-5" />
        {label}
      </>
    )}
  </button>
);

export default GenerateButton;
