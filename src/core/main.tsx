import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Main entry point for the VARtificial Intelligence application
// This application uses machine learning to predict football match outcomes
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);