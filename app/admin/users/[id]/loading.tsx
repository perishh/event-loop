export default function UserDetailLoading() {
  return (
    <main className="eventloop-main-page p-6">
      <div className="animate-pulse">
        <div className="h-4 bg-violet-100 rounded w-28" />
      </div>

      <div className="animate-pulse mt-4 max-w-2xl">
        <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="size-14 rounded-full bg-violet-200 shrink-0" />
            <div className="space-y-2">
              <div className="h-6 bg-violet-100 rounded w-44" />
              <div className="flex items-center gap-2">
                <div className="h-4 bg-violet-50 rounded w-16" />
                <div className="h-4 bg-violet-50 rounded w-20" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="space-y-1">
                <div className="h-3 bg-violet-100/60 rounded w-20" />
                <div className="h-4 bg-violet-100 rounded w-32" />
              </div>
            ))}
          </div>

          <div className="border-t border-violet-100 pt-4">
            <div className="flex gap-2">
              <div className="h-9 bg-violet-200/60 rounded-lg w-28" />
              <div className="h-9 bg-violet-200/60 rounded-lg w-28" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
