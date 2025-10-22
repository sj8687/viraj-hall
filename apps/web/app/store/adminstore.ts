import { create } from 'zustand';
import axios from 'axios';
import { toast } from 'react-toastify';
import { BugReport, Stats } from './types';


interface AdminStore {
    bugs: BugReport[];
    loading: boolean;
    setBugs: (bugs: BugReport[]) => void;
    setLoading: (loading: boolean) => void;
    fetchBugs: () => void;


    stats: Stats;
    fetchStats: () => void;
}


export const adminstore = create<AdminStore>((set) => ({
    bugs: [],
    loading: true,
    setBugs: (bugs) => set({ bugs }),
    setLoading: (loading) => set({ loading }),

    stats: {
        totalUsers: 0,
        totalBookings: 0,
        totalRevenue: 0,
        newUsers: 0,
        totalBugs: 0,
    },


    fetchBugs: async () => {
        set({ loading: true });

        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/bug/bug-report`, {
                withCredentials: true,
            });

            if (Array.isArray(res.data.bugs)) {
                set({ bugs: res.data.bugs });
            } else {
                throw new Error('Unexpected response format');
            }
        } catch (err: any) {
            toast.error(err.response?.data?.error || 'Failed to fetch bug reports');
        } finally {
            set({ loading: false });
        }
    },




    fetchStats: async () => {
        set({ loading: true });
        try {
            const res = await axios.get(`${process.env.NEXT_PUBLIC_Backend_URL}/allusers/allusers`, {
                withCredentials: true,
            });
            set({ stats: res.data });
            set({ loading: false });
        } catch (err) {
            console.error("Failed to fetch stats");
        }
    },
}));










