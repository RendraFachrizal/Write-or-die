import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { DocumentProvider } from "./context/DocumentContext";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <DocumentProvider>
      <App />
    </DocumentProvider>
  </StrictMode>,
);