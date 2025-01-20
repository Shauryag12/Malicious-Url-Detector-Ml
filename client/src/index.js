import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css"; // Global CSS
import App from "./App";

// React 18+ uses createRoot
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
