// Utility functions to export predictions in different formats
import { type MatchPrediction } from "../utils/types";

export interface ExportData {
  homeTeam: string;
  awayTeam: string;
  predictions: MatchPrediction[];
  timestamp: Date;
}

// Export as CSV
export const exportAsCSV = (data: ExportData): string => {
  const headers = ['Model', 'Prediction', 'Confidence', 'Accuracy'];
  const rows = data.predictions.map(prediction => [
    prediction.modelName,
    prediction.outcome,
    prediction.confidence.toFixed(2),
    prediction.modelAccuracy.toFixed(2)
  ]);

  const csvContent = [
    `Match: ${data.homeTeam} vs ${data.awayTeam}`,
    `Exported: ${data.timestamp.toLocaleString()}`,
    '',
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

// Export as JSON
export const exportAsJSON = (data: ExportData): string => {
  return JSON.stringify({
    match: `${data.homeTeam} vs ${data.awayTeam}`,
    exported: data.timestamp.toISOString(),
    predictions: data.predictions
  }, null, 2);
};

// Export as plain text
export const exportAsText = (data: ExportData): string => {
  const lines = [
    `Football Match Prediction Report`,
    `==============================`,
    ``,
    `Match: ${data.homeTeam} vs ${data.awayTeam}`,
    `Exported: ${data.timestamp.toLocaleString()}`,
    ``,
    `Predictions:`,
    `------------`
  ];

  data.predictions.forEach((prediction, index) => {
    lines.push(
      ``,
      `Model ${index + 1}: ${prediction.modelName}`,
      `  Prediction: ${prediction.outcome}`,
      `  Confidence: ${prediction.confidence.toFixed(2)}%`,
      `  Model Accuracy: ${prediction.modelAccuracy.toFixed(2)}%`
    );
  });

  return lines.join('\n');
};

// Trigger file download
export const downloadFile = (content: string, filename: string, mimeType: string): void => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// Export predictions in specified format
export const exportPredictions = (
  data: ExportData, 
  format: 'csv' | 'json' | 'txt'
): void => {
  let content = '';
  let filename = '';
  let mimeType = '';

  switch (format) {
    case 'csv':
      content = exportAsCSV(data);
      filename = `prediction-${data.homeTeam}-vs-${data.awayTeam}-${new Date().toISOString().slice(0, 10)}.csv`;
      mimeType = 'text/csv';
      break;
    case 'json':
      content = exportAsJSON(data);
      filename = `prediction-${data.homeTeam}-vs-${data.awayTeam}-${new Date().toISOString().slice(0, 10)}.json`;
      mimeType = 'application/json';
      break;
    case 'txt':
      content = exportAsText(data);
      filename = `prediction-${data.homeTeam}-vs-${data.awayTeam}-${new Date().toISOString().slice(0, 10)}.txt`;
      mimeType = 'text/plain';
      break;
  }

  downloadFile(content, filename, mimeType);
};