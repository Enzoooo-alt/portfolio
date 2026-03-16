import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { BgmProvider } from "./context/BgmContext";
import "./index.css"; // ton CSS global

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <BgmProvider>
        <App />
      </BgmProvider>
    </BrowserRouter>
  </React.StrictMode>
);
