import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface MonthlyPnLProps {
  data: Array<{ month: string; pnl: number }>;
}

export function MonthlyPnL({ data }: MonthlyPnLProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="month" 
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
        <Bar dataKey="pnl" radius={[8, 8, 0, 0]}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.pnl >= 0 ? "#00f0ff" : "#ff006e"}
              style={{
                filter: entry.pnl >= 0 
                  ? "drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))"
                  : "drop-shadow(0 0 8px rgba(255, 0, 110, 0.6))",
              }}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

