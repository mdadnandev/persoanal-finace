import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  Plus, RefreshCw
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend,
  LineChart, Line, Area, AreaChart
} from 'recharts'
import { CHART_COLORS } from '../utils/formatters'
import TransactionModal from '../components/transactions/TransactionModal'
import EmptyState from '../components/common/EmptyState'

// Custom Tooltip for charts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card px-3 py-2 text-xs">
        {label && <p className="text-slate-400 mb-1">{label}</p>}
        {payload.map((entry, i) => (
          <p key={i} style={{ color: entry.color }} className="font-medium">
            {entry.name}: {formatCurrency(entry.value)}
          </p>
        ))}
      </div>
    )
  }
  return null
}

// Stat Card
const StatCard = ({ title, value, icon, colorClass, trend, trendLabel, glowClass }) => (
  <div className={`stats-card ${glowClass} animate-fade-in`}>
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
        <p className={`text-2xl font-bold mt-1 ${colorClass}`}>{formatCurrency(value)}</p>
      </div>
      <div className={`p-2.5 rounded-xl ${glowClass ? 'bg-slate-700/50' : 'bg-slate-700/50'}`}>
        {icon}
      </div>
    </div>
    {trendLabel && (
      <div className="flex items-center gap-1 text-xs text-slate-500 mt-1">
        {trend >= 0 ? <ArrowUpRight size={12} className="text-emerald-400" /> : <ArrowDownRight size={12} className="text-red-400" />}
        <span>{trendLabel}</span>
      </div>
    )}
  </div>
)

const DashboardPage = () => {
  const { dashboard, loading, fetchDashboard } = useFinance()
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => { fetchDashboard() }, [])

  const isLoading = loading.dashboard

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 rounded-2xl bg-slate-800/50" />
        ))}
      </div>
    )
  }

  const {
    totalIncome = 0, totalExpense = 0, balance = 0,
    recentTransactions = [], expenseByCategory = [],
    incomeByCategory = [], monthlyTrends = []
  } = dashboard || {}

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Overview of your financial health</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fetchDashboard()}
            className="btn-secondary text-sm py-2 px-3"
          >
            <RefreshCw size={14} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-sm"
          >
            <Plus size={16} />
            <span>Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Balance"
          value={balance}
          colorClass={balance >= 0 ? 'text-slate-100' : 'text-red-400'}
          icon={<Wallet size={20} className="text-primary-400" />}
          glowClass="glow-primary"
        />
        <StatCard
          title="Total Income"
          value={totalIncome}
          colorClass="text-emerald-400"
          icon={<TrendingUp size={20} className="text-emerald-400" />}
          glowClass="glow-green"
        />
        <StatCard
          title="Total Expenses"
          value={totalExpense}
          colorClass="text-red-400"
          icon={<TrendingDown size={20} className="text-red-400" />}
          glowClass="glow-red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend - Area Chart */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-100 mb-4">Monthly Trends</h3>
          {monthlyTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyTrends} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <defs>
                  <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="income" name="Income" stroke="#22c55e" fill="url(#incomeGrad)" strokeWidth={2} dot={false} />
                <Area type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" fill="url(#expenseGrad)" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState type="dashboard" />
          )}
        </div>

        {/* Expense Pie Chart */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-100 mb-4">Expenses by Category</h3>
          {expenseByCategory.length > 0 ? (
            <div className="flex gap-4">
              <ResponsiveContainer width="60%" height={200}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    dataKey="total"
                    nameKey="name"
                    cx="50%" cy="50%"
                    outerRadius={80} innerRadius={45}
                    paddingAngle={2}
                  >
                    {expenseByCategory.map((entry, i) => (
                      <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              {/* Legend */}
              <div className="flex-1 flex flex-col justify-center gap-1.5 overflow-y-auto max-h-48">
                {expenseByCategory.slice(0, 7).map((cat, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ background: cat.color || CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="text-slate-400 truncate">{cat.icon} {cat.name}</span>
                    <span className="text-slate-300 font-medium ml-auto">{formatCurrency(cat.total)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState type="dashboard" />
          )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Recent Transactions</h3>
          <a href="/transactions" className="text-xs text-primary-400 hover:text-primary-300 font-medium">
            View all →
          </a>
        </div>

        {recentTransactions.length > 0 ? (
          <div className="space-y-1">
            {recentTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-700/30 transition-colors"
              >
                {/* Category icon */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                  style={{ background: `${tx.category?.color || '#6366f1'}22` }}
                >
                  {tx.category?.icon || '💳'}
                </div>
                {/* Description */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {tx.description || tx.category?.name || 'Transaction'}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(tx.date)}</p>
                </div>
                {/* Amount */}
                <div className={`text-sm font-semibold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            type="transactions"
            onAction={() => setShowAddModal(true)}
            actionLabel="Add First Transaction"
          />
        )}
      </div>

      {/* Add Transaction Modal */}
      <TransactionModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} />
    </div>
  )
}

export default DashboardPage
