import { useState, useEffect } from 'react'
import { api } from '../api/client'
import { format } from 'date-fns'

interface Trade {
  id: string
  ticker: string
  entry: number
  exit: number
  direction: string
  setup: string
  notes: string | null
  tags: string[] | null
  date: string
  ai_feedback: string | null
  created_at: string
}

export default function History() {
  const [trades, setTrades] = useState<Trade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrade, setSelectedTrade] = useState<Trade | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [editingTrade, setEditingTrade] = useState<Trade | null>(null)

  useEffect(() => {
    fetchTrades()
  }, [])

  const fetchTrades = async () => {
    try {
      const data = await api('/trades')
      setTrades(data)
    } catch (error) {
      console.error('Error fetching trades:', error)
      alert('Failed to load trades')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trade?')) return

    try {
      await api(`/trades/${id}`, { method: 'DELETE' })
      setTrades(trades.filter(t => t.id !== id))
      if (selectedTrade?.id === id) {
        setShowModal(false)
        setSelectedTrade(null)
      }
    } catch (error) {
      console.error('Error deleting trade:', error)
      alert('Failed to delete trade')
    }
  }

  const calculatePnL = (trade: Trade) => {
    if (trade.direction === 'long') {
      return trade.exit - trade.entry
    } else {
      return trade.entry - trade.exit
    }
  }

  const calculatePnLPercent = (trade: Trade) => {
    const pnl = calculatePnL(trade)
    return (pnl / trade.entry) * 100
  }

  const openModal = (trade: Trade) => {
    setSelectedTrade(trade)
    setShowModal(true)
  }

  if (loading) {
    return (
      <div className="px-4 py-8 text-center">
        <div className="text-xl">Loading trades...</div>
      </div>
    )
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Trade History</h1>

        {trades.length === 0 ? (
          <div className="bg-gray-800 p-8 rounded-lg border border-gray-700 text-center">
            <p className="text-gray-400 mb-4">No trades yet. Start by adding your first trade!</p>
            <a
              href="/add-trade"
              className="inline-block px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
            >
              Add Trade
            </a>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Ticker
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Direction
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Entry
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Exit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      P&L
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Setup
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {trades.map((trade) => {
                    const pnl = calculatePnL(trade)
                    const pnlPercent = calculatePnLPercent(trade)
                    const isWinner = pnl > 0

                    return (
                      <tr key={trade.id} className="hover:bg-gray-750">
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {format(new Date(trade.date), 'MMM dd, yyyy')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {trade.ticker}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              trade.direction === 'long'
                                ? 'bg-green-900 text-green-200'
                                : 'bg-red-900 text-red-200'
                            }`}
                          >
                            {trade.direction.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.entry.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.exit.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span className={isWinner ? 'text-green-400' : 'text-red-400'}>
                            ${pnl.toFixed(2)} ({pnlPercent > 0 ? '+' : ''}
                            {pnlPercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">{trade.setup}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <button
                            onClick={() => openModal(trade)}
                            className="text-blue-400 hover:text-blue-300"
                          >
                            View
                          </button>
                          <button
                            onClick={() => handleDelete(trade.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal */}
        {showModal && selectedTrade && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-gray-800 rounded-lg border border-gray-700 max-w-3xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-bold">
                    {selectedTrade.ticker} - {format(new Date(selectedTrade.date), 'MMM dd, yyyy')}
                  </h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-400">Direction</p>
                      <p className="font-medium">{selectedTrade.direction.toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Setup</p>
                      <p className="font-medium">{selectedTrade.setup}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Entry</p>
                      <p className="font-medium">${selectedTrade.entry.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Exit</p>
                      <p className="font-medium">${selectedTrade.exit.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">P&L</p>
                      <p
                        className={`font-medium ${
                          calculatePnL(selectedTrade) > 0 ? 'text-green-400' : 'text-red-400'
                        }`}
                      >
                        ${calculatePnL(selectedTrade).toFixed(2)} (
                        {calculatePnLPercent(selectedTrade) > 0 ? '+' : ''}
                        {calculatePnLPercent(selectedTrade).toFixed(2)}%)
                      </p>
                    </div>
                  </div>

                  {selectedTrade.tags && selectedTrade.tags.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Tags</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedTrade.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-700 rounded text-sm"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedTrade.notes && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">Notes</p>
                      <p className="bg-gray-700 p-3 rounded">{selectedTrade.notes}</p>
                    </div>
                  )}

                  {selectedTrade.ai_feedback && (
                    <div>
                      <p className="text-sm text-gray-400 mb-2">AI Feedback</p>
                      <div className="bg-blue-900 bg-opacity-30 border border-blue-700 p-4 rounded">
                        <p className="whitespace-pre-wrap">{selectedTrade.ai_feedback}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

