'use client';

import { Component, type ErrorInfo, type ReactNode } from 'react';
import styles from './ErrorBoundary.module.css';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches render errors and failed dynamic-import rejections in the subtree.
 * Renders a graceful fallback so a single component failure (e.g. CodeMirror
 * chunk 404) doesn't blank the entire page.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Only log in dev; production telemetry would hook in here.
    if (process.env.NODE_ENV !== 'production') {
      console.error('[ErrorBoundary]', error, info);
    }
  }

  handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className={styles.shell} role="alert">
          <div className={styles.body}>
            <h2 className={styles.title}>Something went wrong</h2>
            <p className={styles.detail}>
              An unexpected error occurred. Your draft is autosaved locally and should be intact
              when you reload.
            </p>
            <button type="button" className={styles.button} onClick={this.handleReload}>
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
