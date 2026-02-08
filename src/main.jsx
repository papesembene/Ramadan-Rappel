import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

const root = document.getElementById("root");

// Error boundary component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-nightBlue text-softWhite flex items-center justify-center p-4">
          <div className="text-center">
            <h1 className="text-xl font-semibold text-gold mb-4">Une erreur est survenue</h1>
            <p className="text-lightGray/70 mb-4">Veuillez rafraîchir la page</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gold/20 border border-gold/30 rounded-lg text-gold hover:bg-gold/30"
            >
              Rafraîchir
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
