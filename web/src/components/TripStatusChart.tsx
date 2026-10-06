import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type TripStatusData = {
  status: string;
  count: number;
};

type TripStatusChartProps = {
  data: TripStatusData[];
};

function TripStatusChart({
  data,
}: TripStatusChartProps) {
  return (
    <div className="card">
      <h2>Trip Status</h2>

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

            <XAxis dataKey="status" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="count"
              name="Trips"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default TripStatusChart;