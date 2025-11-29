import os
from groq import Groq
from typing import Dict, List
import json


class AIService:
    def __init__(self):
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            raise ValueError("GROQ_API_KEY must be set in environment variables")
        
        self.client = Groq(api_key=api_key)
        self.model = "llama-3.1-8b-instant"

    def analyze_trade(self, trade: Dict) -> str:
        """Analyze a single trade and provide detailed feedback"""
        
        # Calculate P&L
        entry = trade.get("entry", 0)
        exit_price = trade.get("exit", 0)
        direction = trade.get("direction", "long")
        
        if direction == "long":
            pnl = exit_price - entry
            pnl_percent = ((exit_price - entry) / entry) * 100
        else:
            pnl = entry - exit_price
            pnl_percent = ((entry - exit_price) / entry) * 100
        
        is_winner = pnl > 0
        
        prompt = f"""You are an expert trading coach analyzing a trade. Provide a detailed, constructive critique.

Trade Details:
- Ticker: {trade.get('ticker', 'N/A')}
- Direction: {trade.get('direction', 'N/A').upper()}
- Entry Price: ${trade.get('entry', 0):.2f}
- Exit Price: ${trade.get('exit', 0):.2f}
- P&L: ${pnl:.2f} ({pnl_percent:+.2f}%)
- Setup: {trade.get('setup', 'N/A')}
- Notes: {trade.get('notes', 'None provided')}
- Tags: {', '.join(trade.get('tags', [])) if trade.get('tags') else 'None'}
- Date: {trade.get('date', 'N/A')}

Provide a comprehensive analysis covering:
1. Trade Execution: Was the entry/exit timing good? Why or why not?
2. Setup Quality: Evaluate the setup - was it high probability? What were the strengths/weaknesses?
3. Risk Management: Was position sizing appropriate? Was the risk/reward ratio favorable?
4. Psychology: What psychological factors may have influenced this trade (fear, greed, FOMO, etc.)?
5. What Went Well: Identify positive aspects of this trade
6. What Could Be Improved: Specific, actionable improvements
7. Key Takeaways: 2-3 main lessons from this trade

Be specific, constructive, and educational. Format your response in clear paragraphs."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert trading coach with deep knowledge of technical analysis, risk management, and trading psychology. Provide detailed, actionable feedback."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1500
            )
            
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating AI analysis: {str(e)}"

    def analyze_full_history(self, trades: List[Dict]) -> str:
        """Analyze the full trading history and provide comprehensive insights"""
        
        if not trades:
            return "No trades found. Start adding trades to get personalized insights!"
        
        # Calculate statistics
        total_trades = len(trades)
        winners = []
        losers = []
        setups = {}
        total_pnl = 0
        
        for trade in trades:
            entry = trade.get("entry", 0)
            exit_price = trade.get("exit", 0)
            direction = trade.get("direction", "long")
            setup = trade.get("setup", "Unknown")
            
            if direction == "long":
                pnl = exit_price - entry
            else:
                pnl = entry - exit_price
            
            total_pnl += pnl
            
            if pnl > 0:
                winners.append(trade)
            else:
                losers.append(trade)
            
            if setup not in setups:
                setups[setup] = {"wins": 0, "losses": 0, "pnl": 0}
            
            if pnl > 0:
                setups[setup]["wins"] += 1
            else:
                setups[setup]["losses"] += 1
            setups[setup]["pnl"] += pnl
        
        win_rate = (len(winners) / total_trades * 100) if total_trades > 0 else 0
        
        # Build setup analysis
        setup_analysis = []
        for setup, stats in setups.items():
            setup_total = stats["wins"] + stats["losses"]
            setup_win_rate = (stats["wins"] / setup_total * 100) if setup_total > 0 else 0
            setup_analysis.append(f"- {setup}: {stats['wins']}W/{stats['losses']}L ({setup_win_rate:.1f}% win rate, ${stats['pnl']:.2f} P&L)")
        
        # Find best and worst setups
        best_setup = max(setups.items(), key=lambda x: x[1]["pnl"]) if setups else ("N/A", {})
        worst_setup = min(setups.items(), key=lambda x: x[1]["pnl"]) if setups else ("N/A", {})
        
        # Calculate average win and loss
        avg_win = 0.0
        if winners:
            win_amounts = [
                t.get('exit', 0) - t.get('entry', 0) if t.get('direction') == 'long' 
                else t.get('entry', 0) - t.get('exit', 0) 
                for t in winners
            ]
            avg_win = sum(win_amounts) / len(winners) if win_amounts else 0.0
        
        avg_loss = 0.0
        if losers:
            loss_amounts = [
                t.get('exit', 0) - t.get('entry', 0) if t.get('direction') == 'long' 
                else t.get('entry', 0) - t.get('exit', 0) 
                for t in losers
            ]
            avg_loss = sum(loss_amounts) / len(losers) if loss_amounts else 0.0

        prompt = f"""You are an expert trading coach analyzing a trader's complete trading history. Provide comprehensive insights and a personalized improvement plan.

Trading Statistics:
- Total Trades: {total_trades}
- Winners: {len(winners)} ({win_rate:.1f}% win rate)
- Losers: {len(losers)}
- Total P&L: ${total_pnl:.2f}
- Average Win: ${avg_win:.2f}
- Average Loss: ${avg_loss:.2f}

Setup Performance:
{chr(10).join(setup_analysis)}

Best Performing Setup: {best_setup[0]} (${best_setup[1].get('pnl', 0):.2f} P&L)
Worst Performing Setup: {worst_setup[0]} (${worst_setup[1].get('pnl', 0):.2f} P&L)

Recent Trades Summary:
{json.dumps(trades[:10], indent=2, default=str)}

Provide a comprehensive analysis covering:
1. Overall Performance Assessment: Evaluate the trader's performance holistically
2. Strongest Setups: Which setups work best and why
3. Weakest Setups: Which setups are underperforming and what might be wrong
4. Win/Loss Analysis: Patterns in winning vs losing trades
5. Risk Management Mistakes: Common risk management errors observed
6. Behavioral Patterns: Psychological patterns that may be affecting performance (overtrading, revenge trading, etc.)
7. Personalized Improvement Plan: Specific, actionable steps to improve trading performance

Be detailed, specific, and provide actionable advice. Format your response in clear sections with headers."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert trading coach with deep knowledge of technical analysis, risk management, and trading psychology. Provide comprehensive, actionable insights."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=2000
            )
            
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating AI insights: {str(e)}"

    def chat(self, message: str, trades: List[Dict]) -> str:
        """Handle chat messages with context from trading history"""
        
        trades_context = json.dumps(trades, indent=2, default=str) if trades else "No trades recorded yet."
        
        prompt = f"""You are an AI trading coach assistant. The user is asking you a question about their trading.

User Question: {message}

Trading History:
{trades_context}

Answer the user's question using the trading history as context. Be helpful, educational, and specific. If the question is about a specific trade, reference it. If it's about general trading advice, provide actionable insights."""

        try:
            chat_completion = self.client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful AI trading coach assistant. Answer questions about trading using the provided trading history as context. Be specific, educational, and actionable."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                model=self.model,
                temperature=0.7,
                max_tokens=1000
            )
            
            return chat_completion.choices[0].message.content
        except Exception as e:
            return f"Error generating chat response: {str(e)}"

