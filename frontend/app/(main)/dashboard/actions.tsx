"use server"

export async function startMatching() {
  fetch("https://psa-codesprint-2024.onrender.com/matching", {
      method: "POST",
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.statusCode == 200) {
          
        } else {
          console.log(res)
          
        }
      })
}
