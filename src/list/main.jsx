import React from "react";
import { createRoot } from "react-dom/client";
import ListForm from "./ListForm.jsx";
import "../styles.css";
import "./list.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ListForm />
  </React.StrictMode>
);
