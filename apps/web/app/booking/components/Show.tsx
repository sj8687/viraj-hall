"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";
import Image from "next/image";
import { useSession } from "next-auth/react";
// import { getTokenFromServer } from "@/app/actions/gettoken/gettoken";

interface Booking {
  id: string;
  date: string;
  customer: string;
  guests: number;
  plan: "BASIC" | "PREMIUM";
  status: "PENDING" | "CONFIRMED";
  functionType?: string;
}

const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MyBookings() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { data: authData, status } = useSession();
  const [token, setToken] = useState<string>();


  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get("/api/token"); // ✔️ axios call
        console.log("Token from API:", response.data.token);
        setToken(response.data.token);
      } catch (err) {
        console.error("Error fetching token:", err);
      }
    };

    fetchToken();
  }, []);


  useEffect(() => {
    if (status === "loading") return;

    if (!authData || !authData.user) {
      router.replace("/");
    }
  }, [authData, status, router]);


  useEffect(() => {
    if (!token) return;

    const fetchBookings = async () => {
      setLoading(true);
      try {
        console.log("Fetching with token:", token);

        const { data } = await axios.get(
          `${process.env.NEXT_PUBLIC_Backend_URL}/show/show`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setBookings(data);
      } catch (err: any) {
        if (err.response?.status === 429) {
          toast.error('Too many requests. Please wait.');
        } else {
          toast.error("Failed to load bookings");
        }


        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings(); // ✅ only when token is ready
  }, [token]);

  return (
    <div className="min-h-screen max-w-[1250px] mx-auto px-4 py-8 mt-[80px] flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-center">My Bookings</h1>
      <p className="text-gray-500 mb-6 text-center">
        Easily manage your past, current, and upcoming hall bookings in one place.
      </p>

      {/* Desktop header row */}
      <div className="hidden md:grid grid-cols-12 font-semibold text-gray-700 border-b pb-2 mb-4 text-sm">
        <span className="col-span-5">Venue</span>
        <span className="col-span-4">Date & Timings</span>
        <span className="col-span-3">Payment</span>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center flex-grow text-gray-500">
          <Spinner />
          <p className="mt-2">Loading bookings, please wait...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="flex-grow flex items-center justify-center text-gray-500 text-center mt-10">
          No bookings found yet.
        </div>
      ) : (
        <div className="space-y-6">
          {bookings.map((booking) => {
            const isPaid = booking.status === "CONFIRMED";
            const totalAmount = booking.plan === "PREMIUM" ? 150000 : 70000;

            return (
              <div
                key={booking.id}
                className="grid grid-cols-1 md:grid-cols-12 md:gap-4 border-b pb-6"
              >
                {/* Venue column (5/12) */}
                {/* Venue column (5/12) */}
                <div className="col-span-5 flex flex-col md:flex-row md:items-center gap-4">
                  <Image
                    src="/hall.jpg"
                    alt="Hall"
                    width={112}   // same as md:w-28
                    height={96}   // same as md:h-24
                    className="w-full h-40 md:w-28 md:h-24 object-cover rounded"
                  />
                  <div className="text-center md:text-left">
                    <h2 className="font-medium text-lg">
                      Viraj Multipurpose Hall ({booking.functionType || "Function"})
                    </h2>
                    <p className="text-gray-500 text-sm">
                      📍Viraj Multipurpose Hall, Near 412802, Old NH4,
                    </p>
                    <p className="text-gray-500 text-sm">👥 Guests: {booking.guests}</p>
                    <p className="text-gray-500 text-sm">✨ Name: {booking.customer}</p>

                    <p className="text-black text-sm font-medium mt-1">
                      Total: ₹{totalAmount.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Date & Time column (4/12) */}
                <div className="col-span-4 flex flex-col justify-center gap-2 text-sm text-gray-700 mt-4 md:mt-0 text-center md:text-left">
                  <p>
                    <strong>Check-In:</strong> {formatDate(booking.date)}
                  </p>
                  <p>
                    <strong>Check-Out:</strong>{" "}
                    {formatDate(
                      new Date(new Date(booking.date).getTime() + 86400000).toISOString()
                    )}
                  </p>
                </div>

                {/* Payment column (3/12) */}
                <div className="col-span-3 flex flex-col justify-center items-center md:items-start gap-2 mt-4 md:mt-0 text-sm px-4 md:px-0 text-center md:text-left">
                  <span
                    className={`font-medium inline-flex items-center gap-2 ${isPaid ? "text-green-600" : "text-red-500"
                      }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${isPaid ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></span>
                    {isPaid ? "Paid" : "Unpaid"}
                  </span>

                  {!isPaid && (
                    <>
                      <button
                        className="px-4 py-1 mt-1 rounded bg-orange-500 text-white text-sm hover:bg-orange-600 transition"
                        onClick={() => {
                          toast.info("Redirecting to payment...");
                          router.push(`/booking/payment?bookingId=${booking.id}`);
                        }}
                      >
                        Pay Now
                      </button>
                      <p className="text-xs text-red-400 italic mt-1 max-w-xs">
                        If you don’t complete your payment within a day, your booking is not
                        considered.
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
