import type { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

type Category = { id: string; name: string }

const dataDir = path.join(process.cwd(), 'data')
const filePath = path.join(dataDir, 'categories.json')

function ensureData() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, '[]', 'utf-8')
}

function readAll(): Category[] {
  ensureData()
  return JSON.parse(fs.readFileSync(filePath, 'utf-8') || '[]')
}

function writeAll(data: Category[]) {
  ensureData()
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const mode = process.env.NEXT_PUBLIC_STORAGE_MODE || 'local'
  if (mode === 'local') {
    // local 模式由前端处理，本 API 返回空集合防止报错
    return res.status(200).json([])
  }

  if (req.method === 'GET') {
    return res.status(200).json(readAll())
  }

  if (req.method === 'POST') {
    const body = req.body as Omit<Category, 'id'>
    const next = [...readAll(), { ...body, id: crypto.randomUUID() }]
    writeAll(next)
    return res.status(200).json(next)
  }

  if (req.method === 'PUT') {
    const body = req.body as Category
    const next = readAll().map((c) => (c.id === body.id ? { ...c, ...body } : c))
    writeAll(next)
    return res.status(200).json(next)
  }

  if (req.method === 'DELETE') {
    const id = String(req.query.id)
    const next = readAll().filter((c) => c.id !== id)
    writeAll(next)
    return res.status(200).json(next)
  }

  return res.status(405).end()
}

