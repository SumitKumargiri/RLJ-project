import { useContext } from "react"
import { ApplicationContext } from "../../context/ApplicationContext"
import { DemoRole } from "../../types/session.types"
import { icon } from "./Icon"
import { formatApplicationDate } from "../../utils/formatters"

export function DashboardPreview({
  role,
  openDemo,
}: {
  role: DemoRole
  openDemo: () => void
}) {
  const { applications, jobs: allJobs } = useContext(ApplicationContext)
  const content = {
    candidate: {
      eyebrow: "Candidate workspace",
      title: "Welcome, Jordan",
      introduction:
        "Keep your ministry search organized while you discern what comes next.",
      primaryAction: "Browse jobs",
      primaryHref: "#/jobs-listing",
      secondaryAction: "Edit profile",
      stats: [
        ["Saved jobs", "4", "fa-heart"],
        ["Applications", "2", "fa-file-lines"],
        ["Profile status", "75%", "fa-user"],
      ],
      panelTitle: "Your recent activity",
      items: [
        ["Worship Pastor", "Harbor City Church", "Saved"],
        ["Director of Student Ministries", "Cedar Grove Community", "Applied"],
        ["Executive Pastor", "New Mercy Fellowship", "Draft"],
      ],
      note: "Candidate accounts and applications are always free.",
    },
    employer: {
      eyebrow: "Employer workspace",
      title: "Harbor City Church",
      introduction:
        "Manage sample listings and review fictional candidates from one place.",
      primaryAction: "Post a job",
      primaryHref: "#/for-employers",
      secondaryAction: "Edit organization",
      stats: [
        ["Active jobs", "3", "fa-briefcase"],
        ["New applicants", "8", "fa-user-group"],
        ["Draft listings", "1", "fa-file-pen"],
      ],
      panelTitle: "Current openings",
      items: [
        ["Worship Pastor", "6 sample applicants", "Active"],
        ["Children’s Ministry Director", "2 sample applicants", "Active"],
        ["Operations Coordinator", "Draft listing", "Draft"],
      ],
      note: "Posting and applicant actions are simulated in this staging preview.",
    },
    admin: {
      eyebrow: "Platform administration",
      title: "Operations overview",
      introduction:
        "Review sample platform activity and moderation queues across Red Letter Jobs.",
      primaryAction: "Review listings",
      primaryHref: "#/jobs-listing",
      secondaryAction: "Manage users",
      stats: [
        ["Listings to review", "5", "fa-list-check"],
        ["Open reports", "2", "fa-flag"],
        ["Support requests", "7", "fa-life-ring"],
      ],
      panelTitle: "Review queue",
      items: [
        ["New employer profile", "Cedar Grove Community", "Review"],
        ["Edited ministry listing", "Director of Student Ministries", "Review"],
        ["User-submitted report", "Listing content", "Open"],
      ],
      note: "All organizations, people, and activity shown here are fictional sample data.",
    },
  }[role]

  return (
    <>
      <div className="border-b border-gray-800 bg-brand-charcoal px-6 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              {content.eyebrow}
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
              {content.title}
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-gray-300">
              {content.introduction}
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <a
              href={content.primaryHref}
              className="rounded bg-brand-red px-5 py-3 text-center text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-brand-red-hover"
            >
              {content.primaryAction}
            </a>
            <button
              type="button"
              className="rounded border border-gray-500 px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:border-white"
            >
              {content.secondaryAction}
            </button>
          </div>
        </div>
      </div>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 p-5">
              <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">
                Demo navigation
              </p>
            </div>
            <nav className="grid p-2 text-sm font-bold text-gray-700">
              {[
                ["fa-gauge-high", "Overview"],
                ["fa-user", role === "employer" ? "Organization" : "Profile"],
                [
                  "fa-briefcase",
                  role === "admin" ? "Listings" : "Jobs & activity",
                ],
                ["fa-gear", "Settings"],
              ].map(([iconName, label], index) => (
                <button
                  key={label}
                  type="button"
                  className={`flex items-center gap-3 rounded px-3 py-3 text-left ${
                    index === 0
                      ? "bg-red-50 text-brand-red"
                      : "hover:bg-gray-50 hover:text-brand-dark"
                  }`}
                >
                  <span className="w-5 text-center">{icon(iconName)}</span>
                  {label}
                </button>
              ))}
            </nav>
            <div className="border-t border-gray-200 p-4">
              <button
                type="button"
                onClick={openDemo}
                className="w-full rounded border border-gray-300 px-3 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-dark transition hover:border-brand-red hover:text-brand-red"
              >
                Switch demo role
              </button>
            </div>
          </div>
        </aside>
        <div className="space-y-6 lg:col-span-9">
          <div className="grid gap-4 sm:grid-cols-3">
            {content.stats.map(([label, value, iconName]) => (
              <article
                key={label}
                className="rounded border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-brand-red">
                    {icon(iconName)}
                  </span>
                  <strong className="text-3xl font-black text-brand-dark">
                    {value}
                  </strong>
                </div>
                <p className="mt-4 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                  {label}
                </p>
              </article>
            ))}
          </div>
          <section className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
              <h2 className="text-base font-black uppercase tracking-tight text-brand-dark">
                {content.panelTitle}
              </h2>
              <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                Sample data
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {content.items.map(([title, detail, status]) => (
                <div
                  key={`${title}-${detail}`}
                  className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <p className="text-sm font-extrabold text-brand-dark">
                      {title}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">{detail}</p>
                  </div>
                  <span className="self-start rounded bg-red-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-red sm:self-auto">
                    {status}
                  </span>
                </div>
              ))}
            </div>
          </section>
          {role === "employer" && (
            <section className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
                <h2 className="text-base font-black uppercase tracking-tight text-brand-dark">
                  Applicant List
                </h2>
                <span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Shared demo data
                </span>
              </div>
              <div className="divide-y divide-gray-100">
                {applications.map((application) => {
                  const job = allJobs.find(
                    (item) => item.id === application.jobId,
                  )
                  if (!job) return null
                  return (
                    <div
                      key={application.id}
                      className="flex flex-col justify-between gap-3 px-5 py-4 sm:flex-row sm:items-center"
                    >
                      <div>
                        <p className="text-sm font-extrabold text-brand-dark">
                          {application.candidateName}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          {job.title} ·{" "}
                          {formatApplicationDate(application.applied)}
                        </p>
                        <p className="mt-1 text-[11px] text-gray-400">
                          Resume: {application.resumeName}
                        </p>
                      </div>
                      <span className="self-start rounded bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700 sm:self-auto">
                        {application.status}
                      </span>
                    </div>
                  )
                })}
              </div>
            </section>
          )}
          <div className="rounded border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            {icon("fa-circle-info", "mr-2")}
            {content.note}
          </div>
        </div>
      </div>
    </>
  )
}

export default DashboardPreview

