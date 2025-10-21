"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Spinner } from "./Spinner";
import "react-toastify/dist/ReactToastify.css";
import { Zusstore } from "@/app/store/zustand";

export default function PaymentPage() {
  const { data: authData, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("bookingId");
  const { loading, fetchorder } = Zusstore();

  useEffect(() => {
    if (status === "loading") return;
    if (!authData) router.replace("/");
  }, [authData, status, router]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);


  useEffect(() => {
    if (!bookingId) return;

    fetchorder(
      bookingId,
      () => router.push("/"), 
      () => router.push("/") 
    );
  }, [bookingId, fetchorder, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center space-y-4">
        <Spinner />
        <span className="text-gray-600 text-sm">
          {loading ? "Loading payment gateway..." : "Redirecting..."}
        </span>
      </div>
    </div>
  );
}
















// "use client";

// import { useEffect, useState, useCallback } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Spinner } from "./Spinner";
// import { useSession } from "next-auth/react";
// import "react-toastify/dist/ReactToastify.css";

// interface RazorpayPaymentResponse {
//   razorpay_order_id: string;
//   razorpay_payment_id: string;
//   razorpay_signature: string;
// }

// interface RazorpayOrderResponse {
//   orderId: string;
//   amount: number;
//   currency: string;
//   plan: string;
//   id: string; // booking ID
//   customer: string;
//   email: string;
//   contact: string;
// }

// interface RazorpayOptions {
//   key: string;
//   amount: number;
//   currency: string;
//   name: string;
//   description: string;
//   order_id: string;
//   handler: (response: any) => void;
//   prefill: {
//     name: string;
//     email: string;
//     contact: string;
//   };
//   notes: {
//     bookingId: string;
//   };
//   theme: {
//     color: string;
//   };
//   modal?: {
//     ondismiss: () => void;
//   };
// }

// declare global {
//   interface Window {
//     Razorpay: new (options: RazorpayOptions) => {
//       open: () => void;
//     };
//   }
// }

// export default function PaymentPage() {
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const bookingId = searchParams.get("bookingId");
//   const { data: authData, status } = useSession();

 

//   useEffect(() => {
//     if (status === "loading") return;
//     if (!authData) router.replace("/");
//   }, [authData, status, router]);


//   //  Razorpay Script
//   useEffect(() => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.async = true;
//     document.body.appendChild(script);
//     return () => {
//       document.body.removeChild(script);
//     };
//   }, []);

//   // Payment handler
//   const fetchOrder = useCallback(async () => {
//     if (!bookingId ) return;

//     try {
//       const { data } = await axios.post<RazorpayOrderResponse>(
//         `${process.env.NEXT_PUBLIC_Backend_URL}/payment/create`,
//         { bookingId },
//         {
//           withCredentials:true
//         }
//       );

//       const options: RazorpayOptions = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
//         amount: data.amount,
//         currency: data.currency,
//         name: "Viraj Multipurpose Hall",
//         description: `Booking Payment (${data.plan})`,
//         order_id: data.orderId,
//         prefill: {
//           name: data.customer,
//           email: data.email,
//           contact: data.contact,
//         },
//         notes: {
//           bookingId: data.id,
//         },
//         theme: {
//           color: "#ec6e24",
//         },
//         handler: async (response: RazorpayPaymentResponse) => {
//           try {
//             await axios.post(
//               `${process.env.NEXT_PUBLIC_Backend_URL}/payment/verify`,
//               {
//                 order_id: response.razorpay_order_id,
//                 payment_Id: response.razorpay_payment_id,
//                 signature: response.razorpay_signature,
//                 bookingId,
//               },
//               {
//                 withCredentials:true
//               }
//             );
//             toast.success("Payment successful!");
//             router.push("/");
//           } catch (err: any) {
//             if (err.response?.status === 429) {
//               toast.error('Too many requests. Please wait.');
//             } else {
//               toast.error("Payment verification failed.");
//               router.push("/");
//             }
//             toast.error("Payment verification failed.");
//             router.push("/");
//           }
//         },
//         modal: {
//           ondismiss: () => {
//             toast.info("Payment cancelled by user.");
//             router.push("/");
//           },
//         },
//       };

//       const razor = new window.Razorpay(options);
//       razor.open();
//     } catch (err: any) {
//       toast.error(err?.response?.data?.error || "Failed to create Razorpay order");
//       router.push("/");
//     } finally {
//       setLoading(false);
//     }
//   }, [bookingId]);

//   //  Trigger payment if bookingId + token exist
//   useEffect(() => {
//     if (bookingId ) fetchOrder();
//   }, [bookingId, fetchOrder]);

//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <div className="flex flex-col items-center space-y-4">
//         <Spinner />
//         <span className="text-gray-600 text-sm">
//           {loading ? "Loading payment gateway..." : "Redirecting..."}
//         </span>
//       </div>
//     </div>
//   );
// }
