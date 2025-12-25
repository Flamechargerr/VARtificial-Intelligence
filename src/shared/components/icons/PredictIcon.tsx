import React from "react";

/**
 * PredictIcon - Analysis/Brain Icon
 * 
 * Professional icon for the prediction button.
 * Represents data analysis and machine learning.
 */
const PredictIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Chart/Analysis icon */}
      <path
        d="M3 3V21H21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7 14L11 10L15 13L21 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 7H21V11"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default PredictIcon;
