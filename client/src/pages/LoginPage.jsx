import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, CreditCard, ArrowRight, KeyRound, ShieldCheck } from 'lucide-react'
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
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    return errs
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

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
    setErrors({})
    toast.success('Demo credentials filled')
  }

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[420px]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-sm">
            <CreditCard size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">FinTrack</h1>
          <p className="text-xs text-slate-500 mt-1">Personal Wealth & Cash Flow Ledger</p>
        </div>


        {/* Auth Card */}
        <div className="card p-6 sm:p-8 bg-[#111622] border-[#1e2638] shadow-card">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-100">Sign in to your account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Enter your email and password below</p>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Address */}
            <div>
              <label className="form-label" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="login-email"
                  type="email"
                  className={`form-input pl-10 pr-3.5 text-sm ${errors.email ? 'border-rose-500/70 focus:border-rose-500' : ''
                    }`}
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={e => {
                    setForm(p => ({ ...p, email: e.target.value }))
                    if (errors.email) setErrors(p => ({ ...p, email: null }))
                  }}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-rose-400 text-xs mt-1 font-mono">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0" htmlFor="login-password">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 text-sm ${errors.password ? 'border-rose-500/70 focus:border-rose-500' : ''
                    }`}
                  placeholder="••••••••••••"
                  value={form.password}
                  onChange={e => {
                    setForm(p => ({ ...p, password: e.target.value }))
                    if (errors.password) setErrors(p => ({ ...p, password: null }))
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1 font-mono">{errors.password}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="login-submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-2.5 mt-2 shadow-sm font-semibold"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Register */}
          <div className="mt-6 pt-5 border-t border-[#1a2336] text-center text-xs text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-1.5 mt-6 text-slate-600 text-xs font-mono">
          <ShieldCheck size={14} className="text-emerald-500/70" />
          <span>Encrypted financial ledger</span>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
