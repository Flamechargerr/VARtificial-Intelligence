import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { 
  getTeamInjuryReports, 
  getInjurySeverityColor, 
  getInjurySeverityBgColor, 
  getInjuryStatusColor,
  getDaysUntilReturn,
  type InjuryReport 
} from "@/shared/utils/injuryService";
import { AlertTriangle, Clock, User, Activity } from "lucide-react";

interface PlayerInjuryReportProps {
  teamName: string;
  className?: string;
}

const PlayerInjuryReport: React.FC<PlayerInjuryReportProps> = ({ 
  teamName,
  className = "" 
}) => {
  const [injuryReports, setInjuryReports] = useState<InjuryReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadInjuryReports();
  }, [teamName]);

  const loadInjuryReports = () => {
    try {
      setLoading(true);
      const reports = getTeamInjuryReports(teamName);
      setInjuryReports(reports);
    } catch (error) {
      console.error("Error loading injury reports:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Player Injury Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-gray-500 py-4">Loading injury reports...</p>
        </CardContent>
      </Card>
    );
  }

  if (injuryReports.length === 0) {
    return (
      <Card className={`w-full ${className}`}>
        <CardHeader>
          <CardTitle className="flex items-center">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Player Injury Report
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <Activity className="w-12 h-12 mx-auto text-green-500 mb-2" />
            <p className="text-gray-500">
              No injury reports for {teamName}. All players are fit.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`w-full ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <AlertTriangle className="mr-2 h-5 w-5" />
          Player Injury Report: {teamName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {injuryReports.map((report) => {
            const daysUntilReturn = getDaysUntilReturn(report.expectedReturn);
            return (
              <div 
                key={report.playerId} 
                className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      {report.playerName}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {report.injuryType}
                    </div>
                  </div>
                  <Badge 
                    className={`${getInjurySeverityBgColor(report.severity)} ${getInjurySeverityColor(report.severity)}`}
                  >
                    {report.severity.charAt(0).toUpperCase() + report.severity.slice(1)}
                  </Badge>
                </div>
                
                <div className="mt-3 text-sm">
                  <p className="text-gray-700 dark:text-gray-300">
                    {report.description}
                  </p>
                </div>
                
                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center text-sm">
                    <Clock className="mr-1 h-4 w-4" />
                    <span>
                      {daysUntilReturn > 0 
                        ? `${daysUntilReturn} day${daysUntilReturn !== 1 ? 's' : ''} until return` 
                        : 'Available'}
                    </span>
                  </div>
                  <Badge 
                    variant={report.status === 'fit' ? 'default' : report.status === 'recovering' ? 'secondary' : 'destructive'}
                    className={getInjuryStatusColor(report.status)}
                  >
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>
                
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Expected return: {new Date(report.expectedReturn).toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Total Injuries</span>
            <Badge variant="secondary">{injuryReports.length}</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PlayerInjuryReport;