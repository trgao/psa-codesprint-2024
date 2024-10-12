"use client"

import { toast } from 'react-toastify';
import { signIn } from './actions'
import Link from 'next/link';
import { useTransition } from 'react';

export default function Login() {
  const [isPending, startTransition] = useTransition()

  const handleSignIn = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await signIn(formData)
      } catch (e) {
        const error = e as Error
        toast(error.message, { type: "error" })
      }
    })
  }

  return (
    <form className="h-screen w-screen flex flex-col gap-2 text-center justify-center align-middle items-center">
      <p className="font-medium text-5xl m-5 text-blue-600">MentorShip</p>
      <input
        id="email"
        name="email"
        placeholder="Email"
        className="border border-solid border-black rounded-md w-72 h-14 p-2"
        required
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password"
        className="border border-solid border-black rounded-md w-72 h-14 p-2"
        required
      />
      <button formAction={handleSignIn} disabled={isPending} className="bg-blue-600 rounded-xl w-72 h-14 text-white">
        {isPending ? "Loading" : "Sign In"}
      </button>
      <div className="bg-blue-600 rounded-xl w-72 h-14 text-white flex flex-col justify-center">
        <Link href="/signup">Sign Up</Link>
      </div>
    </form>
  )
}
