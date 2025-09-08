import { useRouter } from 'next/router'
import { useState } from 'react'

export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username, password }) })
    if (res.ok) {
      router.replace('/')
    } else {
      const j = await res.json().catch(() => ({}))
      setError(j.message || '登录失败')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={submit} className="bg-white p-6 rounded-md shadow w-full max-w-sm space-y-3">
        <h1 className="text-lg font-medium">登录</h1>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="用户名" className="w-full rounded-md border px-3 py-2 text-sm" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="密码" className="w-full rounded-md border px-3 py-2 text-sm" />
        <button type="submit" className="w-full rounded-md bg-blue-600 text-white py-2 text-sm">登录</button>
      </form>
    </div>
  )
}

