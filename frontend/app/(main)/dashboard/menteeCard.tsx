import Mentee from '@/types/mentee'
import { createClient } from '@/utils/supabase/server'

export default async function MenteeCard({ id }: { id: number }) {
  const supabase = createClient()

  const profile = (await supabase
    .from("Mentees")
    .select()
    .eq("id", id)).data![0] as Mentee

  return (
    <div className="flex flex-col justify-between shadow-md rounded-xl p-10 w-96 border border-solid border-gray-100">
      <div>Name: {profile.name}</div>
      <div>Email: {profile.email}</div>
      <div>Phone number: {profile.phone_number}</div>
      <div>
        Skills:
        <ul>
        {profile.skills.map((skill, index) => <li key={index}>{skill}</li>)}
        </ul>
      </div>
      <div>Job description: {profile.job_description}</div>
      <div>MBTI: {profile.mbti}</div>
      <div>Location: {profile.location}</div>
    </div>
  )
}