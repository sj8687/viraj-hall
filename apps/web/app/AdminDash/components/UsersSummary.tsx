"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "./CardCompo";
import UserGrowthChart from "./Graph";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";


export default function DashboardSummary() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    newUsers: 0,
    totalBugs: 0,
  });
  const router = useRouter();
  const { data: authData, status } = useSession();

  useEffect(() => {
    if (status === "loading") return;
    if (!authData || !authData.user?.role) {
      router.replace("/");
    }
  }, [authData, status, router]);



  useEffect(() => {

    axios
      .get(`${process.env.NEXT_PUBLIC_Backend_URL}/allusers/allusers`, {
        withCredentials: true
      })
      .then((res) => setStats(res.data))
      .catch(() => console.error("Failed to fetch stats"));
  }, []);


  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-6 mt-6">
        <StatCard
          title="Total Revenue"
          value={`₹${stats.totalRevenue.toLocaleString()}`}
          trend="+12.5%"
          trendText="Trending up "
          desc="revenue for the last 12 months"
          positive
        />
        <StatCard
          title="New Customers"
          value={stats.newUsers}
          trend="-20%"
          trendText="Down 20% this period"
          desc="Acquisition needs attention"
          positive={false}
        />
        <StatCard
          title="Active Accounts"
          value={stats.totalUsers}
          trend="+12.5%"
          trendText="Strong user retention"
          desc="Engagement exceed targets"
          positive
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          trend="+12.5%"
          trendText="Strong user retention"
          desc="Engagement exceed targets"
          positive
        />
        <StatCard
          title="Total Bugs"
          value={stats.totalBugs}
          trend="+52.5%"
          trendText="most bugs this month"
          desc="Based realtime data"
          positive={stats.totalRevenue >= 800000}
        />

      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">User Growth Over Time</h2>
        <UserGrowthChart />
      </div>


    </div>
  );
}

