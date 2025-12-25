import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Progress } from "@/shared/components/ui/progress";
import {
  getCalibrationData,
  calibrateConfidence,
  getCalibrationStatus,
  getCalibrationAdvice,
  type CalibrationData
} from "@/shared/utils/confidenceCalibration";
import { Target, CheckCircle, AlertTriangle, Info } from "lucide-react";

interface ConfidenceCalibrationProps {
  modelId: string;
  rawConfidence: number;
  className?: string;
}

const ConfidenceCalibration: React.FC<ConfidenceCalibrationProps> = ({
  modelId,
  rawConfidence,
  className = ""
}) => {
  const [calibrationData, setCalibrationData] = useState<CalibrationData | null>(null);
  const [calibratedConfidence, setCalibratedConfidence] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCalibrationData();
  }, [modelId, rawConfidence]);

  const loadCalibrationData = () => {
    try {
      setLoading(true);
      const data = getCalibrationData(modelId);
      setCalibrationData(data);

      if (data) {
        const calibrated = calibrateConfidence(modelId, rawConfidence);
        setCalibratedConfidence(calibrated);
      }
    } catch (error) {
      console.error("Error loading calibration data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Confidence Calibration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading calibration data...</p>
        </CardContent>
      </Card>
    );
  }

  if (!calibrationData) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Confidence Calibration
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">
            Calibration data not available for this model.
          </p>
        </CardContent>
      </Card>
    );
  }

  const calibrationStatus = getCalibrationStatus(calibrationData.calibrationScore);
  const calibrationAdvice = getCalibrationAdvice(calibrationData);

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Confidence Calibration
          </span>
          <Badge variant="outline" className="text-xs text-amber-600 border-amber-300">
            Example Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Calibration Status */}
        <div className="text-center">
          <Badge
            variant={calibrationData.calibrationScore < 0.1 ? "default" : calibrationData.calibrationScore < 0.2 ? "secondary" : "destructive"}
            className="text-sm"
          >
            {calibrationStatus}
          </Badge>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Calibration Score: {calibrationData.calibrationScore.toFixed(3)}
          </p>
        </div>

        {/* Confidence Comparison */}
        <div>
          <h3 className="text-sm font-medium mb-3">Confidence Levels</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Raw Confidence</span>
                <span>{rawConfidence}%</span>
              </div>
              <Progress value={rawConfidence} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Calibrated Confidence</span>
                <span className={calibratedConfidence > rawConfidence ? "text-green-600" : calibratedConfidence < rawConfidence ? "text-red-600" : ""}>
                  {calibratedConfidence.toFixed(1)}%
                </span>
              </div>
              <Progress value={calibratedConfidence} className="h-2" />
            </div>
          </div>
        </div>

        {/* Calibration Curve Visualization */}
        <div>
          <h3 className="text-sm font-medium mb-3">Calibration Curve</h3>
          <div className="h-32 relative border rounded-lg bg-gray-50 dark:bg-gray-800">
            {/* Perfect calibration line (diagonal) */}
            <svg className="absolute inset-0 w-full h-full">
              <line
                x1="0" y1="100%"
                x2="100%" y2="0"
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4,4"
              />
              {/* Actual calibration points */}
              {calibrationData.calibrationCurve.map((point, index) => {
                const x = (point.confidence / 100) * 100;
                const y = 100 - (point.accuracy / 100) * 100;
                return (
                  <circle
                    key={index}
                    cx={`${x}%`}
                    cy={`${y}%`}
                    r="3"
                    fill="#3b82f6"
                  />
                );
              })}
            </svg>
            <div className="absolute bottom-1 left-1 text-xs text-gray-500">0%</div>
            <div className="absolute top-1 right-1 text-xs text-gray-500">100%</div>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
            Perfect calibration line shown as dashed diagonal
          </p>
        </div>

        {/* Calibration Advice */}
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex items-start">
            <Info className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                {calibrationAdvice}
              </p>
              {calibrationData.overConfident && (
                <div className="flex items-center mt-2 text-orange-600 dark:text-orange-400">
                  <AlertTriangle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Model tends to overestimate confidence</span>
                </div>
              )}
              {calibrationData.underConfident && (
                <div className="flex items-center mt-2 text-green-600 dark:text-green-400">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  <span className="text-xs">Model tends to underestimate confidence</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConfidenceCalibration;