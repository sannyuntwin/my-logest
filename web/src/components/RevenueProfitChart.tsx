import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlySummary } from "../data/analytics";

type RevenueProfitChartProps = {
  data: MonthlySummary[];
};

function RevenueProfitChart({
  data,
}: RevenueProfitChartProps) {
  return (
    <div
      className="card"
      style={{
        marginBottom: "24px",
      }}
    >
      <h2>Monthly Revenue & Profit</h2>

      <div
        style={{
          width: "100%",
          height: 350,
        }}
      >
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `฿${Number(
                  value
                ).toLocaleString()}`
              }
            />

            <Legend />

            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              strokeWidth={2}
            />

            <Line
              type="monotone"
              dataKey="profit"
              name="Profit"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default RevenueProfitChart;
