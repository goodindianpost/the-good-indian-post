import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export function Login() {
  const { user, loading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-white"><span className="font-display text-gray-400 text-sm uppercase tracking-widest">Loading...</span></div>
  if (user) return <Navigate to="/admin" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    if (error) setError(error.message)
    setSubmitting(false)
  }

  return (
    <div className="min-h-screen flex bg-white font-display">
      {/* Left - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gray-50 items-center justify-center px-16">
        <div>
          <h1 className="text-brand-red font-bold text-5xl tracking-tight leading-tight mb-4">
            THE GOOD<br />INDIAN POST
          </h1>
          <div className="w-12 h-0.5 bg-brand-red mb-6" />
          <p className="text-gray-400 text-lg font-serif leading-relaxed max-w-sm">
            Stories from India and the diaspora. Admin portal.
          </p>
        </div>
      </div>

      {/* Right - Login Form */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-12">
            <h1 className="text-brand-red font-bold text-3xl tracking-tight">THE GOOD INDIAN POST</h1>
            <p className="text-gray-400 text-sm mt-2">Admin Portal</p>
          </div>

          <h2 className="text-brand-black text-2xl font-bold tracking-tight mb-1">Sign in</h2>
          <p className="text-gray-400 text-sm mb-8">Enter your credentials to continue</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full border border-gray-200 text-brand-black px-4 py-3 text-base font-display focus:outline-none focus:border-brand-red transition-colors placeholder:text-gray-300"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                className="w-full border border-gray-200 text-brand-black px-4 py-3 text-base font-display focus:outline-none focus:border-brand-red transition-colors placeholder:text-gray-300"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brand-red text-white py-3.5 text-sm font-semibold uppercase tracking-wider hover:bg-brand-black transition-colors disabled:opacity-50"
            >
              {submitting ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
