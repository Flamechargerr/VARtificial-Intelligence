import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const TeamInputSkeleton: React.FC = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Team Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
            </div>
          </div>
          
          {/* Away Team Skeleton */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-10 w-full mt-1" />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamInputSkeleton;