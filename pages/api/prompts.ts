import type { NextApiRequest, NextApiResponse } from 'next'
import { connectToDatabase } from '@/utils/db'
import { ObjectId } from 'mongodb'

type PromptDoc = { _id?: ObjectId; title: string; content: string; categoryId?: string | null }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { db } = await connectToDatabase()
  const col = db.collection<PromptDoc>('prompts')

  if (req.method === 'GET') {
    const list = await col.find({}).sort({ _id: -1 }).toArray()
    return res.status(200).json(list.map(({ _id, ...rest }) => ({ id: String(_id), ...rest })))
  }

  if (req.method === 'POST') {
    const body = req.body as Omit<PromptDoc, '_id'>
    const r = await col.insertOne({ ...body })
    const list = await col.find({}).sort({ _id: -1 }).toArray()
    return res.status(200).json(list.map(({ _id, ...rest }) => ({ id: String(_id), ...rest })))
  }

  if (req.method === 'PUT') {
    const { id, ...rest } = req.body as any
    await col.updateOne({ _id: new ObjectId(id) }, { $set: rest })
    const list = await col.find({}).sort({ _id: -1 }).toArray()
    return res.status(200).json(list.map(({ _id, ...r }) => ({ id: String(_id), ...r })))
  }

  if (req.method === 'DELETE') {
    const id = String(req.query.id)
    await col.deleteOne({ _id: new ObjectId(id) })
    const list = await col.find({}).sort({ _id: -1 }).toArray()
    return res.status(200).json(list.map(({ _id, ...r }) => ({ id: String(_id), ...r })))
  }

  return res.status(405).end()
}

