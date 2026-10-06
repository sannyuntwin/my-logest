import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { MonthlySummary } from "../data/analytics";

type DistanceChartProps = {
  data: MonthlySummary[];
};

function DistanceChart({
  data,
}: DistanceChartProps) {
  return (
    <div className="card">
      <h2>Distance by Month</h2>

      <div
        style={{
          width: "100%",
          height: 300,
        }}
      >
        <ResponsiveContainer>
          <BarChart data={data}>
            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip
              formatter={(value) =>
                `${Number(
                  value
                ).toLocaleString()} km`
              }
            />

            <Bar
              dataKey="distance"
              name="Distance"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DistanceChart;
