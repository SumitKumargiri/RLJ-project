import { SupplyCandidate } from "../../types/employee.types"
import { icon } from "../common/Icon"

export function SupplyCandidateCard({
  candidate,
  actionHref,
  actionLabel = "View Profile",
  secondaryAction,
  viewAction,
  saveAction,
}: {
  candidate: SupplyCandidate
  actionHref: string
  actionLabel?: string
  secondaryAction?: () => void
  viewAction?: () => void
  saveAction?: () => void
}) {
  return (
    <article className="rounded border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-red">
      <div className="flex items-start gap-4">
        <img
          src={`https://i.pravatar.cc/160?img=${candidate.id + 20}`}
          alt={`${candidate.name} sample profile`}
          className="h-16 w-16 rounded-full object-cover font-poppins"
        />
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold font-poppins uppercase tracking-wider text-brand-red">
            {candidate.category} Supply
          </span>
          <h3 className="mt-1 text-lg font-sans font-black text-brand-dark">
            {candidate.name}
          </h3>
          <p className="text-xs font-bold font-poppins text-gray-600">
            {candidate.roles.join(" · ")}
          </p>
          <p className="mt-1 text-xs font-inter text-gray-500">
            {candidate.city}, {candidate.state} · {candidate.experience} years
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm font-inter leading-6 text-gray-600">
        {candidate.biography}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.availabilityVisible &&
          candidate.availability.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800"
            >
              {item}
            </span>
          ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {viewAction ? (
          <button
            type="button"
            onClick={viewAction}
            className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold font-poppins uppercase tracking-wider text-white"
          >
            {actionLabel}
          </button>
        ) : (
          <a
            href={actionHref}
            className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            {actionLabel}
          </a>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction}
            className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
          >
            Invite to Serve
          </button>
        )}
        {saveAction && (
          <button
            type="button"
            onClick={saveAction}
            className="rounded border border-gray-300 px-3 py-2.5 text-gray-500 hover:border-brand-red hover:text-brand-red"
            aria-label={`Save ${candidate.name}`}
          >
            {icon("fa-heart")}
          </button>
        )}
      </div>
    </article>
  )
}

export default SupplyCandidateCard

