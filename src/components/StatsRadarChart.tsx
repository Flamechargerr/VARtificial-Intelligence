import React, { useEffect, useRef } from "react";
import { Chart, RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler } from "chart.js";

Chart.register(RadarController, RadialLinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

type StatsData = {
  homeTeam: {
    name: string;
    goals: number;
    shots: number;
    shotsOnTarget: number;
    redCards: number;
  };
  awayTeam: {
    name: string;
    goals: number;
    shots: number;
    shotsOnTarget: number;
    redCards: number;
  };
};

interface StatsRadarChartProps {
  data: StatsData;
  className?: string;
}

const StatsRadarChart: React.FC<StatsRadarChartProps> = ({ data, className = "" }) => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      // Destroy previous chart instance if it exists
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        // Define chart data
        chartInstance.current = new Chart(ctx, {
          type: "radar",
          data: {
            labels: ["Shots", "Shots on Target", "Goals", "Red Cards"],
            datasets: [
              {
                label: data.homeTeam.name,
                data: [
                  data.homeTeam.shots,
                  data.homeTeam.shotsOnTarget,
                  data.homeTeam.goals,
                  data.homeTeam.redCards,
                ],
                backgroundColor: "rgba(59, 130, 246, 0.2)",
                borderColor: "rgba(59, 130, 246, 0.8)",
                pointBackgroundColor: "rgba(59, 130, 246, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(59, 130, 246, 1)",
                fill: true,
              },
              {
                label: data.awayTeam.name,
                data: [
                  data.awayTeam.shots,
                  data.awayTeam.shotsOnTarget,
                  data.awayTeam.goals,
                  data.awayTeam.redCards,
                ],
                backgroundColor: "rgba(239, 68, 68, 0.2)",
                borderColor: "rgba(239, 68, 68, 0.8)",
                pointBackgroundColor: "rgba(239, 68, 68, 1)",
                pointBorderColor: "#fff",
                pointHoverBackgroundColor: "#fff",
                pointHoverBorderColor: "rgba(239, 68, 68, 1)",
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
              legend: {
                position: "bottom",
                labels: {
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                  },
                  color: "#4b5563",
                  usePointStyle: true,
                  padding: 20,
                },
              },
              tooltip: {
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                titleColor: "#111827",
                bodyColor: "#374151",
                borderColor: "rgba(229, 231, 235, 1)",
                borderWidth: 1,
                padding: 12,
                boxPadding: 6,
                usePointStyle: true,
                bodyFont: {
                  family: "'Inter', sans-serif",
                },
                titleFont: {
                  family: "'Inter', sans-serif",
                  weight: 600,
                },
                callbacks: {
                  label: function(context) {
                    const label = context.dataset.label || '';
                    const value = context.parsed as unknown as number;
                    return `${label}: ${value}`;
                  }
                }
              },
            },
            scales: {
              r: {
                min: 0,
                ticks: {
                  backdropColor: "transparent",
                  color: "#6b7280",
                  showLabelBackdrop: false,
                  font: {
                    family: "'Inter', sans-serif",
                    size: 10,
                  },
                  stepSize: Math.max(
                    data.homeTeam.shots, 
                    data.homeTeam.shotsOnTarget, 
                    data.homeTeam.goals, 
                    data.homeTeam.redCards,
                    data.awayTeam.shots, 
                    data.awayTeam.shotsOnTarget, 
                    data.awayTeam.goals, 
                    data.awayTeam.redCards
                  ) / 5 || 1
                },
                pointLabels: {
                  color: "#4b5563",
                  font: {
                    family: "'Inter', sans-serif",
                    size: 12,
                    weight: 500,
                  },
                },
                grid: {
                  color: "rgba(203, 213, 225, 0.5)",
                },
                angleLines: {
                  color: "rgba(203, 213, 225, 0.5)",
                },
              },
            },
            elements: {
              line: {
                borderWidth: 3,
              },
              point: {
                radius: 4,
                hoverRadius: 6,
              },
            },
            animation: {
              duration: 2000,
              easing: 'easeOutQuart'
            }
          },
        });
      }
    }

    // Cleanup function
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data]);

  return (
    <div className={`radar-chart-container ${className}`}>
      <canvas ref={chartRef} />
    </div>
  );
};

export default StatsRadarChart;