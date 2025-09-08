import { connectToDatabase } from '@/utils/db'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export type UserDoc = { _id?: any; username: string; passwordHash: string }

export async function findUserByUsername(username: string) {
  const { db } = await connectToDatabase()
  return db.collection<UserDoc>('users').findOne({ username })
}

export async function createUser(username: string, password: string) {
  const { db } = await connectToDatabase()
  const passwordHash = await bcrypt.hash(password, 10)
  await db.collection<UserDoc>('users').insertOne({ username, passwordHash })
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash)
}

export function signToken(payload: { userId: string; username: string }) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; username: string; iat: number; exp: number }
  } catch {
    return null
  }
}
