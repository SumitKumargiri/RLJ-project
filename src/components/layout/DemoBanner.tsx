import { Session } from "../../types/session.types"

export function DemoBanner({
  session,
  openDemo,
  exitDemo,
  resetDemo,
}: {
  session: Session
  openDemo: () => void
  exitDemo: () => void
  resetDemo: () => void
}) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-amber-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs sm:justify-between sm:text-left">
        <p>
          <strong className="uppercase tracking-wider">Preview mode:</strong>{" "}
          You are viewing the {session.role} demo. Actions and data are
          simulated and are not saved.
        </p>
        <div className="flex items-center gap-3 font-bold">
          <button
            type="button"
            onClick={openDemo}
            className="text-brand-red hover:underline"
          >
            Switch role
          </button>
          <button
            type="button"
            onClick={exitDemo}
            className="text-gray-600 hover:text-brand-dark hover:underline"
          >
            Exit demo
          </button>
          <button
            type="button"
            onClick={resetDemo}
            className="text-gray-600 hover:text-brand-dark hover:underline"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  )
}

export default DemoBanner

