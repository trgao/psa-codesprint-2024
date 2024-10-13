"use client"

import Link from 'next/link'
import { signUp } from './actions'
import { toast } from 'react-toastify'
import { useState, useTransition } from 'react'
import Image from 'next/image'
import img from './signup.jpg';

export default function SignUp() {
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = useState("Mentee")

  const changeValue = (e) => {
    setValue(e.target.value)
  }

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
    <div className="h-full w-full p-10 bg-gray-50">
      <div className=" flex justify-center items-center">
        {/* Form Card */}
        <div className="flex flex-row bg-white shadow-md rounded-lg overflow-hidden w-[60%]">
          {/* Form Section */}
          <div className="w-1/2 p-10">
            <h1 className="text-3xl font-bold text-blue-600 mb-4">Sign up</h1>
            <form className="flex flex-col gap-4">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                required
              />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Password*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                required
              />
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                required
              />
              <div className="flex justify-between w-full">
                <div>
                  <input type="radio" name="userType" id="Mentee" value="Mentee" defaultChecked onChange={changeValue} />
                  <label htmlFor="Mentee" className="ml-2"> Mentee</label>
                </div>
                <div>
                  <input type="radio" name="userType" id="Mentor" value="Mentor" onChange={changeValue} />
                  <label htmlFor="Mentor" className="ml-2"> Mentor</label>
                </div>
              </div>
              <input
                id="menteeCount"
                name="menteeCount"
                placeholder="Mentee Count*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                hidden={value == "Mentee"}
              />
              <textarea
                id="jobDescription"
                name="jobDescription"
                placeholder="Job Description*"
                className="border border-solid border-gray-300 rounded-md w-full h-24 p-2"
                required
              />
              <input
                id="mbti"
                name="mbti"
                placeholder="MBTI*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                required
              />
              <input
                id="location"
                name="location"
                placeholder="Location*"
                className="border border-solid border-gray-300 rounded-md w-full h-12 p-2"
                required
              />
              <input
                type="file"
                accept="application/pdf"
                name="resume"
                className="text-sm file:rounded-full
                file:py-2 file:px-6 file:border-0
                file:font-medium file:bg-blue-600 file:text-white
                file:shadow-md file:transition-all
                hover:file:cursor-pointer hover:file:bg-blue-700
                hover:file:shadow-lg file:duration-300 file:mr-5"
                required
              />
              {/* Buttons */}
              <button
                formAction={handleSubmit}
                disabled={isPending}
                className="bg-blue-600 rounded-lg w-full h-12 text-white text-lg mt-4"
              >
                {isPending ? "Loading" : "Sign Up"}
              </button>
              <Link href="/login">
                <button className="text-blue-600 mt-2">I am already a member</button>
              </Link>
            </form>
          </div>

          {/* Illustration Section */}
          <div className="w-1/2 flex items-center justify-center p-6">
            <Image src={img} alt="Sign Up Illustration" width={400} height={400} />
          </div>
        </div>
      </div>
    </div>
  )
}

