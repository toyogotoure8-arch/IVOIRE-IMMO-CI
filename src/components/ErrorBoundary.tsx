import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = window.location.pathname;
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#F2F6F0] dark:bg-[#0d1712] text-gray-900 dark:text-gray-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-md w-full bg-white dark:bg-[#16261c] rounded-3xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-gray-800 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-100 dark:bg-red-950/60 text-red-600 dark:text-red-400 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">
              Un problème est survenu
            </h2>

            <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">
              Une erreur inattendue s'est produite. Ne vous inquiétez pas, vos données et favoris sont en sécurité.
            </p>

            {this.state.error && (
              <div className="bg-gray-100 dark:bg-[#1a2d22] p-3 rounded-xl text-[11px] font-mono text-red-600 dark:text-red-400 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="flex-1 py-3 px-4 bg-[#0F6B3F] hover:bg-[#0B5431] text-white text-xs font-bold rounded-xl shadow flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Recharger l'application</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
