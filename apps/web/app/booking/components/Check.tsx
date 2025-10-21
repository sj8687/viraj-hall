'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from './Spinner';
import { Disclaimer } from '@/components/Disclaminer';
import dynamic from 'next/dynamic';
import { useBookingStore } from '@/app/store/bookingstore';

const PhoneOtp = dynamic(() => import('./Phone'), { ssr: false, loading: () => <Spinner /> });

export default function CheckAvailability() {
  const {
    date, time, plan, available, form, checking, submitting,
    setDate, setTime, setPlan, setForm, checkAvailability,
    handleSubmit, setVerifiedPhone,
  } = useBookingStore();

  const router = useRouter();
  const { data: authData, status } = useSession();

  useEffect(() => {
    if (status !== 'loading' && (!authData || !authData.user)) router.push('/login');
  }, [authData, status, router]);

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="max-w-[1250px] mx-auto p-6 mt-20">
          <h1 className="sm:text-4xl text-3xl font-bold mb-10 text-center">
            Viraj <span className="text-orange-600">Multipurpose</span> Hall Booking
          </h1>

          <div className="bg-white p-4 border rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4 text-orange-700">Check Availability</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label>Date</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full p-[5px] border rounded" />
              </div>

              <div>
                <label>Time Slot</label>
                <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full p-[5px] border rounded">
                  <option>Morning</option>
                  <option>Afternoon</option>
                  <option>Evening</option>
                </select>
              </div>

              <div>
                <label>Plan</label>
                <select value={plan} onChange={(e) => setPlan(e.target.value as any)} className="w-full p-[5px] border rounded">
                  <option value="BASIC">Basic - ₹70,000</option>
                  <option value="PREMIUM">Premium - ₹1,50,000</option>
                </select>
              </div>

              {available !== true && (
                <div className="sm:col-span-2 flex justify-center">
                  <button
                    onClick={checkAvailability}
                    disabled={checking}
                    className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded ${checking ? 'opacity-70' : ''}`}
                  >
                    {checking ? <Spinner /> : 'Check Availability'}
                  </button>
                </div>
              )}
            </div>

            {available && (
              <>
                <h3 className="text-xl font-semibold mt-8 mb-4 text-orange-700">Booking Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label>Customer Name</label>
                    <input
                      type="text"
                      value={form.customer}
                      onChange={(e) => setForm({ customer: e.target.value })}
                      className="w-full p-[5px] border rounded"
                    />
                  </div>

                  <div>
                    <label>Phone</label>
                    <PhoneOtp onVerified={(phone, token) => setVerifiedPhone(phone, token)} />
                  </div>

                  <div>
                    <label>No. of Guests</label>
                    <input
                      type="number"
                      value={form.guests}
                      onChange={(e) => setForm({ guests: e.target.value })}
                      className="w-full p-[5px] border rounded"
                    />
                  </div>

                  <div>
                    <label>Function Type</label>
                    <select
                      value={form.functionType || ''}
                      onChange={(e) => setForm({ functionType: e.target.value })}
                      className="w-full p-[5px] border rounded"
                    >
                      <option value="">Select Function Type</option>
                      <option value="Wedding">Wedding</option>
                      <option value="Birthday">Birthday</option>
                      <option value="Pre-Wedding">Pre-Wedding</option>
                      <option value="Anniverssary">Anniverssary</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label>Additional Info</label>
                    <textarea
                      value={form.additionalInfo || ''}
                      onChange={(e) => setForm({ additionalInfo: e.target.value })}
                      maxLength={200}
                      className="w-full p-[5px] border rounded min-h-[80px]"
                    />
                  </div>

                  <div className="sm:col-span-2 flex justify-center mt-2">
                    <button
                      onClick={() => handleSubmit(authData)}
                      disabled={submitting}
                      className={`bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded ${submitting ? 'opacity-70' : ''}`}
                    >
                      {submitting ? <Spinner /> : 'Confirm Booking'}
                    </button>
                  </div>
                </div>

                <Disclaimer />
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}


































// 'use client';

// import { useCallback, useEffect, useMemo, useState } from 'react';
// import axios from 'axios';
// import { toast } from 'react-toastify';
// import { useRouter } from 'next/navigation';
// import { Spinner } from './Spinner';
// import { Disclaimer } from '@/components/Disclaminer';
// import { useSession } from 'next-auth/react';
// import dynamic from 'next/dynamic';

// const PhoneOtp = dynamic(() => import('./Phone'), {
//   ssr: false,
//   loading: () => <Spinner />,
// });

// // Types
// type PlanType = 'BASIC' | 'PREMIUM';

// interface CheckQuery {
//   date: string;
//   time: string;
//   available: boolean;
// }

// interface BookingRequest {
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

// interface BookingFormInput {
//   customer: string;
//   contact: string;
//   guests: string;
//   functionType?: string;
//   additionalInfo?: string;
// }

// // Utils
// const isValidIndianName = (name: string) => /^[a-zA-Z\s]{1,30}$/.test(name);
// const isPast = (date: string): boolean => {
//   const selected = new Date(date);
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);
//   return selected < today;
// };

// export default function CheckAvailability() {
//   const [date, setDate] = useState('');
//   const [time, setTime] = useState('Morning');
//   const [plan, setPlan] = useState<PlanType>('BASIC');
//   const [available, setAvailable] = useState<boolean | null>(null);
//   const [form, setForm] = useState<BookingFormInput>({ customer: '', contact: '', guests: '', functionType: '', additionalInfo: '' });
//   const [checking, setChecking] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [verifiedPhone, setVerifiedPhone] = useState<string | null>(null);
//   const [firebaseToken, setFirebaseToken] = useState<string | null>(null);

//   const router = useRouter();
//   const { data: authData, status } = useSession();




//   useEffect(() => {
//     if (status === "loading") return;

//     if (!authData || !authData.user) {
//       router.push("/login");
//     }
//   }, [authData, status, router]);

//   const checkAvailability = useCallback(async () => {
//     if (!date || !time) return toast.error('Please select all fields first');
//     if (isPast(date)) return toast.error('You cannot select a past date');


//     try {
//       setChecking(true);
//       const res = await axios.get<CheckQuery>(
//         `${process.env.NEXT_PUBLIC_Backend_URL}/booking/check`,
//         {
//           params: { date, time },
//         }
//       );
//       setAvailable(res.data.available);
//       toast[res.data.available ? 'success' : 'error'](
//         res.data.available ? 'Slot is available ✅' : 'Slot already booked ❌'
//       );
//       toast.info('before payment read a disclamier first...');

//     } catch (err: any) {
//       if (err.response?.status === 429) {
//         toast.error('Too many requests. Please wait.');
//       } else {
//         toast.error('Failed to check availability');
//       }
//     } finally {
//       setChecking(false);
//     }
//   }, [date, time]);

//   const validateForm = (): boolean => {
//     if (!verifiedPhone) return toast.error('Please verify your phone number first'), false;
//     if (!form.customer.trim()) return toast.error('Please enter customer name'), false;
//     if (!isValidIndianName(form.customer.trim())) return toast.error('Name should only contain letters (max 25)'), false;

//     const guestsCount = parseInt(form.guests);
//     if (!guestsCount) return toast.error('Fill the guest field'), false;
//     if (guestsCount < 30) return toast.error('Minimum allowed guests is 30'), false; // <-- added condition
//     if (guestsCount > 1000) return toast.error('Max allowed guests is 1000'), false;
//     if (!form.functionType) return toast.error('Fill the function field'), false;
//     if (isPast(date)) return toast.error('You cannot select a past date'), false;

//     return true;
//   };

//   const handleSubmit = useCallback(async () => {
//     if (!validateForm()) return;

//     try {
//       setSubmitting(true);
//       const res = await axios.post<BookingRequest>(`${process.env.NEXT_PUBLIC_Backend_URL}/booking/book`,
//         {
//           customer: form.customer,
//           contact: verifiedPhone,
//           guests: parseInt(form.guests),
//           date,
//           timeSlot: time,
//           plan,
//           functionType: form.functionType,
//           additionalInfo: form.additionalInfo
//         },
//         {
//           withCredentials: true,
//           headers: {
//             "X-Firebase-Token": firebaseToken
//           }

//         }
//       );

//       toast.success('Redirecting to payment...');

//       setTimeout(() => {
//         router.push(`/booking/payment?bookingId=${res.data.id}`);
//       }, 500);

//       setForm({ customer: '', contact: '', guests: '', functionType: '', additionalInfo: '' });
//       setAvailable(null);
//     } catch (err: any) {
//       if (err.response?.status === 429) {
//         toast.error('Too many requests. Please wait.');
//       } else {
//         toast.error('Booking failed');
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   }, [form, date, verifiedPhone, time, plan]);

//   return (

//     <div className="min-h-screen flex flex-col">
//       <main className="flex-grow">
//         <div className="max-w-[1250px] mx-auto p-6 mt-20">
//           <h1 className="sm:text-4xl text-3xl font-bold mb-10 text-center">
//             Viraj <span className='text-orange-600'>Multipurpose</span> Hall Booking
//           </h1>

//           <div className="bg-white h-auto p-4 overflow-hidden border rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4 text-orange-700">Check Availability</h2>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <div>
//                 <label className="block mb-1 font-medium">Date</label>
//                 <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-[5px] border rounded" />
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Time Slot</label>
//                 <select value={time} onChange={e => setTime(e.target.value)} className="w-full p-[5px] border rounded">
//                   <option>Morning</option>
//                   <option>Afternoon</option>
//                   <option>Evening</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block mb-1 font-medium">Select Plan</label>
//                 <select value={plan} onChange={e => setPlan(e.target.value as PlanType)} className="w-full p-[5px] border rounded">
//                   <option value="BASIC">Basic - ₹70,000</option>
//                   <option value="PREMIUM">Premium - ₹1,50,000</option>
//                 </select>
//               </div>

//               {available !== true && (
//                 <div className="sm:col-span-2 flex justify-center">
//                   <button
//                     onClick={checkAvailability}
//                     disabled={checking || !date || !time}
//                     className={`flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded transition ${checking ? 'opacity-70 cursor-not-allowed' : ''}`}
//                   >
//                     {checking ? <Spinner /> : 'Check Availability'}
//                   </button>
//                 </div>
//               )}
//             </div>

//             <div className={`transition-all duration-500 overflow-hidden ${available ? 'max-h-[1000px]' : 'max-h-0'}`}>
//               {available && (
//                 <>
//                   <h3 className="text-xl font-semibold mt-8 mb-4 text-orange-700">Booking Details</h3>

//                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//                     <div>
//                       <label className="block mb-1 font-medium">Customer Name</label>
//                       <input
//                         type="text"
//                         placeholder="Enter full name"
//                         value={form.customer}
//                         maxLength={25}
//                         onChange={(e) => {
//                           const inputValue = e.target.value.replace(/[^a-zA-Z\s]/g, "");
//                           if (inputValue.length <= 25) setForm({ ...form, customer: inputValue });
//                         }}
//                         className="w-full p-[5px] border rounded"
//                       />
//                     </div>


//                     {/* phn compo */}
//                     <div>
//                       <label className="block mb-1 font-medium">Phone Number</label>
//                       <PhoneOtp onVerified={(phone, token) => {
//                         setVerifiedPhone(phone);
//                         setFirebaseToken(token); // ✅ save token
//                       }} />
//                     </div>

//                     <div>
//                       <label className="block mb-1 font-medium">No. of Guests</label>
//                       <input
//                         type="number"
//                         placeholder="Max 750"
//                         value={form.guests}
//                         onChange={(e) => setForm({ ...form, guests: e.target.value })}
//                         className="w-full p-[5px] border rounded"
//                       />
//                     </div>

//                     <div>
//                       <label className="block mb-1 font-medium">Function Type</label>
//                       <select
//                         value={form.functionType || ''}
//                         onChange={(e) => setForm({ ...form, functionType: e.target.value })}
//                         className="w-full p-[5px] border rounded"
//                       >
//                         <option value="">Select Function Type</option>
//                         <option value="Wedding">Wedding</option>
//                         <option value="Birthday">Birthday</option>
//                         <option value="Pre-Wedding">Pre-Wedding</option>
//                         <option value="Anniverssary">Anniverssary</option>
//                         <option value="other">Other</option>
//                       </select>
//                     </div>

//                     <div className="sm:col-span-2">
//                       <label className="block mb-1 font-medium">Additional Info / Requirements</label>
//                       <textarea
//                         placeholder="Mention any extra requirements here..."
//                         value={form.additionalInfo || ''}
//                         onChange={(e) => {
//                           if (e.target.value.length <= 200) {
//                             setForm({ ...form, additionalInfo: e.target.value });
//                           }
//                         }}
//                         maxLength={200}
//                         className="w-full p-[5px] border rounded min-h-[80px]"
//                       />
//                       <div className="text-right text-sm text-gray-500">{form.additionalInfo?.length || 0}/200</div>
//                     </div>


//                     <div className="sm:col-span-2 flex justify-center mt-2">
//                       <button
//                         onClick={handleSubmit}
//                         disabled={submitting}
//                         className={`flex items-center justify-center px-6 py-2 rounded text-white transition bg-orange-500 hover:bg-orange-600 ${submitting ? 'opacity-70 cursor-not-allowed' : ''}`}
//                       >
//                         {submitting ? <Spinner /> : 'Confirm Booking'}
//                       </button>
//                     </div>

//                   </div>



//                 </>
//               )}
//             </div>

//           </div>

//           <div className="mt-12 text-center text-gray-600">
//             <p className="italic">
//               “We believe every celebration deserves a grand venue. Let us be a part of your special day.”
//             </p>
//           </div>
//           {available && (
//             <Disclaimer />
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }






























