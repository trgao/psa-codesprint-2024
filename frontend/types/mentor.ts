export default interface Mentor {
  id: number
  name: string
  email: string
  phone_number: string
  skills: string[]
  job_description: string
  mbti: string
  location: string
  mentees: number[]
  mentee_count: number
  user_id: number
}
