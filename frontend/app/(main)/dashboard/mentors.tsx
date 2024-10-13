import { createClient } from '@/utils/supabase/server'
import { notFound, redirect } from 'next/navigation'
import MentorCard from './mentorCard'

export default async function Mentors() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const profileQuery = (await supabase
    .from("Mentees")
    .select()
    .eq("user_id", user.id)).data
  
    console.log(profileQuery)
  if (profileQuery == null || profileQuery.length == 0) {
    return notFound()
  }

  const profile = profileQuery[0]

  return (
    <div className="flex justify-center items-center h-screen w-screen">
      {profile.mentors.map((id: number) => <MentorCard id={id} key={id} />)}
    </div>
  )
}
