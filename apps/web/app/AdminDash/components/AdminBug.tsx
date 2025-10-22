'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Spinner } from '../../booking/components/Spinner';
import { Bug, Calendar, User, Mail, Image as ImageIcon, X, Clock, AlertTriangle, FileText, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { adminstore } from '@/app/store/adminstore';



export default function AdminBugReports() {
  const { data: authData, status } = useSession();
  
  const { bugs, loading, fetchBugs } = adminstore();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;
    if (!authData || !authData.user?.role) {
      router.replace('/');
    }
  }, [authData, status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    fetchBugs(); 
  }, [status, fetchBugs]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen dark:text-white flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-gray-600 dark:text-gray-100 mt-4 text-lg">Loading bug reports...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-0">
      <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-100 rounded-lg">
              <Bug className="h-6 w-6 text-red-600" />
            </div>
            <h1 className="text-3xl dark:text-gray-100 font-bold text-gray-900">Bug Reports</h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage and review all submitted bug reports from users
          </p>
          <div className="mt-4 flex items-center gap-4 text-sm dark:text-gray-300 text-gray-500">
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-4 w-4" />
              Total Reports: {bugs.length}
            </span>
          </div>
        </div>

        {bugs.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] dark:bg-slate-700 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-4 bg-gray-100 rounded-full mb-4">
              <Bug className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold dark:text-gray-100 text-gray-900 mb-2">No Bug Reports Found</h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md">
              All clear! There are currently no bug reports to review.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {bugs.map((bug, index) => {
              const { date, time } = formatDate(bug.createdAt);

              return (
                <div
                  key={bug.id}
                  className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-300 hover:shadow-md transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="sm:p-6 p-3 pb-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 dark:bg-gray-200 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                          #{index + 1}
                        </span>
                      </div>
                      <div className="text-right text-xs dark:text-gray-300 text-gray-500">
                        <div className="flex items-center gap-1 mb-1">
                          <Calendar className="h-3 w-3" />
                          {date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {time}
                        </div>
                      </div>
                    </div>

                    <h2 className="text-lg font-semibold dark:text-gray-100 text-gray-900 mb-3 line-clamp-2">
                      "{bug.title}"
                    </h2>

                    <div className="flex items-center gap-4 mb-4 p-3 dark:bg-slate-700 border bg-gray-50 rounded-lg">
                      <div className="p-2 bg-white dark:bg-gray-300 rounded-full">
                        <User className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium dark:text-gray-200 text-gray-900 truncate">
                          {bug.userName}
                        </p>
                        <div className="flex dark:text-gray-300 items-center gap-1 text-xs text-gray-500">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{bug.userEmail}</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <FileText className="h-4 w-4 dark:text-gray-50 text-gray-500" />
                        <span className="text-sm font-medium dark:text-gray-50 text-gray-700">Description</span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                        {bug.description}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <ImageIcon className="h-4 w-4 text-gray-500" />
                        <span className="text-sm font-medium dark:text-gray-100 text-gray-700">Screenshot</span>
                      </div>
                      <div className="relative group">
                        <Image
                          width={500}
                          height={300}
                          src={bug.screenshot}
                          alt="Bug screenshot"
                          className="w-full h-48 object-cover rounded-lg"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
