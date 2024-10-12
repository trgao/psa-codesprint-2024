"use client"

import Link from 'next/link'
import { signUp } from './actions'
import { toast } from 'react-toastify';
import { useTransition } from 'react';

export default function SignUp() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        await signUp(formData)
      } catch (e) {
        const error = e as Error
        toast(error.message, { type: "error" })
        return
      }
      toast("Signed up successfully", { type: "success" })
    })
  }

  return (
    <form className="h-screen w-screen flex flex-col gap-2 text-center justify-center align-middle items-center">
      <input
        type="file"
        accept="application/pdf"
        name="resume"
        className="text-sm text-stone-500 file:rounded-md
        file:mr-5 file:py-1 file:px-3 file:border-[1px]
        file:text-xs file:font-medium
        file:bg-blue-600 file:text-white
        hover:file:cursor-pointer hover:file:bg-white
        hover:file:text-blue-600"
        required
      />
      <input
        id="email"
        name="email"
        type="email"
        placeholder="Email*"
        className="border border-solid border-black rounded-md w-72 h-14 p-2"
        required
      />
      <input
        id="password"
        name="password"
        type="password"
        placeholder="Password*"
        className="border border-solid border-black rounded-md w-72 h-14 p-2"
        required
      />
      <input
        id="confirmPassword"
        name="confirmPassword"
        type="password"
        placeholder="Confirm Password*"
        className="border border-solid border-black rounded-md w-72 h-14 p-2"
        required
      />
      <button formAction={handleSubmit} className="bg-blue-600 rounded-xl w-72 h-14 text-white">
        {isPending ? "Loading" : "Sign Up"}
      </button>
      <div className="bg-blue-600 rounded-xl w-72 h-14 text-white flex flex-col justify-center">
        <Link href="/login">Back to login</Link>
      </div>
    </form>
  )
}
