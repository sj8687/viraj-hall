"use client";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import axios from "axios";

export default function UserGrowthChart() {
  const [range, setRange] = useState(7); 
  const [data, setData] = useState<{ date: string; count: number }[]>([]);
 
  useEffect(() => {
   
    axios
      .get(`${process.env.NEXT_PUBLIC_Backend_URL}/graph/admin/user-growth?range=${range}`, {
         withCredentials:true
      })
      .then((res) => setData(res.data))
      .catch(() => console.error("Error fetching user growth data"));
  }, [range]);



  return (
    <div className="bg-white dark:bg-zinc-700 border rounded-lg p-4 shadow">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center mb-4">
        <div>
          <h2 className="text-xl dark:text-gray-50 font-bold">Total Visitors</h2>
          <p className="text-gray-500 dark:text-gray-300 text-sm">
            Total for the last{" "}
            {range === 7 ? "7 days" : range === 30 ? "30 days" : "3 months"}
          </p>
        </div>
        <div className="flex gap-2">
          {[
            { label: "Last 3 months", value: 90 },
            { label: "Last 30 days", value: 30 },
            { label: "Last 7 days", value: 7 },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setRange(btn.value)}
              className={`px-3 py-1 rounded border text-sm ${range === btn.value
                  ? "bg-orange-200 dark:bg-gray-400 font-semibold"
                  : "text-gray-600 dark:text-gray-100"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#d1d5db" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tickFormatter={(str) => str.slice(5)} />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#d1d5db
"
            fillOpacity={1}
            fill="url(#colorUsers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}


