import type { Metadata } from "next";
import "../globals.css";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import styles from './Dashboard.module.css'
import { signOut } from "./actions";
import Image from "next/image";

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
        <div className={styles.dashboard}>
          <div className={styles.sidebar}>
            <div className={styles.logoContainer}>
              <Image src="/logo.png" alt="MentorShip Logo" width={100} height={50} />
            </div>
            <div className={styles.brand}>MentorShip</div>
            <div className={styles.welcome}>Welcome, {user.email}!</div>
            <form action={signOut}><button className={styles.signout} type="submit">Sign Out</button></form>
          </div>
          <div className={styles.mainContent}>
            <div className={styles.cardContainer}>
              {children}
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
