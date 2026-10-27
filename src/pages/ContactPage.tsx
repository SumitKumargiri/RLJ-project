import { useState } from "react"
import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"

export function ContactPage() {
  const [submitted, setSubmitted] = useState(false)
  return (
    <>
      <PageBanner title="Contact" />
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              We’re here to help
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              How can we help?
            </h1>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Ask about job searching, employer tools, organization profiles, or
              this staging prototype.
            </p>
            <a
              href="#/faqs"
              className="mt-5 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Browse common questions {icon("fa-arrow-right", "ml-2")}
            </a>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault()
              setSubmitted(true)
            }}
            className="rounded border border-gray-200 bg-white p-6 shadow-sm lg:col-span-3"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              {["Name", "Email"].map((label) => (
                <label
                  key={label}
                  className="text-xs font-bold uppercase text-gray-700"
                >
                  {label}
                  <input
                    type={label === "Email" ? "email" : "text"}
                    required
                    className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
                  />
                </label>
              ))}
            </div>
            <label className="mt-4 block text-xs font-bold uppercase text-gray-700">
              Topic
              <select className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case">
                <option>Job seeker question</option>
                <option>Employer question</option>
                <option>Technical support</option>
                <option>General inquiry</option>
              </select>
            </label>
            <label className="mt-4 block text-xs font-bold uppercase text-gray-700">
              Message
              <textarea
                required
                rows={5}
                className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
              />
            </label>
            <button
              type="submit"
              className="mt-4 rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
            >
              Preview Submission
            </button>
            {submitted && (
              <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
                Preview complete. This staging form does not send email or store
                your message.
              </p>
            )}
          </form>
        </div>
      </section>
    </>
  )
}

export default ContactPage

