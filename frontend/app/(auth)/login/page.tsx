"use client";

import { toast } from "react-toastify";
import { signIn } from "./actions";
import Link from "next/link";
import { useTransition } from "react";
import Image from "next/image";
import img from "./signin.jpg"; // Use a relevant image for Sign In (or the same one)

export default function Login() {
  const [isPending, startTransition] = useTransition();

  const handleSignIn = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await signIn(formData);
      } catch (e) {
        const error = e as Error;
        toast(error.message, { type: "error" });
      }
    });
  };

  return (
    <div className="h-screen w-screen flex justify-center items-center bg-blue-100">
      {/* Form Card */}
      <div className="flex flex-row bg-white shadow-md rounded-lg overflow-hidden w-[60%] h-[80%]">
        {/* Illustration Section */}
        <div className="w-1/2 flex items-center justify-center p-6 bg-gray-100">
          <Image
            src={img}
            alt="Sign In Illustration"
            width={400}
            height={400}
          />
        </div>

        {/* Form Section */}
        <div className="w-1/2 flex flex-col items-center justify-center p-10">
          <h1 className="text-3xl font-bold text-blue-600 mb-4">Sign In</h1>
          <form className="flex flex-col gap-4 w-full items-center">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              className="border border-solid border-gray-300 rounded-md w-72 h-12 p-2"
              required
            />
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              className="border border-solid border-gray-300 rounded-md w-72 h-12 p-2"
              required
            />
            <button
              formAction={handleSignIn}
              disabled={isPending}
              className="bg-blue-600 rounded-lg w-72 h-12 text-white text-lg mt-4"
            >
              {isPending ? "Loading" : "Sign In"}
            </button>
            <Link href="/signup">
              <button className="text-blue-600 mt-2">Sign Up</button>
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
}
