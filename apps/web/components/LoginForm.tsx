"use client";

import { loginHandler } from "@/app/actions/login";
import { toast } from "react-toastify";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  return (
    <form
      action={async (formData): Promise<any> => {
        const toastId = toast.loading("Please wait...");
        try {
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          if (!email) toast.error("provide email");
          if (!password) toast.error("provide password");
          const result = await loginHandler(email, password);
          if (result === undefined) {
            toast.dismiss(toastId);
            toast.success("login successfull");
            router.refresh();
          } else {
            toast.dismiss(toastId);
            toast.error(result?.toString());
          }
        } catch (error) {
          toast.dismiss(toastId);
          console.log(error);
        }
      }}
      className="flex flex-col gap-4"
    >
      <Input placeholder="Email" name="email" />
      <Input placeholder="password" name="password" type="password" />
      <Button type="submit">Login</Button>
    </form>
  );
}