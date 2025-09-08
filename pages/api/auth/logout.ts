import type { NextApiRequest, NextApiResponse } from 'next'
import cookie from 'cookie'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()
  res.setHeader('Set-Cookie', cookie.serialize('token', '', { httpOnly: true, path: '/', maxAge: 0 }))
  return res.status(200).json({ ok: true })
}

