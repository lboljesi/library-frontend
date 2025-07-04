import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import "../assets/styles/style.css";

import Navigation from "./Navigation.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Navigation />
      <App />
    </BrowserRouter>
  </StrictMode>
);
