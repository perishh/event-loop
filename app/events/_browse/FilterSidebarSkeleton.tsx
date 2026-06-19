export default function FilterSidebarSkeleton() {
  return (
    <div className="flex-1 sticky top-[76px] left-0 border-r-2 border-violet-100 max-h-[calc(100dvh-76px)] max-w-100">
      <div className="overflow-y-auto p-4 max-h-full">
        <div className="animate-pulse space-y-3">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-4 w-4 bg-violet-100 rounded" />
            <div className="h-4 w-16 bg-violet-100 rounded" />
          </div>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-10 bg-violet-50 rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}
