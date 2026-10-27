import * as React from "react"
import { FormEvent, useContext, useState } from "react"
import {
  EmployerJobStatus,
  EmployerListing,
  EmployerState,
  SupplyCandidate,
  SupplyState,
} from "../types/employee.types"
import { CandidateApplication, CandidateState } from "../types/candidate.types"
import { ApplicationContext } from "../context/ApplicationContext"
import { CATEGORIES } from "../constants/categories.constants"
import { formatApplicationDate } from "../utils/formatters"
import { icon } from "../components/common/Icon"
import { CandidateEmpty } from "../components/common/CandidateEmpty"
import { JobBadge } from "../components/jobs/JobBadge"
import { SupplyCandidateDetail } from "../components/supply/SupplyCandidateDetail"
import {
  CandidateField,
  CandidateNotice,
  PrivacyControl,
} from "../components/common/DemoFormFields"

const EMPTY_EMPLOYER_LISTING: EmployerListing = {
  id: 0,
  title: "",
  category: "",
  city: "",
  state: "",
  workplace: "On-site",
  type: "FULL TIME",
  denomination: "",
  description: "",
  responsibilities: "",
  qualifications: "",
  salaryMin: "",
  salaryMax: "",
  benefits: "",
  deadline: "",
  applicationInstructions:
    "Submit a resume and optional message through Red Letter Jobs.",
  status: "Draft",
  created: "",
}

function EmployerAuthPage({
  mode,
  enterDemo,
}: {
  mode: "sign-up" | "sign-in"
  enterDemo: () => void
}) {
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-md overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
        <div className="bg-brand-charcoal px-6 py-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
            Employer staging access
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">
            {mode === "sign-up"
              ? "Create an Employer Account"
              : "Employer Sign In"}
          </h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (mode === "sign-up")
              window.location.hash = "/employer/onboarding"
            else enterDemo()
          }}
          className="space-y-4 p-6"
        >
          <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            Authentication is simulated. No account or organization data is
            sent to a server.
          </p>
          {mode === "sign-up" && (
            <CandidateField
              label="Organization name"
              value="Harbor City Church"
              onChange={() => undefined}
            />
          )}
          <CandidateField
            label="Work email"
            value="hiring@harbor-city-church.example"
            onChange={() => undefined}
          />
          <label className="block text-xs font-bold uppercase text-gray-700">
            Password
            <input
              type="password"
              defaultValue="demo-password"
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            {mode === "sign-up"
              ? "Continue to Organization Setup"
              : "Enter Employer Demo"}
          </button>
          <div className="text-center text-xs font-bold">
            <a
              href={
                mode === "sign-up"
                  ? "#/employer/sign-in"
                  : "#/employer/sign-up"
              }
              className="text-brand-red"
            >
              {mode === "sign-up"
                ? "Already have an account? Sign in"
                : "Create an employer account"}
            </a>
          </div>
        </form>
      </div>
    </section>
  )
}

function EmployerOnboarding({
  state,
  setState,
  enterDemo,
}: {
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
  enterDemo: () => void
}) {
  const [organization, setOrganization] = useState(state.organization)
  const update = (
    field: keyof EmployerState["organization"],
    value: string,
  ) => setOrganization((current) => ({ ...current, [field]: value }))
  return (
    <section className="px-6 py-10">
      <form
        onSubmit={(event) => {
          event.preventDefault()
          setState((current) => ({
            ...current,
            organization: { ...organization, verification: "Pending Review" },
          }))
          enterDemo()
        }}
        className="mx-auto max-w-3xl rounded border border-gray-200 bg-white p-6 shadow-lg"
      >
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
          Employer onboarding
        </p>
        <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
          Set Up Your Organization
        </h1>
        <p className="mt-3 text-sm leading-6 text-gray-600">
          This information supports your public organization profile and job
          listings. All data remains simulated in this staging prototype.
        </p>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          <CandidateField label="Organization name" value={organization.name} onChange={(value) => update("name", value)} />
          <CandidateField label="Website" value={organization.website} onChange={(value) => update("website", value)} />
          <CandidateField label="City" value={organization.city} onChange={(value) => update("city", value)} />
          <CandidateField label="State" value={organization.state} onChange={(value) => update("state", value)} />
          <div className="sm:col-span-2">
            <CandidateField label="Denomination / tradition" value={organization.denomination} onChange={(value) => update("denomination", value)} />
          </div>
          <div className="sm:col-span-2">
            <CandidateField label="Organization overview" value={organization.overview} onChange={(value) => update("overview", value)} multiline />
          </div>
        </div>
        <div className="mt-6 rounded bg-blue-50 p-4 text-xs leading-5 text-blue-950">
          Completing setup submits a simulated organization verification review.
          It does not create a verified badge.
        </div>
        <button
          type="submit"
          className="mt-5 rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
        >
          Complete Setup
        </button>
      </form>
    </section>
  )
}

