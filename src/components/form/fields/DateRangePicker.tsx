interface Props {
  startDate: string
  endDate: string
  current: boolean
  onStartChange: (val: string) => void
  onEndChange: (val: string) => void
  onCurrentChange: (val: boolean) => void
}

export function DateRangePicker({ startDate, endDate, current, onStartChange, onEndChange, onCurrentChange }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-slate-500">Start</label>
        <input
          type="month"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
      {!current && (
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-slate-500">End</label>
          <input
            type="month"
            value={endDate}
            onChange={(e) => onEndChange(e.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
          />
        </div>
      )}
      <div className="flex items-center gap-2 mt-4">
        <input
          type="checkbox"
          id="current-role"
          checked={current}
          onChange={(e) => onCurrentChange(e.target.checked)}
          className="h-4 w-4 rounded border-slate-300 accent-brand-600"
        />
        <label htmlFor="current-role" className="text-sm text-slate-600">Present / Current</label>
      </div>
    </div>
  )
}
