import { Component, type ErrorInfo, type ReactNode } from 'react'
import { AlertTriangle, RotateCcw } from 'lucide-react'
import { useResumeStore } from '@/store/useResumeStore'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary caught error:', error, info)
  }

  handleReset = (): void => {
    useResumeStore.getState().resetResume()
    this.setState({ error: null })
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-500/10">
            <AlertTriangle size={22} className="text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              Something went wrong loading the form
            </h3>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              The resume data may be malformed. Reset to start fresh.
            </p>
            {this.state.error.message && (
              <p className="mt-2 break-words font-mono text-[11px] text-slate-400 dark:text-slate-500">
                {this.state.error.message}
              </p>
            )}
          </div>
          <button
            onClick={this.handleReset}
            className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-700"
          >
            <RotateCcw size={13} /> Reset Resume
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
