import axios from "axios";
import { toast } from "react-toastify";
import { create } from "zustand";
import { Booking, RazorpayOptions, RazorpayOrderResponse, RazorpayPaymentResponse } from "./types";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}


export interface BookingState {
    bookings: Booking[];
    loading: boolean;
    fetchBookings: () => Promise<void>

    fetchorder: (bookingId: string, onSuccess: () => void, onFail: () => void) => Promise<void>;
}


export const Zusstore = create<BookingState>((set) => ({
    bookings: [],
    loading: false,

    fetchBookings: async () => {
        set({ loading: true });
        try {
            const { data } = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/show/show`,
                { withCredentials: true }
            )

            set({ bookings: data, loading: false })

        } catch (err: any) {
            if (err.response?.status === 429) {
                toast.error('Too many requests. Please wait.');
            } else {
                toast.error('Failed to load bookings');
            }
        }
    },






    fetchorder: async (bookingId, onSuccess, onFail) => {
        set({ loading: true });

        try {
            const { data } = await axios.post<RazorpayOrderResponse>(
                `${process.env.NEXT_PUBLIC_Backend_URL}/payment/create`,
                { bookingId },
                { withCredentials: true }
            );

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: data.amount,
                currency: data.currency,
                name: "Viraj Multipurpose Hall",
                description: `Booking Payment (${data.plan})`,
                order_id: data.orderId,
                prefill: {
                    name: data.customer,
                    email: data.email,
                    contact: data.contact,
                },
                notes: {
                    bookingId: data.id,
                },
                theme: {
                    color: "#ec6e24",
                },


                handler: async (response: RazorpayPaymentResponse) => {
                    try {
                        await axios.post(
                            `${process.env.NEXT_PUBLIC_Backend_URL}/payment/verify`,
                            {
                                order_id: response.razorpay_order_id,
                                payment_Id: response.razorpay_payment_id,
                                signature: response.razorpay_signature,
                                bookingId,
                            },
                            { withCredentials: true }
                        );
                        toast.success("Payment successful!");
                        onSuccess();
                        set({ loading: false });
                    } catch (err: any) {
                        if (err.response?.status === 429) {
                            toast.error('Too many requests. Please wait.');
                        } else {
                            toast.error("Payment verification failed.");
                        }
                        onFail();
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.info("Payment cancelled by user.");
                        onFail();
                    },
                },
            };

            const razor = new window.Razorpay(options);
            razor.open();
             set({ loading: false });
        } catch (err: any) {
            toast.error(err?.response?.data?.error || "Failed to create Razorpay order");
            onFail();
        } 
    },

}))