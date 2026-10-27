import * as React from "react"
import { useContext, useState } from "react"
import { Job } from "../types/job.types"
import {
  EmployerJobStatus,
  EmployerState,
  SupplyState,
} from "../types/employee.types"
import { CandidateApplication, CandidateState } from "../types/candidate.types"
import { ApplicationContext } from "../context/ApplicationContext"
import { RESOURCES } from "../data/resources.data"
import {
  PREACHING_SUPPLY_TYPES,
  WORSHIP_SUPPLY_TYPES,
} from "../constants/supply.constants"
import { icon } from "../components/common/Icon"
import {
  AdminEmpty,
  AdminPageHeader,
  AdminPagination,
} from "../components/admin/AdminComponents"
import {
  CandidateField,
  CandidateNotice,
  PrivacyControl,
} from "../components/common/DemoFormFields"
import {
  ListingStatus,
  VerificationStatus,
} from "./EmployerWorkspacePage"

function AdminSupplyManagement({
  state,
  setState,
}: {
  state: SupplyState
  setState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  const [tab, setTab] = useState("Candidates")
  const [notice, setNotice] = useState("")
  const allCandidates = [...state.candidates, state.profile]
  const metrics = [
    ["Supply candidates", allCandidates.length],
    [
      "Available preachers",
      allCandidates.filter(
        (item) => item.category === "Preaching" && item.profileVisible,
      ).length,
    ],
    [
      "Worship professionals",
      allCandidates.filter(
        (item) => item.category === "Worship" && item.profileVisible,
      ).length,
    ],
    ["Participating churches", 1],
    [
      "Pending requests",
      state.bookings.filter((item) =>
        ["Request Sent", "Awaiting Response"].includes(item.status),
      ).length,
    ],
    [
      "Confirmed",
      state.bookings.filter((item) => item.status === "Accepted").length,
    ],
    [
      "Completed",
      state.bookings.filter((item) => item.status === "Completed").length,
    ],
  ]
  return (
    <div>
      <AdminPageHeader
        title="Pulpit Supply Management"
        description="Moderate supply profiles, participating churches, bookings, classifications, and demo activity."
      />
      <p className="mb-5 rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
        Theological information supports voluntary matching and must never
        automatically disqualify a candidate.
      </p>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map(([label, value]) => (
          <article
            key={label}
            className="rounded border border-gray-200 bg-white p-4 shadow-sm"
          >
            <strong className="text-2xl font-black text-brand-dark">
              {value}
            </strong>
            <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
              {label} · Demo data
            </p>
          </article>
        ))}
      </div>
      <div className="my-6 flex gap-2 overflow-x-auto pb-2">
        {[
          "Candidates",
          "Churches",
          "Bookings",
          "Theology",
          "Categories",
          "Reports",
        ].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`shrink-0 rounded px-3 py-2 text-xs font-bold uppercase ${
              tab === item
                ? "bg-brand-charcoal text-white"
                : "border border-gray-300 bg-white text-brand-dark"
            }`}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Candidates" && (
        <div className="space-y-3">
          {allCandidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h3 className="font-black text-brand-dark">
                    {candidate.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {candidate.roles.join(" · ")} · {candidate.city},{" "}
                    {candidate.state}
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    Credentials and profile visibility available for review
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {candidate.id === state.profile.id && (
                    <button
                      type="button"
                      onClick={() => {
                        setState((current) => ({
                          ...current,
                          profileApproved: true,
                        }))
                        setNotice("Supply profile approved in demo moderation.")
                      }}
                      className="rounded bg-emerald-600 px-3 py-2 text-xs font-bold uppercase text-white"
                    >
                      Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Profile review action recorded in the demo activity log.",
                      )
                    }
                    className="rounded border border-gray-300 px-3 py-2 text-xs font-bold uppercase text-brand-dark"
                  >
                    Review
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setNotice(
                        "Profile suspended in this simulated moderation view.",
                      )
                    }
                    className="rounded border border-red-300 px-3 py-2 text-xs font-bold uppercase text-brand-red"
                  >
                    Suspend
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
      {tab === "Churches" && (
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-brand-dark">Harbor City Church</h3>
          <p className="mt-2 text-sm text-gray-600">
            Participating fictional employer · Profile and reported-account
            controls available.
          </p>
          <button
            type="button"
            onClick={() =>
              setNotice("Church profile review opened in staging mode.")
            }
            className="mt-4 rounded border border-gray-300 px-4 py-2 text-xs font-bold uppercase"
          >
            Review Church
          </button>
        </div>
      )}
      {tab === "Bookings" && (
        <div className="space-y-3">
          {state.bookings.map((booking) => (
            <article
              key={booking.id}
              className="rounded border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h3 className="font-black text-brand-dark">
                    {booking.role} · {booking.church}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {booking.date} · {booking.time} · {booking.location}
                  </p>
                </div>
                <span className="self-start rounded bg-blue-50 px-2 py-1 text-xs font-bold text-blue-800">
                  {booking.status}
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  setNotice(
                    "Booking oversight detail opened. No private contact data is public.",
                  )
                }
                className="mt-3 text-xs font-bold uppercase text-brand-red"
              >
                Inspect Booking
              </button>
            </article>
          ))}
        </div>
      )}
      {tab === "Theology" && (
        <AdminEditableList
          title="Theological & Denominational Classifications"
          items={[
            "Calvinist",
            "Arminian",
            "Reformed",
            "Wesleyan",
            "Evangelical",
            "Pentecostal",
            "Charismatic",
            "Prefer not to specify",
          ]}
        />
      )}
      {tab === "Categories" && (
        <AdminEditableList
          title="Supply Roles, Instruments & Service Types"
          items={[
            ...PREACHING_SUPPLY_TYPES.slice(0, 5),
            ...WORSHIP_SUPPLY_TYPES.slice(0, 6),
          ]}
        />
      )}
      {tab === "Reports" && (
        <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="font-black text-brand-dark">
            Pulpit Supply Reporting Dashboard
          </h3>
          <div className="mt-5 grid h-44 grid-cols-6 items-end gap-3">
            {["h-16", "h-24", "h-20", "h-32", "h-28", "h-36"].map((height, index) => (
              <div key={index} className="text-center">
                <div
                  className={`mx-auto w-full rounded-t bg-brand-red ${height}`}
                />
                <span className="mt-2 block text-[10px] text-gray-500">
                  M{index + 1}
                </span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Demo candidate registration, booking activity, and engagement trend
            visualization.
          </p>
        </div>
      )}
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

function AdminEditableList({
  title,
  items: initialItems,
}: {
  title: string
  items: string[]
}) {
  const [items, setItems] = useState(initialItems)
  const [newItem, setNewItem] = useState("")
  return (
    <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="font-black uppercase text-brand-dark">{title}</h3>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded bg-slate-50 px-3 py-2 text-xs font-bold text-gray-700"
          >
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <input
          value={newItem}
          onChange={(event) => setNewItem(event.target.value)}
          placeholder="Add classification"
          className="flex-1 rounded border border-gray-300 p-2.5 text-sm"
        />
        <button
          type="button"
          disabled={!newItem.trim()}
          onClick={() => {
            setItems((current) => [...current, newItem.trim()])
            setNewItem("")
          }}
          className="rounded bg-brand-red px-4 py-2 text-xs font-bold uppercase text-white disabled:opacity-40"
        >
          Add
        </button>
      </div>
    </section>
  )
}

export function AdminExperience({
  hash,
  employerState,
  setEmployerState,
  candidateState,
  supplyState,
  setSupplyState,
}: {
  hash: string
  employerState: EmployerState
  setEmployerState: React.Dispatch<React.SetStateAction<EmployerState>>
  candidateState: CandidateState
  supplyState: SupplyState
  setSupplyState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  const { jobs } = useContext(ApplicationContext)
  const [notice, setNotice] = useState("")
  const [reports, setReports] = useState([
    {
      id: 1,
      jobId: 4,
      reason: "Compensation details need clarification",
      status: "Open",
      history: ["Report submitted · Demo data"],
    },
    {
      id: 2,
      jobId: 5,
      reason: "Listing appears to be closed",
      status: "Resolved",
      history: ["Report submitted", "Marked resolved · Demo moderator"],
    },
  ])
  const navigation = [
    ["Overview", "/admin/dashboard", "fa-gauge-high"],
    ["Job Approvals", "/admin/job-approvals", "fa-list-check"],
    ["Employers", "/admin/employers", "fa-building"],
    ["Candidates", "/admin/candidates", "fa-user"],
    ["Applications", "/admin/applications", "fa-file-lines"],
    ["Pulpit Supply Management", "/admin/pulpit-supply", "fa-person-chalkboard"],
    ["Reports and Moderation", "/admin/reports", "fa-flag"],
    ["Resources and Page Content", "/admin/content", "fa-pen-to-square"],
    ["Employer Packages and Discount Codes", "/admin/packages", "fa-tags"],
    ["Platform Settings", "/admin/settings", "fa-gears"],
  ]
  const addHistory = (
    listingId: number,
    action: string,
    reason = "No reason supplied",
  ) =>
    setEmployerState((current) => ({
      ...current,
      moderationHistory: {
        ...current.moderationHistory,
        [listingId]: [
          {
            action,
            reason,
            date: new Date().toLocaleString("en-US"),
          },
          ...(current.moderationHistory[listingId] || []),
        ],
      },
    }))
  const moderate = (
    listingId: number,
    status: EmployerJobStatus,
    action: string,
    reason?: string,
  ) => {
    setEmployerState((current) => ({
      ...current,
      listings: current.listings.map((item) =>
        item.id === listingId ? { ...item, status } : item,
      ),
      moderationHistory: {
        ...current.moderationHistory,
        [listingId]: [
          {
            action,
            reason: reason || "No reason supplied",
            date: new Date().toLocaleString("en-US"),
          },
          ...(current.moderationHistory[listingId] || []),
        ],
      },
    }))
    setNotice(`${action} recorded in the simulated moderation log.`)
  }
  const content =
    hash === "/admin/pulpit-supply" ? (
      <AdminSupplyManagement state={supplyState} setState={setSupplyState} />
    ) : hash === "/admin/job-approvals" ? (
      <AdminJobApprovals
        employerState={employerState}
        moderate={moderate}
      />
    ) : hash === "/admin/employers" ? (
      <AdminEmployers
        state={employerState}
        setState={setEmployerState}
        addHistory={addHistory}
      />
    ) : hash === "/admin/candidates" ? (
      <AdminCandidates candidateState={candidateState} />
    ) : hash === "/admin/applications" ? (
      <AdminApplications applications={candidateState.applications} />
    ) : hash === "/admin/reports" ? (
      <AdminReports reports={reports} setReports={setReports} />
    ) : hash === "/admin/content" ? (
      <AdminContent />
    ) : hash === "/admin/packages" ? (
      <AdminPackages />
    ) : hash === "/admin/settings" ? (
      <AdminSettings />
    ) : (
      <AdminOverview
        jobs={jobs}
        employerState={employerState}
        applications={candidateState.applications}
      />
    )
  return (
    <>
      <section className="border-b border-gray-800 bg-brand-charcoal px-6 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Admin demo · Not production access control
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
              Platform Administration
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              Moderation, content, and platform operations using safe demo data
            </p>
          </div>
          <span className="self-start rounded bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950 sm:self-auto">
            Simulated admin access
          </span>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav className="overflow-hidden rounded border border-gray-200 bg-white py-2 shadow-sm" aria-label="Admin dashboard">
            {navigation.map(([label, path, iconName]) => (
              <a
                key={path}
                href={`#${path}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  hash === path
                    ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {icon(iconName, "w-5 text-center")}
                {label}
              </a>
            ))}
          </nav>
          <div className="mt-4 rounded border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            Production requires connected authentication, role-based
            authorization, immutable audit logging, and secure session
            management.
          </div>
        </aside>
        <div className="lg:col-span-9">
          {notice && (
            <div className="mb-5 flex items-center justify-between rounded bg-emerald-700 p-4 text-sm font-bold text-white" role="status">
              <span>{icon("fa-check", "mr-2")}{notice}</span>
              <button type="button" onClick={() => setNotice("")} aria-label="Dismiss notice">{icon("fa-xmark")}</button>
            </div>
          )}
          {content}
        </div>
      </div>
    </>
  )
}

function AdminOverview({
  jobs,
  employerState,
  applications,
}: {
  jobs: Job[]
  employerState: EmployerState
  applications: CandidateApplication[]
}) {
  const activity = Object.entries(employerState.moderationHistory)
    .flatMap(([jobId, history]) =>
      history.map((item) => ({ ...item, jobId })),
    )
    .sort((a, b) => b.date.localeCompare(a.date))
  const metrics = [
    ["Published jobs", jobs.filter((job) => !job.closed).length, "fa-briefcase"],
    ["Pending jobs", employerState.listings.filter((job) => job.status === "Pending Review").length, "fa-clock"],
    ["Employers", 1, "fa-building"],
    ["Candidates", 1, "fa-user"],
    ["Applications", applications.length, "fa-file-lines"],
  ]
  return (
    <div>
      <AdminPageHeader title="Overview" description="Basic reporting calculated from the current staging dataset." />
      <p className="mb-4 inline-flex rounded bg-blue-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-800">
        All metrics are demo data
      </p>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {metrics.map(([label, value, iconName]) => (
          <article key={label} className="rounded border border-gray-200 bg-white p-4 shadow-sm">
            <span className="text-brand-red">{icon(String(iconName))}</span>
            <strong className="mt-3 block text-3xl font-black text-brand-dark">{value}</strong>
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">{label}</span>
          </article>
        ))}
      </div>
      <section className="mt-6 overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 py-4">
          <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">Activity Log</h3>
          <p className="mt-1 text-xs text-gray-500">Simulated approvals and moderation changes</p>
        </div>
        {activity.length ? (
          <div className="divide-y divide-gray-100">
            {activity.slice(0, 8).map((item, index) => (
              <div key={`${item.jobId}-${item.date}-${index}`} className="flex flex-col justify-between gap-2 px-5 py-4 sm:flex-row">
                <div><p className="text-sm font-bold text-brand-dark">{item.action}</p><p className="mt-1 text-xs text-gray-500">Job #{item.jobId} · {item.reason}</p></div>
                <span className="text-xs text-gray-400">{item.date}</span>
              </div>
            ))}
          </div>
        ) : (
          <AdminEmpty title="No moderation activity yet" description="Approvals, change requests, rejections, and verification actions will appear here." />
        )}
      </section>
    </div>
  )
}

function AdminJobApprovals({
  employerState,
  moderate,
}: {
  employerState: EmployerState
  moderate: (
    listingId: number,
    status: EmployerJobStatus,
    action: string,
    reason?: string,
  ) => void
}) {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("Pending Review")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [action, setAction] = useState<"changes" | "reject" | null>(null)
  const [reason, setReason] = useState("")
  const [internalNotes, setInternalNotes] = useState<Record<number, string>>({})
  const perPage = 5
  const filtered = employerState.listings
    .filter(
      (listing) =>
        (!search ||
          `${listing.title} ${employerState.organization.name}`
            .toLowerCase()
            .includes(search.toLowerCase())) &&
        (!status || listing.status === status),
    )
    .sort((a, b) =>
      sort === "title"
        ? a.title.localeCompare(b.title)
        : b.created.localeCompare(a.created),
    )
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  const visible = filtered.slice((page - 1) * perPage, page * perPage)
  const selected = employerState.listings.find((item) => item.id === selectedId)
  return (
    <div>
      <AdminPageHeader title="Job Approvals" description="Inspect pending listings, approve publication, request changes, or reject submissions." />
      <div className="grid gap-3 rounded border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-3">
        <input value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} placeholder="Search jobs or employers" aria-label="Search job approvals" className="rounded border border-gray-300 p-2.5 text-sm outline-none focus:border-brand-red" />
        <select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }} className="rounded border border-gray-300 p-2.5 text-sm">
          <option value="">All statuses</option>
          {["Pending Review", "Published", "Changes Requested", "Rejected", "Draft", "Closed"].map((item) => <option key={item}>{item}</option>)}
        </select>
        <select value={sort} onChange={(event) => setSort(event.target.value)} className="rounded border border-gray-300 p-2.5 text-sm"><option value="newest">Newest first</option><option value="title">Title A–Z</option></select>
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-5">
        <div className="space-y-3 xl:col-span-3">
          {visible.length ? visible.map((listing) => (
            <button key={listing.id} type="button" onClick={() => setSelectedId(listing.id)} className={`w-full rounded border bg-white p-5 text-left shadow-sm ${selectedId === listing.id ? "border-brand-red" : "border-gray-200"}`}>
              <div className="flex items-start justify-between gap-3"><div><ListingStatus status={listing.status} /><h3 className="mt-3 font-extrabold text-brand-dark">{listing.title || "Untitled draft"}</h3><p className="mt-1 text-xs text-gray-500">{employerState.organization.name} · {listing.city}, {listing.state}</p></div>{icon("fa-chevron-right", "mt-2 text-gray-400")}</div>
            </button>
          )) : <AdminEmpty title="No jobs match these filters" description="Clear the filters or submit a listing from the employer demo." />}
          <AdminPagination page={page} pages={pages} setPage={setPage} />
        </div>
        <aside className="xl:col-span-2">
          {selected ? (
            <div className="sticky top-28 rounded border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-extrabold uppercase tracking-wider text-brand-red">Review detail</p>
              <h3 className="mt-2 text-xl font-black text-brand-dark">{selected.title}</h3>
              <p className="mt-1 text-xs text-gray-500">{selected.city}, {selected.state} · {selected.type}</p>
              <dl className="mt-4 divide-y divide-gray-100 text-xs">
                <div className="py-3"><dt className="text-gray-500">Category</dt><dd className="mt-1 font-bold text-brand-dark">{selected.category}</dd></div>
                <div className="py-3"><dt className="text-gray-500">Compensation</dt><dd className="mt-1 font-bold text-brand-dark">{selected.salaryMin && selected.salaryMax ? `$${selected.salaryMin}–$${selected.salaryMax}` : "Not provided"}</dd></div>
                <div className="py-3"><dt className="text-gray-500">Deadline</dt><dd className="mt-1 font-bold text-brand-dark">{selected.deadline || "Not provided"}</dd></div>
              </dl>
              <p className="mt-4 max-h-40 overflow-y-auto whitespace-pre-line text-xs leading-5 text-gray-600">{selected.description}</p>
              <label className="mt-5 block text-xs font-bold uppercase text-gray-700">
                Internal admin note
                <textarea
                  rows={3}
                  value={internalNotes[selected.id] || ""}
                  onChange={(event) =>
                    setInternalNotes((current) => ({
                      ...current,
                      [selected.id]: event.target.value,
                    }))
                  }
                  className="mt-1.5 w-full rounded border border-gray-300 p-2.5 text-sm font-normal normal-case"
                  placeholder="Private note—not visible to employer"
                />
                <span className="mt-1 block font-normal normal-case text-gray-500">
                  Saved only in this admin demo session. Employers and candidates
                  cannot see it.
                </span>
              </label>
              <div className="mt-4 grid gap-2">
                <button type="button" onClick={() => moderate(selected.id, "Published", "Job approved and published", "Approved in admin demo")} className="rounded bg-emerald-600 px-4 py-2.5 text-xs font-extrabold uppercase text-white">Approve & Publish</button>
                <button type="button" onClick={() => { setReason(""); setAction("changes") }} className="rounded border border-amber-400 bg-amber-50 px-4 py-2.5 text-xs font-extrabold uppercase text-amber-900">Request Changes</button>
                <button type="button" onClick={() => { setReason(""); setAction("reject") }} className="rounded border border-red-300 px-4 py-2.5 text-xs font-extrabold uppercase text-brand-red">Reject Listing</button>
              </div>
              <ModerationHistory history={employerState.moderationHistory[selected.id] || []} />
            </div>
          ) : (
            <AdminEmpty title="Select a listing" description="Choose a job to inspect its details and moderation history." />
          )}
        </aside>
      </div>
      {action && selected && (
        <AdminConfirmDialog
          title={action === "reject" ? "Reject this listing?" : "Request listing changes?"}
          description={action === "reject" ? "The listing will not be published. Provide a reason visible to the employer." : "The listing will return to the employer with your requested changes."}
          confirmLabel={action === "reject" ? "Reject Listing" : "Send Change Request"}
          destructive={action === "reject"}
          reason={reason}
          setReason={setReason}
          close={() => setAction(null)}
          confirm={() => {
            if (!reason.trim()) return
            moderate(selected.id, action === "reject" ? "Rejected" : "Changes Requested", action === "reject" ? "Job rejected" : "Changes requested", reason)
            setAction(null)
          }}
        />
      )}
    </div>
  )
}

function AdminEmployers({
  state,
  setState,
  addHistory,
}: {
  state: EmployerState
  setState: React.Dispatch<React.SetStateAction<EmployerState>>
  addHistory: (listingId: number, action: string, reason?: string) => void
}) {
  const [search, setSearch] = useState("")
  const visible = state.organization.name.toLowerCase().includes(search.toLowerCase())
  return (
    <div>
      <AdminPageHeader title="Employers" description="Review fictional organizations and explicit verification states." />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search employers" aria-label="Search employers" className="mb-5 w-full rounded border border-gray-300 bg-white p-3 text-sm shadow-sm outline-none focus:border-brand-red" />
      {visible ? (
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div><h3 className="text-lg font-black text-brand-dark">{state.organization.name}</h3><p className="mt-1 text-sm text-gray-500">{state.organization.city}, {state.organization.state}</p><div className="mt-3"><VerificationStatus status={state.organization.verification} /></div></div>
            <div className="flex flex-wrap gap-2">
              {state.organization.verification !== "Verified Demo" && <button type="button" onClick={() => { setState((current) => ({ ...current, organization: { ...current.organization, verification: "Verified Demo" } })); addHistory(0, "Employer approved as Verified Demo", state.organization.name) }} className="rounded bg-emerald-600 px-4 py-2.5 text-xs font-extrabold uppercase text-white">Approve Verification</button>}
              <button type="button" onClick={() => setState((current) => ({ ...current, organization: { ...current.organization, verification: "Pending Review" } }))} className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark">Return to Review</button>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <div className="rounded bg-slate-50 p-3"><span className="text-xs text-gray-500">Listings</span><strong className="block text-xl text-brand-dark">{state.listings.length}</strong></div>
            <div className="rounded bg-slate-50 p-3"><span className="text-xs text-gray-500">Published</span><strong className="block text-xl text-brand-dark">{state.listings.filter((item) => item.status === "Published").length}</strong></div>
            <div className="rounded bg-slate-50 p-3"><span className="text-xs text-gray-500">Verification</span><strong className="block text-sm text-brand-dark">{state.organization.verification}</strong></div>
          </div>
        </section>
      ) : <AdminEmpty title="No employers found" description="Try a different organization name." />}
    </div>
  )
}

function AdminCandidates({ candidateState }: { candidateState: CandidateState }) {
  const [search, setSearch] = useState("")
  const visible = candidateState.profile.name.toLowerCase().includes(search.toLowerCase())
  return (
    <div>
      <AdminPageHeader title="Candidates" description="Inspect safe fictional candidate records without exposing private resumes publicly." />
      <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidates" aria-label="Search candidates" className="mb-5 w-full rounded border border-gray-300 bg-white p-3 text-sm shadow-sm outline-none focus:border-brand-red" />
      {visible ? (
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 sm:flex-row"><div><h3 className="text-lg font-black text-brand-dark">{candidateState.profile.name}</h3><p className="mt-1 text-sm text-gray-600">{candidateState.profile.headline}</p><p className="mt-1 text-xs text-gray-500">{candidateState.profile.city}, {candidateState.profile.state}</p></div><span className="self-start rounded bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800">Demo candidate</span></div>
          <dl className="mt-5 grid gap-3 sm:grid-cols-3"><div className="rounded bg-slate-50 p-3"><dt className="text-xs text-gray-500">Applications</dt><dd className="text-xl font-black text-brand-dark">{candidateState.applications.length}</dd></div><div className="rounded bg-slate-50 p-3"><dt className="text-xs text-gray-500">Profile visibility</dt><dd className="font-bold text-brand-dark">{candidateState.profile.profileVisible ? "Discoverable" : "Private"}</dd></div><div className="rounded bg-slate-50 p-3"><dt className="text-xs text-gray-500">Resume</dt><dd className="truncate font-bold text-brand-dark">{candidateState.resumeName}</dd></div></dl>
        </section>
      ) : <AdminEmpty title="No candidates found" description="Try a different candidate name." />}
    </div>
  )
}

function AdminApplications({ applications }: { applications: CandidateApplication[] }) {
  const { jobs } = useContext(ApplicationContext)
  const [search, setSearch] = useState("")
  const [sort, setSort] = useState("newest")
  const [page, setPage] = useState(1)
  const perPage = 5
  const filtered = applications
    .filter((item) => {
      const job = jobs.find((candidate) => candidate.id === item.jobId)
      return `${item.candidateName} ${job?.title} ${job?.company}`.toLowerCase().includes(search.toLowerCase())
    })
    .sort((a, b) => sort === "candidate" ? a.candidateName.localeCompare(b.candidateName) : b.applied.localeCompare(a.applied))
  const pages = Math.max(1, Math.ceil(filtered.length / perPage))
  return (
    <div>
      <AdminPageHeader title="Applications" description="Review application activity from the shared demo dataset." />
      <div className="mb-5 grid gap-3 rounded border border-gray-200 bg-white p-4 sm:grid-cols-2"><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search candidate, job, or employer" aria-label="Search applications" className="rounded border border-gray-300 p-2.5 text-sm" /><select value={sort} onChange={(event) => setSort(event.target.value)} aria-label="Sort applications" className="rounded border border-gray-300 p-2.5 text-sm"><option value="newest">Newest first</option><option value="candidate">Candidate A–Z</option></select></div>
      {filtered.length ? <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">{filtered.slice((page - 1) * perPage, page * perPage).map((application) => { const job = jobs.find((item) => item.id === application.jobId); return <div key={application.id} className="grid gap-2 border-b border-gray-100 p-4 last:border-0 sm:grid-cols-4"><span className="font-bold text-brand-dark">{application.candidateName}</span><span className="text-sm text-gray-600">{job?.title || "Unavailable job"}</span><span className="text-sm text-gray-500">{job?.company}</span><span className="text-xs font-bold text-brand-red">{application.status}</span></div> })}</div> : <AdminEmpty title="No applications found" description="Adjust your search to see more records." />}
      <AdminPagination page={page} pages={pages} setPage={setPage} />
    </div>
  )
}

function AdminReports({
  reports,
  setReports,
}: {
  reports: { id: number; jobId: number; reason: string; status: string; history: string[] }[]
  setReports: React.Dispatch<React.SetStateAction<{ id: number; jobId: number; reason: string; status: string; history: string[] }[]>>
}) {
  const { jobs } = useContext(ApplicationContext)
  const [filter, setFilter] = useState("Open")
  const [selected, setSelected] = useState<number | null>(null)
  const [confirm, setConfirm] = useState(false)
  const visible = reports.filter((report) => !filter || report.status === filter)
  const report = reports.find((item) => item.id === selected)
  return (
    <div>
      <AdminPageHeader title="Reports and Moderation" description="Review fictional job reports and preserve clear moderation histories." />
      <div className="mb-5 flex flex-wrap gap-2">{["Open", "Resolved", ""].map((item) => <button key={item || "all"} type="button" onClick={() => setFilter(item)} className={`rounded px-3 py-2 text-xs font-bold ${filter === item ? "bg-brand-charcoal text-white" : "border border-gray-300 bg-white text-brand-dark"}`}>{item || "All reports"}</button>)}</div>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-3">{visible.length ? visible.map((item) => { const job = jobs.find((candidate) => candidate.id === item.jobId); return <button key={item.id} type="button" onClick={() => setSelected(item.id)} className="w-full rounded border border-gray-200 bg-white p-5 text-left shadow-sm"><div className="flex justify-between gap-3"><div><span className="text-[10px] font-extrabold uppercase text-brand-red">{item.status}</span><h3 className="mt-2 font-black text-brand-dark">{job?.title || "Reported job"}</h3><p className="mt-2 text-xs text-gray-600">{item.reason}</p></div>{icon("fa-flag", "text-gray-400")}</div></button> }) : <AdminEmpty title="No reports in this filter" description="Choose another moderation status." />}</div>
        {report ? <section className="rounded border border-gray-200 bg-white p-5 shadow-sm"><h3 className="text-lg font-black text-brand-dark">Report #{report.id}</h3><p className="mt-2 text-sm text-gray-600">{report.reason}</p><h4 className="mt-5 text-xs font-extrabold uppercase text-gray-500">Moderation history</h4><ul className="mt-2 space-y-2 text-xs text-gray-600">{report.history.map((item) => <li key={item} className="rounded bg-slate-50 p-3">{item}</li>)}</ul>{report.status !== "Resolved" && <button type="button" onClick={() => setConfirm(true)} className="mt-5 rounded bg-brand-red px-4 py-2.5 text-xs font-bold uppercase text-white">Resolve Report</button>}</section> : <AdminEmpty title="Select a report" description="Choose a reported job to inspect its moderation history." />}
      </div>
      {confirm && report && <AdminConfirmDialog title="Resolve this report?" description="This simulated destructive action closes the active report and adds a history entry." confirmLabel="Resolve Report" destructive reason="Reviewed and resolved by demo administrator" setReason={() => undefined} close={() => setConfirm(false)} hideReason confirm={() => { setReports((current) => current.map((item) => item.id === report.id ? { ...item, status: "Resolved", history: [...item.history, "Marked resolved · Demo administrator"] } : item)); setConfirm(false) }} />}
    </div>
  )
}

function AdminContent() {
  const [section, setSection] = useState("Resources")
  const [title, setTitle] = useState(RESOURCES[0].title)
  const [body, setBody] = useState(RESOURCES[0].summary)
  const [notice, setNotice] = useState("")
  return (
    <div>
      <AdminPageHeader title="Resources and Page Content" description="Edit staging copies of resource articles, FAQs, and homepage content." />
      <div className="grid gap-5 lg:grid-cols-3">
        <nav className="rounded border border-gray-200 bg-white p-3 shadow-sm">{["Resources", "FAQs", "Homepage"].map((item) => <button key={item} type="button" onClick={() => { setSection(item); setNotice("") }} className={`block w-full rounded px-4 py-3 text-left text-sm font-bold ${section === item ? "bg-red-50 text-brand-red" : "text-gray-700 hover:bg-gray-50"}`}>{item}</button>)}</nav>
        <form onSubmit={(event) => { event.preventDefault(); setNotice(`${section} content saved for this demo session.`) }} className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm lg:col-span-2"><span className="text-xs font-extrabold uppercase tracking-wider text-brand-red">{section} editor</span><CandidateField label={section === "FAQs" ? "Question" : "Title / headline"} value={title} onChange={setTitle} /><CandidateField label={section === "FAQs" ? "Answer" : "Content"} value={body} onChange={setBody} multiline /><div className="flex flex-wrap gap-3"><button type="submit" className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase text-white">Save Demo Content</button><button type="button" onClick={() => setNotice("Preview opened in staging mode. Public content was not changed.")} className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark">Preview</button></div>{notice && <CandidateNotice>{notice}</CandidateNotice>}</form>
      </div>
    </div>
  )
}

function AdminPackages() {
  const [packages, setPackages] = useState([
    {
      name: "Standard Listing",
      price: "[Set approved price]",
      terms: "[Set approved commercial terms]",
    },
    {
      name: "Featured Listing",
      price: "[Set approved price]",
      terms: "[Set approved commercial terms]",
    },
    {
      name: "Organization Package",
      price: "[Set approved price]",
      terms: "[Set approved commercial terms]",
    },
  ])
  const [discounts, setDiscounts] = useState([{ code: "DEMO-CODE", value: "[Set discount]", status: "Inactive" }])
  const [notice, setNotice] = useState("")
  const [selectedDiscount, setSelectedDiscount] = useState<string | null>(null)
  const updatePackage = (
    index: number,
    field: "price" | "terms",
    value: string,
  ) =>
    setPackages((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [field]: value } : item,
      ),
    )
  return (
    <div>
      <AdminPageHeader title="Employer Packages and Discount Codes" description="Manage editable commercial placeholders without activating real prices or payments." />
      <div className="grid gap-4 md:grid-cols-3">
        {packages.map((plan, index) => (
          <article key={plan.name} className="rounded border border-dashed border-gray-300 bg-white p-5">
            <span className="text-[10px] font-extrabold uppercase text-amber-800">Placeholder</span>
            <h3 className="mt-3 font-black text-brand-dark">{plan.name}</h3>
            <CandidateField label="Price" value={plan.price} onChange={(value) => updatePackage(index, "price", value)} />
            <CandidateField label="Terms" value={plan.terms} onChange={(value) => updatePackage(index, "terms", value)} />
            <button type="button" onClick={() => setNotice(`${plan.name} placeholder saved.`)} className="mt-3 rounded border border-gray-300 px-4 py-2 text-xs font-bold uppercase text-brand-dark">Save Placeholder</button>
          </article>
        ))}
      </div>
      <section className="mt-6 rounded border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black uppercase text-brand-dark">Discount Codes</h3>
          <button type="button" onClick={() => setDiscounts((current) => [...current, { code: `DEMO-${current.length + 1}`, value: "[Set discount]", status: "Inactive" }])} className="rounded bg-brand-red px-4 py-2 text-xs font-bold uppercase text-white">Add Demo Code</button>
        </div>
        {discounts.map((discount) => (
          <div key={discount.code} className="mt-4 flex flex-col justify-between gap-3 rounded bg-slate-50 p-4 sm:flex-row sm:items-center">
            <div><strong className="text-brand-dark">{discount.code}</strong><p className="text-xs text-gray-500">{discount.value} · {discount.status}</p></div>
            <button type="button" onClick={() => setSelectedDiscount(discount.code)} className="text-xs font-bold uppercase text-brand-red">Delete</button>
          </div>
        ))}
        {!discounts.length && <p className="mt-4 text-sm text-gray-500">No demo discount codes.</p>}
      </section>
      <p className="mt-5 rounded bg-amber-50 p-4 text-xs leading-5 text-amber-950">No package price, discount, checkout, or commercial term is active. Production billing requires an approved pricing model and payment integration.</p>
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
      {selectedDiscount && <AdminConfirmDialog title="Delete this demo discount code?" description={`This removes ${selectedDiscount} from the current staging session.`} confirmLabel="Delete Code" destructive reason="" setReason={() => undefined} hideReason close={() => setSelectedDiscount(null)} confirm={() => { setDiscounts((current) => current.filter((item) => item.code !== selectedDiscount)); setSelectedDiscount(null) }} />}
    </div>
  )
}

function AdminSettings() {
  const [notice, setNotice] = useState("")
  return (
    <div>
      <AdminPageHeader title="Platform Settings" description="Review staging controls and production integration requirements." />
      <section className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm"><PrivacyControl title="New listing submissions" description="Allow fictional employer listings to enter the simulated approval queue." checked onChange={() => setNotice("Listing submission setting updated for this demo session.")} /><PrivacyControl title="Candidate registrations" description="Allow staging candidate onboarding. This is not production access control." checked onChange={() => setNotice("Candidate registration setting updated for this demo session.")} /><button type="button" onClick={() => setNotice("Settings saved locally for this demo session.")} className="rounded bg-brand-red px-5 py-2.5 text-xs font-bold uppercase text-white">Save Platform Settings</button>{notice && <CandidateNotice>{notice}</CandidateNotice>}</section>
      <section className="mt-6 rounded border-2 border-amber-300 bg-amber-50 p-6"><h3 className="text-base font-black uppercase text-amber-950">Production Integration Requirements</h3><ul className="mt-4 space-y-2 text-sm text-amber-950">{["Secure administrator authentication", "Role-based authorization and least-privilege permissions", "Server-enforced moderation actions", "Immutable audit logging with actor identity and timestamps", "Secure storage, retention, and incident-response controls"].map((item) => <li key={item} className="flex gap-2">{icon("fa-triangle-exclamation", "mt-1")}<span>{item}</span></li>)}</ul></section>
    </div>
  )
}

function ModerationHistory({ history }: { history: { action: string; reason: string; date: string }[] }) {
  return <div className="mt-5 border-t border-gray-200 pt-4"><h4 className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">Moderation status history</h4>{history.length ? <ul className="mt-2 space-y-2">{history.map((item, index) => <li key={`${item.date}-${index}`} className="rounded bg-slate-50 p-3 text-xs"><strong className="block text-brand-dark">{item.action}</strong><span className="mt-1 block text-gray-500">{item.reason} · {item.date}</span></li>)}</ul> : <p className="mt-2 text-xs text-gray-500">No moderation changes recorded.</p>}</div>
}

function AdminConfirmDialog({
  title,
  description,
  confirmLabel,
  destructive,
  reason,
  setReason,
  close,
  confirm,
  hideReason = false,
}: {
  title: string
  description: string
  confirmLabel: string
  destructive?: boolean
  reason: string
  setReason: (value: string) => void
  close: () => void
  confirm: () => void
  hideReason?: boolean
}) {
  return (
    <div className="fixed inset-0 z-[130] flex items-center justify-center bg-gray-950/75 p-4" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <section role="alertdialog" aria-modal="true" aria-labelledby="admin-confirm-title" className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"><span className={`flex h-11 w-11 items-center justify-center rounded-full ${destructive ? "bg-red-50 text-brand-red" : "bg-amber-100 text-amber-900"}`}>{icon(destructive ? "fa-triangle-exclamation" : "fa-circle-question")}</span><h2 id="admin-confirm-title" className="mt-4 text-xl font-black text-brand-dark">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>{!hideReason && <label className="mt-4 block text-xs font-bold uppercase text-gray-700">Reason visible to employer<textarea autoFocus value={reason} onChange={(event) => setReason(event.target.value)} rows={4} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red" /></label>}<div className="mt-5 flex justify-end gap-3"><button type="button" onClick={close} className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark">Cancel</button><button type="button" disabled={!hideReason && !reason.trim()} onClick={confirm} className={`rounded px-4 py-2.5 text-xs font-extrabold uppercase text-white disabled:opacity-40 ${destructive ? "bg-brand-red" : "bg-amber-800"}`}>{confirmLabel}</button></div></section>
    </div>
  )
}
