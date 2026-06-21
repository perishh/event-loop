export default function AdminLoading() {
  return (
    <div className="flex flex-1">
      <aside className="max-w-96 shrink-0 bg-violet-50 p-4">
        <div className="animate-pulse space-y-3">
          <div className="h-3 bg-violet-200 rounded w-28 mb-4" />
          <div className="h-9 bg-violet-200/60 rounded-lg" />
          <div className="h-9 bg-violet-200/60 rounded-lg" />
          <div className="h-9 bg-violet-200/60 rounded-lg mt-1" />
        </div>
      </aside>

      <div className="flex-3 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-7 bg-violet-100 rounded w-48" />
          <div className="h-4 bg-violet-50 rounded w-72" />
          <div className="h-12 bg-violet-100 rounded-xl mt-6" />
          <div className="h-12 bg-violet-100 rounded-xl" />
          <div className="h-12 bg-violet-100 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
