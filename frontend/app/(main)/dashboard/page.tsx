import Link from 'next/link'
import { signOut } from './actions'

export default async function Dashboard() {
  return (
    <div>
      <nav className="w-screen fixed flex justify-between align-middle">
        <Link href="/dashboard" className="text-blue-600 font-medium text-2xl align-middle p-3">MentorShip</Link>
        <form action={signOut} className="p-3">
          <button type="submit" className="bg-blue-600 rounded-xl w-24 h-9 text-white">Sign Out</button>
        </form>
      </nav>
      
    </div>
  )
}
