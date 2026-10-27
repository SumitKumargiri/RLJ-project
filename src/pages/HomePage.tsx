import { FormEvent, useContext, useState } from "react"
import portlandHero from "../assets/portland-hero.jpg"
import { ApplicationContext } from "../context/ApplicationContext"
import { CATEGORIES } from "../constants/categories.constants"
import { DENOMINATIONS } from "../constants/ministry.constants"
import { icon } from "../components/common/Icon"
import { JobCard } from "../components/jobs/JobCard"
import { OrganizationLogo } from "../components/common/OrganizationLogo"
import { organizationSlug } from "../utils/formatters"

export function HomePage() {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const categories = [...CATEGORIES]
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
  const popularDenominations = [...DENOMINATIONS]
    .sort((a, b) => b.count - a.count)
    .slice(0, 9)
  const popularLocations = Array.from(
    allJobs.reduce((locations, job) => {
      const name =
        job.country === "United States" || job.country === "Canada"
          ? job.state
          : job.country
      locations.set(name, (locations.get(name) || 0) + 1)
      return locations
    }, new Map<string, number>()),
    ([name, count]) => ({ name, count }),
  )
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
    .slice(0, 9)
  const jobs = [...allJobs]
    .filter((job) => job.featured)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8)
  const [directoryMode, setDirectoryMode] = useState<
    "denominations" | "locations"
  >("denominations")
  const [keyword, setKeyword] = useState("")
  const [location, setLocation] = useState("")
  const search = (event: FormEvent) => {
    event.preventDefault()
    window.location.hash = `/jobs-listing?keyword=${encodeURIComponent(keyword)}&location=${encodeURIComponent(location)}`
  }
  return (
    <>
      <section className="relative min-h-80 overflow-hidden border-b border-gray-700 px-4 py-6 text-white sm:px-6 sm:py-7">
        <img
          src={portlandHero}
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-slate-700/35" />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/10 via-gray-950/20 to-gray-950/60" />
        <div className="relative mx-auto max-w-7xl text-center">
          <p className="hero-text-shadow mb-3 text-xs font-bold font-poppins uppercase tracking-[0.24em] text-white text-[12px]">
            Your next chapter in ministry starts here
          </p>
          <h1 className="hero-text-shadow mx-auto mb-3 max-w-5xl text-4xl font-inter font-black uppercase tracking-tight md:text-5xl">
            Find Your Calling
          </h1>
          <p className="hero-text-shadow mx-auto mb-4 max-w-2xl text-sm font-inter text-white md:text-base">
            Red Letter Jobs Connects Christian Talent with Ministry
            Opportunities
          </p>
          
        <form onSubmit={search}
          className="mx-auto grid min-h-10 max-w-4xl grid-cols-1 gap-1 rounded bg-white p-1.5 text-gray-800 shadow-2xl md:grid-cols-11"
        >
          <label className="flex items-center px-3 md:col-span-5 md:border-r md:border-gray-200">
            {icon("fa-magnifying-glass", "mr-3 text-gray-400")}
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Job Title, Keywords or Ministry"
              aria-label="Job title, keywords, or ministry"
              className="w-full py-2 text-xs font-semibold outline-none"
            />
          </label>

          <label className="flex items-center border-t border-gray-100 px-3 md:col-span-4 md:border-t-0 md:border-r md:border-gray-200">
            {icon("fa-location-dot", "mr-3 text-gray-400")}
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, State or ZIP"
              aria-label="City, state, or ZIP code"
              className="w-full py-2 text-xs font-semibold outline-none"
            />
            <button
              type="button"
              onClick={() => setLocation("Midland, Texas")}
              className="text-gray-400 hover:text-brand-red"
              aria-label="Use my location"
            >
              {icon("fa-crosshairs")}
            </button>
          </label>

          <button
            type="submit"
            className="rounded bg-brand-red px-2 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-brand-red-hover md:col-span-2"
          >
            Find Jobs {icon("fa-arrow-right", "ml-2")}
          </button>
        </form>

          <div className="mx-auto mt-3 flex max-w-md flex-col justify-center gap-2 sm:flex-row">
            <a href="#/candidate/resume"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-white/60 bg-gray-950/55 px-4 py-2 text-xs backdrop-blur-sm transition hover:bg-gray-950/75 font-inter !no-underline hover:!no-underline"
            >
              {icon("fa-cloud-arrow-up", "text-white")}
              <span className="text-white font-inter text-[12px] font-bold leading-4">Upload Your Resume</span>
            </a>
            <a
              href="#/post-a-job"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-white/60 bg-gray-950/55 px-4 py-2 text-xs font-inter backdrop-blur-sm transition hover:bg-gray-950/75 !no-underline hover:!no-underline"
            >
              {icon("fa-briefcase", "text-white")}
              <span className="text-white font-inter text-[12px] font-bold leading-4">Hiring? Post a Job</span>
            </a>
          </div>
        </div>
      </section>
      <section className="mt-4 bg-header-white py-5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="flex items-center text-xl font-sans font-extrabold uppercase tracking-tight text-brand-dark sm:text-2xl">
              <span className="mr-2 h-2.5 w-2.5 bg-brand-red" />
              Featured Ministry Opportunities
            </h2>
            <a href="#/jobs-listing"
              className="font-inter text-[14px] font-bold leading-5 text-[oklch(0.278_0.033_256.848)] uppercase"
            >
              Browse All Jobs →
            </a>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {jobs.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                compact
                logoClassName="h-16 w-16 scale-90"
                paddingClassName={index === 0 ? "px-4 py-2" : undefined}
                metadataClassName={
                  index === 0 ? "text-gray-525" : undefined
                }
              />
            ))}
          </div>
        </div>
      </section>
      <section className="mx-auto my-6 max-w-7xl px-4 sm:px-6">
        <div className="mb-3 flex items-center justify-between border-b border-gray-200 pb-2">
          <h2 className="flex items-center text-xl font-sans font-extrabold uppercase tracking-tight text-brand-dark sm:text-2xl">
            <span className="mr-2 h-2.5 w-2.5 bg-brand-charcoal" />
            Popular Job Categories
          </h2>
          <a
            href="#/categories"
            className="font-inter text-[14px] font-bold leading-5 text-[oklch(0.278_0.033_256.848)] uppercase hover:underline"
          >
            Browse all categories →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          {categories.map((category) => (
            <a
              key={category.slug}
              href={`#/jobs/${category.slug}`}
              className="group flex flex-col items-center justify-center rounded border border-gray-200 bg-white p-2 text-center shadow-sm transition hover:border-brand-red"
            >
              <span className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-brand-red group-hover:text-white">
                {icon(category.icon)}
              </span>
              <span className="text-xs font-bold uppercase text-gray-800 group-hover:text-brand-red">
                {category.name}
              </span>
              <span className="mt-0.5 text-[11px] text-gray-400">
                ({category.count} Open Vacancies)
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="border-y border-gray-200 bg-header-white px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 border-b border-gray-200 pb-2 sm:flex-row sm:items-center">
            <div>
              <h2 className="flex items-center text-xl font-sans font-extrabold uppercase tracking-tight text-brand-dark sm:text-2xl">
                <span className="mr-2 h-2.5 w-2.5 bg-brand-red" />
                Popular Denominations or Locations
              </h2>
            </div>
            <div className="flex flex-col items-start self-start sm:items-end sm:self-auto">
              <div className="inline-flex rounded border border-gray-200 bg-gray-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setDirectoryMode("denominations")}
                  aria-pressed={directoryMode === "denominations"}
                  className={`rounded px-2 py-1.5 text-[9px] font-bold font-poppins uppercase tracking-wider transition ${
                    directoryMode === "denominations"
                      ? "bg-brand-charcoal text-white shadow-sm"
                      : "text-gray-600 hover:text-brand-dark"
                  }`}
                >
                  Denominations
                </button>
                <button
                  type="button"
                  onClick={() => setDirectoryMode("locations")}
                  aria-pressed={directoryMode === "locations"}
                  className={`rounded px-2 py-1.5 text-[9px] font-bold font-poppins uppercase tracking-wider transition ${
                    directoryMode === "locations"
                      ? "bg-brand-charcoal text-white shadow-sm"
                      : "text-gray-600 hover:text-brand-dark"
                  }`}
                >
                  Locations
                </button>
              </div>
              <a
                href={
                  directoryMode === "denominations"
                    ? "#/denominations"
                    : "#/locations"
                }
                // className="mt-1.5 inline-block text-xs font-bold font-inter uppercase text-brand-red hover:underline"
                className='font-inter font-bold text-xs leading-5 text-[oklch(0.278_0.033_256.848)] uppercase !no-underline hover:underline'
              >
                Browse all{" "}
                {directoryMode === "denominations"
                  ? "denominations"
                  : "locations"}{" "}
                →
              </a>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {(directoryMode === "denominations"
              ? popularDenominations
              : popularLocations
            ).map((item) => (
              <a
                key={item.name}
                href={
                  directoryMode === "denominations"
                    ? `#/denomination/${"slug" in item ? item.slug : ""}`
                    : `#/jobs-listing?location=${encodeURIComponent(item.name)}`
                }
                className="group flex items-center justify-between border-b border-gray-200 py-3 text-base font-bold font-poppins text-brand-dark transition hover:border-brand-red !no-underline"
              >
                <span>{item.name}</span>
                <span className="flex flex-nowrap items-center gap-3 whitespace-nowrap text-xs font-semibold font-inter text-gray-400 pl-1">
                  {item.count} {item.count === 1 ? "opening" : "openings"}
                  {icon(
                    "fa-arrow-right",
                    "shrink-0 transition-transform group-hover:translate-x-1",
                  )}
                </span>
              </a>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-gray-200 bg-slate-50 px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="grid lg:grid-cols-5">
            <div className="relative overflow-hidden bg-brand-charcoal p-6 text-white lg:col-span-2">
              <span className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-red" />
              <span className="absolute -bottom-16 right-12 h-28 w-28 rounded-full border border-white/10" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold font-inter text-red-200">
                  {icon("fa-calendar-check")} Available when plans change
                </span>
                <h2 className="mt-3 text-3xl font-black font-sans uppercase leading-tight tracking-tight">
                  Ministry support for the moments that matter.
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Find trusted people for Sunday services, special gatherings,
                  and short-term ministry needs.
                </p>
                <a
                  href="#/pulpit-supply"
                  className="mt-4 inline-flex items-center rounded bg-brand-red px-5 py-2.5 text-xs font-bold font-inter uppercase tracking-wider text-white shadow-sm transition hover:bg-brand-red-hover"
                >
                  Explore Pulpit Supply {icon("fa-arrow-right", "ml-2")}
                </a>
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:col-span-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-extrabold font-poppins uppercase tracking-widest text-brand-red">
                    Choose the support you need
                  </p>
                  <h3 className="mt-1 text-lg font-black font-poppins text-brand-dark">
                    Two focused ways to find the right fit
                  </h3>
                </div>
                <a
                  href="#/candidate/pulpit-supply"
                  className="text-xs font-extrabold font-inter uppercase tracking-wider hover:underline"
                >
                  Offer your services
                </a>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {[
                  {
                    title: "Preaching Supply",
                    description:
                      "Guest preachers, speakers, and short-term pastoral support.",
                    iconName: "fa-person-chalkboard",
                    tone: "bg-red-50 text-brand-red",
                  },
                  {
                    title: "Worship & Music",
                    description:
                      "Worship leaders, vocalists, pianists, and musicians.",
                    iconName: "fa-music",
                    tone: "bg-slate-100 text-brand-charcoal",
                  },
                ].map((category) => (
                  <a
                    key={category.title}
                    href="#/pulpit-supply"
                    className="group rounded border font-poppins border-gray-200 p-4 transition hover:border-brand-red hover:shadow-md !no-underline"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded ${category.tone}`}
                    >
                      {icon(category.iconName)}
                    </span>
                    <strong className="mt-3 block text-base font-black text-brand-dark">
                      {category.title}
                    </strong>
                    <span className="mt-2 block text-sm font-inter leading-6 text-gray-600">
                      {category.description}
                    </span>
                    <span className="mt-3 inline-flex fon-inter text-xs font-extrabold uppercase tracking-wider text-brand-red">
                      Browse professionals{" "}
                      {icon(
                        "fa-arrow-right",
                        "ml-2 transition-transform group-hover:translate-x-1",
                      )}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-200 pt-3 text-xs font-semibold text-gray-500 font-inter">
                <span>{icon("fa-user-check", "mr-2 text-brand-red")}Professional profiles</span>
                <span>{icon("fa-eye-slash", "mr-2 text-brand-red")}Privacy controls</span>
                <span>{icon("fa-envelope", "mr-2 text-brand-red")}Private invitations</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="border-y border-gray-200 bg-gray-100 px-4 py-8 sm:px-6">
        <style>{`
          @keyframes rlj-organizations-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
          .rlj-organizations-track {
            animation: rlj-organizations-scroll 55s linear infinite;
            width: max-content;
          }
          .rlj-organizations-carousel:hover .rlj-organizations-track,
          .rlj-organizations-carousel:focus-within .rlj-organizations-track {
            animation-play-state: paused;
          }
          @media (prefers-reduced-motion: reduce) {
            .rlj-organizations-track {
              animation: none;
              transform: none;
            }
          }
        `}</style>
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-extrabold font-poppins uppercase tracking-widest text-brand-red">
                Recently hiring
              </p>
              <h2 className="mt-2 text-2xl font-black font-sans uppercase tracking-tight text-brand-dark">
                Latest Organizations on Red Letter Jobs
              </h2>
              <p className="mt-2 max-w-2xl text-sm font-inter leading-6 text-gray-600">
                Explore churches and ministry organizations represented in the
                latest opportunities.
              </p>
            </div>
            <a
              href="#/jobs-listing"
              className="shrink-0 text-xs font-extrabold font-inter uppercase tracking-wider hover:underline !no-underline"
            >
              View latest jobs {icon("fa-arrow-right", "ml-2")}
            </a>
          </div>
          {(() => {
            const latestOrganizations = Array.from(
              new Map(
                [...allJobs]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((job) => [job.company, job]),
              ).values(),
            ).slice(0, 10)
            const carouselOrganizations = [
              ...latestOrganizations,
              ...latestOrganizations,
            ]
            return (
              <div
                className="rlj-organizations-carousel relative mt-5 overflow-hidden"
                aria-label="Latest organizations hiring on Red Letter Jobs"
              >
                <div className="rlj-organizations-track flex gap-4 py-1">
                  {carouselOrganizations.map((job, index) => {
                    const duplicate = index >= latestOrganizations.length
                    return (
                      <a
                        key={`${job.company}-${index}`}
                        href={`#/organization/${organizationSlug(job.company)}`}
                        tabIndex={duplicate ? -1 : undefined}
                        aria-hidden={duplicate || undefined}
                        className="flex w-56 shrink-0 items-center gap-3 rounded border border-gray-200 bg-white p-3 shadow-sm transition hover:border-brand-red hover:shadow-md !no-underline"
                      >
                        <OrganizationLogo
                          name={job.company}
                          className="h-16 w-16"
                        />
                        <span className="min-w-0">
                          <strong className="block text-sm font-black font-poppins leading-5 text-brand-dark">
                            {job.company}
                          </strong>
                          <span className="mt-1 block font-inter truncate text-xs text-gray-500">
                            {job.title}
                          </span>
                        </span>
                      </a>
                    )
                  })}
                </div>
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-gray-100 to-transparent" />
                <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-gray-100 to-transparent" />
              </div>
            )
          })()}
        </div>
      </section>
    </>
  )
}

export default HomePage

