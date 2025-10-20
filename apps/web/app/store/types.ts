// import type { Session } from 'next-auth';


// export type PlanType = 'BASIC' | 'PREMIUM';

// export interface CheckQuery {
//   date: string;
//   time: string;
//   available: boolean;
// }

// export interface BookingRequest {
//   customer: string;
//   contact: string;
//   guests: number;
//   date: string;
//   timeSlot: string;
//   email?: string;
//   plan: PlanType;
//   id: string;
//   functionType?: string;
//   additionalInfo?: string;
// }

// export interface BookingFormInput {
//   customer: string;
//   contact: string;
//   guests: string;
//   functionType?: string;
//   additionalInfo?: string;
// }

// export interface BookingState {
//   // form & booking data
//   date: string;
//   time: string;
//   plan: PlanType;
//   available: boolean | null;
//   form: BookingFormInput;
//   verifiedPhone: string | null;
//   firebaseToken: string | null;

//   // loading & error state
//   checking: boolean;
//   submitting: boolean;

//   // actions
//   setDate: (v: string) => void;
//   setTime: (v: string) => void;
//   setPlan: (v: PlanType) => void;
//   setForm: (v: Partial<BookingFormInput>) => void;
//   setVerifiedPhone: (phone: string, token: string) => void;

//   // methods
//   checkAvailability: () => Promise<void>;
//   handleSubmit: (auth: Session | null) => Promise<void>;

//   // utils
//   resetForm: () => void;
// }
