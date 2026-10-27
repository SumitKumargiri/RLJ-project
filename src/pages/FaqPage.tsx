import { useState } from "react"
import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"

export function FaqPage() {
  const [open, setOpen] = useState(0)
  const questions = [
    [
      "Is Red Letter Jobs free for candidates?",
      "Yes. Candidates can search, save, and apply for ministry opportunities without subscriptions, application fees, or paid candidate features.",
    ],
    [
      "Who can post a job?",
      "Churches, ministries, Christian schools, nonprofits, and other Christian organizations can use the employer experience to prepare a listing.",
    ],
    [
      "Are the jobs and organizations in this prototype real?",
      "No. The current staging experience uses fictional organizations, people, and sample job data for review.",
    ],
    [
      "Does the staging site send applications or email?",
      "No. Application, contact, payment, and email actions are simulated unless a page explicitly says a connected service is available.",
    ],
    [
      "Can I search by denomination or workplace type?",
      "Yes. Browse Jobs includes filters for category, location, employment type, denomination, and on-site, hybrid, or remote work.",
    ],
  ]
  return (
    <>
      <PageBanner title="Frequently Asked Questions" />
      <section className="px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Helpful answers
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Common questions
            </h1>
          </div>
          <div className="mt-8 divide-y divide-gray-200 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            {questions.map(([question, answer], index) => (
              <div key={question}>
                <button
                  type="button"
                  onClick={() => setOpen(open === index ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-extrabold text-brand-dark hover:text-brand-red"
                  aria-expanded={open === index}
                >
                  {question}
                  {icon(open === index ? "fa-minus" : "fa-plus")}
                </button>
                {open === index && (
                  <p className="px-5 pb-5 text-sm leading-7 text-gray-600">
                    {answer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">Still have a question?</p>
            <a
              href="#/contact"
              className="mt-3 inline-flex rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
            >
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </>
  )
}

export default FaqPage

