import { Bell, Pause, Wallet, LineChart, ChevronRight } from 'lucide-react'

export default function HomeLoading() {
  return (
    <div className="flex flex-col flex-1 p-6 lg:p-12 pb-24 lg:pb-12 space-y-8 bg-[#F8FAFC] lg:bg-white min-h-screen">
      <header className="relative pt-2 space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6 lg:mb-0 lg:hidden">
          <div className="h-7 w-24 bg-muted/60 animate-pulse rounded-md"></div>
          <div className="w-9 h-9 bg-muted/60 animate-pulse rounded-full"></div>
        </div>
        
        <div className="lg:flex lg:justify-between lg:items-end">
          <div>
            <div className="h-8 lg:h-10 w-48 lg:w-72 bg-muted/60 animate-pulse rounded-md mb-2"></div>
            <div className="flex items-center gap-2 mt-2">
              <div className="h-5 lg:h-6 w-56 lg:w-80 bg-muted/60 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 pt-2 max-w-4xl mx-auto w-full">
        {/* Main Action Card Skeleton */}
        <div className="lg:col-span-1 lg:row-span-2">
          <div className="flex lg:flex-col items-center lg:items-start p-4 lg:p-8 rounded-2xl lg:rounded-[32px] bg-white lg:bg-[#E7F2EC]/50 border border-border/60 lg:border-success/10 shadow-sm h-full w-full relative overflow-hidden">
            <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-muted/50 lg:bg-white/50 animate-pulse shrink-0 mr-4 lg:mr-0 lg:mb-6"></div>
            <div className="flex-1 flex flex-col justify-center lg:justify-start w-full">
              <div className="h-4 lg:h-5 w-24 bg-muted/50 lg:bg-white/50 animate-pulse rounded-md lg:mb-2 mb-1"></div>
              <div className="h-6 lg:h-8 w-32 lg:w-48 bg-muted/50 lg:bg-white/50 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>

        {/* Secondary Cards Skeleton */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center p-4 lg:p-6 rounded-2xl bg-white border border-border/60 shadow-sm lg:h-auto relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-muted/50 animate-pulse shrink-0 mb-4 lg:mb-0 lg:mr-4"></div>
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="h-5 lg:h-6 w-40 bg-muted/50 animate-pulse rounded-md mb-1"></div>
            <div className="h-4 w-32 bg-muted/40 animate-pulse rounded-md"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center p-4 lg:p-6 rounded-2xl bg-white border border-border/60 shadow-sm lg:h-auto relative overflow-hidden">
          <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-10" />
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-muted/50 animate-pulse shrink-0 mb-4 lg:mb-0 lg:mr-4"></div>
          <div className="flex-1 flex flex-col justify-center w-full">
            <div className="h-5 lg:h-6 w-48 bg-muted/50 animate-pulse rounded-md mb-1"></div>
            <div className="h-4 w-36 bg-muted/40 animate-pulse rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
