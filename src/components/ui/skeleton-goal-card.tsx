import { Skeleton } from "./skeleton"
import { Card, CardContent } from "./card"

export const SkeletonGoalCard = () => (
  <Card className="hover:shadow-lg transition-all duration-200">
    <CardContent className="p-4 sm:p-6">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <Skeleton className="h-6 sm:h-7 w-2/3" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-8 h-8 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-md" />
          </div>
        </div>

        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>
    </CardContent>
  </Card>
)

export const SkeletonGoalList = ({ count = 3 }: { count?: number }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonGoalCard key={index} />
    ))}
  </div>
)
