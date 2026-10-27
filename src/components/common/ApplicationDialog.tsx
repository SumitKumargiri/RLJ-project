import { useEffect, useState } from "react"
import { icon } from "./Icon"
import { Job } from "../../types/job.types"
import { CandidateProfile } from "../../types/candidate.types"

export function ApplicationDialog({
  job,
  profile,
  savedResume,
  close,
  submit,
}: {
  job: Job
  profile: CandidateProfile
  savedResume: string
  close: () => void
  submit: (resumeName: string, message: string) => string | null
}) {
  const [resumeSource, setResumeSource] = useState<"saved" | "other">("saved")
  const [otherResume, setOtherResume] = useState("")
  const [message, setMessage] = useState(
    `Hello, my name is ${profile.name} from ${profile.city}, ${profile.state}. I am interested in the ${job.title} position at ${job.company}. Thank you for considering my application and resume.`,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const selectedResume =
    resumeSource === "saved" ? savedResume : otherResume

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [close, submitting])

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) close()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-dialog-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Free candidate application
            </p>
            <h2
              id="application-dialog-title"
              className="mt-1 text-2xl font-black tracking-tight text-brand-dark"
            >
              Apply for {job.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{job.company}</p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={close}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-40"
            aria-label="Close application"
          >
            {icon("fa-xmark")}
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setError("")
            if (job.closed) {
              setError(
                "Applications for this position are closed and cannot be submitted.",
              )
              return
            }
            if (!selectedResume) {
              setError("Select your saved resume or choose another resume.")
              return
            }
            setSubmitting(true)
            window.setTimeout(() => {
              try {
                const submissionError = submit(selectedResume, message)
                if (submissionError) {
                  setError(submissionError)
                  setSubmitting(false)
                }
              } catch {
                setError(
                  "The demo application could not be submitted. Please try again.",
                )
                setSubmitting(false)
              }
            }, 900)
          }}
          className="space-y-6 p-6"
        >
          {error && (
            <div
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-900"
            >
              {icon("fa-circle-exclamation", "mr-2")}
              {error}
            </div>
          )}
          <section>
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Select a Resume
            </h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-start gap-3 rounded border border-gray-200 bg-slate-50 p-4">
                <input
                  type="radio"
                  name="resume-source"
                  checked={resumeSource === "saved"}
                  onChange={() => setResumeSource("saved")}
                  className="mt-1 accent-red-700"
                />
                <span>
                  <strong className="block text-sm text-brand-dark">
                    Use saved resume
                  </strong>
                  <span className="mt-1 block break-all text-xs text-gray-600">
                    {savedResume}
                  </span>
                </span>
              </label>
              <label className="block rounded border border-gray-200 p-4">
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="resume-source"
                    checked={resumeSource === "other"}
                    onChange={() => setResumeSource("other")}
                    className="mt-1 accent-red-700"
                  />
                  <span>
                    <strong className="block text-sm text-brand-dark">
                      Choose another resume
                    </strong>
                    <span className="mt-1 block text-xs text-gray-600">
                      Select a PDF, DOC, or DOCX for this demo application.
                    </span>
                  </span>
                </span>
                {resumeSource === "other" && (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) =>
                      setOtherResume(event.target.files?.[0]?.name || "")
                    }
                    className="mt-3 block w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-brand-charcoal file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                  />
                )}
              </label>
            </div>
            <div className="mt-3 rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
              <strong>Selected filename:</strong>{" "}
              {selectedResume || "No resume selected"}
              {resumeSource === "other" && (
                <span className="mt-1 block">
                  The selected file is used only for this demo and is not
                  uploaded or stored.
                </span>
              )}
            </div>
          </section>
          <label className="block text-xs font-bold uppercase text-gray-700">
            Cover letter / message{" "}
            <span className="font-normal normal-case text-gray-500">
              (Optional)
            </span>
            <textarea
              rows={7}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal leading-6 normal-case outline-none focus:border-brand-red"
            />
            <span className="mt-1.5 block font-normal normal-case leading-5 text-gray-500">
              Edit, replace, or delete this message completely. An empty message
              will not prevent submission.
            </span>
          </label>
          <div className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            This staging action does not send an application, resume, or message
            to a real employer.
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={close}
              className="rounded border border-gray-300 px-5 py-3 text-xs font-bold uppercase text-brand-dark disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? (
                <>
                  {icon("fa-spinner", "mr-2 animate-spin")}Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

export default ApplicationDialog

