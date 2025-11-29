import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">AI Trading Journal</h1>
          <p className="text-xl text-gray-400 mb-8">
            Track your trades, analyze performance, and get AI-powered coaching
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link
            to="/add-trade"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Add Trade</h2>
            <p className="text-gray-400">
              Record a new trade with entry, exit, setup, and notes. Get instant AI feedback.
            </p>
          </Link>

          <Link
            to="/history"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Trade History</h2>
            <p className="text-gray-400">
              View all your trades, edit details, and read AI analysis for each trade.
            </p>
          </Link>

          <Link
            to="/dashboard"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">Dashboard</h2>
            <p className="text-gray-400">
              Visualize your performance with charts, win rates, and setup analysis.
            </p>
          </Link>

          <Link
            to="/chat"
            className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:border-blue-500 transition-colors"
          >
            <h2 className="text-2xl font-semibold mb-2 text-blue-400">AI Coach</h2>
            <p className="text-gray-400">
              Chat with your AI trading coach about your trades and get personalized advice.
            </p>
          </Link>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <ul className="space-y-2 text-gray-300">
            <li>✓ Automatic AI analysis for every trade</li>
            <li>✓ Comprehensive performance analytics</li>
            <li>✓ Interactive AI coaching chatbot</li>
            <li>✓ Visual charts and equity curves</li>
            <li>✓ Setup performance tracking</li>
            <li>✓ Risk management insights</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

