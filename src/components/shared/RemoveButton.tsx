import { Trash2 } from 'lucide-react'

interface Props {
  onClick: () => void
  label?: string
}

export function RemoveButton({ onClick, label = 'Remove' }: Props) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1 rounded text-xs text-slate-400 hover:text-red-500 transition-colors"
    >
      <Trash2 size={13} />
      {label}
    </button>
  )
}
