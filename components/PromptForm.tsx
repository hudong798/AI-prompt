import { useEffect, useState } from 'react'
import { Category, Prompt } from '@/pages'

type Props = {
  categories: Category[]
  initial?: Prompt
  onSubmit: (payload: Omit<Prompt, 'id'> & { id?: string }) => void | Promise<void>
  onClose: () => void
}

export default function PromptForm({ categories, initial, onSubmit, onClose }: Props) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [content, setContent] = useState(initial?.content ?? '')
  const [categoryId, setCategoryId] = useState<string | ''>(initial?.categoryId ?? '')

  useEffect(() => {
    setTitle(initial?.title ?? '')
    setContent(initial?.content ?? '')
    setCategoryId(initial?.categoryId ?? '')
  }, [initial])

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
      <div className="bg-white rounded-md p-4 w-full max-w-lg">
        <h2 className="font-medium mb-3">{initial ? '编辑提示词' : '新增提示词'}</h2>
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (!title.trim() || !content.trim()) return
          await onSubmit({ id: initial?.id, title: title.trim(), content: content.trim(), categoryId: categoryId || null })
        }} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="标题"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          >
            <option value="">未分类</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="内容"
            rows={8}
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex justify-end gap-2">
            <button type="button" className="px-3 py-2 text-sm" onClick={onClose}>取消</button>
            <button type="submit" className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">保存</button>
          </div>
        </form>
      </div>
    </div>
  )
}

