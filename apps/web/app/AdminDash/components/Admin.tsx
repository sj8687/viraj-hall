'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "@/app/booking/components/Spinner";
import { 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  CreditCard, 
  Trash2, 
  Eye, 
  EyeOff,
  Star,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Filter,
  Search,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Activity
} from "lucide-react";
import { useDebounce } from "@/app/utils/debounce";

interface Booking {
  id: string;
  date: string;
  functionType: string;
  guests: number;
  plan: "BASIC" | "PREMIUM";
  status: "CONFIRMED" | "PENDING";
  timeSlot: string;
  customer: string;
  contact: string;
  paymentId: string;
  additionalInfo?: string;
  user?: {
    email: string;
  };
}

export default function AdminDashboard() {
  const [bookingsByMonth, setBookingsByMonth] = useState<Record<string, Booking[]>>({});
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 1000);
  const [statusFilter, setStatusFilter] = useState<"ALL" | "CONFIRMED" | "PENDING">("ALL");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set());
  const router = useRouter();
 const { data: authData, status } = useSession();



  useEffect(() => {
    if (status === "loading") return;
    if (!authData || !authData.user?.role) {
      router.replace("/");
    }
  }, [authData, status, router]);

  const fetchBookings = () => {
  
    setLoading(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_Backend_URL}/adminbooking/admin/bookings`, {
       withCredentials:true
      })
      .then((res) => {
        setBookingsByMonth(res.data);
        
        setExpandedMonths(new Set(Object.keys(res.data)));
      })
      .catch(() => toast.error("Failed to fetch bookings"))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this booking?")) return;

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_Backend_URL}/adminbooking/admin/delete/${id}`,
        { 
          withCredentials:true,
         }
      );
      toast.success("Booking deleted successfully");
      fetchBookings();
    } catch (error) {
      toast.error("Error deleting booking");
    }
  };

  useEffect(() => {
    
      fetchBookings();
  
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const toggleMonth = (month: string) => {
    setExpandedMonths((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(month)) newSet.delete(month);
      else newSet.add(month);
      return newSet;
    });
  };

  const filteredBookings = Object.entries(bookingsByMonth).reduce((acc, [month, bookings]) => {
   const filtered = bookings.filter(booking => {
  const matchesSearch = 
    booking.customer.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    booking.user?.email?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
    booking.functionType.toLowerCase().includes(debouncedSearchTerm.toLowerCase());

  const matchesStatus = statusFilter === "ALL" || booking.status === statusFilter;
  
  return matchesSearch && matchesStatus;
});

    
    if (filtered.length > 0) {
      acc[month] = filtered;
    }
    return acc;
  }, {} as Record<string, Booking[]>);

  const totalBookings = Object.values(filteredBookings).flat().length;
  const confirmedBookings = Object.values(filteredBookings).flat().filter(b => b.status === "CONFIRMED").length;
  const pendingBookings = Object.values(filteredBookings).flat().filter(b => b.status === "PENDING").length;

  if (loading) {
    return (
      <div className="min-h-screen text-white  flex items-center justify-center">
        <div className="text-center">
         <Spinner />
          <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">Fetching booking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="sm:p-3 p-1 bg-gradient-to-r from-blue-200 to-orange-600 rounded-xl shadow-lg">
              <BarChart3 className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="sm:text-4xl text-2xl dark:text-gray-50 font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-400 sm:text-lg">Comprehensive booking management system</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:from-gray-600 dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-600 mb-1">Total Bookings</p>
                  <p className="text-3xl font-bold dark:text-gray-50 text-gray-900">{totalBookings}</p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-gray-500 rounded-lg">
                  <TrendingUp className="h-6 w-6 dark:text-blue-400 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:from-gray-600 dark:bg-zinc-900  rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-100 mb-1">Confirmed</p>
                  <p className="text-3xl font-bold dark:text-gray-50 text-green-600">{confirmedBookings}</p>
                </div>
                <div className="p-3 bg-green-50 dark:bg-gray-500 rounded-lg">
                  <CheckCircle className="h-6 w-6 dark:text-gray-300 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:from-gray-600 dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium dark:text-gray-100 text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold dark:text-gray-50 text-orange-600">{pendingBookings}</p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-gray-500 rounded-lg">
                  <AlertCircle className="h-6 w-6 dark:text-red-400 text-orange-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters Section */}
          <div className="bg-white dark:bg-zinc-800 dark:border-gray-400 rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4  lg:w-auto">
                <div className="relative flex-1 lg:w-80">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 dark:text-gray-50 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 sm:py-2 py-1 border border-gray-300 rounded-lg dark:text-gray-100 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex  items-center gap-3">
                <Filter className="h-5 w-5 dark:text-gray-50 text-gray-400" />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as "ALL" | "CONFIRMED" | "PENDING")}
                  className="px-4 sm:py-2 py-1 border border-gray-300 rounded-lg dark:text-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="ALL">All Status</option>
                  <option value="CONFIRMED">Confirmed</option>
                  <option value="PENDING">Pending</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        {Object.keys(filteredBookings).length === 0 ? (
          <div className="bg-white dark:bg-gray-400 rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="p-4 bg-gray-100 rounded-full w-20 h-20 mx-auto mb-6 flex items-center justify-center">
              <Calendar className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Bookings Found</h3>
            <p className="text-gray-600 dark:text-gray-700 max-w-md mx-auto">
              {searchTerm || statusFilter !== "ALL" 
                ? "No bookings match your current filters. Try adjusting your search criteria."
                : "No bookings have been made yet. Check back later for new reservations."
              }
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(filteredBookings).map(([month, bookings]) => (
              <div key={month} className="bg-white dark:bg-gray-400 rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {/* Month Header */}
                <div 
                  className="bg-gradient-to-r dark:from-gray-700 dark:to-neutral-300 from-blue-50 to-purple-50 border-b border-gray-200 p-4 cursor-pointer hover:from-blue-100 hover:to-orange-100 transition-all duration-200"
                  onClick={() => toggleMonth(month)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-2  bg-blue-100 rounded-lg">
                        <Calendar className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <h2 className="sm:text-xl dark:text-gray-50 text-[13px] font-bold text-gray-900">{month}</h2>
                        <p className="text-gray-600 dark:text-gray-300 sm:text-[17px] text-[14px]">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-blue-100 text-orange-800 rounded-full text-sm font-medium">
                        {bookings.length} total
                      </span>
                      {expandedMonths.has(month) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Table */}
                {expandedMonths.has(month) && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-neutral-500 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              User Email
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4" />
                              Customer
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              Contact
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">Function</th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              Date
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              Time
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">Guests</th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Star className="h-4 w-4" />
                              Plan
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <CreditCard className="h-4 w-4" />
                              Payment ID
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">
                            <div className="flex items-center gap-2">
                              <Activity className="h-4 w-4" />
                              Status
                            </div>
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium  dark:text-neutral-50 text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-neutral-300 divide-y divide-gray-200">
                        {bookings.map((booking, index) => (
                          <React.Fragment key={booking.id}>
                            <tr className="hover:bg-gray-50 transition-colors duration-150">
                              <td className="px-4 py-4 text-sm text-gray-900 max-w-[200px] truncate" title={booking.user?.email || "N/A"}>
                                {booking.user?.email || "N/A"}
                              </td>
                              <td className="px-4 py-4 text-sm font-medium text-gray-900 max-w-[150px] truncate" title={booking.customer}>
                                {booking.customer}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900 max-w-[120px] truncate" title={booking.contact}>
                                {booking.contact}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900 max-w-[120px] truncate" title={booking.functionType}>
                                {booking.functionType}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {new Date(booking.date).toLocaleDateString("en-IN")}
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900">{booking.timeSlot}</td>
                              <td className="px-4 py-4 text-sm text-gray-900">{booking.guests}</td>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.plan === "PREMIUM" 
                                    ? "bg-yellow-100 text-yellow-800" 
                                    : "bg-gray-100 text-gray-800"
                                }`}>
                                  {booking.plan === "PREMIUM" && <Star className="h-3 w-3" />}
                                  {booking.plan}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-900 font-mono max-w-[150px] truncate" title={booking.paymentId}>
                                {booking.paymentId}
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  booking.status === "CONFIRMED" 
                                    ? "bg-green-100 text-green-800" 
                                    : "bg-orange-100 text-orange-800"
                                }`}>
                                  {booking.status === "CONFIRMED" ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <AlertCircle className="h-3 w-3 mr-1" />
                                  )}
                                  {booking.status}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDelete(booking.id)}
                                    className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-xs font-medium transition-colors duration-200"
                                    title="Delete Booking"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                    Delete
                                  </button>
                                  {booking.additionalInfo && (
                                    <button
                                      onClick={() => toggleRow(booking.id)}
                                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-xs font-medium transition-colors duration-200"
                                      title={expandedRows.has(booking.id) ? "Hide Customer Note" : "Show Customer Note"}
                                    >
                                      {expandedRows.has(booking.id) ? (
                                        <>
                                          <EyeOff className="h-3 w-3" />
                                          Hide
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="h-3 w-3" />
                                          Note
                                        </>
                                      )}
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>

                            {booking.additionalInfo && expandedRows.has(booking.id) && (
                              <tr className="bg-blue-50 dark:bg-gray-400">
                                <td colSpan={11} className="px-6 py-4">
                                  <div className="bg-white dark:bg-neutral-100 rounded-lg p-4 border border-blue-200">
                                    <div className="flex items-center gap-2 mb-2">
                                      <Eye className="h-4 w-4 text-blue-600" />
                                      <span className="font-medium text-blue-900">Customer Note</span>
                                    </div>
                                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                                      {booking.additionalInfo}
                                    </p>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}