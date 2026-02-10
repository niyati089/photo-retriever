/**
 * ErrorBoundary Component
 * Catches React errors and displays fallback UI
 */

'use client';

import { Component, ReactNode } from 'react';
import Button from './Button';

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

/**
 * Error boundary to catch and display errors gracefully
 */
export default class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
        };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error,
        };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by ErrorBoundary:', error, errorInfo);
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
        });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="flex items-center justify-center min-h-screen bg-gray-50">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-red-500 mb-4">
                            <svg
                                className="w-16 h-16 mx-auto"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h2>

                        <p className="text-gray-600 mb-6">
                            {this.state.error?.message || 'An unexpected error occurred'}
                        </p>

                        <div className="flex gap-3 justify-center">
                            <Button onClick={this.handleReset} variant="primary">
                                Try Again
                            </Button>

                            <Button
                                onClick={() => window.location.href = '/'}
                                variant="outline"
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
