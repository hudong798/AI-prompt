import { Category } from '@/pages'

type Props = {
  categories: Category[]
  activeCategoryId: string | null
  onSelect: (id: string | null) => void
  onEdit: (cat: Category) => void
  onDelete: (cat: Category) => void
}

export default function CategoryList({ categories, activeCategoryId, onSelect, onEdit, onDelete }: Props) {
  return (
    <div className="flex-1 overflow-auto">
      <ul className="p-2 space-y-1">
        <li>
          <button
            className={`w-full text-left px-3 py-2 rounded-md text-sm ${activeCategoryId === null ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'}`}
            onClick={() => onSelect(null)}
          >全部</button>
        </li>
        {categories.map((c) => (
          <li key={c.id} className="group flex items-center justify-between px-2 rounded-md hover:bg-gray-50">
            <button
              className={`flex-1 text-left px-1 py-2 rounded-md text-sm ${activeCategoryId === c.id ? 'text-blue-700' : ''}`}
              onClick={() => onSelect(c.id)}
            >{c.name}</button>
            <div className="opacity-0 group-hover:opacity-100 transition flex gap-1">
              <button className="text-xs text-gray-500 hover:text-gray-800" onClick={() => onEdit(c)}>编辑</button>
              <button className="text-xs text-red-500 hover:text-red-700" onClick={() => onDelete(c)}>删除</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

