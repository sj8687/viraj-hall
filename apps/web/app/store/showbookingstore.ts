import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import { Booking } from "./types";

export interface BookingState {
    bookings: Booking[];
    loading: boolean;
    fetchBookings: () => Promise<void>
}

export const showBookingstore = create<BookingState>((set) => ({
    bookings: [],
    loading: false,

    fetchBookings: async () => {
        set({ loading: true });
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/show/show`,
                { withCredentials: true }
            )

            set({ bookings: data ,loading: false })

        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error('Too many requests. Please wait.');
            } else {
                toast.error('Failed to load bookings');
            }
        }
    }
}))