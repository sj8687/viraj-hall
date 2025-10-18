"use server";
import { signIn } from "@/auth";
import { CredentialsSignin } from "next-auth";

export const loginHandler = async (email: string, password: string) => {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: true,
      redirectTo: "/",
    });

    if (result) return result;
  } catch (error) {
    const err = error as CredentialsSignin;
    if (JSON.stringify(err.cause) == undefined) {
      return;
    } else if (JSON.stringify(err?.cause).includes("....")) {
      return JSON.stringify(err?.cause);
    } else if (JSON.stringify(err?.cause).includes("invalid credential")) {
      return JSON.stringify(err?.cause);
    } else if (
      JSON.stringify(err?.cause).includes("both required email and password")
    ) {
      return JSON.stringify(err?.cause);
    } else {
      return JSON.stringify("somthing wrong");
    }
  }
};