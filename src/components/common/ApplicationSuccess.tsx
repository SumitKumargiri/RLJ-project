import { icon } from "./Icon"

export function ApplicationSuccess({
  close,
}: {
  close: () => void
}) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed bottom-5 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-4 rounded-lg border-2 border-emerald-300 bg-emerald-700 p-5 text-white shadow-2xl"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl text-emerald-700">
        {icon("fa-check")}
      </span>
      <strong className="flex-grow text-base">
        Application submitted successfully.
      </strong>
      <button
        type="button"
        onClick={close}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/10"
        aria-label="Dismiss success message"
      >
        {icon("fa-xmark")}
      </button>
    </div>
  )
}

export default ApplicationSuccess

