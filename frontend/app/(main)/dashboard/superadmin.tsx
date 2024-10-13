"use client"

import { startMatching } from './actions'

export default function SuperAdmin() {
  return (
    <div className="flex justify-center items-center h-full w-full">
      <form><button formAction={startMatching} className="bg-blue-600 rounded-xl w-96 h-40 text-white text-4xl">Start Matching</button></form>
    </div>
  )
}
