# 🧠 AI Trading Journal  

A full-stack trading journal powered by **FastAPI**, **React**, **Supabase**, and **LLMs (Groq/Llama-3)**.  
Built to help traders analyze performance, track setups, and receive personalized AI coaching.

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



