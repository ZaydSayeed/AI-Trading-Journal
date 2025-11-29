import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client'

interface TradeForm {
  ticker: string
  entry: string
  exit: string
  direction: 'long' | 'short'
  setup: string
  notes: string
  tags: string
  date: string
}

export default function AddTrade() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState<TradeForm>({
    ticker: '',
    entry: '',
    exit: '',
    direction: 'long',
    setup: '',
    notes: '',
    tags: '',
    date: new Date().toISOString().split('T')[0],
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setShowSuccess(false)

    try {
      const tagsArray = formData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0)

      const payload = {
        ...formData,
        entry: parseFloat(formData.entry),
        exit: parseFloat(formData.exit),
        tags: tagsArray,
      }

      await api('/trades', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      setShowSuccess(true)
      
      // Reset form
      setFormData({
        ticker: '',
        entry: '',
        exit: '',
        direction: 'long',
        setup: '',
        notes: '',
        tags: '',
        date: new Date().toISOString().split('T')[0],
      })

      setTimeout(() => {
        setShowSuccess(false)
        navigate('/history')
      }, 2000)
    } catch (error) {
      console.error('Error adding trade:', error)
      alert('Failed to add trade. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Add New Trade</h1>

        {showSuccess && (
          <div className="mb-4 p-4 bg-green-900 border border-green-700 rounded-lg text-green-200">
            Trade added successfully! Redirecting to history...
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg border border-gray-700 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="ticker" className="block text-sm font-medium mb-2">
                Ticker *
              </label>
              <input
                type="text"
                id="ticker"
                name="ticker"
                value={formData.ticker}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="AAPL"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-sm font-medium mb-2">
                Date *
              </label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="entry" className="block text-sm font-medium mb-2">
                Entry Price *
              </label>
              <input
                type="number"
                id="entry"
                name="entry"
                value={formData.entry}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="150.00"
              />
            </div>

            <div>
              <label htmlFor="exit" className="block text-sm font-medium mb-2">
                Exit Price *
              </label>
              <input
                type="number"
                id="exit"
                name="exit"
                value={formData.exit}
                onChange={handleChange}
                required
                step="0.01"
                min="0"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
                placeholder="155.00"
              />
            </div>

            <div>
              <label htmlFor="direction" className="block text-sm font-medium mb-2">
                Direction *
              </label>
              <select
                id="direction"
                name="direction"
                value={formData.direction}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="long">Long</option>
                <option value="short">Short</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="setup" className="block text-sm font-medium mb-2">
              Setup *
            </label>
            <input
              type="text"
              id="setup"
              name="setup"
              value={formData.setup}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Breakout, Pullback, Reversal, etc."
            />
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="momentum, tech, earnings"
            />
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              placeholder="Additional notes about this trade..."
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition-colors"
            >
              {loading ? 'Adding Trade...' : 'Add Trade'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/history')}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

