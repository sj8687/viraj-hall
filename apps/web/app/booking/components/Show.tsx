"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { Spinner } from "./Spinner";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Zusstore } from "@/app/store/zustand";


const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export default function MyBookings() {
  const router = useRouter();
  const { data: authData, status } = useSession();

  const {bookings,loading,fetchBookings} = Zusstore()


  useEffect(() => {
    if (status === "loading") return;

    if (!authData || !authData.user) {
      router.replace("/");
    }
  }, [authData, status, router]);


  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return (
    <div className="min-h-screen max-w-[1250px] mx-auto px-4 py-8 mt-[80px] flex flex-col">
      <h1 className="text-3xl font-bold mb-2 text-center">My Bookings</h1>
      <p className="text-gray-500 mb-6 text-center">
        Easily manage your past, current, and upcoming hall bookings in one place.
      </p>

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
               
                <div className="col-span-5 flex flex-col md:flex-row md:items-center gap-4">
                  <Image
                    src="/hall.jpg"
                    alt="Hall"
                    width={112}   
                    height={96}  
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
