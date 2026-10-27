import { useContext, useEffect, useMemo, useState } from "react"
import { ApplicationContext } from "../context/ApplicationContext"
import { CATEGORIES } from "../constants/categories.constants"
import { DENOMINATIONS } from "../constants/ministry.constants"
import { US_STATES, CANADA_PROVINCES } from "../constants/location.constants"
import { icon } from "../components/common/Icon"
import { FilterBox } from "../components/jobs/FilterBox"
import { JobCard } from "../components/jobs/JobCard"
import { MapModal } from "../components/jobs/MapModal"

export function JobListingsPage({ hash }: { hash: string }) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const path = hash.split("?")[0]
  const params = new URLSearchParams(
    hash.includes("?") ? hash.split("?")[1] : "",
  )
  const context = path.startsWith("/jobs/")
    ? "category"
    : path.startsWith("/denomination/")
      ? "denomination"
      : path.startsWith("/location/")
        ? "location"
        : "all"
  const slug = path.split("/").pop() || ""
  const title =
    context === "category"
      ? CATEGORIES.find(
          (item) => item.slug.toLowerCase() === slug.toLowerCase(),
        )?.name || slug
      : context === "denomination"
        ? DENOMINATIONS.find(
            (item) => item.slug.toLowerCase() === slug.toLowerCase(),
          )?.name || slug
        : context === "location"
          ? slug.replaceAll("-", " ")
          : "Find Jobs"
  const [searchQuery, setSearchQuery] = useState(
    [params.get("keyword"), params.get("location")]
      .filter(Boolean)
      .join(" "),
  )
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  const [locationMenuOpen, setLocationMenuOpen] = useState(false)
  const [international, setInternational] = useState(false)
  const [types, setTypes] = useState<string[]>([])
  const [categoryFilter, setCategoryFilter] = useState("")
  const [denominationFilter, setDenominationFilter] = useState("")
  const [workplace, setWorkplace] = useState("")
  const [dateRange, setDateRange] = useState("all")
  const [sort, setSort] = useState("recent")
  const [perPage, setPerPage] = useState(25)
  const [page, setPage] = useState(1)
  const [mapOpen, setMapOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    const searchTerms = searchQuery
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(Boolean)
    const days =
      dateRange === "24h"
        ? 1
        : dateRange === "7d"
          ? 7
          : dateRange === "30d"
            ? 30
            : null
    const latest = new Date("2026-10-13").getTime()
    return allJobs.filter((job) => {
      const searchableJob =
        `${job.title} ${job.company} ${job.city} ${job.state} ${job.country}`.toLowerCase()
      if (searchTerms.some((term) => !searchableJob.includes(term)))
        return false
      if (selectedLocations.length || international) {
        const matchesSelectedLocation = selectedLocations.includes(job.state)
        const matchesInternational =
          international &&
          job.country !== "United States" &&
          job.country !== "Canada"
        if (!matchesSelectedLocation && !matchesInternational) return false
      }
      if (types.length && !types.includes(job.type)) return false
      if (categoryFilter && job.category !== categoryFilter) return false
      if (denominationFilter && job.denomination !== denominationFilter)
        return false
      if (workplace && job.workplace !== workplace) return false
      if (days && latest - new Date(job.date).getTime() > days * 86400000)
        return false
      if (
        context === "category" &&
        job.category.toLowerCase() !== slug.toLowerCase()
      )
        return false
      if (
        context === "denomination" &&
        job.denomination.toLowerCase() !== slug.toLowerCase()
      )
        return false
      if (
        context === "location" &&
        job.state.toLowerCase() !== slug.replaceAll("-", " ").toLowerCase()
      )
        return false
      return true
    }).sort((a, b) =>
      sort === "oldest"
        ? a.date.localeCompare(b.date)
        : sort === "asc"
          ? a.title.localeCompare(b.title)
          : sort === "desc"
            ? b.title.localeCompare(a.title)
            : b.date.localeCompare(a.date),
    )
  }, [
    context,
    categoryFilter,
    dateRange,
    denominationFilter,
    international,
    selectedLocations,
    searchQuery,
    slug,
    sort,
    types,
    workplace,
    allJobs,
  ])
  const pageCount = Math.max(1, Math.ceil(filtered.length / perPage))
  const currentPage = Math.min(page, pageCount)
  const firstResult = (currentPage - 1) * perPage
  const paginatedJobs = filtered.slice(firstResult, firstResult + perPage)
  const paginationItems: (number | "ellipsis")[] = []
  for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
    if (
      pageNumber === 1 ||
      pageNumber === pageCount ||
      Math.abs(pageNumber - currentPage) <= 1
    ) {
      paginationItems.push(pageNumber)
    } else if (paginationItems.at(-1) !== "ellipsis") {
      paginationItems.push("ellipsis")
    }
  }

  useEffect(() => {
    setPage(1)
  }, [
    context,
    categoryFilter,
    dateRange,
    denominationFilter,
    international,
    perPage,
    selectedLocations,
    searchQuery,
    slug,
    sort,
    types,
    workplace,
  ])

  const toggleType = (type: string) =>
    setTypes((current) =>
      current.includes(type)
        ? current.filter((item) => item !== type)
        : [...current, type],
    )
  const toggleLocation = (location: string) =>
    setSelectedLocations((current) =>
      current.includes(location)
        ? current.filter((item) => item !== location)
        : [...current, location],
    )
  const reset = () => {
    setSearchQuery("")
    setSelectedLocations([])
    setInternational(false)
    setTypes([])
    setCategoryFilter("")
    setDenominationFilter("")
    setWorkplace("")
    setDateRange("all")
  }
  const activeFilters = [
    searchQuery && { label: `Search: ${searchQuery}`, clear: () => setSearchQuery("") },
    ...selectedLocations.map((location) => ({
      label: location,
      clear: () => toggleLocation(location),
    })),
    international && {
      label: "International",
      clear: () => setInternational(false),
    },
    categoryFilter && {
      label:
        CATEGORIES.find((item) => item.slug === categoryFilter)?.name ||
        categoryFilter,
      clear: () => setCategoryFilter(""),
    },
    denominationFilter && {
      label:
        DENOMINATIONS.find((item) => item.slug === denominationFilter)?.name ||
        denominationFilter,
      clear: () => setDenominationFilter(""),
    },
    workplace && { label: workplace, clear: () => setWorkplace("") },
    ...types.map((type) => ({
      label: type,
      clear: () => toggleType(type),
    })),
  ].filter(Boolean) as { label: string; clear: () => void }[]
  return (
    <>
      <div className="border-b border-gray-200 bg-white px-6 py-3">
        <div className="mx-auto max-w-7xl text-xs text-gray-500 px-[30px]">
          <a href="#/" className="font-semibold font-poppins hover:text-brand-red">
            Home
          </a>
          <span className="mx-2">›</span>
          <span className="font-bold font-poppins text-brand-dark">{title}</span>
        </div>
      </div>
      <div className="mx-auto max-w-7xl px-6 py-6">
        <button
          type="button"
          onClick={() => setFiltersOpen((value) => !value)}
          className="mb-4 flex w-full items-center justify-between rounded bg-brand-charcoal px-4 py-3 text-xs font-extrabold uppercase tracking-wider text-white lg:hidden"
          aria-expanded={filtersOpen}
        >
          <span>{icon("fa-sliders", "mr-2")}Search filters</span>
          {icon(filtersOpen ? "fa-chevron-up" : "fa-chevron-down")}
        </button>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          <aside
            className={`${filtersOpen ? "block" : "hidden"} space-y-4 lg:col-span-3 lg:block`}
          >
            <FilterBox title="Search Jobs" iconName="fa-magnifying-glass">
              <label className="flex items-center rounded border border-gray-300 bg-white px-3">
                {icon("fa-magnifying-glass", "mr-2 text-xs text-gray-400")}
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Title, ministry, or location"
                  aria-label="Search jobs by title, ministry, or location"
                  className="w-full py-2 text-sm font-medium font-poppins text-gray-700 outline-none placeholder:font-medium placeholder:text-gray-500"
                />
              </label>
            </FilterBox>
            <FilterBox title="Locations" iconName="fa-location-dot">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLocationMenuOpen((value) => !value)}
                  aria-expanded={locationMenuOpen}
                  className="flex w-full items-center justify-between rounded border border-gray-300 bg-white p-2 text-left text-sm font-medium text-gray-700"
                >
                  <span>
                    {selectedLocations.length
                      ? `${selectedLocations.length} selected`
                      : "Select states or provinces"}
                  </span>
                  {icon(
                    locationMenuOpen ? "fa-chevron-up" : "fa-chevron-down",
                    "text-xs text-gray-400",
                  )}
                </button>
                {locationMenuOpen && (
                  <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-80 overflow-y-auto rounded border border-gray-300 bg-white p-3 shadow-xl">
                    <p className="mb-2 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      United States
                    </p>
                    <div className="space-y-2">
                      {US_STATES.map((state) => (
                        <label
                          key={state}
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(state)}
                            onChange={() => toggleLocation(state)}
                            className="mr-2 accent-red-700"
                          />
                          {state}
                        </label>
                      ))}
                    </div>
                    <p className="mb-2 mt-4 border-t border-gray-200 pt-3 text-xs font-extrabold uppercase tracking-wider text-gray-500">
                      Canada
                    </p>
                    <div className="space-y-2">
                      {CANADA_PROVINCES.map((province) => (
                        <label
                          key={province}
                          className="flex items-center text-sm font-medium text-gray-700"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLocations.includes(province)}
                            onChange={() => toggleLocation(province)}
                            className="mr-2 accent-red-700"
                          />
                          {province}
                        </label>
                      ))}
                    </div>
                    <label className="mt-4 flex items-center border-t border-gray-200 pt-3 text-sm font-medium text-gray-700">
                      <input
                        checked={international}
                        onChange={(event) =>
                          setInternational(event.target.checked)
                        }
                        type="checkbox"
                        className="mr-2 accent-red-700"
                      />
                      International
                    </label>
                  </div>
                )}
              </div>
            </FilterBox>
            <FilterBox title="Job Type" iconName="fa-clock">
              {([
                "FULL TIME",
                "PART TIME",
                "INTERNSHIP",
                "INTERIM",
              ] as const).map((type) => (
                <label
                  key={type}
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <input
                    type="checkbox"
                    checked={types.includes(type)}
                    onChange={() => toggleType(type)}
                    className="mr-2 accent-red-700"
                  />
                  {type
                    .replace("FULL", "Full")
                    .replace("PART", "Part")
                    .replace("INTERNSHIP", "Internship")
                    .replace("INTERIM", "Interim")}
                </label>
              ))}
            </FilterBox>
            <FilterBox title="Ministry Category" iconName="fa-layer-group">
              <select
                value={categoryFilter}
                onChange={(event) => setCategoryFilter(event.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm font-medium font-poppins text-gray-700"
              >
                <option value="">All categories</option>
                {CATEGORIES.map((category) => (
                  <option key={category.slug} value={category.slug}>
                    {category.name}
                  </option>
                ))}
              </select>
            </FilterBox>
            <FilterBox title="Denomination" iconName="fa-church">
              <select
                value={denominationFilter}
                onChange={(event) => setDenominationFilter(event.target.value)}
                className="w-full rounded border border-gray-300 p-2 text-sm font-normal text-gray-700"
              >
                <option value="">All denominations</option>
                {DENOMINATIONS.map((denomination) => (
                  <option key={denomination.slug} value={denomination.slug}>
                    {denomination.name}
                  </option>
                ))}
              </select>
            </FilterBox>
            <FilterBox title="Workplace" iconName="fa-building">
              {["On-site", "Hybrid", "Remote"].map((option) => (
                <label
                  key={option}
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <input
                    type="radio"
                    name="workplace"
                    checked={workplace === option}
                    onChange={() => setWorkplace(option)}
                    className="mr-2 accent-red-700"
                  />
                  {option}
                </label>
              ))}
            </FilterBox>
            <FilterBox title="Date Posted" iconName="fa-calendar-days">
              {[
                ["all", "All Dates"],
                ["24h", "Last 24 Hours"],
                ["7d", "Last 7 Days"],
                ["30d", "Last 30 Days"],
              ].map(([value, label]) => (
                <label
                  key={value}
                  className="flex items-center text-sm font-medium text-gray-700"
                >
                  <input
                    type="radio"
                    name="date"
                    value={value}
                    checked={dateRange === value}
                    onChange={() => setDateRange(value)}
                    className="mr-2 accent-red-700"
                  />
                  {label}
                </label>
              ))}
            </FilterBox>
          </aside>
          <section className="lg:col-span-9">
            {activeFilters.length > 0 && (
              <div className="mb-4 flex flex-wrap items-center gap-2 rounded border border-gray-200 bg-white p-3 shadow-sm">
                <span className="mr-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                  Active filters
                </span>
                {activeFilters.map((filter) => (
                  <button
                    key={filter.label}
                    type="button"
                    onClick={filter.clear}
                    className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red hover:bg-red-100"
                  >
                    {filter.label} {icon("fa-xmark", "ml-1")}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={reset}
                  className="ml-auto text-xs font-extrabold text-brand-dark underline hover:text-brand-red"
                >
                  Clear all
                </button>
              </div>
            )}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded border border-gray-200 bg-white p-3 text-xs shadow-sm">
              <div>
                <b className="text-brand-dark">{filtered.length} Jobs Found</b>
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-500">
                  Displayed:{" "}
                  {filtered.length
                    ? `${firstResult + 1}-${Math.min(
                        firstResult + perPage,
                        filtered.length,
                      )}`
                    : "0"}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-gray-500">
                  Sort:{" "}
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded border border-gray-200 px-2 py-1 font-bold text-gray-800"
                  >
                    <option value="recent">Recent Jobs</option>
                    <option value="oldest">Oldest Jobs</option>
                    <option value="asc">Title A–Z</option>
                    <option value="desc">Title Z–A</option>
                  </select>
                </label>
                <label className="text-gray-500">
                  Show:{" "}
                  <select
                    value={perPage}
                    onChange={(e) => setPerPage(Number(e.target.value))}
                    className="rounded border border-gray-200 px-2 py-1 font-bold text-gray-800"
                  >
                    {[10, 25, 50, 75, 100, 200].map((amount) => (
                      <option key={amount} value={amount}>
                        {amount} Per Page
                      </option>
                    ))}
                  </select>
                </label>
                <button
                  type="button"
                  onClick={() => setMapOpen(true)}
                  className="rounded bg-brand-charcoal px-3 py-2 text-xs font-bold text-white transition hover:bg-brand-red"
                >
                  {icon("fa-map-location-dot", "mr-1.5")}Map View
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {filtered.length ? (
                paginatedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    logoClassName="h-16 w-16"
                  />
                ))
              ) : (
                <div className="rounded border border-gray-200 bg-white p-12 text-center shadow-sm">
                  <span className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand-red">
                    {icon("fa-magnifying-glass")}
                  </span>
                  <h2 className="text-sm font-bold text-gray-900">
                    No Records Found! Try searching again or{" "}
                    <button
                      onClick={reset}
                      className="font-black text-brand-red underline"
                    >
                      clear filters to view all jobs
                    </button>
                  </h2>
                  <p className="mt-2 text-xs text-gray-500">
                    Check your spelling or remove location filters to expand
                    your search.
                  </p>
                </div>
              )}
            </div>
            <div className="mt-6 flex items-center justify-between rounded border border-gray-200 bg-white p-3 text-xs text-gray-500">
              <span>
                Page {currentPage} of {pageCount}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => setPage((value) => Math.max(1, value - 1))}
                  className="h-8 w-8 rounded border border-gray-200 bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Previous page"
                >
                  ‹
                </button>
                {paginationItems.map((item, index) =>
                  item === "ellipsis" ? (
                    <span
                      key={`ellipsis-${index}`}
                      className="flex h-8 w-6 items-center justify-center"
                    >
                      …
                    </span>
                  ) : (
                    <button
                      key={item}
                      type="button"
                      onClick={() => setPage(item)}
                      className={`h-8 min-w-8 rounded px-2 font-bold ${
                        item === currentPage
                          ? "bg-brand-red text-white"
                          : "border border-gray-200 bg-gray-50 text-gray-600 hover:border-brand-red"
                      }`}
                      aria-label={`Go to page ${item}`}
                      aria-current={item === currentPage ? "page" : undefined}
                    >
                      {item}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  disabled={currentPage === pageCount}
                  onClick={() =>
                    setPage((value) => Math.min(pageCount, value + 1))
                  }
                  className="h-8 w-8 rounded border border-gray-200 bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Next page"
                >
                  ›
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
      {mapOpen && <MapModal close={() => setMapOpen(false)} jobs={filtered} />}
    </>
  )
}

export default JobListingsPage

