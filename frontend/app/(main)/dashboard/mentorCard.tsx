import Mentor from '@/types/mentor'
import { createClient } from '@/utils/supabase/server'

export default async function MentorCard({ id }: { id: number }) {
  const supabase = createClient()

  const profile = (await supabase
    .from("Mentors")
    .select()
    .eq("id", id)).data![0] as Mentor

  return (
    <div className="flex flex-col justify-between shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out rounded-xl p-8 w-96 border border-gray-200 bg-white">
      <div className="flex items-center mb-6">
        <div className="text-2xl font-semibold text-gray-800">{profile.name}</div>
      </div>

      <div className="text-gray-600 mb-4">
        <div>Email: <span className="text-gray-900 font-medium">{profile.email}</span></div>
        <div>Phone: <span className="text-gray-900 font-medium">{profile.phone_number}</span></div>
      </div>

      <div className="mb-4">
        <div className="font-semibold text-gray-700 mb-2">Skills:</div>
        <div className="flex gap-2 flex-wrap">
          {profile.skills.map((skill, index) => (
            <div
              key={index}
              className="rounded-full px-3 py-1 text-sm bg-blue-700 text-white border border-blue-300"
            >
              {skill}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="font-semibold text-gray-700">Job Description:</div>
        <p className="text-gray-600">{profile.job_description}</p>
      </div>

      <div className="mb-4">
        <div className="flex justify-between">
          <div>
            <span className="font-semibold text-gray-700">MBTI:</span> <span className="text-gray-900">{profile.mbti}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-700">Location:</span> <span className="text-gray-900">{profile.location}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
