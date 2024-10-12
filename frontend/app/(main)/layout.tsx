import type { Metadata } from "next";
import "../globals.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "./actions";

export const metadata: Metadata = {
  title: "MentorShip - Dashboard",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return (
    <html lang="en">
      <body
        className={`antialiased`}
      >
        <nav className="w-screen fixed flex justify-between align-middle">
          <Link href="/dashboard" className="text-blue-600 font-medium text-2xl align-middle p-3">MentorShip</Link>
          <form action={signOut} className="p-3">
          <button type="submit" className="bg-blue-600 rounded-xl w-24 h-9 text-white">Sign Out</button>
          </form>
        </nav>
        {children}
      </body>
    </html>
  );
}
