import { Plus } from 'lucide-react'

interface Props {
  label: string
  onClick: () => void
}

export function AddItemButton({ label, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 py-3 text-sm font-medium text-slate-500 transition-colors hover:border-brand-500 hover:text-brand-600"
    >
      <Plus size={16} />
      {label}
    </button>
  )
}
