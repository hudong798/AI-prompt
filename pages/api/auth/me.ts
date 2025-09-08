import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'
import { verifyToken } from '@/utils/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const cookies = cookie.parse(req.headers.cookie || '')
  const token = cookies.token
  if (!token) return res.status(401).json({ authenticated: false })
  const payload = verifyToken(token)
  if (!payload) return res.status(401).json({ authenticated: false })
  return res.status(200).json({ authenticated: true, username: payload.username })
}

