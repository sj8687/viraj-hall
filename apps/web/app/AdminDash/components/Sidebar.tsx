"use client";
import { useEffect, useState } from "react";
import {
  FaChevronLeft,
  FaBug,
} from "react-icons/fa";
import AdminBugReports from "./AdminBug";
import AdminDashboard from "./Admin";
import { BiSolidDashboard } from "react-icons/bi";
import { IoBookmarksSharp } from "react-icons/io5";
import { useSession } from "next-auth/react";
import Image from "next/image";
import DashboardSummary from "./UsersSummary";
import Theme from "./Theme";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";





export default function MainAdminDashboard() {
  const [collapsed, setCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<"dashboard" | "Bug reports" | "Bookings">("dashboard");
  const { data: authData, status } = useSession();
  const router = useRouter();
 

  
  
    useEffect(() => {
      if (status === "loading") return;
  
      if (!authData || !authData.user?.role) {
        router.replace("/");
      }
    }, [authData, status, router]);

  const menuItems = [
    { label: "Dashboard", icon: <BiSolidDashboard className="sm:text-xl text-[16px]" />, key: "dashboard" },
    { label: "Bug reports", icon: <FaBug className="sm:text-xl text-[16px]" />, key: "Bug reports" },
    { label: "Bookings", icon: <IoBookmarksSharp className="sm:text-xl text-[16px]" />, key: "Bookings" },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
      <div className={`transition-all  duration-300 dark:bg-zinc-900 bg-white dark:border-r-gray-400 border-r shadow h-full relative ${collapsed ? "sm:w-20 w-16 " : "w-64" }`} >
        <div className="flex items-center gap-1 p-4 border-b">
        <Link href={"/"}> <div className="bg-orange-500 text-white rounded-full sm:w-10 sm:h-10 w-8 h-8 flex items-center justify-center font-bold">
            V
          </div>
          </Link> 
          {!collapsed && (
            <div className="">
              <h2 className="font-bold flex text-center text-md leading-tight">Viraj Multipurpose Hall</h2>
            </div>
          )}
        </div>

        <div className="mt-4  flex flex-col gap-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveTab(item.key as any)}
              className={`
              flex items-center 
            ${collapsed ? "justify-center px-2" : "gap-4 px-4"}  py-3 mx-2 rounded-md text-sm  dark:hover:bg-slate-400  hover:bg-gray-100 
            ${activeTab === item.key ? "dark:bg-gray-700 bg-gray-300 font-semibold" : ""}
            `}
            >
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
            </button>


          ))}

          <div className={`absolute bottom-24 md:bottom-7 right-1 transition-all duration-300 ${collapsed ? "right-2" : "right-4" }`}>
            <span className={`flex items-center gap-2 p-2 rounded-md transition ${collapsed ? "justify-center" : ""}`} >
              <Theme  />
            </span>
          </div>

        </div>

        <button onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-4 top-1/2 transform -translate-y-1/2 hidden dark:bg-gray-500 bg-gray-300 hover:bg-gray-600 w-8 h-8 rounded-full sm:flex items-center justify-center shadow">
             <FaChevronLeft className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
        </button>
      </div>


      <div className="flex-1 overflow-y-auto sm:p-6 p-2 ">
        <div className="w-full flex items-center justify-between mb-6 flex-wrap gap-4">
          <div className="">
            <h1 className="text-2xl dark:text-white font-bold mb-4">Welcome Admin!</h1>
          </div>

          <div className="flex items-center gap-3 border dark:bg-slate-700 dark:sm:border-gray-10  dark:border-gray-400 bg-white sm:px-4 p-1 sm:py-2 rounded  sm:shadow ">
            <div className="w-9 h-9  rounded-full  text-white flex items-center justify-center font-bold">
              {
                authData?.user?.image ? (<Image src={authData?.user.image} alt="Profile" width={36} height={36} className="rounded-full   " />
                ) : (
                  <span className="text-lg p-9 ">{authData?.user?.email?.charAt(0)?.toUpperCase() || "A"}</span>)

              }
            </div>
            <div className="text-sm hidden md:block  leading-tight">
              <p className="font-medium">{authData?.user?.name}</p>
              <p className="text-xs dark:text-gray-300 text-gray-500">Admin</p>
            </div>
          </div>
        </div>



        {activeTab === "dashboard" && (
          <>
            <p className="dark:text-orange-300 text-orange-700 mb-6">Account Summary…</p>
          </>
        )}
        {activeTab === "Bug reports" && <AdminBugReports />}
        {activeTab === "Bookings" && <AdminDashboard />}
        {activeTab === "dashboard" && <DashboardSummary  />}
      </div>
    </div>
  );
}


