import { useState, useEffect } from 'react'
import { api } from '../api/client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { format, parseISO, startOfMonth, eachMonthOfInterval } from 'date-fns'

interface Trade {
  id: string
  ticker: string
  entry: number
  exit: number
  direction: string
  setup: string
  date: string
}

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']

export default function Dashboard() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [insights, setInsights] = useState<string>('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const tradesData = await api('/trades')
      setTrades(tradesData)

      // Fetch AI insights
      try {
        const insightsData = await api('/ai/insights')
        setInsights(insightsData.insights || '')
      } catch (error) {
        console.error('Error fetching insights:', error)
      }
    } catch (error) {
      console.error('Error fetching trades:', error)
      alert('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const calculatePnL = (trade: Trade) => {
    if (trade.direction === 'long') {
      return trade.exit - trade.entry
    } else {
      return trade.entry - trade.exit
    }
  }

  // Calculate statistics
  const stats = {
    totalTrades: trades.length,
    winners: trades.filter(t => calculatePnL(t) > 0).length,
    losers: trades.filter(t => calculatePnL(t) <= 0).length,
    winRate: trades.length > 0 ? (trades.filter(t => calculatePnL(t) > 0).length / trades.length) * 100 : 0,
    totalPnL: trades.reduce((sum, t) => sum + calculatePnL(t), 0),
    avgWin: (() => {
      const wins = trades.filter(t => calculatePnL(t) > 0).map(t => calculatePnL(t))
      return wins.length > 0 ? wins.reduce((a, b) => a + b, 0) / wins.length : 0
    })(),
    avgLoss: (() => {
      const losses = trades.filter(t => calculatePnL(t) <= 0).map(t => calculatePnL(t))
      return losses.length > 0 ? losses.reduce((a, b) => a + b, 0) / losses.length : 0
    })(),
  }

  // Equity curve data
  const equityCurve = trades
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .reduce((acc, trade) => {
      const prevEquity = acc.length > 0 ? acc[acc.length - 1].equity : 0
      const pnl = calculatePnL(trade)
      acc.push({
        date: format(parseISO(trade.date), 'MMM dd'),
        equity: prevEquity + pnl,
        pnl,
      })
      return acc
    }, [] as Array<{ date: string; equity: number; pnl: number }>)

  // Setup performance
  const setupPerformance = trades.reduce((acc, trade) => {
    const setup = trade.setup || 'Unknown'
    if (!acc[setup]) {
      acc[setup] = { wins: 0, losses: 0, pnl: 0 }
    }
    const pnl = calculatePnL(trade)
    if (pnl > 0) {
      acc[setup].wins++
    } else {
      acc[setup].losses++
    }
    acc[setup].pnl += pnl
    return acc
  }, {} as Record<string, { wins: number; losses: number; pnl: number }>)

  const setupData = Object.entries(setupPerformance).map(([setup, stats]) => ({
    setup,
    winRate: stats.wins + stats.losses > 0 ? (stats.wins / (stats.wins + stats.losses)) * 100 : 0,
    pnl: stats.pnl,
  }))

  // Trades per month
  const tradesPerMonth = trades.reduce((acc, trade) => {
    const month = format(parseISO(trade.date), 'MMM yyyy')
    acc[month] = (acc[month] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const monthlyData = Object.entries(tradesPerMonth)
    .map(([month, count]) => ({ month, count }))
    .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime())

  // Profit distribution
  const profitDistribution = trades.map(t => ({
    name: t.ticker,
    pnl: calculatePnL(t),
  }))

  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    )
  }

  if (trades.length === 0) {
    return (
      <div className="px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">No trades yet. Add some trades to see your analytics!</p>
            <a
              href="/add-trade"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Add Trade
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total Trades</p>
            <p className="text-3xl font-bold">{stats.totalTrades}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Win Rate</p>
            <p className="text-3xl font-bold text-green-400">{stats.winRate.toFixed(1)}%</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Total P&L</p>
            <p
              className={`text-3xl font-bold ${
                stats.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              ${stats.totalPnL.toFixed(2)}
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <p className="text-gray-400 text-sm mb-1">Wins / Losses</p>
            <p className="text-3xl font-bold">
              <span className="text-green-400">{stats.winners}</span> /{' '}
              <span className="text-red-400">{stats.losers}</span>
            </p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Equity Curve */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Equity Curve</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={equityCurve}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="date" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Line type="monotone" dataKey="equity" stroke="#3b82f6" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Setup Performance */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Setup Performance</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={setupData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="setup" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="winRate" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Trades Per Month */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Trades Per Month</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="count" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Profit Distribution */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4">Profit Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={profitDistribution.slice(0, 10)}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px' }}
                />
                <Bar dataKey="pnl" fill="#f59e0b">
                  {profitDistribution.slice(0, 10).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.pnl >= 0 ? '#10b981' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Insights */}
        {insights && (
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 mb-8">
            <h2 className="text-xl font-semibold mb-4">AI Insights</h2>
            <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded">
              <p className="whitespace-pre-wrap text-gray-200">{insights}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

