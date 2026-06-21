export default function TrainPageLoading() {
  return (
    <main className="p-6 flex-1">
      <div className="animate-pulse">
        <div className="h-6 bg-violet-100 rounded w-64" />
        <div className="h-4 bg-violet-50 rounded w-96 mt-2 mb-6" />
      </div>

      <div className="animate-pulse flex items-center gap-2 mb-4">
        <div className="size-5 bg-violet-200 rounded" />
        <div className="h-5 bg-violet-100 rounded w-44" />
      </div>

      <div className="animate-pulse grid grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="rounded-xl border border-violet-100 bg-white/80 p-4 shadow-sm shadow-violet-100/60 space-y-3"
          >
            <div className="size-8 bg-violet-100 rounded-lg" />
            <div className="h-3 bg-violet-50 rounded w-20" />
            <div className="h-5 bg-violet-100 rounded w-16" />
          </div>
        ))}
      </div>

      <div className="animate-pulse space-y-4">
        <div className="h-5 bg-violet-100 rounded w-36" />
        <div className="rounded-xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 space-y-4">
          <div className="space-y-2">
            <div className="h-3 bg-violet-50 rounded w-24" />
            <div className="h-9 bg-violet-100 rounded-lg w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-violet-50 rounded w-32" />
            <div className="h-9 bg-violet-100 rounded-lg w-full" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-violet-50 rounded w-28" />
            <div className="h-9 bg-violet-100 rounded-lg w-full" />
          </div>
          <div className="h-10 bg-violet-200/60 rounded-lg w-40" />
        </div>
      </div>
    </main>
  );
}
