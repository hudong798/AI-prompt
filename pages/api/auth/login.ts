import type { NextApiRequest, NextApiResponse } from 'next'
import { findUserByUsername, verifyPassword, signToken } from '@/utils/auth'
import cookie from 'cookie'
import { ObjectId } from 'mongodb'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  const { username, password } = req.body as { username: string; password: string }
  const user = await findUserByUsername(username)
  if (!user) return res.status(401).json({ message: '用户不存在' })
  const ok = await verifyPassword(password, user.passwordHash)
  if (!ok) return res.status(401).json({ message: '密码错误' })
  const token = signToken({ userId: String((user as any)._id || new ObjectId()), username })
  res.setHeader('Set-Cookie', cookie.serialize('token', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 }))
  return res.status(200).json({ username })
}

