import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import Mentees from './mentees'
import Mentors from './mentors'

export default async function Dashboard() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login')
  }

  const mentorQuery = await supabase.from("Mentors").select().eq("user_id", user.id)
  const menteeQuery = await supabase.from("Mentees").select().eq("user_id", user.id)

  console.log(mentorQuery?.data?.length)
  console.log(menteeQuery?.data?.length)

  // User can only be mentor or mentee
  if (menteeQuery?.data?.length == 1) {
    return <Mentors />
  } else if (mentorQuery?.data?.length == 1) {
    return <Mentees />
  } else {
    return notFound()
  }
}
