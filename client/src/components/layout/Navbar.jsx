import { Menu, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth()

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })

  return (
    <header className="sticky top-0 z-20 bg-[#0d121c]/90 backdrop-blur-sm border-b border-[#1a2336]">
      <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
        {/* Left side: Hamburger & Page context */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuToggle}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#141b28] transition-all lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu size={18} />
          </button>

          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-slate-200 truncate">
              {user?.name ? `${user.name.split(' ')[0]}'s Workspace` : 'Workspace'}
            </h2>
            <p className="text-[11px] text-slate-500 font-mono hidden sm:block">
              {dateFormatted}
            </p>
          </div>
        </div>

        {/* Right side: Indicators & Profile */}
        <div className="flex items-center gap-2.5">
          {/* Sync indicator */}
          <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-[#131926] border border-[#1f2a3f] text-[11px] font-mono text-slate-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>INR (₹)</span>
          </div>

          {/* Notifications */}
          <button
            className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-[#141b28] border border-transparent hover:border-[#1f2a3f] transition-all relative"
            title="Notifications"
          >
            <Bell size={16} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          </button>

          {/* User Avatar */}
          <div className="w-8 h-8 rounded-lg bg-[#141d2e] border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono font-medium text-xs">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
