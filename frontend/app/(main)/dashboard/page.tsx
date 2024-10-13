import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Mentees from './mentees'
import Mentors from './mentors'
import SuperAdmin from './superadmin'
import styles from './Dashboard.module.css'
import Image from 'next/image'
import { signOut } from '../actions'

export default async function Dashboard() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  if (user.email == "admin@admin.com") {
    return <SuperAdmin />
  }

  const mentorQuery = await supabase.from("Mentors").select().eq("user_id", user.id)
  const menteeQuery = await supabase.from("Mentees").select().eq("user_id", user.id)

  if (mentorQuery?.data?.length === 1) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="MentorShip Logo" width={100} height={50} />
          </div>
          <div className={styles.brand}>MentorShip</div>
          <div className={styles.welcome}>Welcome, {user.email}!</div>
          <button className={styles.signout} onClick={signOut}>Sign Out</button>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.cardContainer}>
            <Mentees />
          </div>
        </div>
      </div>
    )
  } else if (menteeQuery?.data?.length === 1) {
    return (
      <div className={styles.dashboard}>
        <div className={styles.sidebar}>
          <div className={styles.logoContainer}>
            <Image src="/logo.png" alt="MentorShip Logo" width={100} height={50} />
          </div>
          <div className={styles.brand}>MentorShip</div>
          <div className={styles.welcome}>Welcome, {user.email}!</div>
          <button className={styles.signout} onClick={signOut}>Sign Out</button>
        </div>
        <div className={styles.mainContent}>
          <div className={styles.cardContainer}>
            <Mentors />
          </div>
        </div>
      </div>
    )
  } else {
    return notFound()
  }
}
