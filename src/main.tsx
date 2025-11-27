import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/globals.css";

function loadTheme() {
  const stored = localStorage.getItem("lux-theme");
  if (stored) document.body.className = stored;
  else document.body.className = "theme-soft-blue";
}

loadTheme();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <div className="app-bg-orbit" />
    <App />
  </React.StrictMode>
);
