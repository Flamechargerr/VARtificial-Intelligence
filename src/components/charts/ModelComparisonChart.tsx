import React from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ModelComparisonChartProps {
  data: Array<{
    name: string;
    accuracy: number;
    precision: number;
    f1Score: number;
  }>;
  className?: string;
}

const ModelComparisonChart: React.FC<ModelComparisonChartProps> = ({ data, className = "" }) => {
  // Colors for different models
  const colors = [
    { accuracy: "#4F46E5", precision: "#6366F1", f1: "#818CF8" },
    { accuracy: "#10B981", precision: "#34D399", f1: "#6EE7B7" },
    { accuracy: "#EC4899", precision: "#F472B6", f1: "#F9A8D4" },
  ];

  return (
    <Card className={`border-0 shadow-lg bg-gradient-to-br from-white/50 to-gray-50/50 dark:from-gray-800/50 dark:to-gray-900/50 backdrop-blur-sm ${className}`}>
      <CardHeader>
        <CardTitle className="text-gray-900 dark:text-white">Model Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={60}
                tick={{ fontSize: 12, fill: "#6b7280" }}
              />
              <YAxis 
                tick={{ fontSize: 12, fill: "#6b7280" }}
                tickFormatter={(value) => `${value}%`}
                domain={[0, 100]}
              />
              <Tooltip
                contentStyle={{ 
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  border: "1px solid rgba(229, 231, 235, 1)",
                  borderRadius: "0.5rem",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, undefined]}
                labelStyle={{ fontWeight: 600, color: "#111827" }}
              />
              <Legend />
              <Bar dataKey="accuracy" name="Accuracy" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length].accuracy} />
                ))}
              </Bar>
              <Bar dataKey="precision" name="Precision" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length].precision} />
                ))}
              </Bar>
              <Bar dataKey="f1Score" name="F1 Score" radius={[4, 4, 0, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length].f1} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelComparisonChart;