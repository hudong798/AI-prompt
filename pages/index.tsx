import { useEffect, useMemo, useState } from 'react'
import Head from 'next/head'
import CategoryList from '@/components/CategoryList'
import PromptCard from '@/components/PromptCard'
import PromptForm from '@/components/PromptForm'
import { apiJson } from '@/utils/storage'

export type Category = {
  id: string
  name: string
}

export type Prompt = {
  id: string
  title: string
  content: string
  categoryId?: string | null
}


export default function Home() {
  const [categories, setCategories] = useState<Category[]>([])
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [isPromptModalOpen, setPromptModalOpen] = useState(false)
  const [isCategoryModalOpen, setCategoryModalOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<Prompt | null>(null)

  const loadData = async () => {
    const [cats, prs] = await Promise.all([
      apiJson<Category[]>('/api/categories'),
      apiJson<Prompt[]>('/api/prompts'),
    ])
    setCategories(cats)
    setPrompts(prs)
  }

  useEffect(() => {
    loadData()
  }, [])

  const filteredPrompts = useMemo(() => {
    return prompts.filter((p) => {
      const matchesCategory = !activeCategoryId || p.categoryId === activeCategoryId
      const s = search.trim().toLowerCase()
      const matchesSearch = !s || p.title.toLowerCase().includes(s) || p.content.toLowerCase().includes(s)
      return matchesCategory && matchesSearch
    })
  }, [prompts, activeCategoryId, search])

  const upsertPrompt = async (payload: Omit<Prompt, 'id'> & { id?: string }) => {
    const method = payload.id ? 'PUT' : 'POST'
    const data = await apiJson<Prompt[]>('/api/prompts', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setPrompts(data)
  }

  const removePrompt = async (id: string) => {
    const data = await apiJson<Prompt[]>('/api/prompts?id=' + id, { method: 'DELETE' })
    setPrompts(data)
  }

  const upsertCategory = async (payload: Omit<Category, 'id'> & { id?: string }) => {
    const method = payload.id ? 'PUT' : 'POST'
    const data = await apiJson<Category[]>('/api/categories', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
    setCategories(data)
  }

  const removeCategory = async (id: string) => {
    const data = await apiJson<Category[]>('/api/categories?id=' + id, { method: 'DELETE' })
    setCategories(data)
    if (activeCategoryId === id) setActiveCategoryId(null)
  }

  return (
    <>
      <Head>
        <title>AI 提示词管理平台</title>
      </Head>
      <div className="h-full flex">
        <aside className="w-72 border-r bg-white flex flex-col">
          <div className="p-4 border-b">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="搜索标题/内容..."
              className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="mt-3 w-full rounded-md bg-blue-600 text-white py-2 text-sm hover:bg-blue-700"
              onClick={() => setCategoryModalOpen(true)}
            >
              新增分类
            </button>
          </div>
          <CategoryList
            categories={categories}
            activeCategoryId={activeCategoryId}
            onSelect={setActiveCategoryId}
            onEdit={(c) => {
              const name = prompt('重命名分类', c.name)
              if (name) upsertCategory({ id: c.id, name })
            }}
            onDelete={(c) => removeCategory(c.id)}
          />
        </aside>
        <main className="flex-1 flex flex-col">
          <header className="p-4 border-b bg-white flex items-center justify-between">
            <h1 className="font-semibold">提示词</h1>
            <div className="space-x-2">
              <button
                className="rounded-md bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                onClick={() => setPromptModalOpen(true)}
              >新增提示词</button>
            </div>
          </header>
          <section className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto">
            {filteredPrompts.map((p) => (
              <PromptCard
                key={p.id}
                prompt={p}
                category={categories.find((c) => c.id === p.categoryId) || null}
                onEdit={() => { setEditingPrompt(p); setPromptModalOpen(true) }}
                onDelete={() => removePrompt(p.id)}
              />
            ))}
            {filteredPrompts.length === 0 && (
              <div className="text-sm text-gray-500">暂无数据</div>
            )}
          </section>
        </main>

        {isPromptModalOpen && (
          <PromptForm
            categories={categories}
            initial={editingPrompt || undefined}
            onClose={() => { setPromptModalOpen(false); setEditingPrompt(null) }}
            onSubmit={async (data) => { await upsertPrompt(data); setPromptModalOpen(false); setEditingPrompt(null) }}
          />
        )}

        {isCategoryModalOpen && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4">
            <div className="bg-white rounded-md p-4 w-full max-w-sm">
              <h2 className="font-medium mb-3">新增分类</h2>
              <form onSubmit={(e) => {
                e.preventDefault()
                const form = e.target as HTMLFormElement
                const fd = new FormData(form)
                const name = String(fd.get('name') || '').trim()
                if (!name) return
                upsertCategory({ name }).then(() => setCategoryModalOpen(false))
              }}>
                <input name="name" placeholder="分类名称" className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <div className="flex justify-end gap-2 mt-4">
                  <button type="button" className="px-3 py-2 text-sm" onClick={() => setCategoryModalOpen(false)}>取消</button>
                  <button type="submit" className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700">保存</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  )
}

