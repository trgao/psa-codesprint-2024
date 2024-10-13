import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Mentees from './mentees'
import Mentors from './mentors'
import SuperAdmin from './superadmin'
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
    return <Mentees />
  } else if (menteeQuery?.data?.length === 1) {
    return <Mentors />
  } else {
    return notFound()
  }
}
