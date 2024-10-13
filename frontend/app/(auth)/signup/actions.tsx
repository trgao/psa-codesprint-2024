"use server";

import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  if (
    (formData.get("password") as String) !=
    (formData.get("confirmPassword") as String)
  ) {
    throw new Error("Passwords are not the same");
  } else if ((formData.get("resume") as File).type != "application/pdf") {
    throw new Error("File is not in pdf format");
  } else {
    console.log(formData);
    const userType = formData.get("userType") as string;
    const userData = new FormData();
    userData.append("files", formData.get("resume") as File);
    userData.append("email", formData.get("email") as string);
    userData.append("password", formData.get("password") as string);
    userData.append(
      "job_description",
      formData.get("jobDescription") as string
    );
    userData.append("mbti", formData.get("mbti") as string);
    userData.append("location", formData.get("location") as string);
    // change to proper api backend
    if (userType == "Mentee") {
      return fetch("https://psa-codesprint-2024.onrender.com/upload/mentee", {
        method: "POST",
        body: userData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode == 200) {
            redirect("/login");
          } else {
            console.log(res);
            throw new Error(res.message);
          }
        });
    } else {
      userData.append("mentee_count", formData.get("menteeCount") as string);
      return fetch("https://psa-codesprint-2024.onrender.com/upload/mentor", {
        method: "POST",
        body: userData,
      })
        .then((res) => res.json())
        .then((res) => {
          if (res.statusCode == 200) {
            redirect("/login");
          } else {
            console.log(res);
            throw new Error(res.message);
          }
        });
    }
  }
}
