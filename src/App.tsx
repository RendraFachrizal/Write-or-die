import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DocumentList from "./pages/DocumentList";
import SessionSetup from "./pages/SessionSetup";
import Editor from "./pages/Editor";
import DocumentView from "./pages/DocumentView";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DocumentList />} />
        <Route path="/new" element={<SessionSetup />} />
        <Route path="/write/:id" element={<Editor />} />
        <Route path="/view/:id" element={<DocumentView />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}