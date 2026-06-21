export default function Loading() {
  return (
    <main className="eventloop-main-page">
      <section className="eventloop-welcome-page-content">
        <section>
          <div className="embla relative">
            <div className="overflow-hidden">
              <div className="bg-violet-100/80 h-[400px] w-full animate-pulse" />
            </div>
          </div>

          <div className="flex items-center justify-center space-x-1.5 mt-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full h-2 animate-pulse ${i === 0 ? "w-4 bg-purple-300" : "w-2 bg-purple-200/60"}`}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between w-full px-8">
            <div className="flex items-center space-x-6">
              <div className="size-9 rounded-lg bg-orange-200/60 animate-pulse" />
              <div className="h-7 w-64 rounded-md bg-gray-200 animate-pulse" />
            </div>
            <div className="flex items-center space-x-2">
              <div className="size-9 rounded-full border-2 border-orange-200/60 bg-orange-50/50 animate-pulse" />
              <div className="size-9 rounded-full border-2 border-orange-200/60 bg-orange-50/50 animate-pulse" />
            </div>
          </div>

          <div className="embla mt-4">
            <div className="overflow-hidden">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ flex: "0 0 300px" }} className="pl-4">
                    <div className="block rounded-2xl border border-violet-100 bg-white/80 shadow-sm shadow-violet-100/60 animate-pulse">
                      <div className="overflow-hidden rounded-t-2xl">
                        <div className="h-48 w-full bg-violet-100/80" />
                      </div>
                      <div className="p-4 space-y-3">
                        <div className="h-5 w-16 rounded-full bg-violet-100/80" />
                        <div className="h-5 w-3/4 rounded-md bg-gray-200" />
                        <div className="h-4 w-1/2 rounded-md bg-gray-100" />
                        <div className="h-4 w-2/3 rounded-md bg-gray-100" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}
