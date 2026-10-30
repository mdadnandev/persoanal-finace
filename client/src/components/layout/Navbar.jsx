import { useState } from 'react'
import { Menu, Bell, Search } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { getInitials } from '../../utils/formatters'

const Navbar = ({ onMenuToggle }) => {
  const { user } = useAuth()
  const [searchOpen, setSearchOpen] = useState(false)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  return (
    <header className="sticky top-0 z-20 bg-slate-950/80 backdrop-blur-md border-b border-slate-700/50">
      <div className="flex items-center gap-3 px-4 py-3 md:px-6">
        {/* Mobile menu toggle */}
        <button
          onClick={onMenuToggle}
          className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-all lg:hidden"
        >
          <Menu size={20} />
        </button>

        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-100 truncate">
            {greeting}, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋
          </p>
          <p className="text-xs text-slate-500 hidden sm:block">
            {now.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Notification placeholder */}
          <button className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-700/50 transition-all relative">
            <Bell size={18} />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary-500 rounded-full" />
          </button>

          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-violet-600 flex items-center justify-center text-white font-semibold text-xs cursor-pointer">
            {getInitials(user?.name)}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Navbar
