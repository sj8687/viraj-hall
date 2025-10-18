'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FiUpload } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { Spinner } from '@/app/booking/components/Spinner';

export default function BugReport() {
  const { data: authData, status } = useSession();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
 

  


  useEffect(() => {
    if (status === 'loading') return;
    if (!authData || !authData.user) {
      router.push('/login');
    }
  }, [authData, status, router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image');
      return;
    }

    if (file.size > 1024 * 1024) {
      toast.error('Image must be less than 1MB');
      return;
    }

    setScreenshot(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (title.length < 5) return toast.error('Title must be at least 5 characters');
    if (description.length < 10) return toast.error('Description must be at least 10 characters');
    if (title.length > 50) return toast.error('Title must not exceed 50 characters');
    if (description.length > 500) return toast.error('Description must not exceed 500 characters');
    if (!title.trim() || !description.trim() || !screenshot) {
      return toast.error('All fields and screenshot are required');
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('screenshot', screenshot);
    formData.append('userEmail', authData?.user?.email || '');
    formData.append('userName', authData?.user?.name || '');

    setIsSubmitting(true); 
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_Backend_URL}/bug/bug-report`, formData, {
        withCredentials:true
       
      });

      toast.success('Bug reported!');
      setTitle('');
      setDescription('');
      setScreenshot(null);
      setPreview(null);
    } catch (err:any) {
      if (err.response?.status === 429) {
        toast.error('Too many requests. Please wait.');
        
      }else{
      toast.error('Failed to submit a bug report');

      }
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-6 text-gray-800">
      <div className="text-2xl font-semibold text-gray-800">🐞 Bug Report Form</div>

      <div>
        <label className="block mb-1 font-medium">Bug Title (max 50 characters)</label>
        <input
          type="text"
          placeholder="e.g. Submit button not working"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-sm text-gray-500 mt-1">{title.length} /50 characters</p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Description (max 500 characters)</label>
        <textarea
          placeholder="Describe the issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={5}
          className="w-full border border-gray-300 px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-sm text-gray-500 mt-1">{description.length} / 500 characters</p>
      </div>

      <div>
        <label className="block mb-1 font-medium">Screenshot</label>
        <label className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md py-6 cursor-pointer hover:bg-gray-50 transition">
          <FiUpload className="text-xl mr-2 text-orange-600" />
          <span className="text-gray-600">Click to upload screenshot</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />
        </label>

        {preview && (
          <img
            src={preview}
            alt="Screenshot preview"
            className="mt-4 rounded-md max-h-64 border shadow-md"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-md font-semibold shadow transition flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Spinner  /> Sending...
          </>
        ) : (
          'Submit Report'
        )}
      </button>
    </form>
  );
}
