import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface EquityCurveProps {
  data: Array<{ date: string; equity: number }>;
}

export function EquityCurve({ data }: EquityCurveProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <defs>
          <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#b026ff" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#b026ff" stopOpacity={0} />
          </linearGradient>
        </defs>
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
            border: "1px solid rgba(176, 38, 255, 0.5)",
            borderRadius: "8px",
            color: "#fff",
          }}
          labelStyle={{ color: "#b026ff" }}
        />
        <Area
          type="monotone"
          dataKey="equity"
          stroke="#b026ff"
          strokeWidth={3}
          fillOpacity={1}
          fill="url(#colorEquity)"
          style={{
            filter: "drop-shadow(0 0 8px rgba(176, 38, 255, 0.6))",
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

