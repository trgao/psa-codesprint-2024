import type { Metadata } from "next";
import "../globals.css";
import 'react-toastify/dist/ReactToastify.css';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Slide, ToastContainer } from "react-toastify";

export const metadata: Metadata = {
  title: "MentorShip - Login",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        {children}
        <ToastContainer
          position="bottom-right"
          autoClose={2500}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss={false}
          draggable={false}
          pauseOnHover={false}
          theme="light"
          transition={Slide}
        />
      </body>
    </html>
  );
}
