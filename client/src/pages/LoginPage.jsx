import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, CreditCard, ArrowRight, KeyRound } from 'lucide-react'
import toast from 'react-hot-toast'

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.email) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      await login(form)
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password'
      toast.error(msg)
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  const fillDemo = () => {
    setForm({ email: 'adnan@example.com', password: 'Password123!' })
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-7">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3.5 shadow-sm">
            <CreditCard size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">FinTrack</h1>
          <p className="text-xs text-slate-500 mt-1">Sign in to your private financial ledger</p>
        </div>

        {/* Auth Card */}
        <div className="card p-6 md:p-7 bg-[#111622] border-[#1e2638]">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Welcome back</h2>
          <p className="text-xs text-slate-500 mb-5">Enter your credentials to access your account</p>

          {errors.form && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="form-label" htmlFor="login-email">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-email"
                  type="email"
                  className={`form-input pl-9.5 text-xs ${errors.email ? 'border-rose-500/70' : ''}`}
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-rose-400 text-[11px] mt-1 font-mono">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="form-label mb-0" htmlFor="login-password">Password</label>
              </div>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pl-9.5 pr-10 text-xs ${errors.password ? 'border-rose-500/70' : ''}`}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-rose-400 text-[11px] mt-1 font-mono">{errors.password}</p>}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full text-xs py-2.5 mt-2"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Sign In to Ledger</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>

            {/* Quick Demo Fill Button */}
            <button
              type="button"
              onClick={fillDemo}
              className="w-full py-2 px-3 text-xs text-slate-400 hover:text-emerald-300 bg-[#0e131d] border border-[#1e2638] hover:border-emerald-500/30 rounded-lg transition-colors font-mono flex items-center justify-center gap-1.5"
            >
              <KeyRound size={13} className="text-emerald-400" />
              <span>Fill Demo (adnan@example.com)</span>
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#1a2336] text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/register" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Create account
            </Link>
          </div>
        </div>

        {/* Subtext info */}
        <p className="text-center text-[11px] text-slate-600 mt-5 font-mono">
          AES-256 encrypted • End-to-end private finance tracking
        </p>
      </div>
    </div>
  )
}

export default LoginPage
