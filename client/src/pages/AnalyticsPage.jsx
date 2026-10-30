import { useState } from 'react'
import { useFinance } from '../context/FinanceContext'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
  LineChart, Line
} from 'recharts'
import { formatCurrency } from '../utils/formatters'
import { CHART_COLORS } from '../utils/formatters'
import EmptyState from '../components/common/EmptyState'

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

const AnalyticsPage = () => {
  const { dashboard, loading } = useFinance()
  const [activeChart, setActiveChart] = useState('bar')

  if (loading.dashboard) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => <div key={i} className="h-72 rounded-2xl bg-slate-800/50" />)}
      </div>
    )
  }

  const {
    monthlyTrends = [], expenseByCategory = [], incomeByCategory = [],
    totalIncome = 0, totalExpense = 0, balance = 0
  } = dashboard || {}

  const savingsRate = totalIncome > 0 ? ((balance / totalIncome) * 100).toFixed(1) : 0

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Deep dive into your financial patterns</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Income', value: formatCurrency(totalIncome), color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
          { label: 'Total Expense', value: formatCurrency(totalExpense), color: 'text-red-400', bg: 'bg-red-500/10' },
          { label: 'Net Balance', value: formatCurrency(balance), color: balance >= 0 ? 'text-primary-400' : 'text-red-400', bg: 'bg-primary-500/10' },
          { label: 'Savings Rate', value: `${savingsRate}%`, color: parseFloat(savingsRate) >= 20 ? 'text-emerald-400' : 'text-yellow-400', bg: 'bg-yellow-500/10' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className="glass-card p-4">
            <p className="text-xs text-slate-400 font-medium">{label}</p>
            <p className={`text-xl font-bold mt-1 ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Monthly Trends - Bar vs Line Toggle */}
      <div className="glass-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-100">Monthly Trends</h3>
          <div className="flex gap-1 bg-slate-800 rounded-lg p-1">
            {['bar', 'line'].map(type => (
              <button
                key={type}
                onClick={() => setActiveChart(type)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all capitalize
                  ${activeChart === type ? 'bg-primary-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        {monthlyTrends.length > 0 ? (
          <ResponsiveContainer width="100%" height={260}>
            {activeChart === 'bar' ? (
              <BarChart data={monthlyTrends} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Bar dataKey="income" name="Income" fill="#22c55e" radius={[4, 4, 0, 0]} maxBarSize={40} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </BarChart>
            ) : (
              <LineChart data={monthlyTrends} margin={{ top: 5, right: 10, bottom: 5, left: -10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="monthLabel" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                <Line type="monotone" dataKey="income" name="Income" stroke="#22c55e" strokeWidth={2.5} dot={{ fill: '#22c55e', r: 4 }} />
                <Line type="monotone" dataKey="expense" name="Expense" stroke="#ef4444" strokeWidth={2.5} dot={{ fill: '#ef4444', r: 4 }} />
                <Line type="monotone" dataKey="balance" name="Balance" stroke="#6366f1" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            )}
          </ResponsiveContainer>
        ) : (
          <EmptyState type="dashboard" />
        )}
      </div>

      {/* Pie Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expense Pie */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-100 mb-4">Expense Breakdown</h3>
          {expenseByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="total" nameKey="name"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={3}>
                  {expenseByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry) => `${entry.payload.icon || ''} ${value}`}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState type="dashboard" />}
        </div>

        {/* Income Pie */}
        <div className="glass-card p-5">
          <h3 className="font-semibold text-slate-100 mb-4">Income Breakdown</h3>
          {incomeByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={incomeByCategory} dataKey="total" nameKey="name"
                  cx="50%" cy="50%" outerRadius={90} innerRadius={55} paddingAngle={3}>
                  {incomeByCategory.map((entry, i) => (
                    <Cell key={i} fill={entry.color || CHART_COLORS[i % CHART_COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  formatter={(value, entry) => `${entry.payload.icon || ''} ${value}`}
                  wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : <EmptyState type="dashboard" />}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
