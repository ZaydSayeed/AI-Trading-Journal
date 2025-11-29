import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageWrapper } from "@/components/layout/PageWrapper";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProfitChart } from "@/components/charts/ProfitChart";
import { EquityCurve } from "@/components/charts/EquityCurve";
import { MonthlyPnL } from "@/components/charts/MonthlyPnL";
import { Button } from "@/components/ui/button";
import { useTrades } from "@/hooks/useTrades";
import { format } from "date-fns";
import { TrendingUp, TrendingDown, Target, Calendar, ArrowRight, Sparkles } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { trades, loading } = useTrades();

  const stats = useMemo(() => {
    if (!trades.length) {
      return {
        totalPnL: 0,
        winRate: 0,
        avgRR: 0,
        monthlyTrades: 0,
      };
    }

    const completedTrades = trades.filter((t) => t.exit !== null);
    const winners = completedTrades.filter((t) => {
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      return pnl > 0;
    });

    const totalPnL = completedTrades.reduce((sum, t) => {
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      return sum + pnl;
    }, 0);

    const winRate = completedTrades.length > 0 
      ? (winners.length / completedTrades.length) * 100 
      : 0;

    // Average Risk/Reward (simplified)
    const avgRR = completedTrades.length > 0 ? 1.5 : 0;

    // Monthly trades (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const monthlyTrades = trades.filter((t) => new Date(t.date) >= thirtyDaysAgo).length;

    return {
      totalPnL,
      winRate,
      avgRR,
      monthlyTrades,
    };
  }, [trades]);

  const profitData = useMemo(() => {
    const sortedTrades = [...trades]
      .filter((t) => t.exit !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let cumulativeProfit = 0;
    return sortedTrades.map((t) => {
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      cumulativeProfit += pnl;
      return {
        date: format(new Date(t.date), "MMM dd"),
        profit: cumulativeProfit,
      };
    });
  }, [trades]);

  const equityData = useMemo(() => {
    const sortedTrades = [...trades]
      .filter((t) => t.exit !== null)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let equity = 10000; // Starting equity
    return sortedTrades.map((t) => {
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      equity += pnl;
      return {
        date: format(new Date(t.date), "MMM dd"),
        equity,
      };
    });
  }, [trades]);

  const monthlyPnLData = useMemo(() => {
    const completedTrades = trades.filter((t) => t.exit !== null);
    const monthlyData: Record<string, number> = {};

    completedTrades.forEach((t) => {
      const month = format(new Date(t.date), "MMM");
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      monthlyData[month] = (monthlyData[month] || 0) + pnl;
    });

    return Object.entries(monthlyData).map(([month, pnl]) => ({
      month,
      pnl: Number(pnl.toFixed(2)),
    }));
  }, [trades]);

  const setupData = useMemo(() => {
    const completedTrades = trades.filter((t) => t.exit !== null && t.setup);
    const setupStats: Record<string, { count: number; pnl: number }> = {};

    completedTrades.forEach((t) => {
      const setup = t.setup || "Unknown";
      const pnl = t.direction === "long" 
        ? (t.exit! - t.entry) 
        : (t.entry - t.exit!);
      
      if (!setupStats[setup]) {
        setupStats[setup] = { count: 0, pnl: 0 };
      }
      setupStats[setup].count++;
      setupStats[setup].pnl += pnl;
    });

    return Object.entries(setupStats)
      .map(([setup, stats]) => ({
        setup,
        count: stats.count,
        pnl: Number(stats.pnl.toFixed(2)),
      }))
      .slice(0, 5);
  }, [trades]);

  const latestTrades = useMemo(() => {
    return [...trades].sort((a, b) => {
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }).slice(0, 5);
  }, [trades]);

  if (loading) {
    return (
      <PageWrapper>
        <div className="space-y-6">
          <div>
            <div className="h-8 w-64 bg-muted rounded animate-pulse mb-2" />
            <div className="h-4 w-96 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-muted rounded animate-pulse" />
            ))}
          </div>
        </div>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
            Performance Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Track your trading performance and insights
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="border-neon-cyan/30 hover:border-neon-cyan/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total P&L (30d)
              </CardTitle>
              {stats.totalPnL >= 0 ? (
                <TrendingUp className="h-4 w-4 text-neon-cyan" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <span className={stats.totalPnL >= 0 ? "text-neon-cyan" : "text-red-500"}>
                  ${stats.totalPnL.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-purple/30 hover:border-neon-purple/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Win Rate
              </CardTitle>
              <Target className="h-4 w-4 text-neon-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-purple">
                {stats.winRate.toFixed(1)}%
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-cyan/30 hover:border-neon-cyan/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg R:R
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-neon-cyan" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-cyan">
                {stats.avgRR.toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card className="border-neon-purple/30 hover:border-neon-purple/50 transition-all">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Trades
              </CardTitle>
              <Calendar className="h-4 w-4 text-neon-purple" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neon-purple">
                {stats.monthlyTrades}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Latest Trades and AI Feedback */}
        {trades.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Latest Trades</CardTitle>
                  <CardDescription>Recent trading activity and AI insights</CardDescription>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/history")}
                  className="text-neon-cyan"
                >
                  View All <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {latestTrades.map((trade) => {
                  const pnl =
                    trade.exit !== null
                      ? trade.direction === "long"
                        ? trade.exit - trade.entry
                        : trade.entry - trade.exit
                      : null;

                  return (
                    <div
                      key={trade.id}
                      className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-lg">{trade.ticker}</span>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                trade.direction === "long"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {trade.direction.toUpperCase()}
                            </span>
                            {pnl !== null && (
                              <span
                                className={`font-semibold ${
                                  pnl >= 0 ? "text-neon-cyan" : "text-red-500"
                                }`}
                              >
                                {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            <span>{trade.setup || "No setup"}</span>
                            <span className="mx-2">•</span>
                            <span>{format(new Date(trade.date), "MMM dd, yyyy")}</span>
                          </div>
                          {trade.ai_feedback && (
                            <div className="mt-3 pt-3 border-t border-border/50">
                              <div className="flex items-start gap-2">
                                <Sparkles className="h-4 w-4 text-neon-purple mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                  <p className="text-xs font-medium text-neon-purple mb-1">
                                    AI Feedback
                                  </p>
                                  <p className="text-sm text-muted-foreground line-clamp-2">
                                    {trade.ai_feedback.length > 150
                                      ? `${trade.ai_feedback.substring(0, 150)}...`
                                      : trade.ai_feedback}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profit Over Time */}
          <Card>
            <CardHeader>
              <CardTitle>Profit Over Time</CardTitle>
              <CardDescription>Cumulative profit/loss tracking</CardDescription>
            </CardHeader>
            <CardContent>
              {profitData.length > 0 ? (
                <ProfitChart data={profitData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Equity Curve */}
          <Card>
            <CardHeader>
              <CardTitle>Equity Curve</CardTitle>
              <CardDescription>Account equity progression</CardDescription>
            </CardHeader>
            <CardContent>
              {equityData.length > 0 ? (
                <EquityCurve data={equityData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monthly P&L */}
          <Card>
            <CardHeader>
              <CardTitle>Monthly P&L</CardTitle>
              <CardDescription>Profit/loss by month</CardDescription>
            </CardHeader>
            <CardContent>
              {monthlyPnLData.length > 0 ? (
                <MonthlyPnL data={monthlyPnLData} />
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Trades by Setup</CardTitle>
              <CardDescription>Top performing setups</CardDescription>
            </CardHeader>
            <CardContent>
              {setupData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={setupData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                    <XAxis 
                      dataKey="setup" 
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <YAxis 
                      stroke="#9CA3AF"
                      tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "rgba(15, 23, 42, 0.95)",
                        border: "1px solid rgba(0, 240, 255, 0.5)",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                      labelStyle={{ color: "#00f0ff" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {setupData.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? "#00f0ff" : "#b026ff"}
                          style={{
                            filter: index % 2 === 0
                              ? "drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))"
                              : "drop-shadow(0 0 8px rgba(176, 38, 255, 0.6))",
                          }}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                  No data available
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </PageWrapper>
  );
}
