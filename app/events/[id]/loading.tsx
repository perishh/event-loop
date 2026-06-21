export default function EventDetailLoading() {
  return (
    <section className="w-full max-w-3xl mx-auto mt-8 px-4">
      <div className="animate-pulse flex items-center gap-2 mb-4">
        <div className="h-4 bg-violet-100 rounded w-16" />
        <div className="h-4 bg-violet-100 rounded w-24" />
        <div className="h-4 bg-violet-100 rounded w-32" />
      </div>

      <div className="animate-pulse mt-4 mb-6">
        <div className="w-full aspect-video bg-violet-50 rounded-2xl" />
      </div>

      <div className="animate-pulse mb-6">
        <div className="flex items-center justify-between mb-2">
          <div className="h-6 bg-violet-100 rounded-full w-24" />
        </div>
        <div className="h-9 bg-violet-100 rounded w-3/4 mt-4" />
      </div>

      <div className="animate-pulse mb-8 space-y-3">
        <div className="h-4 bg-violet-50 rounded w-full" />
        <div className="h-4 bg-violet-50 rounded w-full" />
        <div className="h-4 bg-violet-50 rounded w-5/6" />
      </div>

      <div className="animate-pulse rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mb-5">
        <div className="h-3 bg-violet-100 rounded w-44 mb-4" />
        <div className="space-y-5 md:flex md:space-y-0">
          <div className="flex items-start flex-1 space-x-3">
            <div className="w-5 h-5 bg-violet-100 rounded shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-violet-50 rounded w-12" />
              <div className="h-5 bg-violet-100 rounded w-32" />
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 bg-violet-50 rounded" />
                <div className="h-4 bg-violet-50 rounded w-16" />
              </div>
            </div>
          </div>
          <div className="flex items-start flex-1 space-x-3">
            <div className="w-5 h-5 bg-violet-100 rounded shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 bg-violet-50 rounded w-12" />
              <div className="h-5 bg-violet-100 rounded w-32" />
              <div className="flex items-center gap-1">
                <div className="w-3.5 h-3.5 bg-violet-50 rounded" />
                <div className="h-4 bg-violet-50 rounded w-16" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="animate-pulse rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mb-5">
        <div className="h-3 bg-violet-100 rounded w-24 mb-3" />
        <div className="flex gap-3">
          <div className="space-y-2 flex-1">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-violet-100 rounded shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-5 bg-violet-100 rounded w-40" />
                <div className="h-4 bg-violet-50 rounded w-56" />
                <div className="h-4 bg-violet-50 rounded w-24" />
              </div>
            </div>
          </div>
          <div className="h-40 bg-violet-50 rounded-2xl flex-1 max-w-56" />
        </div>
      </div>

      <div className="animate-pulse grid grid-cols-1 md:grid-cols-2 gap-4 my-5">
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <div className="h-3 bg-violet-100 rounded w-28 mb-3" />
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-violet-100 rounded shrink-0" />
            <div className="h-7 bg-violet-100 rounded w-24" />
          </div>
        </div>
        <div className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60">
          <div className="h-3 bg-violet-100 rounded w-20 mb-3" />
          <div className="flex flex-wrap gap-2">
            <div className="h-7 bg-violet-50 rounded-full w-20" />
            <div className="h-7 bg-violet-50 rounded-full w-24" />
            <div className="h-7 bg-violet-50 rounded-full w-16" />
          </div>
        </div>
      </div>

      <div className="animate-pulse rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="h-3 bg-violet-100 rounded w-32" />
          <div className="h-9 bg-violet-200 rounded-xl w-24" />
        </div>
        <div className="divide-y divide-violet-100">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 bg-violet-100 rounded shrink-0" />
                <div className="h-5 bg-violet-100 rounded w-28" />
              </div>
              <div className="text-end space-y-1">
                <div className="h-6 bg-violet-100 rounded w-20" />
                <div className="h-3 bg-violet-50 rounded w-16 ml-auto" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
