export default function HistoryLoading() {
  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 flex-1 min-h-screen bg-[#F9FAFB] lg:p-8 w-full max-w-6xl mx-auto">
      
      {/* Left Column (List) */}
      <div className="flex flex-col flex-1 lg:w-1/2 lg:flex-none p-6 lg:p-0 bg-white lg:bg-transparent pb-24 lg:pb-0 space-y-6">
        <header className="pt-2 lg:pt-4">
          <div className="h-8 w-40 bg-muted/60 animate-pulse rounded-md"></div>
        </header>

        {/* 3 Stat Boxes Skeleton */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/50 shadow-soft-card bg-white h-[88px] relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted/10 to-transparent z-10" />
              <div className="h-8 w-16 bg-muted/40 animate-pulse rounded-md mb-2"></div>
              <div className="h-3 w-20 bg-muted/30 animate-pulse rounded-md"></div>
            </div>
          ))}
        </div>

        {/* Filter Pills Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 w-24 rounded-full bg-muted/40 animate-pulse shrink-0"></div>
          ))}
        </div>

        {/* History List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border/40 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-muted/10 to-transparent z-10" />
              <div className="flex flex-col space-y-2 w-1/2">
                <div className="h-6 w-32 bg-muted/50 animate-pulse rounded-md"></div>
                <div className="h-4 w-24 bg-muted/40 animate-pulse rounded-md"></div>
                <div className="h-3 w-28 bg-muted/30 animate-pulse rounded-md"></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-muted/40 animate-pulse rounded-full"></div>
                <div className="h-5 w-5 bg-muted/30 animate-pulse rounded-md"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Column (Placeholder for Desktop) */}
      <div className="hidden lg:flex flex-col flex-1 items-center justify-center bg-white/50 rounded-3xl border border-border/30 shadow-sm my-4 sticky top-8 h-[calc(100vh-4rem)]">
        <div className="w-20 h-20 rounded-full bg-muted/30 animate-pulse mx-auto mb-4"></div>
        <div className="h-6 w-48 bg-muted/40 animate-pulse rounded-md mb-3 mx-auto"></div>
        <div className="h-4 w-64 bg-muted/30 animate-pulse rounded-md mx-auto"></div>
        <div className="h-4 w-56 bg-muted/30 animate-pulse rounded-md mx-auto mt-2"></div>
      </div>
    </div>
  )
}
