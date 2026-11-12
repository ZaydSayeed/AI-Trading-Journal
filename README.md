# 🧠 AI Trading Journal  

A full-stack trading journal powered by **FastAPI**, **React**, **Supabase**, and **LLMs (Groq/Llama-3)**.  
Built to help traders analyze performance, track setups, and receive personalized AI coaching.

**Who it's for:** active retail traders who want one place to log trades, see what's working, and get
blunt feedback on habits like overtrading or revenge trades. It's self-hosted: you run it against your
own Supabase project and your own Groq key, and it only holds the trades you enter.

## 🚧 Project Status

Early but working. Logging, editing and reviewing trades works end to end, the AI coach answers with
your own Groq key, and the frontend builds cleanly. Not done yet:

- Sign-in is a placeholder (it stores an email in the browser), and trades aren't scoped per user yet.
- The charts exist as components but aren't wired to computed stats.
- There are no automated tests yet.

Real auth with row-level security, computed analytics and a test suite are next.
See **[ROADMAP.md](ROADMAP.md)** for the full plan and known bugs.

---

## 🚀 Features

### **📈 Core Journal Features**
- Add new trades (ticker, entry, exit, direction, date, notes)
- View full trade history with sortable table
- Visualization dashboard (win rate, equity curve, setup stats — coming soon)
- Tagging system for setups & strategies

### **🤖 AI-Powered Coaching**
- Automated AI analysis for every trade  
- Full account-level performance breakdown  
- Pattern detection:  
  - Overtrading  
  - Revenge trades  
  - Stop-loss discipline  
  - Setup consistency  
- Personalized improvement plan via LLM
- Interactive chat page with an AI trading coach

### **🔐 Database & Backend**
- Supabase Postgres for storage  
- Python FastAPI backend  
- REST API for CRUD, analytics, and chat  
- Environment variables supported via `.env`

### **🎨 Frontend**
- React + TypeScript + Vite  
- TailwindCSS + Shadcn UI  
- Recharts for data visualization (coming soon)

---

## 🏗️ Tech Stack

### **Frontend**
- React (Vite + TypeScript)
- TailwindCSS  
- Shadcn UI  
- React Router  
- Recharts  
- Fetch/Axios for API calls

### **Backend**
- Python FastAPI  
- Supabase SDK  
- Groq LLM API  
- Uvicorn  
- Pydantic  

### **Database**
- Supabase Postgres  
- SQL schema for `trades` table  

---

## 🌐 API Endpoints (current & planned)

| Method | Endpoint          | Purpose |
|-------|-------------------|---------|
| POST  | `/trades`         | Add a new trade |
| GET   | `/trades`         | Get all trades |
| PUT   | `/trades/{id}`    | Update a trade |
| DELETE| `/trades/{id}`    | Delete a trade |
| POST  | `/ai/analyze`     | Analyze a single trade with AI |
| GET   | `/ai/insights`    | Full journal AI review |
| POST  | `/chat`           | Chat with the AI coach |

---

## ▶️ Running it locally

**You need:** Python 3.10+, Node.js 18+, a free [Supabase](https://supabase.com) project and a
[Groq](https://console.groq.com) API key.

**1. Database:** in the Supabase SQL editor, run [`supabase/schema.sql`](supabase/schema.sql).

**2. Backend:**

```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env        # then fill in your own values
uvicorn main:app --reload --port 8000
```

**3. Frontend:**

```bash
cd frontend
npm install
npm run dev                  # http://localhost:5173
```

Interactive API docs are at http://localhost:8000/docs once the backend is running.
Never commit your `.env`; it's already in `.gitignore`.

---

## 🗺️ Roadmap

The full plan is in **[ROADMAP.md](ROADMAP.md)**. The headlines: real accounts with Supabase Auth and
row-level security, computed analytics behind the charts, tests and CI, CSV import from broker
exports, and one-command self-hosting with Docker Compose.

## 📄 License

MIT. See [LICENSE](LICENSE).

## ⚠️ Disclaimer

For journaling and self-review only. Nothing here, including the AI coach's output, is financial advice.

