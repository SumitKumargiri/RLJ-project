import { useEffect } from "react"
import { icon } from "./Icon"
import { DemoRole } from "../../types/session.types"

export function DemoAccess({
  close,
  chooseRole,
  resetDemo,
}: {
  close: () => void
  chooseRole: (role: DemoRole) => void
  resetDemo: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [close])

  const roles: {
    role: DemoRole
    iconName: string
    title: string
    description: string
  }[] = [
    {
      role: "candidate",
      iconName: "fa-user",
      title: "Candidate",
      description:
        "Preview a free job seeker workspace for profiles, saved roles, and applications.",
    },
    {
      role: "employer",
      iconName: "fa-church",
      title: "Employer",
      description:
        "Preview organization tools for job listings, applicants, and hiring activity.",
    },
    {
      role: "admin",
      iconName: "fa-shield-halved",
      title: "Admin",
      description:
        "Preview platform management for users, organizations, listings, and reports.",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-access-title"
        className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Staging preview
            </p>
            <h2
              id="demo-access-title"
              className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark"
            >
              Choose a demo experience
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Demo switching is for preview only. It does not create an account
              or authenticate a real user, and changes are not saved.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-red hover:text-brand-red"
            aria-label="Close demo access"
          >
            {icon("fa-xmark")}
          </button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {roles.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => chooseRole(item.role)}
              className="group rounded border border-gray-200 bg-slate-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red hover:bg-white hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded bg-red-50 text-lg text-brand-red">
                {icon(item.iconName)}
              </span>
              <strong className="mt-5 block text-base font-extrabold uppercase tracking-tight text-brand-dark group-hover:text-brand-red">
                {item.title} Demo
              </strong>
              <span className="mt-2 block text-sm leading-6 text-gray-600">
                {item.description}
              </span>
              <span className="mt-5 block text-xs font-extrabold uppercase tracking-wider text-brand-red">
                Open demo {icon("fa-arrow-right", "ml-1")}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-gray-200 bg-slate-50 px-6 py-4 text-xs text-gray-600 sm:flex-row sm:items-center">
          <span>Demo changes are stored in this browser for review.</span>
          <button
            type="button"
            onClick={resetDemo}
            className="self-start font-extrabold uppercase tracking-wider text-brand-red hover:underline sm:self-auto"
          >
            Reset Demo Data
          </button>
        </div>
      </section>
    </div>
  )
}

export default DemoAccess

