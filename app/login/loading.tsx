export default function LoginLoading() {
  return (
    <section className="max-w-md mx-auto mt-8 px-4">
      <div className="animate-pulse flex items-center space-x-2">
        <div className="h-4 bg-violet-100 rounded w-16" />
        <div className="h-4 text-violet-300">/</div>
        <div className="h-4 bg-violet-200 rounded w-20" />
      </div>

      <div className="animate-pulse h-7 bg-violet-100 rounded w-72 mt-4 mb-6" />

      <div className="bg-violet-50 rounded-2xl shadow-lg shadow-violet-100/80 p-6 animate-pulse">
        <div className="space-y-5">
          <section className="rounded-2xl border border-violet-100 bg-white/80 p-5 shadow-sm shadow-violet-100/60 space-y-4">
            <div className="h-3 bg-violet-200 rounded w-36" />

            <div className="grid grid-cols-1 gap-3">
              <div className="space-y-1.5">
                <div className="h-3 bg-violet-100 rounded w-24" />
                <div className="h-10 bg-violet-100/60 rounded-lg w-full" />
              </div>

              <div className="space-y-1.5">
                <div className="h-3 bg-violet-100 rounded w-32" />
                <div className="h-10 bg-violet-100/60 rounded-lg w-full" />
              </div>
            </div>
          </section>
        </div>

        <div className="flex items-center justify-between mt-6">
          <div className="space-y-1">
            <div className="h-3 bg-violet-100 rounded w-36" />
            <div className="h-3 bg-violet-200 rounded w-28" />
          </div>
          <div className="h-9 bg-violet-200/80 rounded-lg w-24" />
        </div>
      </div>
    </section>
  );
}
