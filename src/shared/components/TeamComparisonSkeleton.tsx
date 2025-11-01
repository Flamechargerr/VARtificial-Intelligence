import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TeamComparisonSkeleton: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Skeleton className="h-5 w-5 mr-2 rounded-full" />
            <Skeleton className="h-6 w-40" />
          </div>
          <Skeleton className="h-6 w-32" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistical Comparison Chart Skeleton */}
          <div className="col-span-1 md:col-span-2">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="h-64 flex items-center justify-center">
              <Skeleton className="h-56 w-full rounded-lg" />
            </div>
          </div>

          {/* Form Statistics Skeleton */}
          <div>
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Detailed Stats Skeleton */}
          <div>
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item}>
                  <div className="flex justify-between mb-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <Skeleton className="h-2.5 w-full rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamComparisonSkeleton;