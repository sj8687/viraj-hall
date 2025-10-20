'use client';
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Spinner } from './Spinner';
import { Disclaimer } from '@/components/Disclaminer';
import dynamic from 'next/dynamic';
import { useBookingStore } from '@/app/store/zustand';

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










