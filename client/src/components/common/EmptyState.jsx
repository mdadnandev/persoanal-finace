import { AlertCircle, TrendingUp, Wallet } from 'lucide-react'

const EmptyState = ({ type = 'transactions', onAction, actionLabel }) => {
  const configs = {
    transactions: {
      icon: <Wallet size={24} className="text-slate-400" />,
      title: 'No Transactions Recorded',
      message: 'Your ledger is currently empty. Record your first inflow or outflow to begin tracking.',
    },
    dashboard: {
      icon: <TrendingUp size={24} className="text-slate-400" />,
      title: 'Awaiting Financial Activity',
      message: 'Once transactions are recorded, cash flow graphs and category distributions will populate here.',
    },
    error: {
      icon: <AlertCircle size={24} className="text-rose-400" />,
      title: 'Unable to Load Records',
      message: 'Could not communicate with the ledger service. Please check connectivity and retry.',
    },
  }

  const config = configs[type] || configs.transactions

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#0e131d] border border-[#1e2638] flex items-center justify-center mb-3.5 shadow-sm">
        {config.icon}
      </div>
      <h3 className="text-sm font-semibold text-slate-200">{config.title}</h3>
      <p className="text-xs text-slate-500 mt-1 max-w-xs">{config.message}</p>
      {onAction && (
        <button onClick={onAction} className="btn-primary text-xs py-2 px-3.5 mt-4">
          {actionLabel || 'Record Entry'}
        </button>
      )}
    </div>
  )
}

export default EmptyState
