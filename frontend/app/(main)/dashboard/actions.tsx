"use server"

export async function startMatching() {
  fetch("http://localhost:8000/matching", {
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
