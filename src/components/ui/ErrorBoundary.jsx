import { Component } from 'react';
import { RefreshCw } from 'lucide-react';

export class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  componentDidCatch(error, info) { console.error('Social-CV Error:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="mesh-bg min-h-screen flex items-center justify-center p-6">
          <div className="glass-card p-10 max-w-md text-center space-y-5">
            <h2 className="text-xl font-bold text-white">Something went wrong</h2>
            <p className="text-sm text-slate-400">{this.state.error?.message || 'An unexpected error occurred.'}</p>
            <button onClick={() => window.location.reload()} className="btn-primary w-auto px-8 py-3 mx-auto">
              <RefreshCw size={15} /> Reload App
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
