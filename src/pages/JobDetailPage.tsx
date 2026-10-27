import { useContext } from "react"
import { ApplicationContext } from "../context/ApplicationContext"
import { JobBadge } from "../components/jobs/JobBadge"
import { JobCard } from "../components/jobs/JobCard"
import { JobLocationMap } from "../components/jobs/JobLocationMap"
import { OrganizationLogo } from "../components/common/OrganizationLogo"
import { icon } from "../components/common/Icon"
import { JOB_DETAILS } from "../data/jobs.data"
import {
  formatLocation,
  formatJobDate,
  formatApplicationDate,
  organizationSlug,
} from "../utils/formatters"

export function JobDetailPage({ hash }: { hash: string }) {
  const id = Number(hash.split("/").pop())
  const {
    applications,
    openApplication,
    jobs: allJobs,
    employerListings,
    savedJobIds,
    toggleSavedJob,
  } =
    useContext(ApplicationContext)
  const job = allJobs.find((item) => item.id === id)
  if (!job) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-black uppercase text-brand-dark">
          Job Not Found
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          This ministry opportunity may have been filled or removed.
        </p>
        <a
          href="#/jobs-listing"
          className="mt-6 inline-flex rounded bg-brand-red px-5 py-3 text-xs font-bold uppercase"
        >
          <span className="text-white">Browse Current Jobs</span>
        </a>
      </div>
    )
  }

  const employerListing = employerListings.find((item) => item.id === job.id)
  const details = employerListing
    ? {
        summary: employerListing.description,
        responsibilities: employerListing.responsibilities
          .split("\n")
          .filter(Boolean),
        qualifications: employerListing.qualifications
          .split("\n")
          .filter(Boolean),
      }
    : JOB_DETAILS[job.id] || {
    summary: `${job.company} is seeking a ${job.title} to serve its congregation and help advance its ministry in ${formatLocation(job)}.`,
    responsibilities: [
      "Provide faithful ministry leadership in alignment with the church's mission.",
      "Develop volunteers and collaborate with staff and lay leaders.",
      "Care for people and support the spiritual health of the congregation.",
      "Plan and execute ministry programs with excellence and accountability.",
    ],
    qualifications: [
      "A growing relationship with Jesus Christ and a clear call to ministry.",
      "Relevant church leadership, volunteer, or vocational ministry experience.",
      "Strong communication, collaboration, and organizational skills.",
      "Alignment with the church's beliefs, values, and ministry philosophy.",
    ],
      }
  const relatedJobs = allJobs.filter(
    (item) =>
      item.id !== job.id &&
      (item.category === job.category || item.state === job.state),
  ).slice(0, 3)
  const application = applications.find((item) => item.jobId === job.id)
  const saved = (savedJobIds ?? []).includes(job.id)

  return (
    <>
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto max-w-7xl text-xs text-gray-500">
          <a href="#/" className="font-semibold hover:text-brand-red">
            Home
          </a>
          <span className="mx-2">›</span>
          <a
            href="#/jobs-listing"
            className="font-semibold hover:text-brand-red"
          >
            Find Jobs
          </a>
          <span className="mx-2">›</span>
          <span className="font-bold text-brand-dark">{job.title}</span>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-10 lg:grid-cols-12">
        <article className="rounded border border-gray-200 bg-white p-6 shadow-sm lg:col-span-8">
          <div className="border-b border-gray-200 pb-6">
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <JobBadge type={job.type} />
              {job.featured && (
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase text-amber-800">
                  {icon("fa-star", "mr-1 text-amber-500")}Featured
                </span>
              )}
            </div>
            <div className="flex items-start gap-4">
              <OrganizationLogo name={job.company} className="h-32 w-32" />
              <div className="min-w-0">
                <h1 className="text-3xl font-black tracking-tight text-brand-dark">
                  {job.title}
                </h1>
                <a
                  href={`#/organization/${organizationSlug(job.company)}`}
                  className="mt-2 inline-block text-base font-bold text-gray-700 hover:text-brand-red"
                >
                  {job.company}
                </a>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-gray-500">
              <span>
                {icon("fa-location-dot", "mr-1.5 text-gray-400")}
                {formatLocation(job)}
              </span>
              <span>
                {icon("fa-calendar-days", "mr-1.5 text-gray-400")}
                Posted {formatJobDate(job.date)}
              </span>
              <span>
                {icon("fa-church", "mr-1.5 text-gray-400")}
                {job.denomination.replaceAll("-", " ")}
              </span>
              <span>
                {icon("fa-building", "mr-1.5 text-gray-400")}
                {job.workplace}
              </span>
            </div>
          </div>

          <section className="py-6">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
              Position Overview
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {details.summary}
            </p>
          </section>
          <section className="border-t border-gray-200 py-6">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
              Key Responsibilities
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
              {details.responsibilities.map((item) => (
                <li key={item} className="flex gap-3">
                  {icon("fa-check", "mt-1 text-brand-red")}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
              Qualifications
            </h2>
            <ul className="mt-3 space-y-3 text-sm leading-6 text-gray-600">
              {details.qualifications.map((item) => (
                <li key={item} className="flex gap-3">
                  {icon("fa-check", "mt-1 text-brand-red")}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
          <section className="mt-6 border-t border-gray-200 pt-6">
            <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
              About the Organization
            </h2>
            <p className="mt-3 text-sm leading-7 text-gray-600">
              {job.company} is a fictional sample organization serving its local
              community in {formatLocation(job)}. Visit its profile to learn
              about its ministry focus and current sample openings.
            </p>
            <a
              href={`#/organization/${organizationSlug(job.company)}`}
              className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red hover:underline"
            >
              View organization profile {icon("fa-arrow-right", "ml-2")}
            </a>
          </section>
          {employerListing?.benefits && (
            <section className="mt-6 border-t border-gray-200 pt-6">
              <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
                Benefits
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {employerListing.benefits}
              </p>
            </section>
          )}
        </article>

        <aside className="lg:col-span-4">
          <div className="sticky top-28 rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-dark">
              Position Details
            </h2>
            <dl className="mt-4 divide-y divide-gray-200 text-sm">
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">Job type</dt>
                <dd className="font-bold text-brand-dark">{job.type}</dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">Workplace</dt>
                <dd className="font-bold text-brand-dark">{job.workplace}</dd>
              </div>
              {job.salary && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-gray-500">Compensation</dt>
                  <dd className="text-right font-bold text-brand-dark">
                    {job.salary}
                  </dd>
                </div>
              )}
              {job.deadline && (
                <div className="flex justify-between gap-4 py-3">
                  <dt className="text-gray-500">Apply by</dt>
                  <dd className="font-bold text-brand-dark">
                    {formatJobDate(job.deadline)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">Location</dt>
                <dd className="text-right font-bold text-brand-dark">
                  {formatLocation(job)}
                </dd>
              </div>
              <div className="flex justify-between gap-4 py-3">
                <dt className="text-gray-500">Category</dt>
                <dd className="text-right font-bold text-brand-dark">
                  {job.category.replaceAll("-", " ")}
                </dd>
              </div>
            </dl>
            {application ? (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full items-center justify-center rounded bg-emerald-600 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white"
                >
                  {icon("fa-check", "mr-2")}Applied
                </button>
                <p className="mt-2 text-center text-xs font-bold text-emerald-700">
                  Applied on {formatApplicationDate(application.applied)}
                </p>
              </>
            ) : job.closed ? (
              <>
                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center justify-center rounded bg-gray-400 px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white"
                >
                  Applications Closed
                </button>
                <p className="mt-2 text-center text-xs text-gray-500">
                  This employer is no longer accepting applications.
                </p>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openApplication(job)}
                  className="mt-5 flex w-full items-center justify-center rounded bg-brand-red px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white transition hover:bg-brand-red-hover"
                >
                  Apply for this position
                </button>
                <p className="mt-3 text-center text-xs leading-5 text-gray-500">
                  Use your private candidate profile and selected resume.
                </p>
              </>
            )}
            <button
              type="button"
              onClick={() => toggleSavedJob(job.id)}
              className={`mt-3 flex w-full items-center justify-center rounded border px-5 py-3 text-sm font-extrabold uppercase tracking-wider transition ${
                saved
                  ? "border-brand-red bg-red-50 text-brand-red"
                  : "border-gray-300 text-brand-dark hover:border-brand-red"
              }`}
            >
              {icon("fa-heart", "mr-2")}
              {saved ? "Job Saved" : "Save Job"}
            </button>
            <div className="mt-5 border-t border-gray-200 pt-5">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-brand-dark">
                {icon("fa-location-dot", "mr-1.5 text-brand-red")}
                Job Location
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {formatLocation(job)}
              </p>
              <JobLocationMap job={job} />
            </div>
          </div>
        </aside>
      </div>
      <section className="border-t border-gray-200 bg-white px-6 py-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between border-b border-gray-200 pb-3">
            <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark">
              Related Opportunities
            </h2>
            <a
              href="#/jobs-listing"
              className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Browse all jobs
            </a>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {relatedJobs.map((relatedJob) => (
              <JobCard key={relatedJob.id} job={relatedJob} compact />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default JobDetailPage

