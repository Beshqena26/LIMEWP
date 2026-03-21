"use client";

import React, { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "50%",
              backgroundColor: "var(--error-bg, rgba(239,68,68,0.1))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--error, #ef4444)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>

          <h2
            style={{
              fontSize: 20,
              fontWeight: 600,
              color: "var(--text-primary, #f1f5f9)",
              marginBottom: 8,
            }}
          >
            Something went wrong
          </h2>

          <p
            style={{
              fontSize: 14,
              color: "var(--text-tertiary, #64748b)",
              maxWidth: 400,
              marginBottom: 24,
            }}
          >
            {this.state.error?.message || "An unexpected error occurred."}
          </p>

          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              padding: "10px 20px",
              borderRadius: 12,
              fontSize: 14,
              fontWeight: 500,
              color: "#fff",
              background: "linear-gradient(to right, #10b981, #059669)",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(16,185,129,0.2)",
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
