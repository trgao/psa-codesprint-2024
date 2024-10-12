"use server"

import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function signUp(formData: FormData) {
  // post to backend but no backend yet so
  if ((formData.get("password") as String) != (formData.get("confirmPassword")as String)) {
    throw new Error("Passwords are not the same")
  } else if ((formData.get("resume") as File).type != "application/pdf") {
    throw new Error("File is not in pdf format")
  } else {
    console.log(formData)
  }
  // const supabase = createClient()

  // const data = {
  //   email: formData.get('email') as string,
  //   password: formData.get('password') as string,
  // }

  // const { error } = await supabase.auth.signUp(data)

  // if (error) {
  //   console.log(error)
  // }

  // redirect('/dashboard')
}
