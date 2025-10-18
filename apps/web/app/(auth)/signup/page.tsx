"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { signIn, useSession } from "next-auth/react"; // ✅ correct import here
import { useEffect, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { data: authData, status } = useSession();

     useEffect(() => {
          if (status === "loading") return; 
      
          if (authData?.user) {
            router.replace("/");
          }
        }, [authData, status, router]);


        
  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    const form = new FormData(e.currentTarget);
    const name = form.get("name") as string;
    const email = form.get("email") as string;
    const password = form.get("password") as string;

    if (!name || !email || !password) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_Backend_URL}/add/signupuser`,
        {
          name,
          email,
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(res.data.message || "Signup successful");
      router.push("/login");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Signup failed ";

         if (err.response?.status === 429) {
              toast.error('Too many requests. Please wait.');
            } else {
      toast.error(message);
            }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    toast.info("Redirecting to Google for signup...");
    await signIn("google");
  };

  return (
    <div className="flex justify-center items-center w-full h-[80vh]">
      <Card className="w-[90%] md:w-[50%] lg:w-[28%]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">SignUp</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            <Input placeholder="Name" name="name" required />
            <Input placeholder="Email" name="email" type="email" required />
            <Input
              placeholder="Password"
              name="password"
              type="password"
              required
            />
            <Button type="submit" disabled={loading}>
              {loading ? "Signing up..." : "SignUp"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col">
          <div className="w-full mt-3">
            <p className="text-center">OR</p>
            <Button
              type="button"
              variant="outline"
              className="w-[100%] mt-2 flex items-center justify-center gap-2"
              onClick={handleGoogleSignup}
            >
              <FcGoogle className="text-xl" />
              Sign up with Google
            </Button>
          </div>

          <p className="text-sm mt-3 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
