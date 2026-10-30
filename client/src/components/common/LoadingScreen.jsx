import { CreditCard } from 'lucide-react'

const LoadingScreen = ({ message = 'Synchronizing ledger records...' }) => {
  return (
    <div className="min-h-screen bg-[#0b0e14] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-xl bg-[#111622] border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
          <CreditCard size={22} />
        </div>
        <div className="absolute -inset-1 rounded-xl border border-emerald-500/20 animate-ping opacity-25" />
      </div>

      <div className="flex flex-col items-center gap-2">
        <div className="w-4 h-4 border-2 border-[#1e2638] border-t-emerald-400 rounded-full animate-spin" />
        <p className="text-xs text-slate-400 font-mono tracking-tight">{message}</p>
      </div>
    </div>
  )
}

export default LoadingScreen
