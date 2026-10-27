import { useState } from "react"

export function AuthPage({
  login,
}: {
  login: (role: "candidate" | "employer") => void
}) {
  const [role, setRole] = useState<"candidate" | "employer">("candidate")
  return (
    <div className="mx-auto my-12 max-w-md rounded border border-gray-200 bg-white p-6 shadow-md">
      <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
        Staging preview
      </p>
      <h1 className="mb-6 text-center text-xl font-bold uppercase tracking-tight text-gray-900">
        Sign In to Red Letter Jobs
      </h1>
      <p className="-mt-3 mb-6 text-center text-xs leading-5 text-gray-500">
        This form opens a simulated demo workspace. It does not authenticate an
        account or send information to a server.
      </p>
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase text-gray-700">
          Account Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-semibold"
          >
            <option value="candidate">Job Seeker (Candidate)</option>
            <option value="employer">Church / Employer</option>
          </select>
        </label>
        <label className="block text-xs font-bold uppercase text-gray-700">
          Email Address
          <input
            type="email"
            defaultValue="jordan@example.test"
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-normal normal-case"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-gray-700">
          Password
          <input
            type="password"
            defaultValue="password"
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-normal"
          />
        </label>
        <button
          onClick={() => login(role)}
          className="w-full rounded bg-brand-red py-3 text-xs font-bold uppercase text-white transition hover:bg-brand-red-hover"
        >
          Continue to Demo
        </button>
      </div>
    </div>
  )
}

export default AuthPage

