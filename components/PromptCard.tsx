import { Prompt } from '@/pages'

type Props = {
  prompt: Prompt
  category: { id: string; name: string } | null
  onEdit: () => void
  onDelete: () => void
}

export default function PromptCard({ prompt, category, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white border rounded-md p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-medium">{prompt.title}</h3>
          {category && (
            <div className="text-xs text-gray-500 mt-1">{category.name}</div>
          )}
        </div>
        <div className="flex gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onEdit}>编辑</button>
          <button className="text-sm text-red-600 hover:text-red-800" onClick={onDelete}>删除</button>
        </div>
      </div>
      <pre className="mt-3 text-sm whitespace-pre-wrap text-gray-800">{prompt.content}</pre>
    </div>
  )
}

