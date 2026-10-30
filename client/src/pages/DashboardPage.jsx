import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFinance } from '../context/FinanceContext'
import { useAuth } from '../context/AuthContext'
import { formatCurrency, formatDate } from '../utils/formatters'
import {
  TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight,
  Plus, RefreshCw, ArrowRight, Percent, Calendar
} from 'lucide-react'
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  Area, AreaChart, CartesianGrid, XAxis, YAxis
} from 'recharts'
import { CHART_COLORS } from '../utils/formatters'
import TransactionModal from '../components/transactions/TransactionModal'
import EmptyState from '../components/common/EmptyState'

// Bespoke Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#131926] border border-[#222c40] rounded-lg p-3 shadow-xl text-xs">
        {label && <p className="text-slate-400 font-medium mb-1.5 pb-1 border-b border-[#1f283d]">{label}</p>}
        <div className="space-y-1">
          {payload.map((entry, i) => (
            <div key={i} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ background: entry.color }} />
                {entry.name}
              </span>
              <span className="font-mono font-semibold text-slate-100">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return null
}

const DashboardPage = () => {
  const { dashboard, loading, fetchDashboard } = useFinance()
  const { user } = useAuth()
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    fetchDashboard()
  }, [])

  const isLoading = loading.dashboard

  if (isLoading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-[#141b29] rounded-lg" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 rounded-xl bg-[#131826] border border-[#1d2538]" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 rounded-xl bg-[#131826] border border-[#1d2538]" />
          <div className="h-80 rounded-xl bg-[#131826] border border-[#1d2538]" />
        </div>
      </div>
    )
  }

  const {
    totalIncome = 0,
    totalExpense = 0,
    balance = 0,
    recentTransactions = [],
    expenseByCategory = [],
    incomeByCategory = [],
    monthlyTrends = []
  } = dashboard || {}

  // Calculate savings rate
  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#182133]">
        <div>
          <h1 className="page-title">Financial Overview</h1>
          <p className="page-subtitle">Real-time ledger summary and cash flow dynamics</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchDashboard()}
            className="btn-secondary text-xs py-2 px-3"
            title="Reload data"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary text-xs py-2 px-3.5"
          >
            <Plus size={15} />
            <span>New Transaction</span>
          </button>
        </div>
      </div>

      {/* Top 4 Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Net Balance */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Balance</span>
            <div className="w-7 h-7 rounded-md bg-[#161d2d] border border-[#222c42] flex items-center justify-center text-slate-300">
              <Wallet size={14} />
            </div>
          </div>
          <p className={`text-2xl font-mono font-bold tracking-tight ${balance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
            {formatCurrency(balance)}
          </p>
          <div className="flex items-center gap-1.5 mt-2.5 text-xs text-slate-500">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Net Liquid Capital</span>
          </div>
        </div>

        {/* Card 2: Total Income */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Inflow</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={14} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold tracking-tight text-emerald-400">
            +{formatCurrency(totalIncome)}
          </p>
          <div className="flex items-center gap-1 text-xs text-emerald-500/80 mt-2.5 font-medium">
            <ArrowUpRight size={13} />
            <span>Recorded Revenue</span>
          </div>
        </div>

        {/* Card 3: Total Expenses */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Outflow</span>
            <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown size={14} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold tracking-tight text-rose-400">
            -{formatCurrency(totalExpense)}
          </p>
          <div className="flex items-center gap-1 text-xs text-rose-500/80 mt-2.5 font-medium">
            <ArrowDownRight size={13} />
            <span>Total Debits</span>
          </div>
        </div>

        {/* Card 4: Savings Rate */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Savings Rate</span>
            <div className="w-7 h-7 rounded-md bg-[#161d2d] border border-[#222c42] flex items-center justify-center text-slate-300">
              <Percent size={13} />
            </div>
          </div>
          <p className="text-2xl font-mono font-bold tracking-tight text-slate-100">
            {savingsRate}%
          </p>
          <div className="mt-2.5 w-full bg-[#182133] rounded-full h-1.5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                savingsRate >= 30 ? 'bg-emerald-400' : savingsRate >= 10 ? 'bg-amber-400' : 'bg-rose-400'
              }`}
              style={{ width: `${Math.max(4, savingsRate)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends Area Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#182133]">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Cash Flow Trends</h3>
              <p className="text-[11px] text-slate-500">Monthly Inflow vs Outflow</p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> Inflow
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2 h-2 rounded-full bg-rose-400" /> Outflow
              </span>
            </div>
          </div>

          {monthlyTrends && monthlyTrends.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2336" vertical={false} />
                  <XAxis
                    dataKey="monthLabel"
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={{ stroke: '#1a2336' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="income"
                    name="Inflow"
                    stroke="#10b981"
                    strokeWidth={2}
                    fill="url(#incomeGrad)"
                  />
                  <Area
                    type="monotone"
                    dataKey="expense"
                    name="Outflow"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fill="url(#expenseGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState type="dashboard" />
            </div>
          )}
        </div>

        {/* Expenses by Category Donut Chart */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#182133]">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Expenditure by Category</h3>
              <p className="text-[11px] text-slate-500">Distribution of debits</p>
            </div>
            <span className="text-[11px] font-mono text-slate-500">
              {expenseByCategory.length} Categories
            </span>
          </div>

          {expenseByCategory && expenseByCategory.length > 0 ? (
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="w-48 h-48 flex-shrink-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={75}
                      innerRadius={48}
                      paddingAngle={3}
                      strokeWidth={1}
                      stroke="#111622"
                    >
                      {expenseByCategory.map((entry, i) => (
                        <Cell
                          key={i}
                          fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Category Breakdown List */}
              <div className="flex-1 w-full space-y-2 overflow-y-auto max-h-52 pr-1">
                {expenseByCategory.slice(0, 6).map((cat, i) => {
                  const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
                  const color = cat.color || CHART_COLORS[i % CHART_COLORS.length]
                  return (
                    <div key={i} className="group">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="flex items-center gap-2 text-slate-300 truncate max-w-[140px]">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                          <span className="truncate">{cat.icon} {cat.name}</span>
                        </span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-slate-400 text-[11px]">{pct}%</span>
                          <span className="text-slate-200 font-medium">{formatCurrency(cat.total)}</span>
                        </div>
                      </div>
                      <div className="w-full bg-[#182133] h-1 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{ width: `${pct}%`, background: color }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-12">
              <EmptyState type="dashboard" />
            </div>
          )}
        </div>
      </div>

      {/* Recent Ledger Activity */}
      <div className="card">
        <div className="flex items-center justify-between p-4 border-b border-[#182133]">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Recent Transactions</h3>
            <p className="text-[11px] text-slate-500">Latest entries posted to your account</p>
          </div>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-emerald-400 transition-colors font-medium"
          >
            <span>View Full Ledger</span>
            <ArrowRight size={13} />
          </Link>
        </div>

        {recentTransactions && recentTransactions.length > 0 ? (
          <div className="divide-y divide-[#182133]">
            {recentTransactions.map((tx) => {
              const isIncome = tx.type === 'INCOME'
              return (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3.5 hover:bg-[#141b2a] transition-colors"
                >
                  {/* Category icon & Description */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-sm flex-shrink-0 border"
                      style={{
                        backgroundColor: `${tx.category?.color || '#3b82f6'}15`,
                        borderColor: `${tx.category?.color || '#3b82f6'}30`
                      }}
                    >
                      {tx.category?.icon || '💳'}
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {tx.description || tx.category?.name || 'Unspecified Transaction'}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500 font-mono">
                        <span>{formatDate(tx.date)}</span>
                        <span>•</span>
                        <span>{tx.category?.name || 'General'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Amount with Monospace Numbers */}
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className={`text-xs font-mono font-semibold tracking-tight ${isIncome ? 'text-emerald-400' : 'text-slate-200'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(tx.amount)}
                    </span>
                    <p className="text-[10px] text-slate-500 font-mono uppercase">
                      {tx.type}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="p-8">
            <EmptyState
              type="transactions"
              onAction={() => setShowAddModal(true)}
              actionLabel="Record First Transaction"
            />
          </div>
        )}
      </div>

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />
    </div>
  )
}

export default DashboardPage