function EmployerJobEditor({
  existing,
  state,
  setState,
}: {
  existing?: EmployerListing
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
}) {
  const [step, setStep] = useState(1)
  const [listing, setListing] = useState<EmployerListing>(
    existing || {
      ...EMPTY_EMPLOYER_LISTING,
      city: state.organization.city,
      state: state.organization.state,
      denomination: state.organization.denomination,
    },
  )
  const [error, setError] = useState("")
  const update = (field: keyof EmployerListing, value: string) =>
    setListing((current) => ({ ...current, [field]: value }))
  const save = (status: EmployerJobStatus) => {
    const saved: EmployerListing = {
      ...listing,
      id:
        listing.id ||
        Math.max(1000, ...state.listings.map((item) => item.id)) + 1,
      created: listing.created || new Date().toISOString().slice(0, 10),
      status,
    }
    setState((current) => ({
      ...current,
      listings: current.listings.some((item) => item.id === saved.id)
        ? current.listings.map((item) =>
            item.id === saved.id ? saved : item,
          )
        : [saved, ...current.listings],
    }))
    window.location.hash = "/employer/jobs"
  }
  const next = () => {
    setError("")
    if (
      step === 1 &&
      (!listing.title ||
        !listing.category ||
        !listing.city ||
        !listing.state)
    ) {
      setError("Complete the title, category, city, and state to continue.")
      return
    }
    if (
      step === 2 &&
      (!listing.description ||
        !listing.responsibilities ||
        !listing.qualifications)
    ) {
      setError(
        "Add the description, responsibilities, and qualifications to continue.",
      )
      return
    }
    setStep((current) => Math.min(5, current + 1))
  }
  const labels = [
    "Job Details",
    "Qualifications",
    "Compensation",
    "Application Settings",
    "Preview & Submit",
  ]
  return (
    <div>
      <div className="mb-6">
        <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
          Guided job posting
        </p>
        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
          {existing ? "Edit Job Listing" : "Create a Job Listing"}
        </h2>
      </div>
      <div className="mb-6 grid gap-2 sm:grid-cols-5">
        {labels.map((label, index) => (
          <button
            key={label}
            type="button"
            onClick={() => index + 1 <= step && setStep(index + 1)}
            className={`rounded px-3 py-2 text-[10px] font-extrabold uppercase tracking-wider ${
              step === index + 1
                ? "bg-brand-red text-white"
                : index + 1 < step
                  ? "bg-brand-charcoal text-white"
                  : "bg-gray-200 text-gray-500"
            }`}
          >
            {index + 1}. {label}
          </button>
        ))}
      </div>
      <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        {error && (
          <p role="alert" className="mb-5 rounded bg-red-50 p-3 text-sm font-bold text-red-900">
            {icon("fa-circle-exclamation", "mr-2")}{error}
          </p>
        )}
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2"><CandidateField label="Job title" value={listing.title} onChange={(value) => update("title", value)} /></div>
            <label className="text-xs font-bold uppercase text-gray-700">
              Ministry category
              <select value={listing.category} onChange={(event) => update("category", event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case">
                <option value="">Select a category</option>
                {CATEGORIES.map((category) => <option key={category.slug} value={category.slug}>{category.name}</option>)}
              </select>
            </label>
            <label className="text-xs font-bold uppercase text-gray-700">
              Employment type
              <select value={listing.type} onChange={(event) => update("type", event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case">
                {["FULL TIME", "PART TIME", "INTERNSHIP", "INTERIM"].map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <CandidateField label="City" value={listing.city} onChange={(value) => update("city", value)} />
            <CandidateField label="State" value={listing.state} onChange={(value) => update("state", value)} />
            <label className="text-xs font-bold uppercase text-gray-700">
              Workplace arrangement
              <select value={listing.workplace} onChange={(event) => update("workplace", event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case">
                {["On-site", "Hybrid", "Remote"].map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>
            <CandidateField label="Denomination (where relevant)" value={listing.denomination} onChange={(value) => update("denomination", value)} />
          </div>
        )}
        {step === 2 && (
          <div className="space-y-4">
            <CandidateField label="Job description" value={listing.description} onChange={(value) => update("description", value)} multiline />
            <CandidateField label="Responsibilities" value={listing.responsibilities} onChange={(value) => update("responsibilities", value)} multiline help="Enter one responsibility per line." />
            <CandidateField label="Qualifications" value={listing.qualifications} onChange={(value) => update("qualifications", value)} multiline help="Enter one qualification per line." />
          </div>
        )}
        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <CandidateField label="Minimum annual salary" value={listing.salaryMin} onChange={(value) => update("salaryMin", value)} />
            <CandidateField label="Maximum annual salary" value={listing.salaryMax} onChange={(value) => update("salaryMax", value)} />
            <div className="sm:col-span-2"><CandidateField label="Benefits" value={listing.benefits} onChange={(value) => update("benefits", value)} multiline /></div>
            <p className="sm:col-span-2 rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
              Compensation is shown only when provided. Enter sample values for
              this staging listing.
            </p>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <label className="block text-xs font-bold uppercase text-gray-700">
              Application deadline
              <input type="date" value={listing.deadline} onChange={(event) => update("deadline", event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case sm:max-w-sm" />
            </label>
            <CandidateField label="Application instructions" value={listing.applicationInstructions} onChange={(value) => update("applicationInstructions", value)} multiline />
            <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
              Applications, messages, and resume delivery remain simulated in
              this prototype.
            </p>
          </div>
        )}
        {step === 5 && (
          <div>
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-200 pb-5">
              <div>
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">Preview</span>
                <h3 className="mt-3 text-2xl font-black text-brand-dark">{listing.title || "Untitled position"}</h3>
                <p className="mt-1 text-sm font-bold text-gray-600">{state.organization.name}</p>
                <p className="mt-2 text-xs text-gray-500">{listing.city}, {listing.state} · {listing.workplace} · {listing.type}</p>
              </div>
              <JobBadge type={listing.type} />
            </div>
            {[
              ["Position Overview", listing.description],
              ["Responsibilities", listing.responsibilities],
              ["Qualifications", listing.qualifications],
              ["Benefits", listing.benefits],
              ["Application Instructions", listing.applicationInstructions],
            ].map(([title, body]) => body && (
              <section key={title} className="border-b border-gray-100 py-5 last:border-0">
                <h4 className="text-sm font-black uppercase tracking-tight text-brand-dark">{title}</h4>
                <p className="mt-2 whitespace-pre-line text-sm leading-6 text-gray-600">{body}</p>
              </section>
            ))}
          </div>
        )}
        <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-gray-200 pt-5 sm:flex-row">
          <div className="flex gap-3">
            <button type="button" onClick={() => save("Draft")} className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark">Save Draft</button>
            {step > 1 && <button type="button" onClick={() => setStep((current) => current - 1)} className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark">Back</button>}
          </div>
          {step < 5 ? (
            <button type="button" onClick={next} className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white">Continue</button>
          ) : (
            <button type="button" onClick={() => save("Pending Review")} className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white">Submit for Review</button>
          )}
        </div>
      </section>
    </div>
  )
}

function EmployerSupplyCandidateCard({
  candidate,
  saved,
  view,
  invite,
  toggleSaved,
}: {
  candidate: SupplyCandidate
  saved: boolean
  view: () => void
  invite: () => void
  toggleSaved: () => void
}) {
  return (
    <article className="group overflow-hidden rounded border border-gray-200 bg-white shadow-sm transition hover:border-brand-red hover:shadow-md">
      <div className="relative h-16 bg-brand-charcoal">
        <span className="absolute right-0 top-0 h-16 w-16 rounded-bl-full bg-brand-red opacity-90" />
        <button
          type="button"
          onClick={toggleSaved}
          aria-label={saved ? `Remove ${candidate.name} from saved profiles` : `Save ${candidate.name}`}
          aria-pressed={saved}
          className={`absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full border text-xs transition ${
            saved
              ? "border-white bg-white text-brand-red"
              : "border-white/40 bg-brand-charcoal/30 text-white hover:bg-white hover:text-brand-red"
          }`}
        >
          {icon("fa-heart")}
        </button>
        <img
          src={`https://i.pravatar.cc/200?img=${candidate.id + 20}`}
          alt={`${candidate.name} sample profile`}
          loading="lazy"
          decoding="async"
          className="absolute -bottom-10 left-4 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
        />
      </div>
      <div className="px-4 pb-4 pt-3">
        <div className="min-h-16 pl-28">
          <h3 className="truncate text-lg font-black text-brand-dark">
            {candidate.name}
          </h3>
          <p className="mt-0.5 truncate text-sm font-bold text-brand-red">
            {candidate.roles[0]}
          </p>
          {candidate.availabilityVisible && candidate.availability.length > 0 && (
            <span className="mt-1 inline-flex rounded-full bg-emerald-50 px-2 py-1 text-xs font-extrabold uppercase text-emerald-800">
              {icon("fa-circle", "mr-1 text-[6px]")}Available
            </span>
          )}
        </div>
        <div className="mt-3 space-y-1.5 text-sm leading-5 text-gray-500">
          <p className="truncate">{icon("fa-location-dot", "mr-1.5 text-gray-400")}{candidate.city}, {candidate.state}</p>
          <p>{icon("fa-briefcase", "mr-1.5 text-gray-400")}{candidate.experience} years of experience</p>
          {candidate.theologyVisible && (
            <p className="truncate">{icon("fa-church", "mr-1.5 text-gray-400")}{candidate.denomination}</p>
          )}
        </div>
        {candidate.availabilityVisible && candidate.availability[0] && (
          <div className="mt-3">
            {candidate.availability.slice(0, 1).map((item) => (
              <span key={item} className="inline-flex rounded bg-slate-100 px-2 py-1 text-xs font-bold text-gray-600">
                {icon("fa-calendar-check", "mr-1 text-brand-red")}{item}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-2 border-t border-gray-100 bg-slate-50 p-2.5">
        <button
          type="button"
          onClick={view}
          className="rounded border border-gray-300 bg-white px-2 py-2.5 text-xs font-bold uppercase text-brand-dark transition hover:border-brand-red hover:text-brand-red"
        >
          Profile
        </button>
        <button
          type="button"
          onClick={invite}
          className="rounded bg-brand-red px-2 py-2.5 text-xs font-extrabold uppercase text-white transition hover:bg-brand-red-hover"
        >
          Invite
        </button>
      </div>
    </article>
  )
}

function EmployerSupplyArea({
  state,
  setState,
  organization,
}: {
  state: SupplyState
  setState: React.Dispatch<React.SetStateAction<SupplyState>>
  organization: EmployerState["organization"]
}) {
  const [view, setView] = useState("Search")
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [role, setRole] = useState("")
  const [denomination, setDenomination] = useState("")
  const [theology, setTheology] = useState("")
  const [category, setCategory] = useState("")
  const [availability, setAvailability] = useState("")
  const [sort, setSort] = useState("experience")
  const [selected, setSelected] = useState<SupplyCandidate | null>(null)
  const [bookingCandidate, setBookingCandidate] =
    useState<SupplyCandidate | null>(null)
  const [notice, setNotice] = useState("")
  const [booking, setBooking] = useState({
    contactPerson: "Morgan Lee",
    date: "",
    time: "",
    role: "",
    location: `${organization.city}, ${organization.state}`,
    description: "",
    congregationSize: "",
    serviceFormat: "",
    theologicalPreference: "",
    honorarium: "",
    travelReimbursement: "",
    lodging: "",
    instructions: "",
  })
  const candidates = [
    ...state.candidates,
    ...(state.enabled && state.profile.profileVisible ? [state.profile] : []),
  ].filter(
    (candidate) =>
      candidate.profileVisible &&
      (!query ||
        `${candidate.name} ${candidate.roles.join(" ")} ${candidate.biography}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!location ||
        `${candidate.city} ${candidate.state}`
          .toLowerCase()
          .includes(location.toLowerCase())) &&
      (!role ||
        candidate.roles.some((item) =>
          item.toLowerCase().includes(role.toLowerCase()),
        )) &&
      (!denomination ||
        candidate.denomination
          .toLowerCase()
          .includes(denomination.toLowerCase())) &&
      (!category || candidate.category === category) &&
      (!availability ||
        candidate.availability.some((item) =>
          item.toLowerCase().includes(availability.toLowerCase()),
        )) &&
      (!theology ||
        (candidate.theologyVisible && candidate.theology === theology)),
  ).sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : sort === "distance"
        ? a.travelDistance - b.travelDistance
        : b.experience - a.experience,
  )
  const activeSearchFilters = [
    query,
    location,
    role,
    denomination,
    theology,
    category,
    availability,
  ].filter(Boolean).length
  const clearSearchFilters = () => {
    setQuery("")
    setLocation("")
    setRole("")
    setDenomination("")
    setTheology("")
    setCategory("")
    setAvailability("")
  }
  const sendBooking = (event: FormEvent) => {
    event.preventDefault()
    if (!bookingCandidate || !booking.date || !booking.time || !booking.role || !booking.description) {
      setNotice("Complete the required booking details before sending.")
      return
    }
    const overlap = state.bookings.some(
      (item) =>
        item.candidateId === bookingCandidate.id &&
        item.date === booking.date &&
        item.time === booking.time &&
        item.status === "Accepted",
    )
    if (overlap) {
      setNotice(
        "This candidate already has a confirmed engagement at that date and time.",
      )
      return
    }
    setState((current) => ({
      ...current,
      bookings: [
        {
          id: Math.max(0, ...current.bookings.map((item) => item.id)) + 1,
          candidateId: bookingCandidate.id,
          church: organization.name,
          contactPerson: booking.contactPerson,
          date: booking.date,
          time: booking.time,
          role: booking.role,
          location: booking.location,
          description: booking.description,
          congregationSize: booking.congregationSize,
          serviceFormat: booking.serviceFormat,
          theologicalPreference: booking.theologicalPreference,
          honorarium: booking.honorarium,
          travelReimbursement: booking.travelReimbursement,
          lodging: booking.lodging,
          instructions: booking.instructions,
          status: "Request Sent",
          messages: [],
        },
        ...current.bookings,
      ],
    }))
    setBookingCandidate(null)
    setView("Bookings")
    setNotice("Booking request sent in the staging workflow.")
  }
  return (
    <div>
      <EmployerPageHeader
        title="Pulpit Supply"
        description="Browse available ministry professionals and send service invitations."
      />
      <div className="mb-4 flex gap-6 overflow-x-auto border-b border-gray-200">
        {[
          ["Search", "Browse"],
          ["Bookings", "Requests"],
          ["Calendar", "Calendar"],
          ["Saved Candidates", "Saved"],
        ].map(([item, label]) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setView(item)
              setSelected(null)
              setBookingCandidate(null)
            }}
            className={`shrink-0 border-b-2 px-1 pb-3 text-xs font-bold uppercase transition ${
              view === item
                ? "border-brand-red text-brand-red"
                : "border-transparent text-gray-500 hover:text-brand-dark"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
      {view === "Search" && !selected && !bookingCandidate && (
        <>
          <section className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <label className="text-xs font-bold uppercase text-gray-700 sm:col-span-2">
                Name, role, instrument, or keyword
                <span className="mt-1.5 flex items-center rounded border border-gray-300 bg-white px-3 focus-within:border-brand-red">
                  {icon("fa-magnifying-glass", "mr-2 text-gray-400")}
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="Search profiles"
                    className="w-full py-2.5 text-sm font-normal normal-case outline-none"
                  />
                </span>
              </label>
              <label className="text-xs font-bold uppercase text-gray-700">
                Location
                <input
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="City, state, or province"
                  className="mt-1.5 w-full rounded border border-gray-300 p-2.5 text-sm font-normal normal-case outline-none focus:border-brand-red"
                />
              </label>
              <label className="text-xs font-bold uppercase text-gray-700">
                Ministry type
                <select value={category} onChange={(event) => setCategory(event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 bg-white p-2.5 text-sm font-normal normal-case">
                  <option value="">All ministry types</option>
                  <option value="Preaching">Preaching Supply</option>
                  <option value="Worship">Worship & Music</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase text-gray-700">
                Denomination
                <input
                  value={denomination}
                  onChange={(event) => setDenomination(event.target.value)}
                  placeholder="Any denomination"
                  className="mt-1.5 w-full rounded border border-gray-300 p-2.5 text-sm font-normal normal-case outline-none focus:border-brand-red"
                />
              </label>
              <label className="text-xs font-bold uppercase text-gray-700">
                Availability
                <select value={availability} onChange={(event) => setAvailability(event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 bg-white p-2.5 text-sm font-normal normal-case">
                  <option value="">Any availability</option>
                  <option value="Sunday">Sunday services</option>
                  <option value="Special">Special events</option>
                  <option value="Conference">Conferences</option>
                  <option value="Holiday">Holiday services</option>
                </select>
              </label>
              <label className="text-xs font-bold uppercase text-gray-700">
                Sort profiles
                <select value={sort} onChange={(event) => setSort(event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 bg-white p-2.5 text-sm font-normal normal-case">
                  <option value="experience">Most experienced</option>
                  <option value="distance">Shortest travel range</option>
                  <option value="name">Name A–Z</option>
                </select>
              </label>
              <details className="group rounded border border-gray-200 bg-slate-50 sm:col-span-2 lg:col-span-1">
                <summary className="flex cursor-pointer list-none items-center justify-between px-3 py-2.5 text-xs font-bold uppercase text-gray-700">
                  More filters {icon("fa-chevron-down", "transition group-open:rotate-180")}
                </summary>
                <div className="space-y-3 border-t border-gray-200 p-3">
                  <label className="block text-xs font-bold text-gray-700">
                    Specific role
                    <input value={role} onChange={(event) => setRole(event.target.value)} placeholder="e.g. Guest Preacher" className="mt-1 w-full rounded border border-gray-300 bg-white p-2 text-sm font-normal outline-none" />
                  </label>
                  <label className="block text-xs font-bold text-gray-700">
                    Shared theology
                    <select value={theology} onChange={(event) => setTheology(event.target.value)} className="mt-1 w-full rounded border border-gray-300 bg-white p-2 text-sm font-normal">
                      <option value="">Any shared theology</option>
                      {["Calvinist", "Arminian", "Reformed", "Wesleyan", "Evangelical", "Pentecostal", "Charismatic"].map((item) => <option key={item}>{item}</option>)}
                    </select>
                  </label>
                </div>
              </details>
            </div>
          </section>
          <div className="mt-4 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-base font-black text-brand-dark">Available professionals</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {candidates.length} {candidates.length === 1 ? "profile matches" : "profiles match"} your search
              </p>
            </div>
            {activeSearchFilters > 0 && (
              <button type="button" onClick={clearSearchFilters} className="shrink-0 text-xs font-bold text-brand-red hover:underline">
                Clear filters
              </button>
            )}
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {candidates.map((candidate) => (
              <EmployerSupplyCandidateCard
                key={candidate.id}
                candidate={candidate}
                saved={state.savedCandidateIds.includes(candidate.id)}
                view={() => setSelected(candidate)}
                invite={() => setBookingCandidate(candidate)}
                toggleSaved={() =>
                  setState((current) => ({
                    ...current,
                    savedCandidateIds: current.savedCandidateIds.includes(
                      candidate.id,
                    )
                      ? current.savedCandidateIds.filter(
                          (id) => id !== candidate.id,
                        )
                      : [...current.savedCandidateIds, candidate.id],
                  }))
                }
              />
            ))}
          </div>
          {!candidates.length && <CandidateEmpty title="No supply candidates found" description="Try a broader location, remove a ministry type, or clear optional filters." action="Clear Filters" onAction={clearSearchFilters} />}
        </>
      )}
      {selected && (
        <SupplyCandidateDetail
          candidate={selected}
          close={() => setSelected(null)}
          invite={() => { setBookingCandidate(selected); setSelected(null) }}
        />
      )}
      {bookingCandidate && (
        <form onSubmit={sendBooking} className="space-y-5 rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between"><div><p className="text-xs font-extrabold uppercase text-brand-red">Booking Request</p><h3 className="mt-1 text-2xl font-black text-brand-dark">{bookingCandidate.name}</h3></div><button type="button" onClick={() => setBookingCandidate(null)} aria-label="Close booking form">{icon("fa-xmark")}</button></div>
          <div className="grid gap-4 sm:grid-cols-2">
            <CandidateField label="Church name" value={organization.name} onChange={() => undefined} />
            <CandidateField label="Contact person" value={booking.contactPerson} onChange={(value) => setBooking((current) => ({ ...current, contactPerson: value }))} />
            <label className="text-xs font-bold uppercase text-gray-700">Service date *<input required type="date" value={booking.date} onChange={(event) => setBooking((current) => ({ ...current, date: event.target.value }))} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal" /></label>
            <label className="text-xs font-bold uppercase text-gray-700">Service time *<input required type="time" value={booking.time} onChange={(event) => setBooking((current) => ({ ...current, time: event.target.value }))} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal" /></label>
            <CandidateField label="Ministry role requested *" value={booking.role} onChange={(value) => setBooking((current) => ({ ...current, role: value }))} />
            <CandidateField label="Church location *" value={booking.location} onChange={(value) => setBooking((current) => ({ ...current, location: value }))} />
            <div className="sm:col-span-2"><CandidateField label="Assignment description *" value={booking.description} onChange={(value) => setBooking((current) => ({ ...current, description: value }))} multiline /></div>
            <CandidateField label="Congregation size (Optional)" value={booking.congregationSize} onChange={(value) => setBooking((current) => ({ ...current, congregationSize: value }))} />
            <CandidateField label="Service format (Optional)" value={booking.serviceFormat} onChange={(value) => setBooking((current) => ({ ...current, serviceFormat: value }))} />
            <CandidateField label="Preferred theological background (Optional)" value={booking.theologicalPreference} onChange={(value) => setBooking((current) => ({ ...current, theologicalPreference: value }))} />
            <CandidateField label="Suggested honorarium (Optional)" value={booking.honorarium} onChange={(value) => setBooking((current) => ({ ...current, honorarium: value }))} />
            <CandidateField label="Travel reimbursement (Optional)" value={booking.travelReimbursement} onChange={(value) => setBooking((current) => ({ ...current, travelReimbursement: value }))} />
            <CandidateField label="Lodging arrangements (Optional)" value={booking.lodging} onChange={(value) => setBooking((current) => ({ ...current, lodging: value }))} />
            <div className="sm:col-span-2"><CandidateField label="Special instructions (Optional)" value={booking.instructions} onChange={(value) => setBooking((current) => ({ ...current, instructions: value }))} multiline /></div>
          </div>
          <button type="submit" className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase text-white">Send Booking Request</button>
        </form>
      )}
      {view === "Bookings" && (
        <div className="space-y-5">
          {["Pending Invitations", "Upcoming Engagements", "Completed Engagements", "Cancelled Engagements"].map((heading) => {
            const items = state.bookings.filter((booking) => heading.startsWith("Pending") ? ["Request Sent", "Awaiting Response"].includes(booking.status) : heading.startsWith("Upcoming") ? booking.status === "Accepted" : heading.startsWith("Completed") ? booking.status === "Completed" : booking.status === "Cancelled")
            return <section key={heading}><h3 className="mb-3 border-b border-gray-200 pb-2 text-base font-black uppercase text-brand-dark">{heading} ({items.length})</h3>{items.length ? <div className="space-y-3">{items.map((booking) => { const candidate = [...state.candidates, state.profile].find((item) => item.id === booking.candidateId); return <article key={booking.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-3 sm:flex-row"><div><p className="font-black text-brand-dark">{booking.role} · {candidate?.name}</p><p className="mt-1 text-sm text-gray-500">{booking.date} at {booking.time} · {booking.location}</p></div><span className="self-start rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">{booking.status}</span></div>{!["Completed", "Cancelled", "Declined"].includes(booking.status) && <button type="button" onClick={() => setState((current) => ({ ...current, bookings: current.bookings.map((item) => item.id === booking.id ? { ...item, status: "Cancelled" } : item) }))} className="mt-3 text-xs font-bold uppercase text-brand-red">Cancel Engagement</button>}</article> })}</div> : <p className="rounded bg-slate-50 p-4 text-sm text-gray-500">No {heading.toLowerCase()}.</p>}</section>
          })}
        </div>
      )}
      {view === "Calendar" && (
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm"><h3 className="text-xl font-black uppercase text-brand-dark">Engagement Calendar</h3><div className="mt-5 grid gap-3 sm:grid-cols-2">{state.bookings.map((booking) => { const candidate = [...state.candidates, state.profile].find((item) => item.id === booking.candidateId); return <div key={booking.id} className="rounded border border-gray-200 p-4"><strong className="text-brand-dark">{booking.date} · {booking.time}</strong><p className="mt-1 text-sm text-gray-600">{organization.name} · {candidate?.name}</p><p className="mt-1 text-xs font-bold text-brand-red">{booking.status}</p></div> })}</div></div>
      )}
      {view === "Saved Candidates" && !selected && !bookingCandidate && (
        <div>
          <div className="mb-5">
            <h3 className="text-lg font-black text-brand-dark">Saved profiles</h3>
            <p className="mt-1 text-sm text-gray-500">
              Return to promising ministry professionals and invite them when your dates are ready.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {state.candidates
              .filter((candidate) => state.savedCandidateIds.includes(candidate.id))
              .map((candidate) => (
                <EmployerSupplyCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  saved
                  view={() => setSelected(candidate)}
                  invite={() => setBookingCandidate(candidate)}
                  toggleSaved={() =>
                    setState((current) => ({
                      ...current,
                      savedCandidateIds: current.savedCandidateIds.filter(
                        (id) => id !== candidate.id,
                      ),
                    }))
                  }
                />
              ))}
          </div>
          {!state.savedCandidateIds.length && (
            <CandidateEmpty
              title="No saved supply candidates"
              description="Save candidates from search results to compare them later."
              action="Browse Candidates"
              onAction={() => setView("Search")}
            />
          )}
        </div>
      )}
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

export function EmployerExperience({
  hash,
  state,
  setState,
  candidateState,
  setCandidateState,
  enterDemo,
  supplyState,
  setSupplyState,
}: {
  hash: string
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
  candidateState: CandidateState
  setCandidateState: React.Dispatch<React.SetStateAction<CandidateState>>
  enterDemo: () => void
  supplyState: SupplyState
  setSupplyState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  const [notice, setNotice] = useState("")
  if (hash === "/employer/sign-up") return <EmployerAuthPage mode="sign-up" enterDemo={enterDemo} />
  if (hash === "/employer/sign-in") return <EmployerAuthPage mode="sign-in" enterDemo={enterDemo} />
  if (hash === "/employer/onboarding") return <EmployerOnboarding state={state} setState={setState} enterDemo={enterDemo} />

  const navigation = [
    ["Overview", "/employer/dashboard", "fa-gauge-high"],
    ["Jobs", "/employer/jobs", "fa-briefcase"],
    ["Applicants", "/employer/applicants", "fa-user-group"],
    ["Pulpit Supply", "/employer/pulpit-supply", "fa-person-chalkboard"],
    ["Messages", "/employer/messages", "fa-envelope"],
    ["Organization Profile", "/employer/organization", "fa-church"],
    ["Billing", "/employer/billing", "fa-receipt"],
    ["Team and Settings", "/employer/team-settings", "fa-users-gear"],
  ]
  const employerJobIds = state.listings.map((item) => item.id)
  const employerApplications = candidateState.applications.filter((item) =>
    employerJobIds.includes(item.jobId),
  )
  const content = hash === "/employer/jobs/new" ? (
    <EmployerJobEditor state={state} setState={setState} />
  ) : hash.includes("/edit") ? (
    <EmployerJobEditor
      existing={state.listings.find(
        (item) => item.id === Number(hash.split("/")[3]),
      )}
      state={state}
      setState={setState}
    />
  ) : hash.includes("/preview") ? (
    <EmployerJobPreview
      listing={state.listings.find(
        (item) => item.id === Number(hash.split("/")[3]),
      )}
      organization={state.organization}
    />
  ) : hash === "/employer/jobs" ? (
    <EmployerJobsPage state={state} setState={setState} />
  ) : hash.startsWith("/employer/applicants/") ? (
    <EmployerApplicantDetail
      application={candidateState.applications.find(
        (item) =>
          item.id === Number(hash.split("/").pop()) &&
          employerJobIds.includes(item.jobId),
      )}
      state={state}
      setState={setState}
      setCandidateState={setCandidateState}
    />
  ) : hash === "/employer/applicants" ? (
    <EmployerApplicantsPage
      applications={employerApplications}
      setCandidateState={setCandidateState}
    />
  ) : hash === "/employer/pulpit-supply" ? (
    <EmployerSupplyArea
      state={supplyState}
      setState={setSupplyState}
      organization={state.organization}
    />
  ) : hash === "/employer/messages" ? (
    <EmployerMessages application={employerApplications[0]} />
  ) : hash === "/employer/organization" ? (
    <EmployerOrganizationPage state={state} setState={setState} />
  ) : hash === "/employer/billing" ? (
    <EmployerBilling />
  ) : hash === "/employer/team-settings" ? (
    <EmployerTeamSettings notice={notice} setNotice={setNotice} />
  ) : (
    <EmployerOverview state={state} applications={employerApplications} />
  )

  return (
    <>
      <section className="border-b border-gray-800 bg-brand-charcoal px-6 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">Employer workspace</p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">{state.organization.name}</h1>
            <p className="mt-1 text-sm text-gray-300">Hiring tools and organization management</p>
          </div>
          <VerificationStatus status={state.organization.verification} />
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="overflow-hidden rounded border border-gray-200 bg-white py-2 shadow-sm" aria-label="Employer dashboard">
            {navigation.map(([label, path, iconName]) => (
              <a key={path} href={`#${path}`} className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${hash === path || (path !== "/employer/dashboard" && hash.startsWith(path)) ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red" : "text-gray-700 hover:bg-gray-50"}`}>
                {icon(iconName, "w-5 text-center")}{label}
              </a>
            ))}
          </nav>
          <a href="#/employer/jobs/new" className="mt-4 flex items-center justify-center rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
            {icon("fa-plus", "mr-2")}Create Job
          </a>
        </aside>
        <div className="lg:col-span-9">{content}</div>
      </div>
    </>
  )
}

export function VerificationStatus({
  status,
}: {
  status: EmployerState["organization"]["verification"]
}) {
  return (
    <span className={`self-start rounded px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider sm:self-auto ${status === "Verified Demo" ? "bg-emerald-100 text-emerald-900" : status === "Pending Review" ? "bg-amber-100 text-amber-950" : "bg-gray-200 text-gray-800"}`}>
      {status === "Verified Demo" && icon("fa-circle-check", "mr-1.5")}
      {status === "Verified Demo" ? "Verified Demo Organization" : `Verification: ${status}`}
    </span>
  )
}

function EmployerOverview({
  state,
  applications,
}: {
  state: EmployerState
  applications: CandidateApplication[]
}) {
  return (
    <div>
      <EmployerPageHeader title="Overview" description="Track listing activity and applicant progress across your staging workspace." />
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Published jobs", state.listings.filter((item) => item.status === "Published").length, "fa-briefcase"],
          ["Applicants", applications.length, "fa-user-group"],
          ["Pending review", state.listings.filter((item) => item.status === "Pending Review").length, "fa-clock"],
        ].map(([label, value, iconName]) => (
          <article key={label} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-brand-red">{icon(String(iconName))}</span>
            <strong className="mt-4 block text-3xl font-black text-brand-dark">{value}</strong>
            <span className="text-xs font-extrabold uppercase tracking-wider text-gray-500">{label}</span>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">End-to-end demo path</h3>
        <div className="mt-5 grid gap-3 sm:grid-cols-5">
          {["Organization setup", "Create job", "Submit review", "Admin approval", "Review applicants"].map((step, index) => (
            <div key={step} className="rounded bg-slate-50 p-3 text-center">
              <span className="text-xl font-black text-gray-300">{index + 1}</span>
              <p className="mt-1 text-xs font-bold text-brand-dark">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

function EmployerJobsPage({
  state,
  setState,
}: {
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
}) {
  const { applications } = useContext(ApplicationContext)
  const changeStatus = (id: number, status: EmployerJobStatus) =>
    setState((current) => ({
      ...current,
      listings: current.listings.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    }))
  return (
    <div>
      <EmployerPageHeader title="Jobs" description="Create, preview, duplicate, close, and manage each ministry listing." action="Create Job" href="#/employer/jobs/new" />
      <div className="space-y-3">
        {state.listings.map((listing) => (
          <article key={listing.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-extrabold text-brand-dark">{listing.title || "Untitled draft"}</h3>
                  <ListingStatus status={listing.status} />
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  {listing.city}, {listing.state} · {listing.type} ·{" "}
                  {listing.workplace} ·{" "}
                  {
                    applications.filter(
                      (application) => application.jobId === listing.id,
                    ).length
                  }{" "}
                  applicants
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href={`#/employer/jobs/${listing.id}/preview`} className="rounded border border-gray-300 px-3 py-2 text-[10px] font-bold uppercase text-brand-dark">Preview</a>
                <a href={`#/employer/jobs/${listing.id}/edit`} className="rounded border border-gray-300 px-3 py-2 text-[10px] font-bold uppercase text-brand-dark">Edit</a>
                <button type="button" onClick={() => setState((current) => ({ ...current, listings: [{ ...listing, id: Math.max(...current.listings.map((item) => item.id)) + 1, title: `${listing.title} (Copy)`, status: "Draft" }, ...current.listings] }))} className="rounded border border-gray-300 px-3 py-2 text-[10px] font-bold uppercase text-brand-dark">Duplicate</button>
                {listing.status !== "Closed" && <button type="button" onClick={() => changeStatus(listing.id, "Closed")} className="rounded border border-red-300 px-3 py-2 text-[10px] font-bold uppercase text-brand-red">Close</button>}
              </div>
            </div>
            {listing.status === "Pending Review" && (
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded bg-amber-50 p-3 text-xs text-amber-950">
                <span>This listing is waiting for simulated admin approval.</span>
                <a href="#/admin/dashboard" className="font-extrabold uppercase text-brand-red">Open Admin Demo</a>
              </div>
            )}
            {(listing.status === "Changes Requested" ||
              listing.status === "Rejected") && (
              <div
                className={`mt-4 rounded p-3 text-xs ${
                  listing.status === "Rejected"
                    ? "bg-red-50 text-red-900"
                    : "bg-amber-50 text-amber-950"
                }`}
              >
                <strong>{listing.status}:</strong>{" "}
                {state.moderationHistory[listing.id]?.[0]?.reason ||
                  "Review the listing and contact support for details."}
                {listing.status === "Changes Requested" && (
                  <a
                    href={`#/employer/jobs/${listing.id}/edit`}
                    className="ml-2 font-extrabold uppercase text-brand-red"
                  >
                    Edit and resubmit
                  </a>
                )}
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  )
}

function EmployerJobPreview({
  listing,
  organization,
}: {
  listing?: EmployerListing
  organization: EmployerState["organization"]
}) {
  if (!listing) return <CandidateEmpty title="Listing not found" action="Back to Jobs" href="#/employer/jobs" />
  return (
    <div>
      <EmployerPageHeader title="Listing Preview" description="This is how the core listing content will appear after approval." />
      <article className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-2"><ListingStatus status={listing.status} /><span className="rounded bg-gray-100 px-2 py-1 text-[10px] font-bold uppercase text-gray-600">Employer preview</span></div>
        <h2 className="mt-4 text-3xl font-black text-brand-dark">{listing.title}</h2>
        <p className="mt-2 font-bold text-gray-700">{organization.name}</p>
        <p className="mt-2 text-sm text-gray-500">{listing.city}, {listing.state} · {listing.workplace} · {listing.type}</p>
        {[["Description", listing.description], ["Responsibilities", listing.responsibilities], ["Qualifications", listing.qualifications], ["Benefits", listing.benefits]].map(([title, body]) => (
          <section key={title} className="mt-6 border-t border-gray-200 pt-5">
            <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">{title}</h3>
            <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">{body || "Not provided."}</p>
          </section>
        ))}
        <div className="mt-6 flex gap-3">
          <a href={`#/employer/jobs/${listing.id}/edit`} className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase text-white">Edit Listing</a>
          <a href="#/employer/jobs" className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark">Back to Jobs</a>
        </div>
      </article>
    </div>
  )
}

export function ListingStatus({ status }: { status: EmployerJobStatus }) {
  const colors = status === "Published" ? "bg-emerald-100 text-emerald-800" : status === "Pending Review" ? "bg-amber-100 text-amber-900" : status === "Closed" ? "bg-gray-200 text-gray-700" : "bg-blue-50 text-blue-700"
  return <span className={`rounded px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider ${colors}`}>{status}</span>
}

function EmployerApplicantsPage({
  applications,
  setCandidateState,
}: {
  applications: CandidateApplication[]
  setCandidateState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs } = useContext(ApplicationContext)
  const [search, setSearch] = useState("")
  const [jobId, setJobId] = useState("")
  const [stage, setStage] = useState("")
  const stages = ["New", "Reviewing", "Shortlisted", "Interview", "Hired", "Not Selected"]
  const filtered = applications.filter((application) => {
    const job = jobs.find((item) => item.id === application.jobId)
    return (
      (!search || `${application.candidateName} ${job?.title}`.toLowerCase().includes(search.toLowerCase())) &&
      (!jobId || application.jobId === Number(jobId)) &&
      (!stage || application.status === stage)
    )
  })
  const updateStage = (id: number, status: string) =>
    setCandidateState((current) => ({
      ...current,
      applications: current.applications.map((item) =>
        item.id === id ? { ...item, status } : item,
      ),
    }))
  return (
    <div>
      <EmployerPageHeader title="Applicants" description="Search, filter, and move applicants through your hiring stages." />
      <div className="mb-5 grid gap-3 rounded border border-gray-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate or job" aria-label="Search applicants by candidate or job" className="rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-brand-red" />
        <select value={jobId} onChange={(event) => setJobId(event.target.value)} className="rounded border border-gray-300 p-2.5 text-sm"><option value="">All jobs</option>{jobs.filter((job) => applications.some((item) => item.jobId === job.id)).map((job) => <option key={job.id} value={job.id}>{job.title}</option>)}</select>
        <select value={stage} onChange={(event) => setStage(event.target.value)} className="rounded border border-gray-300 p-2.5 text-sm"><option value="">All stages</option>{stages.map((item) => <option key={item}>{item}</option>)}</select>
      </div>
      {filtered.length ? (
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          {filtered.map((application) => {
            const job = jobs.find((item) => item.id === application.jobId)
            return (
              <article key={application.id} className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 last:border-0 lg:flex-row lg:items-center">
                <div><h3 className="font-extrabold text-brand-dark">{application.candidateName}</h3><p className="mt-1 text-sm text-gray-600">{job?.title || "Position unavailable"}</p><p className="mt-1 text-xs text-gray-500">Applied {formatApplicationDate(application.applied)}</p></div>
                <div className="flex flex-wrap items-center gap-3">
                  <select value={application.status} onChange={(event) => updateStage(application.id, event.target.value)} className="rounded border border-gray-300 px-2 py-2 text-xs font-bold">
                    {!stages.includes(application.status) && <option>{application.status}</option>}
                    {stages.map((item) => <option key={item}>{item}</option>)}
                  </select>
                  <a href={`#/employer/applicants/${application.id}`} className="text-xs font-extrabold uppercase tracking-wider text-brand-red">View applicant</a>
                </div>
              </article>
            )
          })}
        </div>
      ) : <CandidateEmpty title="No applicants found" description="Adjust the search or filters to see more candidates." action="Clear Filters" onAction={() => { setSearch(""); setJobId(""); setStage("") }} />}
    </div>
  )
}

function EmployerApplicantDetail({
  application,
  state,
  setState,
  setCandidateState,
}: {
  application?: CandidateApplication
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
  setCandidateState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs } = useContext(ApplicationContext)
  const [note, setNote] = useState(application ? state.internalNotes[application.id] || "" : "")
  const [message, setMessage] = useState("")
  const [notice, setNotice] = useState("")
  if (!application) return <CandidateEmpty title="Applicant not found" action="Back to Applicants" href="#/employer/applicants" />
  const job = jobs.find((item) => item.id === application.jobId)
  return (
    <div>
      <EmployerPageHeader title={application.candidateName} description={`Applicant for ${job?.title || "a ministry position"}`} />
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Candidate Profile</h3>
          <dl className="mt-4 divide-y divide-gray-200 text-sm">
            <div className="py-3"><dt className="text-xs text-gray-500">Professional headline</dt><dd className="mt-1 font-bold text-brand-dark">Discipleship and Community Ministry Leader</dd></div>
            <div className="py-3"><dt className="text-xs text-gray-500">Location</dt><dd className="mt-1 font-bold text-brand-dark">Denver, Colorado</dd></div>
            <div className="py-3"><dt className="text-xs text-gray-500">Resume</dt><dd className="mt-1 font-bold text-brand-red">{application.resumeName}</dd></div>
          </dl>
          <div className="mt-4 rounded bg-blue-50 p-4 text-xs leading-5 text-blue-950">
            <strong className="block">Submitted resume view</strong>
            This filename represents the private resume shared with this
            application. Document download is simulated.
          </div>
          <h4 className="mt-5 text-xs font-extrabold uppercase text-gray-500">Application message</h4>
          <p className="mt-2 rounded bg-slate-50 p-4 text-sm leading-6 text-gray-600">{application.message || "No application message was supplied."}</p>
        </section>
        <div className="space-y-5">
          <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Hiring Stage</h3>
            <select value={application.status} onChange={(event) => setCandidateState((current) => ({ ...current, applications: current.applications.map((item) => item.id === application.id ? { ...item, status: event.target.value } : item) }))} className="mt-3 w-full rounded border border-gray-300 p-3 text-sm font-bold">
              {["New", "Reviewing", "Shortlisted", "Interview", "Hired", "Not Selected"].map((item) => <option key={item}>{item}</option>)}
            </select>
            <p className="mt-2 text-xs leading-5 text-gray-500">Stage changes also update the candidate’s application status.</p>
          </section>
          <section className="rounded border-2 border-dashed border-amber-300 bg-amber-50 p-5">
            <h3 className="text-sm font-black uppercase tracking-tight text-amber-950">{icon("fa-lock", "mr-2")}Internal Notes</h3>
            <p className="mt-1 text-xs text-amber-900">Visible only to the employer team. Candidates cannot see these notes.</p>
            <textarea value={note} onChange={(event) => setNote(event.target.value)} rows={4} className="mt-3 w-full rounded border border-amber-300 bg-white p-3 text-sm outline-none" />
            <button type="button" onClick={() => { setState((current) => ({ ...current, internalNotes: { ...current.internalNotes, [application.id]: note } })); setNotice("Internal note saved for this demo session.") }} className="mt-3 rounded bg-amber-900 px-4 py-2 text-xs font-bold uppercase text-white">Save Internal Note</button>
          </section>
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">Candidate-visible Message</h3>
            <p className="mt-1 text-xs text-gray-500">This separate staging message would be visible to the candidate. Live delivery is not connected.</p>
            <textarea value={message} onChange={(event) => setMessage(event.target.value)} rows={3} className="mt-3 w-full rounded border border-gray-300 p-3 text-sm outline-none" />
            <button type="button" onClick={() => { setMessage(""); setNotice("Message preview complete. No live message was sent.") }} className="mt-3 rounded bg-brand-red px-4 py-2 text-xs font-bold uppercase text-white">Preview Send</button>
          </section>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </div>
      </div>
    </div>
  )
}

function EmployerMessages({
  application,
}: {
  application?: CandidateApplication
}) {
  const { jobs } = useContext(ApplicationContext)
  const job = jobs.find((item) => item.id === application?.jobId)
  const [notice, setNotice] = useState("")
  return (
    <div>
      <EmployerPageHeader title="Messages" description="Preview employer and candidate conversations. Live messaging is not connected." />
      <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-extrabold uppercase text-brand-red">
          {application?.candidateName || "No applicant selected"} · Sample conversation
        </p>
        <h3 className="mt-2 font-black text-brand-dark">
          {job?.title || "Employer inbox"}
        </h3>
        <p className="mt-4 rounded bg-slate-50 p-4 text-sm leading-6 text-gray-600">Thank you for your interest. This fictional conversation demonstrates the employer inbox.</p>
        <textarea rows={4} placeholder="Write a staging message..." aria-label="Staging message to candidate" className="mt-4 w-full rounded border border-gray-300 p-3 text-sm outline-none" />
        <button type="button" onClick={() => setNotice("Message preview complete. No live message was sent.")} className="mt-3 rounded bg-brand-red px-5 py-2.5 text-xs font-bold uppercase text-white">Preview Send</button>
        {notice && <CandidateNotice>{notice}</CandidateNotice>}
      </section>
    </div>
  )
}

function EmployerOrganizationPage({
  state,
  setState,
}: {
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
}) {
  const [draft, setDraft] = useState(state.organization)
  const [notice, setNotice] = useState("")
  const update = (field: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [field]: value }))
  return (
    <div>
      <EmployerPageHeader title="Organization Profile" description="Manage the organization information shown with published listings." />
      <form onSubmit={(event) => { event.preventDefault(); setState((current) => ({ ...current, organization: draft })); setNotice("Organization profile saved for this demo session.") }} className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex justify-end"><VerificationStatus status={draft.verification} /></div>
        <CandidateField label="Organization name" value={draft.name} onChange={(value) => update("name", value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <CandidateField label="City" value={draft.city} onChange={(value) => update("city", value)} />
          <CandidateField label="State" value={draft.state} onChange={(value) => update("state", value)} />
          <CandidateField label="Denomination" value={draft.denomination} onChange={(value) => update("denomination", value)} />
          <CandidateField label="Website" value={draft.website} onChange={(value) => update("website", value)} />
        </div>
        <CandidateField label="Overview" value={draft.overview} onChange={(value) => update("overview", value)} multiline />
        <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">A verified badge appears only after an explicit admin action changes this fictional organization to “Verified Demo.”</p>
        <button type="submit" className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase text-white">Save Organization</button>
        {notice && <CandidateNotice>{notice}</CandidateNotice>}
      </form>
    </div>
  )
}

function EmployerBilling() {
  const [notice, setNotice] = useState("")
  return (
    <div>
      <EmployerPageHeader title="Billing" description="Review editable package placeholders and simulated billing history." />
      <div className="grid gap-4 md:grid-cols-3">
        {["Standard Listing", "Featured Listing", "Organization Package"].map((name) => (
          <article key={name} className="rounded border border-dashed border-gray-300 bg-white p-5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">Editable placeholder</span>
            <h3 className="mt-3 font-black text-brand-dark">{name}</h3>
            <p className="mt-3 text-2xl font-black text-brand-red">[Set price]</p>
            <p className="mt-2 text-xs text-gray-500">[Set package terms and approved features]</p>
            <button type="button" onClick={() => setNotice("Simulated checkout opened. No payment was processed.")} className="mt-5 w-full rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark">Simulate Checkout</button>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded border border-gray-200 bg-white p-5 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Billing History</h3>
        <p className="mt-4 rounded bg-slate-50 p-4 text-sm text-gray-600">No real transactions. Sample invoice · $[Set amount] · Demo only</p>
      </section>
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

function EmployerTeamSettings({
  notice,
  setNotice,
}: {
  notice: string
  setNotice: (value: string) => void
}) {
  return (
    <div>
      <EmployerPageHeader title="Team and Settings" description="Manage fictional hiring-team access and organization preferences." />
      <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Team Access</h3>
        {[["Morgan Lee", "Owner"], ["Casey Brooks", "Hiring Manager"]].map(([name, role]) => (
          <div key={name} className="mt-4 flex items-center justify-between border-b border-gray-100 pb-4">
            <div><p className="text-sm font-bold text-brand-dark">{name}</p><p className="text-xs text-gray-500">Fictional demo teammate</p></div>
            <span className="rounded bg-gray-100 px-2 py-1 text-xs font-bold text-gray-700">{role}</span>
          </div>
        ))}
        <button type="button" onClick={() => setNotice("Team invitation previewed. No email was sent.")} className="mt-5 rounded bg-brand-red px-5 py-2.5 text-xs font-bold uppercase text-white">Invite Team Member</button>
      </section>
      <section className="mt-5 rounded border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Employer Settings</h3>
        <PrivacyControl title="Applicant activity notifications" description="Preview notifications for new sample applications and stage changes." checked onChange={() => setNotice("Notification preference updated for this demo session.")} />
      </section>
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

export function EmployerPageHeader({
  title,
  description,
  action,
  href,
}: {
  title: string
  description: string
  action?: string
  href?: string
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
      <div><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">Employer dashboard</p><h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></div>
      {action && href && <a href={href} className="self-start rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white">{action}</a>}
    </div>
  )
}
