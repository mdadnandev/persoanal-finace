import { AlertCircle, TrendingUp, TrendingDown, Wallet } from 'lucide-react'

const EmptyState = ({ type = 'transactions', onAction, actionLabel }) => {
  const configs = {
    transactions: {
      icon: <Wallet size={40} className="text-slate-600" />,
      title: 'No transactions yet',
      message: 'Add your first income or expense to get started.',
    },
    dashboard: {
      icon: <TrendingUp size={40} className="text-slate-600" />,
      title: 'No data available',
      message: 'Start adding transactions to see your financial insights.',
    },
    error: {
      icon: <AlertCircle size={40} className="text-red-500/60" />,
      title: 'Something went wrong',
      message: 'Failed to load data. Please try again.',
    },
  }

  const config = configs[type] || configs.transactions

  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="p-4 rounded-2xl bg-slate-800/50">{config.icon}</div>
      <div>
        <h3 className="text-slate-300 font-semibold text-lg">{config.title}</h3>
        <p className="text-slate-500 text-sm mt-1 max-w-xs">{config.message}</p>
      </div>
      {onAction && (
        <button onClick={onAction} className="btn-primary mt-2">
          {actionLabel || 'Get Started'}
        </button>
      )}
    </div>
  )
}

export default EmptyState
