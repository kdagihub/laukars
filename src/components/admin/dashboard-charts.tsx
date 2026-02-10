"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type ChartData = {
  name: string;
  demandes: number;
  ventes: number;
  echecs: number;
};

export function DashboardCharts({ data }: { data: ChartData[] }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h2 className="font-semibold text-gray-900 mb-6">
        Activité sur 6 mois
      </h2>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis dataKey="name" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "1px solid #e2e8f0",
              boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.05)",
            }}
          />
          <Legend />
          <Bar
            dataKey="demandes"
            fill="#3b82f6"
            name="Demandes"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="ventes"
            fill="#22c55e"
            name="Ventes"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="echecs"
            fill="#ef4444"
            name="Échecs"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
