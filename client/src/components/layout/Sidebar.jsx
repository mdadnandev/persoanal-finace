import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'
import {
  LayoutDashboard, ArrowLeftRight, Tags, LogOut,
  TrendingUp, X, CreditCard
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { to: '/transactions', icon: <ArrowLeftRight size={18} />, label: 'Transactions' },
  { to: '/categories', icon: <Tags size={18} />, label: 'Categories' },
  { to: '/analytics', icon: <TrendingUp size={18} />, label: 'Analytics' },
]

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 z-30 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 z-40
        bg-[#0d121c] border-r border-[#1a2336]
        flex flex-col transition-transform duration-200 ease-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Brand Header */}
        <div className="p-5 border-b border-[#1a2336]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CreditCard size={18} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100 text-sm tracking-tight">FinTrack</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-[#182236] text-slate-400 border border-[#232f48]">PRO</span>
              </div>
              <p className="text-[11px] text-slate-500 truncate">Cash Flow & Wealth</p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:text-slate-300 lg:hidden"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3.5 space-y-1">
          <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2.5 px-2.5">
            Overview
          </p>
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User Profile + Logout */}
        <div className="p-3 border-t border-[#1a2336] bg-[#0b0f17]/60">
          <div className="flex items-center gap-3 p-2 rounded-lg bg-[#111622] border border-[#1a2336] mb-2">
            <div className="w-8 h-8 rounded-md bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono text-xs font-semibold flex-shrink-0">
              {getInitials(user?.name)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 truncate font-mono">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-slate-400
                       hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all duration-150 text-xs font-medium"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
