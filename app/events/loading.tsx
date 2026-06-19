import EventGridSkeleton from "./_browse/EventGridSkeleton";
import FilterSidebarSkeleton from "./_browse/FilterSidebarSkeleton";

export default function EventsLoading() {
  return (
    <main className="flex-1 flex flex-col">
      <div className="flex flex-1">
        <FilterSidebarSkeleton />

        <div className="flex-3 px-6 py-4">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-violet-100 rounded w-48" />
            <div className="h-8 bg-violet-100 rounded w-64" />
            <EventGridSkeleton />
          </div>
        </div>
      </div>
    </main>
  );
}
