import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface ProfitChartProps {
  data: Array<{ date: string; profit: number }>;
}

export function ProfitChart({ data }: ProfitChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
        <XAxis 
          dataKey="date" 
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
        <Legend wrapperStyle={{ color: "#9CA3AF" }} />
        <Line
          type="monotone"
          dataKey="profit"
          stroke="#00f0ff"
          strokeWidth={3}
          dot={{ fill: "#00f0ff", r: 4 }}
          activeDot={{ r: 6, fill: "#b026ff" }}
          strokeDasharray="0"
          style={{
            filter: "drop-shadow(0 0 8px rgba(0, 240, 255, 0.6))",
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

