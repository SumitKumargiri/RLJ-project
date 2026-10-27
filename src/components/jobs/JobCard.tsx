import { useContext } from "react"
import { ApplicationContext } from "../../context/ApplicationContext"
import { Job } from "../../types/job.types"
import { OrganizationLogo } from "../common/OrganizationLogo"
import { JobBadge } from "./JobBadge"
import { icon } from "../common/Icon"
import {
  formatLocation,
  formatJobDate,
  organizationSlug,
} from "../../utils/formatters"

export function JobCard({
  job,
  compact = false,
  logoClassName,
  paddingClassName,
  metadataClassName = "text-gray-500",
}: {
  job: Job
  compact?: boolean
  logoClassName?: string
  paddingClassName?: string
  metadataClassName?: string
}) {
  const { applications, savedJobIds, toggleSavedJob } =
    useContext(ApplicationContext)
  const saved = (savedJobIds ?? []).includes(job.id)
  const application = applications.find((item) => item.jobId === job.id)
  return (
    <article
      onClick={() => {
        window.location.hash = `/job/${job.id}`
      }}
      className={`job-card cursor-pointer rounded border border-gray-200 shadow-sm transition hover:border-brand-red ${
        compact
          ? `flex flex-col gap-3 bg-header-white ${paddingClassName || "p-4"} sm:flex-row sm:items-center sm:justify-between`
          : `flex flex-col justify-between gap-4 p-4 sm:flex-row sm:items-center ${
              job.featured ? "bg-amber-50" : "bg-white"
            }`
      }`}
    >
      <div
        className={`flex min-w-0 ${
          compact ? "items-center gap-3" : "items-start gap-4"
        }`}
      >
        <OrganizationLogo name={job.company} className={logoClassName} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3
              className={`job-title truncate font-bold font-popins tracking-tight text-gray-900 transition ${
                compact ? "text-base" : "text-sm"
              }`}
            >
              {job.title}
            </h3>
            {!compact && job.featured && (
              <span className="rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-extrabold text-amber-800">
                {icon("fa-star", "mr-1 text-amber-500")}Featured
              </span>
            )}
            {job.closed && (
              <span className="rounded bg-gray-200 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-gray-700">
                Closed
              </span>
            )}
          </div>
          <a
            href={`#/organization/${organizationSlug(job.company)}`}
            onClick={(event) => event.stopPropagation()}
            className={`!no-underline ${
              compact ? "mt-1 text-sm" : "mt-1 text-xs"
            } block truncate font-extrabold font-inter text-gray-700`}
          >
            {job.company}
          </a>
          <div
            className={`mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-inter font-bold  ${metadataClassName}`}
          >
            <span>
              {icon("fa-location-dot", "mr-1 text-gray-400")}
              {formatLocation(job)}
            </span>
            <span>
              {icon("fa-calendar-days", "mr-1 text-gray-400")}
              {formatJobDate(job.date)}
            </span>
            {!compact && (
              <span className="text-gray-400">
                {icon("fa-layer-group", "mr-1")}
                {job.denomination.replaceAll("-", " ")}
              </span>
            )}
            {application && (
              <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
                {icon("fa-check", "mr-1")}Applied
              </span>
            )}
          </div>
        </div>
      </div>
      <div
        className={`flex shrink-0 items-center gap-3 ${
          compact
            ? "w-full flex-row-reverse justify-between sm:w-auto sm:flex-col-reverse"
            : "justify-between border-t border-gray-100 pt-2 sm:border-0 sm:pt-0"
        }`}
      >
        <JobBadge type={job.type} />
        <button
          onClick={(event) => {
            event.stopPropagation()
            toggleSavedJob(job.id)
          }}
          className={`save-heart px-1 text-base transition ${
            saved ? "text-brand-red" : "text-gray-300"
          }`}
          aria-label={saved ? "Remove saved job" : "Save job"}
        >
          {icon("fa-heart")}
        </button>
      </div>
    </article>
  )
}

export default JobCard

