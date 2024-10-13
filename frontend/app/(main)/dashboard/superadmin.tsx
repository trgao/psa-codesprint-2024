"use client"

import { startMatching } from './actions'

export default async function SuperAdmin() {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <form><button formAction={startMatching} className="bg-blue-600 rounded-xl w-96 h-40 text-white text-4xl">Start Matching</button></form>
    </div>
  )
}
