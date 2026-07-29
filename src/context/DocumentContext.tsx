import { createContext, useContext, useEffect, useReducer, type ReactNode } from "react";
import type { WritingDocument } from "../types/document";
import { STORAGE_KEY, getDocuments } from "../lib/storage";

interface DocumentState {
  documents: WritingDocument[];
}

type DocumentAction =
  | { type: "ADD_DOCUMENT"; payload: WritingDocument }
  | { type: "UPDATE_DOCUMENT"; payload: WritingDocument }
  | { type: "DELETE_DOCUMENT"; payload: string };

function documentReducer(state: DocumentState, action: DocumentAction): DocumentState {
  switch (action.type) {
    case "ADD_DOCUMENT":
      return { documents: [...state.documents, action.payload] };
    case "UPDATE_DOCUMENT":
      return {
        documents: state.documents.map((doc) =>
          doc.id === action.payload.id ? action.payload : doc,
        ),
      };
    case "DELETE_DOCUMENT":
      return {
        documents: state.documents.filter((doc) => doc.id !== action.payload),
      };
  }
}

interface DocumentContextValue {
  state: DocumentState;
  dispatch: React.Dispatch<DocumentAction>;
}

const DocumentContext = createContext<DocumentContextValue | null>(null);

export function DocumentProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(documentReducer, {
    documents: getDocuments(),
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.documents));
  }, [state]);

  return (
    <DocumentContext.Provider value={{ state, dispatch }}>
      {children}
    </DocumentContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentContext);
  if (!context) {
    throw new Error("useDocuments must be used within a DocumentProvider");
  }
  return context;
}