"use server"

import { redirect } from 'next/navigation'

export async function signUp(formData: FormData) {
  // post to backend but no backend yet so
  if ((formData.get("password") as String) != (formData.get("confirmPassword")as String)) {
    throw new Error("Passwords are not the same")
  } else if ((formData.get("resume") as File).type != "application/pdf") {
    throw new Error("File is not in pdf format")
  } else {
    console.log(formData)
    const userType = formData.get("userType") as string
    const userData = new FormData()
    userData.append("files", formData.get("resume") as File)
    userData.append("name", formData.get("name") as string)
    userData.append("email", formData.get("email") as string)
    userData.append("password", formData.get("password") as string)
    userData.append("job_description", formData.get("jobDescription") as string)
    userData.append("mbti", formData.get("mbti") as string)
    userData.append("location", formData.get("location") as string)
    // change to proper api backend
    if (userType == "Mentee") {
      return fetch("http://localhost:8000/upload/mentee", {
        method: "POST",
        body: userData
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode == 200) {
            redirect('/login')
          } else {
            console.log(res)
            throw new Error(res.message)
          }
        })
    } else {
      return fetch("http://localhost:8000/upload/mentor", {
        method: "POST",
        body: userData
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode == 200) {
            redirect('/login')
          } else {
            console.log(res)
            throw new Error(res.message)
          }
        })
    }
  }
}
