from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv, find_dotenv
import os

# ============================
# LOAD ENV BEFORE ANY IMPORTS
# ============================

env_path = find_dotenv()
print("Found .env at:", env_path)

load_dotenv(env_path, override=True)

print("SUPABASE_URL:", os.getenv("SUPABASE_URL"))
print("SUPABASE_ANON_KEY:", os.getenv("SUPABASE_ANON_KEY"))

# ============================
# IMPORT ROUTES AFTER ENV LOAD
# ============================
# Import routes after environment is loaded to ensure services can access env vars
from routes import trades, ai, chat, settings

# ============================
# FASTAPI APP
# ============================

app = FastAPI(
    title="AI Trading Journal API",
    description="Backend API for AI Trading Journal with AI Coach",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(trades.router)
app.include_router(ai.router)
app.include_router(chat.router)
app.include_router(settings.router)

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
