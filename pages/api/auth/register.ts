import type { NextApiRequest, NextApiResponse } from 'next'
import { createUser, findUserByUsername } from '@/utils/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body as { username: string; password: string }
  const exists = await findUserByUsername(username)
  if (exists) return res.status(400).json({ message: '用户已存在' })
  await createUser(username, password)
  return res.status(200).json({ ok: true })
}

