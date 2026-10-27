import { icon } from "./Icon"

export function CandidateEmpty({
  title,
  description = "The requested candidate information is not available.",
  action,
  href,
  onAction,
}: {
  title: string
  description?: string
  action: string
  href?: string
  onAction?: () => void
}) {
  const className =
    "mt-5 inline-flex rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
  return (
    <div className="rounded border border-gray-200 bg-white p-10 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand-red">
        {icon("fa-compass")}
      </span>
      <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
        {description}
      </p>
      {href ? (
        <a href={href} className={className}>
          {action}
        </a>
      ) : (
        <button type="button" onClick={onAction} className={className}>
          {action}
        </button>
      )}
    </div>
  )
}

export default CandidateEmpty

