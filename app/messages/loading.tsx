export default function MessagesLoading() {
  return (
    <main className="eventloop-main-page flex h-[calc(100vh-4.5rem)]">
      <aside className="flex w-72 shrink-0 flex-col bg-violet-50 animate-pulse">
        <div className="flex items-center justify-between gap-2 px-4 py-3">
          <div className="h-5 bg-violet-200 rounded w-20" />
          <div className="h-5 bg-violet-200 rounded w-24" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto space-y-1 px-2">
          <div className="flex items-center gap-2 px-2 py-2.5">
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 bg-violet-200 rounded w-24 flex-1" />
            <div className="h-5 bg-violet-200 rounded-full w-8" />
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`inbox-${i}`}
              className="flex items-center gap-3 px-2 py-2.5"
            >
              <div className="h-9 w-9 bg-violet-200 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 bg-violet-200 rounded w-3/4" />
                <div className="h-3 bg-violet-200 rounded w-full" />
              </div>
              <div className="h-3 bg-violet-200 rounded w-10 shrink-0" />
            </div>
          ))}

          <div className="flex items-center gap-2 px-2 py-2.5 mt-4">
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 bg-violet-200 rounded w-24 flex-1" />
          </div>

          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`sent-${i}`}
              className="flex items-center gap-3 px-2 py-2.5"
            >
              <div className="h-9 w-9 bg-violet-200 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 bg-violet-200 rounded w-3/4" />
                <div className="h-3 bg-violet-200 rounded w-full" />
              </div>
              <div className="h-3 bg-violet-200 rounded w-10 shrink-0" />
            </div>
          ))}

          <div className="flex items-center gap-2 px-2 py-2.5 mt-4">
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 w-4 bg-violet-200 rounded" />
            <div className="h-4 bg-violet-200 rounded w-24 flex-1" />
          </div>

          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`conv-${i}`}
              className="flex items-center gap-3 px-2 py-2.5"
            >
              <div className="h-9 w-9 bg-violet-200 rounded-full shrink-0" />
              <div className="min-w-0 flex-1 space-y-1.5">
                <div className="h-3 bg-violet-200 rounded w-3/5" />
                <div className="h-3 bg-violet-200 rounded w-2/5" />
                <div className="h-3 bg-violet-200 rounded w-4/5" />
              </div>
              <div className="flex flex-col items-end gap-1">
                <div className="h-3 bg-violet-200 rounded w-10" />
                <div className="h-3 bg-violet-200 rounded w-14" />
              </div>
            </div>
          ))}
        </div>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col bg-white animate-pulse">
        <div className="shrink-0 px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-violet-100 rounded w-16" />
            <div className="h-4 bg-violet-100 rounded w-4" />
            <div className="h-4 bg-violet-100 rounded w-20" />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-4">
          <div className="h-4 bg-violet-100 rounded w-64" />
        </div>
      </section>
    </main>
  );
}
