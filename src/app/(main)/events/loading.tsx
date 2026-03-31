function RouteCallCardSkeleton() {
  return (
    <div className="bg-card dark:bg-muted rounded-2xl overflow-hidden shadow-md flex flex-col animate-pulse">
      <div className="h-52 w-full bg-accent" />

      <div className="p-5 flex flex-col gap-3 flex-1">
        <div className="h-4 bg-accent rounded-full w-1/4" />
        <div className="h-5 bg-accent rounded-full w-3/4" />

        <div className="flex gap-2 mt-1">
          <div className="h-4 w-20 bg-accent rounded-full" />
          <div className="h-4 w-16 bg-accent rounded-full" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="h-7 w-24 bg-accent rounded-full" />
          <div className="h-4 w-16 bg-accent rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function EventsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero skeleton */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 animate-pulse">
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-8 bg-accent rounded-full w-2/3" />
            <div className="h-4 bg-accent rounded-full w-1/2" />
          </div>
          <div className="h-10 w-40 bg-accent rounded-full" />
        </div>

        {/* Filter bar skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-8 animate-pulse">
          <div className="h-9 w-full sm:w-64 bg-accent rounded-full shrink-0" />
          <div className="hidden sm:block h-6 w-px bg-accent" />
          <div className="flex gap-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-7 w-20 bg-accent rounded-full" />
            ))}
          </div>
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <RouteCallCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
