import { Skeleton } from "./skeleton"
import { Card, CardContent } from "./card"

export const SkeletonTaskCard = () => (
  <Card className="border-l-4 border-l-primary">
    <CardContent className="p-3 sm:p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-3 sm:space-y-4">
          <div className="flex items-start justify-between">
            <Skeleton className="h-5 sm:h-6 w-3/4" />
            <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
              <Skeleton className="w-8 sm:w-9 h-8 sm:h-9 rounded-md" />
              <Skeleton className="w-8 sm:w-9 h-8 sm:h-9 rounded-md" />
              <Skeleton className="w-8 sm:w-9 h-8 sm:h-9 rounded-md" />
              <Skeleton className="w-8 sm:w-9 h-8 sm:h-9 rounded-md" />
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Skeleton className="h-5 w-24 rounded-md" />
            <Skeleton className="h-5 w-20 rounded-md" />
            <Skeleton className="h-5 w-28 rounded-md" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
)

export const SkeletonTaskList = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-4">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonTaskCard key={index} />
    ))}
  </div>
)
