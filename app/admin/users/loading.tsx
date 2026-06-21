export default function UsersPageLoading() {
  return (
    <main className="p-6 flex-1">
      <div className="animate-pulse">
        <div className="h-6 bg-violet-100 rounded w-48" />
        <div className="h-4 bg-violet-50 rounded w-36 mt-2 mb-5" />
      </div>

      <div className="animate-pulse space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 bg-white border border-violet-100 rounded-xl px-4 py-3"
          >
            <div className="size-9 rounded-full bg-violet-200 shrink-0" />

            <div className="flex-1 min-w-0 space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="h-4 bg-violet-100 rounded w-32" />
                <div className="h-4 bg-violet-50 rounded w-16" />
              </div>
              <div className="h-3 bg-violet-50 rounded w-48" />
            </div>

            <div className="h-6 bg-violet-100 rounded w-24 shrink-0" />
          </div>
        ))}
      </div>
    </main>
  );
}
