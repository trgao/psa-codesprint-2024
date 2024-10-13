import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import MenteeCard from './menteeCard'

export default async function Mentees() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profileQuery = (await supabase
    .from("Mentors")
    .select()
    .eq("user_id", user.id)).data
  
  console.log(profileQuery)
  if (profileQuery == null || profileQuery.length == 0) {
    return notFound()
  }

  const profile = profileQuery[0]

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {profile.mentees.map((id: number) => <MenteeCard id={id} key={id} />)}
    </div>
  )
}
