import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line, AreaChart, Area
} from 'recharts'
import { formatCurrency } from '../utils/formatters'
import { CHART_COLORS } from '../utils/formatters'
import EmptyState from '../components/common/EmptyState'
import { TrendingUp, TrendingDown, Wallet, Percent, BarChart3, LineChart as LineIcon } from 'lucide-react'

// Custom tooltip for charts
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

const AnalyticsPage = () => {
  const { dashboard, loading } = useFinance()
  const [chartType, setChartType] = useState('bar') // 'bar' | 'area' | 'line'

  if (loading.dashboard) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-10 w-48 bg-[#141b29] rounded-lg" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 rounded-xl bg-[#131826] border border-[#1d2538]" />
          ))}
        </div>
        <div className="h-80 rounded-xl bg-[#131826] border border-[#1d2538]" />
      </div>
    )
  }

  const {
    monthlyTrends = [],
    expenseByCategory = [],
    incomeByCategory = [],
    totalIncome = 0,
    totalExpense = 0,
    balance = 0
  } = dashboard || {}

  const savingsRate = totalIncome > 0
    ? Math.max(0, Math.min(100, Math.round(((totalIncome - totalExpense) / totalIncome) * 100)))
    : 0

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#182133]">
        <div>
          <h1 className="page-title">Financial Analytics</h1>
          <p className="page-subtitle">Pattern analysis, savings velocity, and expenditure breakdown</p>
        </div>
      </div>

      {/* 4 Financial Performance Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Income */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Gross Income</span>
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp size={13} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-emerald-400">
            {formatCurrency(totalIncome)}
          </p>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Recorded inflow</span>
        </div>

        {/* Expense */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Debits</span>
            <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <TrendingDown size={13} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-rose-400">
            {formatCurrency(totalExpense)}
          </p>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Recorded outflow</span>
        </div>

        {/* Balance */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Net Position</span>
            <div className="w-7 h-7 rounded-md bg-[#161d2d] border border-[#222c42] flex items-center justify-center text-slate-300">
              <Wallet size={13} />
            </div>
          </div>
          <p className={`text-xl sm:text-2xl font-mono font-bold tracking-tight ${balance >= 0 ? 'text-slate-100' : 'text-rose-400'}`}>
            {formatCurrency(balance)}
          </p>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Retained balance</span>
        </div>

        {/* Savings Rate */}
        <div className="stats-card">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Savings Velocity</span>
            <div className="w-7 h-7 rounded-md bg-[#161d2d] border border-[#222c42] flex items-center justify-center text-slate-300">
              <Percent size={13} />
            </div>
          </div>
          <p className="text-xl sm:text-2xl font-mono font-bold tracking-tight text-slate-100">
            {savingsRate}%
          </p>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">Inflow retained</span>
        </div>
      </div>

      {/* Monthly Trends Analysis */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3 border-b border-[#182133]">
          <div>
            <h3 className="text-sm font-semibold text-slate-200">Cash Flow Evolution</h3>
            <p className="text-[11px] text-slate-500">Compare income and expenditure trajectories</p>
          </div>

          {/* Segmented view picker */}
          <div className="inline-flex rounded-lg bg-[#0e131d] p-1 border border-[#1a2336] self-start sm:self-auto">
            {[
              { id: 'bar', label: 'Bars' },
              { id: 'area', label: 'Area' },
              { id: 'line', label: 'Lines' },
            ].map(type => (
              <button
                key={type.id}
                onClick={() => setChartType(type.id)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  chartType === type.id
                    ? 'bg-[#182133] text-emerald-400 border border-[#232f48] shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {monthlyTrends && monthlyTrends.length > 0 ? (
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={monthlyTrends} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2336" vertical={false} />
                  <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1a2336' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="income" name="Inflow" fill="#10b981" radius={[3, 3, 0, 0]} maxBarSize={36} />
                  <Bar dataKey="expense" name="Outflow" fill="#f43f5e" radius={[3, 3, 0, 0]} maxBarSize={36} />
                </BarChart>
              ) : chartType === 'area' ? (
                <AreaChart data={monthlyTrends} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <defs>
                    <linearGradient id="areaIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="areaExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2336" vertical={false} />
                  <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1a2336' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="income" name="Inflow" stroke="#10b981" strokeWidth={2} fill="url(#areaIncome)" />
                  <Area type="monotone" dataKey="expense" name="Outflow" stroke="#f43f5e" strokeWidth={2} fill="url(#areaExpense)" />
                </AreaChart>
              ) : (
                <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1a2336" vertical={false} />
                  <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: '#1a2336' }} tickLine={false} />
                  <YAxis tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="income" name="Inflow" stroke="#10b981" strokeWidth={2.5} dot={{ fill: '#10b981', r: 3 }} />
                  <Line type="monotone" dataKey="expense" name="Outflow" stroke="#f43f5e" strokeWidth={2.5} dot={{ fill: '#f43f5e', r: 3 }} />
                  <Line type="monotone" dataKey="balance" name="Net Balance" stroke="#60a5fa" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="py-12">
            <EmptyState type="dashboard" />
          </div>
        )}
      </div>

      {/* Two Distribution Breakdown Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses by Category */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#182133]">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Expense Allocation</h3>
              <p className="text-[11px] text-slate-500">Distribution by expense category</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Total: {formatCurrency(totalExpense)}
            </span>
          </div>

          {expenseByCategory && expenseByCategory.length > 0 ? (
            <div className="space-y-4">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseByCategory}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={45}
                      paddingAngle={3}
                      stroke="#111622"
                      strokeWidth={1}
                    >
                      {expenseByCategory.map((entry, i) => (
                        <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {expenseByCategory.map((cat, i) => {
                  const pct = totalExpense > 0 ? Math.round((cat.total / totalExpense) * 100) : 0
                  const color = cat.color || CHART_COLORS[i % CHART_COLORS.length]
                  return (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#172030]">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span>{cat.icon} {cat.name}</span>
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500 text-[11px]">{pct}%</span>
                        <span className="text-slate-200 font-semibold">{formatCurrency(cat.total)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-10">
              <EmptyState type="dashboard" />
            </div>
          )}
        </div>

        {/* Income by Category */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#182133]">
            <div>
              <h3 className="text-sm font-semibold text-slate-200">Income Inflow Sources</h3>
              <p className="text-[11px] text-slate-500">Distribution by revenue stream</p>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Total: {formatCurrency(totalIncome)}
            </span>
          </div>

          {incomeByCategory && incomeByCategory.length > 0 ? (
            <div className="space-y-4">
              <div className="h-44">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeByCategory}
                      dataKey="total"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      innerRadius={45}
                      paddingAngle={3}
                      stroke="#111622"
                      strokeWidth={1}
                    >
                      {incomeByCategory.map((entry, i) => (
                        <Cell key={i} fill={entry.color || CHART_COLORS[(i + 3) % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {incomeByCategory.map((cat, i) => {
                  const pct = totalIncome > 0 ? Math.round((cat.total / totalIncome) * 100) : 0
                  const color = cat.color || CHART_COLORS[(i + 3) % CHART_COLORS.length]
                  return (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#172030]">
                      <span className="flex items-center gap-2 text-slate-300">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span>{cat.icon} {cat.name}</span>
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-slate-500 text-[11px]">{pct}%</span>
                        <span className="text-slate-200 font-semibold">{formatCurrency(cat.total)}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="py-10">
              <EmptyState type="dashboard" />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
