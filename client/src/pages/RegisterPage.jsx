import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Eye, EyeOff, Mail, Lock, User, CreditCard, ArrowRight, Check } from 'lucide-react'
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

  const passwordStrength = () => {
    const p = form.password
    if (!p) return { score: 0, label: '', color: '' }
    let score = 0
    if (p.length >= 6) score++
    if (p.length >= 10) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    const levels = [
      { score: 0, label: 'Too short', color: 'bg-slate-700' },
      { score: 1, label: 'Weak', color: 'bg-rose-500' },
      { score: 2, label: 'Fair', color: 'bg-amber-500' },
      { score: 3, label: 'Good', color: 'bg-blue-400' },
      { score: 4, label: 'Strong', color: 'bg-emerald-400' },
      { score: 5, label: 'Excellent', color: 'bg-emerald-300' },
    ]
    return levels[score]
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setLoading(true)
    setErrors({})
    try {
      await register({ name: form.name, email: form.email, password: form.password })
      navigate('/dashboard')
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      toast.error(msg)
      setErrors({ form: msg })
    } finally {
      setLoading(false)
    }
  }

  const strength = passwordStrength()

  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mb-3.5 shadow-sm">
            <CreditCard size={22} />
          </div>
          <h1 className="text-xl font-bold text-slate-100 tracking-tight">FinTrack</h1>
          <p className="text-xs text-slate-500 mt-1">Create your personal ledger account</p>
        </div>

        {/* Auth Card */}
        <div className="card p-6 md:p-7 bg-[#111622] border-[#1e2638]">
          <h2 className="text-sm font-semibold text-slate-200 mb-1">Get started</h2>
          <p className="text-xs text-slate-500 mb-5">Open an isolated, private finance workspace</p>

          {errors.form && (
            <div className="mb-4 p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Full Name */}
            <div>
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <div className="relative">
                <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-name"
                  type="text"
                  className={`form-input pl-9.5 text-xs ${errors.name ? 'border-rose-500/70' : ''}`}
                  placeholder="e.g. Adnan Ansari"
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  autoComplete="name"
                />
              </div>
              {errors.name && <p className="text-rose-400 text-[11px] mt-1 font-mono">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-email"
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
              <label className="form-label" htmlFor="reg-password">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input pl-9.5 pr-10 text-xs ${errors.password ? 'border-rose-500/70' : ''}`}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Password strength */}
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 bg-[#182133] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${(strength.score / 5) * 100}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 font-mono">
                    <span>Security rating</span>
                    <span className="font-semibold text-slate-400">{strength.label}</span>
                  </div>
                </div>
              )}
              {errors.password && <p className="text-rose-400 text-[11px] mt-1 font-mono">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  id="reg-confirm"
                  type="password"
                  className={`form-input pl-9.5 text-xs ${errors.confirmPassword ? 'border-rose-500/70' : ''}`}
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={e => setForm(p => ({ ...p, confirmPassword: e.target.value }))}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-400 text-[11px] mt-1 font-mono">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="register-submit"
              disabled={loading}
              className="btn-primary w-full text-xs py-2.5 mt-2"
            >
              {loading ? (
                <span className="spinner" />
              ) : (
                <>
                  <span>Create Account</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-[#1a2336] text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
