import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { auth, signIn } from "@/auth";
import { LoginForm } from "@/components/LoginForm";
import { redirect } from "next/navigation";
import { CiLock } from "react-icons/ci";

export default async function Page() {
  let session = await auth();
  if (session?.user) return redirect("/");

  return (
    <div className="flex justify-center items-center w-full h-dvh">
      <Card className="w-[90%] md:w-[50%] lg:w-[28%]">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
        <CardFooter className="flex flex-col">
          <form
            className="flex flex-col gap-4"
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Link
              href={"/forgot"}
              className="flex justify-center items-center gap-2"
            >
              Forgot Password
              <p>
                <CiLock className="text-red-500 text-2xl hover:text-green-400" />
              </p>
            </Link>
            <p className="text-center">OR</p>
            <Button type="submit" variant={"outline"}>
              <FcGoogle />
              Login With Google
            </Button>
          </form>
          <Link
            className="text-sm flex gap-2 mt-2 hover:text-green-600"
            href={"/signup"}
          >
            <p className="text-black dark:text-white">Don't have an account?</p>
            Signup
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}