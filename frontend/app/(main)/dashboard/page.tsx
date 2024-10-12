import { signOut } from './actions'

export default async function Dashboard() {
  return (
    <div>
      <form action={signOut}><button type="submit">Sign Out</button></form>
      <p>Hello world</p>
    </div>
  )
}
