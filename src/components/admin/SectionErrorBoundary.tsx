'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  /** Section name shown in the error message */
  section?: string;
}

interface State {
  hasError: boolean;
}

/**
 * Lightweight error boundary for individual dashboard sections/tabs.
 * Catches render errors in one section without taking down the whole page.
 *
 * Usage:
 *   <SectionErrorBoundary section="Projects">
 *     <ProjectsTab />
 *   </SectionErrorBoundary>
 */
export class SectionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error(`[SectionError${this.props.section ? `: ${this.props.section}` : ''}]`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-12 px-4 rounded-xl border border-red-100 bg-red-50/50">
          <AlertTriangle className="w-6 h-6 text-red-400 mb-3" />
          <p className="text-sm font-medium text-fm-neutral-700 mb-1">
            {this.props.section ? `${this.props.section} failed to load` : 'This section failed to load'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-red-200 text-red-600 hover:bg-red-100 transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            Retry
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
