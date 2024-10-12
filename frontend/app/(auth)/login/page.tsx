import { signIn, signUp } from './actions';

export default function LoginPage() {
  return (
    <form className="h-screen w-screen flex flex-col gap-2 text-center justify-center align-middle">
      <div>
        <input
          id="email"
          name="email"
          placeholder="Email"
          className="border border-solid border-black rounded-md w-56 h-10 p-2"
          required
        />
      </div>
      <div>
        <input
          id="password"
          name="password"
          type="password"
          placeholder="Password"
          className="border border-solid border-black rounded-md w-56 h-10 p-2"
          required
        />
      </div>
      <div>
        <button formAction={signIn} className="bg-slate-400 rounded-xl px-5 py-2 w-56 text-white">Sign in</button>
      </div>
      <div>
        <button formAction={signUp} className="bg-slate-400 rounded-xl px-5 py-2 w-56 text-white">Sign Up</button>
      </div>
    </form>
  )
}
