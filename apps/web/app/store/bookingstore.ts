'use client';
import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { redirect } from 'next/navigation';
import { devtools } from 'zustand/middleware';
import { BookingRequest, BookingState, CheckQuery } from './types';


const isValidIndianName = (name: string) => /^[a-zA-Z\s]{1,30}$/.test(name);
const isPast = (date: string) => {
  const selected = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
};




export const useBookingStore = create<BookingState>()(
  devtools((set, get) => ({
    date: '',
    time: 'Morning',
    plan: 'BASIC',
    available: null,
    form: {
      customer: '',
      contact: '',
      guests: '',
      functionType: '',
      additionalInfo: '',
    },
    verifiedPhone: null,
    firebaseToken: null,
    checking: false,
    submitting: false,

    setDate: (v) => set({ date: v }),
    setTime: (v) => set({ time: v }),
    setPlan: (v) => set({ plan: v }),
    setForm: (v) => set((s) => ({ form: { ...s.form, ...v } })),
    setVerifiedPhone: (phone, token) =>
      set({ verifiedPhone: phone, firebaseToken: token }),

    
    resetForm: () =>
      set({
        available: null,
        form: {
          customer: '',
          contact: '',
          guests: '',
          functionType: '',
          additionalInfo: '',
        },
      }),




checkAvailability: async () => {

      const { date, time } = get();
      if (!date || !time) return toast.error('Please select all fields first');
      if (isPast(date)) return toast.error('You cannot select a past date');

      try {
        set({ checking: true });
        const res = await axios.get<CheckQuery>(
          `${process.env.NEXT_PUBLIC_Backend_URL}/booking/check`,
          { params: { date, time } }
        );

        set({ available: res.data.available });

        toast[res.data.available ? 'success' : 'error'](
          res.data.available ? 'Slot is available ✅' : 'Slot already booked ❌'
        );
        toast.info('Before payment, please read the disclaimer.');

      } catch (err: any) {
        if (err.response?.status === 429) {
          toast.error('Too many requests. Please wait.');
        } else {
          toast.error('Failed to check availability');
        }
      } finally {
        set({ checking: false });
      }
    },



    handleSubmit: async (auth) => {

      const { form, date, time, plan, verifiedPhone, firebaseToken } = get();

      if (!auth || !auth.user) {
        toast.error('You must be logged in to book.');
        redirect('/login');
        return;
      }

      // validation
      if (!verifiedPhone) return toast.error('Please verify your phone number first');
      if (!form.customer.trim()) return toast.error('Please enter customer name');
      if (!isValidIndianName(form.customer.trim()))
        return toast.error('Name should only contain letters (max 25)');

      const guestsCount = parseInt(form.guests);
      if (!guestsCount) return toast.error('Fill the guest field');
      if (guestsCount < 30) return toast.error('Minimum allowed guests is 30');
      if (guestsCount > 1000) return toast.error('Max allowed guests is 1000');
      if (!form.functionType) return toast.error('Fill the function field');
      if (isPast(date)) return toast.error('You cannot select a past date');

      try {
        set({ submitting: true });

        const res = await axios.post<BookingRequest>(
          `${process.env.NEXT_PUBLIC_Backend_URL}/booking/book`,
          {
            customer: form.customer,
            contact: verifiedPhone,
            guests: guestsCount,
            date,
            timeSlot: time,
            plan,
            functionType: form.functionType,
            additionalInfo: form.additionalInfo,
          },
          {
            withCredentials: true,
            headers: {
              'X-Firebase-Token': firebaseToken || '',
            },
          }
        );

        toast.success('Redirecting to payment...');
        
        setTimeout(() => {
          window.location.href = `/booking/payment?bookingId=${res.data.id}`;
        }, 500);

        get().resetForm();
      } catch (err: any) {
        if (err.response?.status === 429) {
          toast.error('Too many requests. Please wait.');
        } else {
          toast.error('Booking failed');
        }
      } finally {
        set({ submitting: false });
      }
    },
  }))
);
