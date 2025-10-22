import type { Session } from 'next-auth';

// booking & checking types
export type PlanType = 'BASIC' | 'PREMIUM';

export interface CheckQuery {
  date: string;
  time: string;
  available: boolean;
}

export interface BookingRequest {
  customer: string;
  contact: string;
  guests: number;
  date: string;
  timeSlot: string;
  email?: string;
  plan: PlanType;
  id: string;
  functionType?: string;
  additionalInfo?: string;
}

export interface BookingFormInput {
  customer: string;
  contact: string;
  guests: string;
  functionType?: string;
  additionalInfo?: string;
}

export interface BookingState {
  date: string;
  time: string;
  plan: PlanType;
  available: boolean | null;
  form: BookingFormInput;
  verifiedPhone: string | null;
  firebaseToken: string | null;


  checking: boolean;
  submitting: boolean;

  setDate: (v: string) => void;
  setTime: (v: string) => void;
  setPlan: (v: PlanType) => void;
  setForm: (v: Partial<BookingFormInput>) => void;
  setVerifiedPhone: (phone: string, token: string) => void;

  checkAvailability: () => Promise<void>;
  handleSubmit: (auth: Session | null) => Promise<void>;

  resetForm: () => void;
}






// show booking data types
export interface Booking {
    id: string;
    date: string;
    customer: string;
    guests: number;
    plan: 'BASIC' | 'PREMIUM';
    status: 'pending' | 'CONFIRMED';
    functionType: string;
}

export interface BookingState {
    bookings: Booking[];
    loading: boolean;
    fetchBookings: () => Promise<void>
}






// payment route types
export interface RazorpayPaymentResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: string;
  plan: string;
  id: string; // booking ID
  customer: string;
  email: string;
  contact: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: any) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  notes: {
    bookingId: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss: () => void;
  };
}






// types of fetch bugs(admin)
export interface BugReport {
  id: string;
  title: string;
  description: string;
  screenshot: string;
  userEmail: string;
  userName: string;
  createdAt: string;
}





//types of userdata
export interface Stats {
    totalUsers: number;
    totalBookings: number;
    totalRevenue: number;
    newUsers: number;
    totalBugs: number;
}
