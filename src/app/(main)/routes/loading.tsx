function RouteCardSkeleton() {
  return (
    <div className="bg-card dark:bg-muted rounded-2xl overflow-hidden shadow-md flex flex-col animate-pulse">
      <div className="h-48 w-full bg-accent" />

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div className="h-4 bg-accent rounded-full w-3/4" />

        <div className="flex gap-2">
          <div className="h-5 w-16 bg-accent rounded-full" />
          <div className="h-5 w-20 bg-accent rounded-full" />
        </div>

        <div className="flex items-center justify-between mt-auto pt-2 border-t border-border">
          <div className="h-4 w-20 bg-accent rounded-full" />
          <div className="h-4 w-16 bg-accent rounded-full" />
        </div>
      </div>
    </div>
  );
}

export default function RoutesLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col gap-2 animate-pulse">
          <div className="w-full min-h-75 rounded-lg bg-accent" />
          <div className="flex flex-col gap-3 p-4">
            <div className="h-8 bg-accent rounded-full w-2/3" />
            <div className="flex flex-col gap-2">
              <div className="h-3.5 bg-accent rounded-full w-full" />
              <div className="h-3.5 bg-accent rounded-full w-5/6" />
              <div className="h-3.5 bg-accent rounded-full w-4/6" />
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mt-8 animate-pulse">
          <div className="h-9 w-full sm:w-64 bg-accent rounded-full shrink-0" />
          <div className="hidden sm:block h-6 w-px bg-accent" />
          <div className="flex gap-2">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="h-7 w-16 bg-accent rounded-full"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
          {[...Array(6)].map((_, i) => (
            <RouteCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
