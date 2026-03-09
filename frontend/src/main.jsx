import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

window.onerror = function (message, source, lineno) {
  console.error("FATAL ERROR: " + message + " at " + source + ":" + lineno);
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
