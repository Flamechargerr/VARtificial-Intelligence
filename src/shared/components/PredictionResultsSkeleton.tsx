import React from "react";
import { Skeleton } from "./ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const PredictionResultsSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-48 mx-auto mt-2" />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Prediction Card 1 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Prediction Card 2 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Prediction Card 3 */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-16 mt-1" />
              </div>
              <div>
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-2 w-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Model Performance Chart Skeleton */}
      <Card>
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-6 w-48" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <Skeleton className="h-48 w-full rounded-lg" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PredictionResultsSkeleton;