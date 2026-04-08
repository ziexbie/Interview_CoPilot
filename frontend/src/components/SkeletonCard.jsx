const SkeletonCard = ({ compact = false }) => (
  <div className="soft-panel animate-pulse p-5">
    <div className="mb-4 flex items-center gap-3">
      <div className="h-10 w-10 rounded-2xl bg-night-700" />
      <div className="space-y-2">
        <div className="h-3 w-20 rounded-full bg-night-700" />
        <div className="h-4 w-32 rounded-full bg-night-700/70" />
      </div>
    </div>

    <div className="space-y-3">
      <div className="h-4 w-5/6 rounded-full bg-night-700" />
      <div className="h-4 w-full rounded-full bg-night-700/70" />
      {!compact && <div className="h-4 w-2/3 rounded-full bg-night-700/70" />}
    </div>
  </div>
);

export default SkeletonCard;
