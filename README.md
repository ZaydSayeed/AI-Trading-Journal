# AI Trading Journal + AI Coach

A full-stack trading journal application with AI-powered analysis and coaching. Track your trades, analyze performance, and get personalized insights from an AI coach powered by Groq's Llama 3.

## 🚀 Features

- **Trade Management**: Add, edit, and delete trades with detailed information
- **AI Analysis**: Automatic AI feedback for every trade using Groq's Llama 3
- **Performance Analytics**: Comprehensive dashboard with charts and statistics
- **AI Coach Chat**: Interactive chatbot for personalized trading advice
- **Visual Analytics**: Equity curves, setup performance, win rates, and more

## 📋 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- React Router
- TailwindCSS
- Recharts
- Axios

### Backend
- Python 3.9+
- FastAPI
- Uvicorn
- Supabase (PostgreSQL)
- Groq API (Llama 3)

## 🛠️ Setup Instructions

### Prerequisites

1. **Supabase Account**
   - Create a project at [supabase.com](https://supabase.com)
   - Get your `SUPABASE_URL` and `SUPABASE_ANON_KEY`

2. **Groq API Key**
   - Sign up at [groq.com](https://groq.com)
   - Get your `GROQ_API_KEY`

3. **Python 3.9+** and **Node.js 18+**

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file:
```bash
cp .env.example .env
```

5. Edit `.env` and add your credentials:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

6. Set up the database:
   - Go to your Supabase project
   - Navigate to SQL Editor
   - Run the SQL from `supabase/schema.sql`

7. Start the backend server:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```bash
cp .env.example .env
```

4. Edit `.env` and set the backend URL:
```
VITE_BACKEND_URL=http://localhost:8000
```

5. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## 📁 Project Structure

```
ai-trading-journal/
├── backend/
│   ├── main.py                 # FastAPI application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example           # Environment variables template
│   ├── models/
│   │   └── trade_model.py     # Pydantic models
│   ├── routes/
│   │   ├── trades.py          # Trade CRUD endpoints
│   │   ├── ai.py              # AI analysis endpoints
│   │   └── chat.py            # Chat endpoint
│   └── services/
│       ├── supabase_service.py # Supabase database service
│       └── ai_service.py      # Groq AI service
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx       # Home page
│   │   │   ├── AddTrade.tsx   # Add trade form
│   │   │   ├── History.tsx    # Trade history table
│   │   │   ├── Dashboard.tsx  # Analytics dashboard
│   │   │   └── Chat.tsx       # AI coach chat
│   │   ├── api/
│   │   │   └── client.ts      # API client
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # React entry point
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
└── supabase/
    └── schema.sql             # Database schema
```

## 🎯 API Endpoints

### Trades
- `POST /trades` - Create a new trade
- `GET /trades` - Get all trades
- `GET /trades/{id}` - Get a specific trade
- `PUT /trades/{id}` - Update a trade
- `DELETE /trades/{id}` - Delete a trade

### AI
- `POST /ai/analyze` - Analyze a specific trade
- `GET /ai/insights` - Get comprehensive insights from all trades

### Chat
- `POST /chat` - Chat with AI coach

### Health
- `GET /health` - Health check endpoint

## 🚢 Deployment

### Frontend (Vercel)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_BACKEND_URL` to your backend URL
4. Deploy

### Backend (Render/Railway)

1. Push your code to GitHub
2. Create a new service on Render/Railway
3. Set environment variables:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `GROQ_API_KEY`
4. Set build command: `pip install -r requirements.txt`
5. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
6. Deploy

## 📝 Usage

1. **Add a Trade**: Navigate to "Add Trade" and fill in the trade details
2. **View History**: See all your trades in the "History" page
3. **Analyze Performance**: Check the "Dashboard" for charts and statistics
4. **Chat with AI**: Use the "AI Coach" page to ask questions about your trading

## 🔒 Environment Variables

### Backend `.env`
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
```

### Frontend `.env`
```
VITE_BACKEND_URL=http://localhost:8000
```

## 📄 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

