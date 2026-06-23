export default function ManageLoading() {
  return (
    <main className="eventloop-main-page p-6">
      <div className="animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-4 bg-violet-100 rounded w-16" />
          <div className="h-4 bg-violet-100 rounded w-4" />
          <div className="h-4 bg-violet-100 rounded w-36" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <div className="h-7 bg-violet-100 rounded w-56" />
          <div className="h-9 bg-violet-600 rounded-lg w-28" />
        </div>
        <div className="h-4 bg-violet-50 rounded w-48 mt-2 mb-5" />

        <ul className="flex flex-col gap-2 overflow-y-auto max-h-[calc(100vh_-_13rem)]">
          {Array.from({ length: 4 }).map((_, i) => (
            <li
              key={i}
              className="flex flex-col gap-2 rounded-2xl border border-violet-100 bg-white/80 px-4 py-3 shadow-sm shadow-violet-100/60"
            >
              <div className="flex items-start gap-3">
                <div className="min-w-0 flex-1 space-y-3">
                  <div className="h-5 bg-violet-100 rounded w-3/5" />
                  <div className="grid grid-cols-[max-content_auto] items-center gap-x-2 gap-y-2">
                    <div className="h-3 bg-violet-100 rounded w-28" />
                    <div className="h-5 bg-violet-100 rounded w-24" />
                    <div className="h-3 bg-violet-100 rounded w-32" />
                    <div className="h-5 bg-violet-100 rounded w-28" />
                    <div className="h-3 bg-violet-100 rounded w-16" />
                    <div className="h-5 bg-violet-100 rounded w-20" />
                    <div className="h-3 bg-violet-100 rounded w-16" />
                    <div className="h-5 bg-violet-100 rounded w-16" />
                    <div className="h-3 bg-violet-100 rounded w-28" />
                    <div className="h-5 bg-violet-100 rounded w-24" />
                  </div>
                </div>

                <div className="shrink-0 flex items-center gap-3">
                  <div className="h-4 bg-violet-100 rounded w-12" />
                  <div className="h-4 bg-violet-100 rounded w-16" />
                  <div className="h-4 bg-violet-100 rounded w-14" />
                </div>
              </div>

              <div className="flex gap-2 mt-1">
                <div className="h-8 bg-violet-100 rounded-lg w-20" />
                <div className="h-8 bg-violet-100 rounded-lg w-24" />
                <div className="h-8 bg-violet-100 rounded-lg w-28" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
