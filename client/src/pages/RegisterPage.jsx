import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, CreditCard, ArrowRight, Check, ShieldCheck } from 'lucide-react'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters'
    if (!form.email.trim()) errs.email = 'Email address is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Enter a valid email address'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match'
    return errs
  }

  const getPasswordStrength = () => {
    const p = form.password
    if (!p) return { score: 0, label: '', color: 'bg-[#182133]' }
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 8 && (/[A-Z]/.test(p) || /[0-9]/.test(p))) score++
    if (p.length >= 10 && /[A-Z]/.test(p) && /[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++

    const levels = [
      { score: 0, label: '', color: 'bg-[#182133]' },
      { score: 1, label: 'Weak', color: 'bg-rose-500' },
      { score: 2, label: 'Fair', color: 'bg-amber-500' },
      { score: 3, label: 'Good', color: 'bg-blue-400' },
      { score: 4, label: 'Strong', color: 'bg-emerald-400' },
    ]
    return levels[score]
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
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  const strength = getPasswordStrength()
  const passwordsMatch = form.confirmPassword && form.password === form.confirmPassword

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-[440px]">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3 shadow-sm">
            <CreditCard size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">FinTrack</h1>
          <p className="text-xs text-slate-500 mt-1">Open your private personal ledger</p>
        </div>

        {/* Auth Card */}
        <div className="card p-6 sm:p-8 bg-[#111622] border-[#1e2638] shadow-card">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-slate-100">Create an account</h2>
            <p className="text-xs text-slate-500 mt-0.5">Start tracking cash flow and net worth</p>
          </div>

          {errors.form && (
            <div className="mb-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="form-label" htmlFor="reg-name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <User size={16} />
                </div>
                <input
                  id="reg-name"
                  type="text"
                  className={`form-input pl-10 pr-3.5 text-sm ${
                    errors.name ? 'border-rose-500/70 focus:border-rose-500' : ''
                  }`}
                  placeholder="e.g. Adnan Ansari"
                  value={form.name}
                  onChange={e => {
                    setForm(p => ({ ...p, name: e.target.value }))
                    if (errors.name) setErrors(p => ({ ...p, name: null }))
                  }}
                  autoComplete="name"
                />
              </div>
              {errors.name && (
                <p className="text-rose-400 text-xs mt-1 font-mono">{errors.name}</p>
              )}
            </div>

            {/* Email Address */}
            <div>
              <label className="form-label" htmlFor="reg-email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Mail size={16} />
                </div>
                <input
                  id="reg-email"
                  type="email"
                  className={`form-input pl-10 pr-3.5 text-sm ${
                    errors.email ? 'border-rose-500/70 focus:border-rose-500' : ''
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
                <label className="form-label mb-0" htmlFor="reg-password">
                  Password
                </label>
                {strength.label && (
                  <span className="text-[11px] font-mono text-slate-400">
                    Strength: <span className="font-semibold">{strength.label}</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pl-10 pr-10 text-sm ${
                    errors.password ? 'border-rose-500/70 focus:border-rose-500' : ''
                  }`}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={e => {
                    setForm(p => ({ ...p, password: e.target.value }))
                    if (errors.password) setErrors(p => ({ ...p, password: null }))
                  }}
                  autoComplete="new-password"
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

              {/* 4-segment strength meter */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[1, 2, 3, 4].map(step => (
                  <div
                    key={step}
                    className={`h-1 rounded-full transition-all duration-200 ${
                      strength.score >= step ? strength.color : 'bg-[#182133]'
                    }`}
                  />
                ))}
              </div>
              {errors.password && (
                <p className="text-rose-400 text-xs mt-1 font-mono">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="form-label mb-0" htmlFor="reg-confirm">
                  Confirm Password
                </label>
                {passwordsMatch && (
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-mono">
                    <Check size={12} />
                    <span>Match</span>
                  </span>
                )}
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                  <Lock size={16} />
                </div>
                <input
                  id="reg-confirm"
                  type="password"
                  className={`form-input pl-10 pr-3.5 text-sm ${
                    errors.confirmPassword
                      ? 'border-rose-500/70 focus:border-rose-500'
                      : passwordsMatch
                      ? 'border-emerald-500/60'
                      : ''
                  }`}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => {
                    setForm(p => ({ ...p, confirmPassword: e.target.value }))
                    if (errors.confirmPassword) setErrors(p => ({ ...p, confirmPassword: null }))
                  }}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-xs mt-1 font-mono">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="btn-primary w-full text-sm py-2.5 mt-2 shadow-sm font-semibold"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Switch to Login */}
          <div className="mt-6 pt-5 border-t border-[#1a2336] text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              Sign in
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

export default RegisterPage
