import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { initMetaPixel } from "./lib/metaPixel.js";
import "./styles.css";

initMetaPixel();

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
