export default function EventGridSkeleton() {
  return (
    <div className="animate-pulse mt-4">
      <div className="px-4 grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-64 bg-violet-50 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
