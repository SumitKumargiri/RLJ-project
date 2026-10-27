import { useContext, useState } from "react"
import { ApplicationContext } from "../context/ApplicationContext"
import { JobCard } from "../components/jobs/JobCard"
import { JobLocationMap } from "../components/jobs/JobLocationMap"
import { OrganizationLogo } from "../components/common/OrganizationLogo"
import { icon } from "../components/common/Icon"
import { formatLocation, organizationSlug } from "../utils/formatters"

export function OrganizationPage({ hash }: { hash: string }) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const slug = hash.split("/").pop() || ""
  const organizationJobs = allJobs.filter(
    (job) => organizationSlug(job.company) === slug,
  )
  const organization = organizationJobs[0]
  const [linkCopied, setLinkCopied] = useState(false)
  const websiteUrl =
    slug === "grace-community-church"
      ? "https://gracechurch.org"
      : `https://${slug}.example`
  const organizationJobsUrl = `${window.location.origin}${window.location.pathname}#/organization/${slug}`

  if (!organization) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h1 className="text-2xl font-black uppercase text-brand-dark">
          Organization Not Found
        </h1>
        <p className="mt-3 text-sm text-gray-500">
          This sample organization profile is no longer available.
        </p>
        <a
          href="#/jobs-listing"
          className="mt-6 inline-flex rounded bg-brand-red px-5 py-3 text-xs font-bold uppercase text-white"
        >
          Browse Jobs
        </a>
      </div>
    )
  }

  return (
    <>
      <section className="border-b border-gray-800 bg-brand-charcoal px-6 py-10 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-center">
          <OrganizationLogo
            name={organization.company}
            className="h-40 w-40"
          />
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Sample organization profile
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight sm:text-4xl">
              {organization.company}
            </h1>
            <p className="mt-2 text-sm text-gray-300">
              {organizationSlug(organization.company) ===
              "grace-community-church" ? (
                <>
                  1845 Cedar Avenue,{" "}
                  <a
                    href={`#/jobs-listing?location=${encodeURIComponent(
                      organization.city,
                    )}`}
                    className="underline decoration-gray-500 underline-offset-2 hover:text-white"
                  >
                    {organization.city}
                  </a>
                  ,{" "}
                  <a
                    href={`#/location/${organization.state.replaceAll(
                      " ",
                      "-",
                    )}`}
                    className="underline decoration-gray-500 underline-offset-2 hover:text-white"
                  >
                    {organization.state}
                  </a>{" "}
                  97205 ·{" "}
                  <a
                    href={`#/denomination/${organization.denomination}`}
                    className="underline decoration-gray-500 underline-offset-2 hover:text-white"
                  >
                    {organization.denomination.replaceAll("-", " ")}
                  </a>
                </>
              ) : (
                <>
                  {formatLocation(organization)} ·{" "}
                  {organization.denomination.replaceAll("-", " ")}
                </>
              )}
            </p>
          </div>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-12">
        <div className="space-y-8 lg:col-span-8">
          <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark">
              Organization Overview
            </h2>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {organization.company} is a fictional Christian organization used
              to demonstrate the Red Letter Jobs public profile experience. Its
              sample team serves families and neighbors through worship,
              discipleship, community care, and local partnerships.
            </p>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              Candidates can use this page to understand an organization’s
              ministry context and review all open positions before applying.
            </p>
          </section>
          <section>
            <div className="flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark">
                Open Positions
              </h2>
              <span className="text-xs font-bold text-gray-500">
                {organizationJobs.length} sample{" "}
                {organizationJobs.length === 1 ? "opening" : "openings"}
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {organizationJobs.slice(0, 8).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          </section>
        </div>
        <aside className="lg:col-span-4">
          <div className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-dark">
              Organization Details
            </h2>
            <dl className="mt-4 divide-y divide-gray-200 text-sm">
              <div className="py-3">
                <dt className="text-xs text-gray-500">Location</dt>
                <dd className="mt-1 font-bold text-brand-dark">
                  {formatLocation(organization)}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-xs text-gray-500">Denomination</dt>
                <dd className="mt-1 font-bold text-brand-dark">
                  {organization.denomination.replaceAll("-", " ")}
                </dd>
              </div>
              <div className="py-3">
                <dt className="text-xs text-gray-500">Website</dt>
                <dd className="mt-1">
                  <a
                    href={websiteUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="font-bold text-brand-red hover:underline"
                  >
                    {slug === "grace-community-church"
                      ? "gracechurch.org"
                      : `${organizationSlug(organization.company)}.example`}
                    {icon("fa-arrow-up-right-from-square", "ml-1.5 text-[10px]")}
                  </a>
                </dd>
              </div>
            </dl>
            <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-900">
              {slug === "grace-community-church"
                ? "This profile uses fictional sample organization details. The website link opens the referenced church site."
                : "This organization and website are fictional sample content."}
            </p>
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-4 flex items-center justify-center rounded bg-brand-red px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
            >
              Visit Organization Website
              {icon("fa-arrow-up-right-from-square", "ml-2")}
            </a>
            <div className="mt-5 border-t border-gray-200 pt-5">
              <h3 className="text-sm font-extrabold text-brand-dark">
                Link this page to your website
              </h3>
              <p className="mt-2 text-xs leading-5 text-gray-500">
                Use this profile link on your organization’s website to display
                all current jobs from this organization.
              </p>
              <a
                href={`#/organization/${slug}`}
                className="mt-3 block break-all rounded bg-slate-50 p-3 text-xs font-semibold text-brand-red underline"
              >
                {organizationJobsUrl}
              </a>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard
                    .writeText(organizationJobsUrl)
                    .then(() => setLinkCopied(true))
                    .catch(() => setLinkCopied(false))
                }}
                className="mt-3 rounded border border-gray-300 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-brand-dark hover:border-brand-red hover:text-brand-red"
              >
                {icon(linkCopied ? "fa-check" : "fa-link", "mr-2")}
                {linkCopied ? "Link Copied" : "Copy Organization Jobs Link"}
              </button>
              <p className="sr-only" aria-live="polite">
                {linkCopied ? "Organization jobs link copied." : ""}
              </p>
            </div>
          </div>
          <div className="mt-5 rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-brand-dark">
              {icon("fa-location-dot", "mr-2 text-brand-red")}
              Organization Location
            </h2>
            <p className="mt-2 text-xs leading-5 text-gray-500">
              {slug === "grace-community-church"
                ? "1845 Cedar Avenue, Portland, Oregon 97205"
                : formatLocation(organization)}
            </p>
            <JobLocationMap job={organization} organizationMode />
          </div>
        </aside>
      </div>
    </>
  )
}

export default OrganizationPage

