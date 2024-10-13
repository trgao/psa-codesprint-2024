"use client"

import { toast } from 'react-toastify';
import { startMatching } from './actions'
import { useTransition } from 'react'

export default function SuperAdmin() {
  const [isPending, startTransition] = useTransition()

  const handleSubmit = async () => {
    startTransition(async () => {
      try {
        await startMatching();
      } catch (e) {
        const error = e as Error;
        toast(error.message, { type: "error" });
        return;
      }
      toast("Matched successfully", { type: "success" });
    });
  };

  return (
    <div className="flex justify-center items-center h-full w-full">
      <form action={handleSubmit}><button type="submit" className="bg-blue-600 rounded-xl w-96 h-40 text-white text-4xl">{isPending ? "Loading" : "Start Matching"}</button></form>
    </div>
  )
}
