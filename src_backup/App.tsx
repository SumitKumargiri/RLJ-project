import * as L from "leaflet"
import {createContext,FormEvent,useContext,useEffect,useMemo,useRef,useState,} from "react"
import portlandHero from "./assets/portland-hero.jpg"
import redLetterJobsLogo from "./assets/red-letter-jobs-logo.png"
import { Job } from "./types/job.types"
import { DemoRole, Session } from "./types/session.types"
import { EmployerJobStatus, EmployerListing, EmployerState, SupplyCandidate, SupplyState } from "./types/employee.types"
import { CandidateApplication, CandidateProfile, CandidateState } from "./types/candidate.types"
import { ApplicationContextValue } from "./types/application.types"

const DEMO_ROUTES: Record<DemoRole, string> = {
  candidate: "/candidate/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
}

const CATEGORIES = [
  {
    name: "Accounting / Finance",
    slug: "Accounting-Finance",
    count: 18,
    icon: "fa-chart-line",
  },
  {
    name: "Administration / Business",
    slug: "Administration-Business",
    count: 24,
    icon: "fa-clipboard-list",
  },
  {
    name: "Adult Ministry",
    slug: "Adult-Ministry",
    count: 21,
    icon: "fa-people-group",
  },
  {
    name: "Associate Pastor",
    slug: "Associate-Pastor",
    count: 32,
    icon: "fa-hands-praying",
  },
  {
    name: "Automotive Jobs",
    slug: "Automotive-Jobs",
    count: 4,
    icon: "fa-car",
  },
  {
    name: "Chaplain",
    slug: "Chaplain",
    count: 12,
    icon: "fa-hand-holding-heart",
  },
  {
    name: "Children's Ministry",
    slug: "Childrens-Ministry",
    count: 29,
    icon: "fa-children",
  },
  {
    name: "Christian College Jobs",
    slug: "Christian-College-Jobs",
    count: 15,
    icon: "fa-graduation-cap",
  },
  {
    name: "Christian Schools",
    slug: "Christian-Schools",
    count: 27,
    icon: "fa-school",
  },
  {
    name: "Communications / Media",
    slug: "Communications-Media",
    count: 19,
    icon: "fa-bullhorn",
  },
  {
    name: "Counseling",
    slug: "Counseling",
    count: 11,
    icon: "fa-comments",
  },
  {
    name: "Lead / Senior Pastor",
    slug: "Pastor",
    count: 45,
    icon: "fa-person-chalkboard",
  },
  {
    name: "Worship & Creative Arts",
    slug: "Worship-Arts",
    count: 38,
    icon: "fa-music",
  },
  {
    name: "Youth / Student Ministry",
    slug: "Youth-Ministry",
    count: 36,
    icon: "fa-seedling",
  },
]

const denominationLogo = (name: string) =>
  `${import.meta.env.BASE_URL}assets/denominations/${name}.png`



function employerListingToJob(
  listing: EmployerListing,
  organization: EmployerState["organization"],
): Job {
  return {
    id: listing.id,
    title: listing.title,
    company: organization.name,
    country: "United States",
    state: listing.state,
    city: listing.city,
    type: listing.type,
    date: listing.created,
    featured: false,
    category: listing.category,
    denomination: listing.denomination,
    salary:
      listing.salaryMin && listing.salaryMax
        ? `$${Number(listing.salaryMin).toLocaleString()}–$${Number(
            listing.salaryMax,
          ).toLocaleString()}`
        : undefined,
    workplace: listing.workplace,
    deadline: listing.deadline || undefined,
    closed: listing.status === "Closed",
  }
}

const JOB_DETAILS: Record<
  number,
  {
    summary: string
    responsibilities: string[]
    qualifications: string[]
  }
> = {
  1: {
    summary:
      "Grace Community Church is seeking a Christ-centered Lead Pastor to provide biblical teaching, spiritual leadership, and organizational direction for a growing multigenerational congregation in Portland.",
    responsibilities: [
      "Preach and teach Scripture with clarity, conviction, and pastoral sensitivity.",
      "Lead the elders, staff, and ministry leaders in carrying out the church's mission.",
      "Provide pastoral care and cultivate a healthy culture of discipleship and prayer.",
      "Develop leaders and strengthen the church's engagement with the Portland community.",
    ],
    qualifications: [
      "Demonstrated pastoral leadership and regular preaching experience.",
      "Graduate theological education or equivalent ministry preparation.",
      "Strong alignment with the church's statement of faith and elder-led governance.",
      "A collaborative leadership style and a reputation for spiritual maturity.",
    ],
  },
  2: {
    summary:
      "Redeemer Fellowship is looking for an Associate Pastor of Discipleship who can build clear pathways that help people move from first connection to mature, multiplying faith.",
    responsibilities: [
      "Oversee small groups, adult formation, membership, and volunteer development.",
      "Recruit, train, and coach group leaders and ministry volunteers.",
      "Teach regularly and support the Lead Pastor with pastoral care.",
      "Create measurable discipleship rhythms for every stage of spiritual growth.",
    ],
    qualifications: [
      "Three or more years of church ministry leadership experience.",
      "Strong communication, coaching, and team-building skills.",
      "A bachelor's degree; theological training is preferred.",
      "A passion for relational discipleship and developing lay leaders.",
    ],
  },
  3: {
    summary:
      "New Hope Church seeks an energetic Youth Pastor to disciple middle and high school students, partner with parents, and build a safe ministry where students encounter Jesus and grow in community.",
    responsibilities: [
      "Lead weekly student gatherings, small groups, retreats, and service projects.",
      "Recruit, equip, and care for a team of screened adult volunteers.",
      "Partner with parents and communicate a clear student ministry calendar.",
      "Develop student leaders and connect teenagers to the wider life of the church.",
    ],
    qualifications: [
      "Experience leading teenagers in a church or parachurch setting.",
      "Clear biblical teaching skills and sound pastoral judgment.",
      "Strong organizational skills and commitment to student safety.",
      "Ability to build trust with students, parents, and volunteers.",
    ],
  },
  4: {
    summary:
      "River City Church is hiring a Worship Pastor to shape Christ-centered gatherings, develop musicians and vocalists, and cultivate a worship culture that serves the whole church.",
    responsibilities: [
      "Plan and lead weekly worship services in partnership with the teaching team.",
      "Recruit, audition, schedule, and pastor volunteer musicians and vocalists.",
      "Oversee worship production, rehearsal systems, and creative planning.",
      "Develop new worship leaders and maintain a healthy team culture.",
    ],
    qualifications: [
      "Proven experience leading worship in a local church.",
      "Strong musical, vocal, and platform leadership skills.",
      "Working knowledge of modern worship production and planning tools.",
      "Pastoral maturity and an ability to lead both creatives and technical teams.",
    ],
  },
  5: {
    summary:
      "Crossroads Church is seeking a Children's Ministry Pastor to help children know and follow Jesus while equipping parents and volunteers to nurture faith at home and at church.",
    responsibilities: [
      "Provide vision and oversight for nursery through fifth-grade ministries.",
      "Select curriculum and ensure engaging, age-appropriate biblical teaching.",
      "Recruit, train, schedule, and encourage children's ministry volunteers.",
      "Maintain excellent safety, check-in, and family communication practices.",
    ],
    qualifications: [
      "Experience directing a children's or family ministry.",
      "A clear understanding of child development and biblical discipleship.",
      "Strong volunteer leadership and parent communication skills.",
      "Commitment to safety policies and background-screening standards.",
    ],
  },
  6: {
    summary:
      "Faith Church is searching for a Campus Pastor to lead its Phoenix congregation, care for people, develop local leaders, and carry the church's shared mission into a growing community.",
    responsibilities: [
      "Provide visible pastoral leadership for the campus and its ministry teams.",
      "Lead staff, develop volunteers, and ensure alignment with church-wide vision.",
      "Teach regularly, host weekend gatherings, and provide pastoral care.",
      "Build local partnerships and guide outreach throughout the Phoenix area.",
    ],
    qualifications: [
      "Substantial pastoral or campus leadership experience.",
      "Strong team leadership, communication, and problem-solving ability.",
      "Theological alignment with Faith Church and commitment to its ministry model.",
      "A track record of developing leaders and building healthy ministry systems.",
    ],
  },
}

const LOCATION_COORDINATES: Record<string, [number, number]> = {
  "Portland, Oregon": [45.5152, -122.6784],
  "Seattle, Washington": [47.6062, -122.3321],
  "Boise, Idaho": [43.615, -116.2023],
  "Phoenix, Arizona": [33.4484, -112.074],
  "Denver, Colorado": [39.7392, -104.9903],
  "Dallas, Texas": [32.7767, -96.797],
  "Austin, Texas": [30.2672, -97.7431],
  "Nashville, Tennessee": [36.1627, -86.7816],
  "Atlanta, Georgia": [33.749, -84.388],
  "Charlotte, North Carolina": [35.2271, -80.8431],
  "Orlando, Florida": [28.5383, -81.3792],
  "Jacksonville, Florida": [30.3322, -81.6557],
  "Columbus, Ohio": [39.9612, -82.9988],
  "Chicago, Illinois": [41.8781, -87.6298],
  "Minneapolis, Minnesota": [44.9778, -93.265],
  "Kansas City, Missouri": [39.0997, -94.5786],
  "Oklahoma City, Oklahoma": [35.4676, -97.5164],
  "Richmond, Virginia": [37.5407, -77.436],
  "Louisville, Kentucky": [38.2527, -85.7585],
}

const icon = (name: string, className = "") => (
  <i className={`fa-solid ${name} ${className}`} aria-hidden="true" />
)

function useHash() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || "/")
  useEffect(() => {
    const update = () => {
      setHash(window.location.hash.slice(1) || "/")
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])
  return hash
}

function formatLocation(job: Job) {
  return job.country === "United States" || job.country === "Canada"
    ? `${job.city}, ${job.state}`
    : `${job.city}, ${job.country}`
}

function formatJobDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function formatApplicationDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

function organizationSlug(name: string) {
  return name.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/(^-|-$)/g, "")
}

function typeClass(type: Job["type"]) {
  if (type === "FULL TIME") return "bg-sky-600"
  if (type === "PART TIME") return "bg-orange-600"
  if (type === "INTERNSHIP") return "bg-emerald-600"
  return "bg-purple-600"
}

function Logo() {
  return (
    <a
      href="#/"
      className="flex shrink-0 items-center"
      aria-label="Red Letter Jobs home"
    >
      <img
        src={redLetterJobsLogo}
        alt="Red Letter Jobs — Find your calling"
        className="h-9 w-auto sm:h-14"
      />
    </a>
  )
}

function OrganizationLogo({
  name,
  className = "h-24 w-24",
}: {
  name: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const signature = Array.from(name).reduce(
    (total, character) => total + character.charCodeAt(0),
    0,
  )
  const churchDomains = [
    "gracechurch.org",
    "redeemer.com",
    "life.church",
    "elevationchurch.org",
    "northpoint.org",
    "willowcreek.org",
    "saddleback.com",
    "summitchurch.com",
    "passioncitychurch.com",
    "gatewaypeople.com",
    "seacoast.org",
    "crossroads.net",
    "flatironschurch.com",
    "mosaic.org",
    "transformationchurch.us",
    "rivervalley.org",
    "crosspoint.tv",
    "newlifechurch.org",
    "ccclife.org",
    "journeychristian.com",
    "covlife.org",
    "liquidchurch.com",
    "churchome.org",
    "shorelinecity.church",
    "baysideonline.com",
  ]
  const knownOrganizations = [
    ...Array.from(new Set(JOBS.map((job) => job.company))),
    "Harbor City Church",
  ]
  const organizationIndex = knownOrganizations.indexOf(name)
  const domain =
    churchDomains[
      (organizationIndex >= 0 ? organizationIndex : signature) %
        churchDomains.length
    ]
  const palette = [
    "text-brand-red",
    "text-sky-700",
    "text-emerald-700",
    "text-amber-700",
    "text-indigo-700",
    "text-purple-700",
  ][signature % 6]
  const initials = name
    .split(" ")
    .filter((word) => !["of", "the", "and"].includes(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return failed ? (
    <svg
      viewBox="0 0 48 48"
      className={`${className} shrink-0 ${palette}`}
      role="img"
      aria-label={`${name} logo fallback`}
    >
      <text
        x="24"
        y="29"
        textAnchor="middle"
        className="fill-current"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </svg>
  ) : (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
      alt={`${name} church logo`}
      className={`${className} shrink-0 object-contain`}
      onError={() => setFailed(true)}
    />
  )
}

function Header({
  hash,
  openDemo,
}: {
  hash?: string
  openDemo: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = hash || "/"
  const links: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs-listing" },
    { label: "Pulpit Supply", href: "/pulpit-supply" },
    { label: "Resources", href: "/resources" },
    { label: "For Employers", href: "/for-employers" },
    { label: "Pricing", href: "/pricing" },
    { label: "View Demos", href: "/demos" },
  ]
  const isActive = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath.startsWith(href)
  return (
    <>
      {/* <div className="border-b border-brand-red-hover bg-brand-red px-4 py-2 text-center text-xs font-bold text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span>
            Connecting Christ-Centered Ministers with Faithful Churches
          </span>
          <a
            href="#/jobs-listing"
            className="hidden underline decoration-2 underline-offset-2 transition hover:text-white sm:inline"
          >
            Browse open roles
          </a>
        </div>
      </div> */}
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-header-white shadow-sm">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="hidden font-poppins items-center gap-5 text-[12px] font-bold uppercase tracking-wider text-gray-700 xl:flex"
            aria-label="Primary navigation"
          >
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href === "/demos" ? "#/demos" : `#${href}`}
                onClick={
                  href === "/demos"
                    ? (event) => {
                        event.preventDefault()
                        openDemo()
                      }
                    : undefined
                }
                aria-current={isActive(href) ? "page" : undefined}
                className={`border-b-2 py-2 transition hover:text-brand-red font-poppins ${
                  isActive(href)
                    ? "border-brand-red text-brand-red"
                    : "border-transparent"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#/post-a-job"
              className="rounded bg-action-red px-2 py-2.5 text-xs font-extrabold uppercase tracking-wider shadow-sm transition hover:bg-action-red-hover sm:px-4"
            >
              <span className="text-white font-poppins text-[12px]">Post a Job</span>
            </a>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded border border-gray-200 p-2.5 text-gray-700 xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {icon(menuOpen ? "fa-xmark" : "fa-bars")}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="grid border-t border-gray-100 bg-header-white px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-gray-700 xl:hidden">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href === "/demos" ? "#/demos" : `#${href}`}
                onClick={(event) => {
                  setMenuOpen(false)
                  if (href === "/demos") {
                    event.preventDefault()
                    openDemo()
                  }
                }}
                className="border-b border-gray-100 py-3 last:border-0"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}

function DemoAccess({
  close,
  chooseRole,
  resetDemo,
}: {
  close: () => void
  chooseRole: (role: DemoRole) => void
  resetDemo: () => void
}) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [close])

  const roles: {
    role: DemoRole
    iconName: string
    title: string
    description: string
  }[] = [
    {
      role: "candidate",
      iconName: "fa-user",
      title: "Candidate",
      description:
        "Preview a free job seeker workspace for profiles, saved roles, and applications.",
    },
    {
      role: "employer",
      iconName: "fa-church",
      title: "Employer",
      description:
        "Preview organization tools for job listings, applicants, and hiring activity.",
    },
    {
      role: "admin",
      iconName: "fa-shield-halved",
      title: "Admin",
      description:
        "Preview platform management for users, organizations, listings, and reports.",
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-access-title"
        className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Staging preview
            </p>
            <h2
              id="demo-access-title"
              className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark"
            >
              Choose a demo experience
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-gray-600">
              Demo switching is for preview only. It does not create an account
              or authenticate a real user, and changes are not saved.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition hover:border-brand-red hover:text-brand-red"
            aria-label="Close demo access"
          >
            {icon("fa-xmark")}
          </button>
        </div>
        <div className="grid gap-4 p-6 md:grid-cols-3">
          {roles.map((item) => (
            <button
              key={item.role}
              type="button"
              onClick={() => chooseRole(item.role)}
              className="group rounded border border-gray-200 bg-slate-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red hover:bg-white hover:shadow-md"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded bg-red-50 text-lg text-brand-red">
                {icon(item.iconName)}
              </span>
              <strong className="mt-5 block text-base font-extrabold uppercase tracking-tight text-brand-dark group-hover:text-brand-red">
                {item.title} Demo
              </strong>
              <span className="mt-2 block text-sm leading-6 text-gray-600">
                {item.description}
              </span>
              <span className="mt-5 block text-xs font-extrabold uppercase tracking-wider text-brand-red">
                Open demo {icon("fa-arrow-right", "ml-1")}
              </span>
            </button>
          ))}
        </div>
        <div className="flex flex-col justify-between gap-3 border-t border-gray-200 bg-slate-50 px-6 py-4 text-xs text-gray-600 sm:flex-row sm:items-center">
          <span>Demo changes are stored in this browser for review.</span>
          <button
            type="button"
            onClick={resetDemo}
            className="self-start font-extrabold uppercase tracking-wider text-brand-red hover:underline sm:self-auto"
          >
            Reset Demo Data
          </button>
        </div>
      </section>
    </div>
  )
}

function ApplicationDialog({
  job,
  profile,
  savedResume,
  close,
  submit,
}: {
  job: Job
  profile: CandidateProfile
  savedResume: string
  close: () => void
  submit: (resumeName: string, message: string) => string | null
}) {
  const [resumeSource, setResumeSource] = useState<"saved" | "other">("saved")
  const [otherResume, setOtherResume] = useState("")
  const [message, setMessage] = useState(
    `Hello, my name is ${profile.name} from ${profile.city}, ${profile.state}. I am interested in the ${job.title} position at ${job.company}. Thank you for considering my application and resume.`,
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")
  const selectedResume =
    resumeSource === "saved" ? savedResume : otherResume

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !submitting) close()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [close, submitting])

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-gray-950/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !submitting) close()
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-dialog-title"
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-lg bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-200 px-6 py-5">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Free candidate application
            </p>
            <h2
              id="application-dialog-title"
              className="mt-1 text-2xl font-black tracking-tight text-brand-dark"
            >
              Apply for {job.title}
            </h2>
            <p className="mt-1 text-sm text-gray-500">{job.company}</p>
          </div>
          <button
            type="button"
            disabled={submitting}
            onClick={close}
            className="ml-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-red hover:text-brand-red disabled:opacity-40"
            aria-label="Close application"
          >
            {icon("fa-xmark")}
          </button>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setError("")
            if (job.closed) {
              setError(
                "Applications for this position are closed and cannot be submitted.",
              )
              return
            }
            if (!selectedResume) {
              setError("Select your saved resume or choose another resume.")
              return
            }
            setSubmitting(true)
            window.setTimeout(() => {
              try {
                const submissionError = submit(selectedResume, message)
                if (submissionError) {
                  setError(submissionError)
                  setSubmitting(false)
                }
              } catch {
                setError(
                  "The demo application could not be submitted. Please try again.",
                )
                setSubmitting(false)
              }
            }, 900)
          }}
          className="space-y-6 p-6"
        >
          {error && (
            <div
              role="alert"
              className="rounded border border-red-300 bg-red-50 p-4 text-sm font-bold text-red-900"
            >
              {icon("fa-circle-exclamation", "mr-2")}
              {error}
            </div>
          )}
          <section>
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Select a Resume
            </h3>
            <div className="mt-3 space-y-3">
              <label className="flex items-start gap-3 rounded border border-gray-200 bg-slate-50 p-4">
                <input
                  type="radio"
                  name="resume-source"
                  checked={resumeSource === "saved"}
                  onChange={() => setResumeSource("saved")}
                  className="mt-1 accent-red-700"
                />
                <span>
                  <strong className="block text-sm text-brand-dark">
                    Use saved resume
                  </strong>
                  <span className="mt-1 block break-all text-xs text-gray-600">
                    {savedResume}
                  </span>
                </span>
              </label>
              <label className="block rounded border border-gray-200 p-4">
                <span className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="resume-source"
                    checked={resumeSource === "other"}
                    onChange={() => setResumeSource("other")}
                    className="mt-1 accent-red-700"
                  />
                  <span>
                    <strong className="block text-sm text-brand-dark">
                      Choose another resume
                    </strong>
                    <span className="mt-1 block text-xs text-gray-600">
                      Select a PDF, DOC, or DOCX for this demo application.
                    </span>
                  </span>
                </span>
                {resumeSource === "other" && (
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={(event) =>
                      setOtherResume(event.target.files?.[0]?.name || "")
                    }
                    className="mt-3 block w-full text-xs text-gray-600 file:mr-3 file:rounded file:border-0 file:bg-brand-charcoal file:px-4 file:py-2 file:text-xs file:font-bold file:text-white"
                  />
                )}
              </label>
            </div>
            <div className="mt-3 rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
              <strong>Selected filename:</strong>{" "}
              {selectedResume || "No resume selected"}
              {resumeSource === "other" && (
                <span className="mt-1 block">
                  The selected file is used only for this demo and is not
                  uploaded or stored.
                </span>
              )}
            </div>
          </section>
          <label className="block text-xs font-bold uppercase text-gray-700">
            Cover letter / message{" "}
            <span className="font-normal normal-case text-gray-500">
              (Optional)
            </span>
            <textarea
              rows={7}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal leading-6 normal-case outline-none focus:border-brand-red"
            />
            <span className="mt-1.5 block font-normal normal-case leading-5 text-gray-500">
              Edit, replace, or delete this message completely. An empty message
              will not prevent submission.
            </span>
          </label>
          <div className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            This staging action does not send an application, resume, or message
            to a real employer.
          </div>
          <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              disabled={submitting}
              onClick={close}
              className="rounded border border-gray-300 px-5 py-3 text-xs font-bold uppercase text-brand-dark disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover disabled:cursor-wait disabled:opacity-70"
            >
              {submitting ? (
                <>
                  {icon("fa-spinner", "mr-2 animate-spin")}Submitting…
                </>
              ) : (
                "Submit Application"
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function ApplicationSuccess({
  close,
}: {
  close: () => void
}) {
  return (
    <div
      role="status"
      aria-live="assertive"
      className="fixed bottom-5 left-1/2 z-[120] flex w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 items-center gap-4 rounded-lg border-2 border-emerald-300 bg-emerald-700 p-5 text-white shadow-2xl"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-xl text-emerald-700">
        {icon("fa-check")}
      </span>
      <strong className="flex-grow text-base">
        Application submitted successfully.
      </strong>
      <button
        type="button"
        onClick={close}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/50 text-white hover:bg-white/10"
        aria-label="Dismiss success message"
      >
        {icon("fa-xmark")}
      </button>
    </div>
  )
}

function DemoBanner({
  session,
  openDemo,
  exitDemo,
  resetDemo,
}: {
  session: Session
  openDemo: () => void
  exitDemo: () => void
  resetDemo: () => void
}) {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2.5 text-amber-950">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-2 text-center text-xs sm:justify-between sm:text-left">
        <p>
          <strong className="uppercase tracking-wider">Preview mode:</strong>{" "}
          You are viewing the {session.role} demo. Actions and data are
          simulated and are not saved.
        </p>
        <div className="flex items-center gap-3 font-bold">
          <button
            type="button"
            onClick={openDemo}
            className="text-brand-red hover:underline"
          >
            Switch role
          </button>
          <button
            type="button"
            onClick={exitDemo}
            className="text-gray-600 hover:text-brand-dark hover:underline"
          >
            Exit demo
          </button>
          <button
            type="button"
            onClick={resetDemo}
            className="text-gray-600 hover:text-brand-dark hover:underline"
          >
            Reset Demo
          </button>
        </div>
      </div>
    </div>
  )
}

function Footer() {
  return (
    <footer className="border-t-4 border-brand-red bg-brand-charcoal text-gray-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <a
              href="#/"
              className="inline-flex rounded bg-white p-2 shadow-sm"
              aria-label="Red Letter Jobs home"
            >
              <img
                src={redLetterJobsLogo}
                alt="Red Letter Jobs — Find your calling"
                className="h-12 w-auto"
              />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Connecting churches, Christian organizations, and ministry
              professionals with opportunities to serve.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#/jobs-listing"
                className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white transition hover:bg-brand-red-hover"
              >
                Find Jobs
              </a>
              <a
                href="#/post-a-job"
                className="rounded border border-gray-600 px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:border-white"
              >
                Post a Job
              </a>
            </div>
            <a
              href="https://x.com/RedLetterJobs"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gray-400 transition hover:text-white"
              aria-label="Follow Red Letter Jobs on X"
            >
              <i
                className="fa-brands fa-x-twitter text-base"
                aria-hidden="true"
              />
              @RedLetterJobs
            </a>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["Find Jobs", "/jobs-listing"],
                ["Pulpit Supply", "/pulpit-supply"],
                ["Job Categories", "/categories"],
                ["Locations", "/locations"],
                ["Denominations", "/denominations"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Candidates
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["Candidate Sign In", "/candidate/sign-in"],
                ["Create Free Account", "/candidate/sign-up"],
                ["Candidate Dashboard", "/candidate/dashboard"],
                ["Resources", "/resources"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Employers
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["For Employers", "/for-employers"],
                ["Post a Job", "/post-a-job"],
                ["Employer Sign In", "/employer/sign-in"],
                ["Pricing", "/pricing"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase tracking-widest text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["About", "/about-us"],
                ["FAQs", "/faqs"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Use", "/terms-of-use"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition hover:text-white">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-y border-gray-700 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {icon("fa-shield-halved", "mr-2 text-red-300")}
            Purpose-built for ministry hiring and short-term service connections.
          </p>
          <a
            href="#/contact"
            className="font-bold text-white transition hover:text-red-200"
          >
            Need help? Contact support
          </a>
        </div>

        <div className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-gray-500 sm:flex-row">
          <span>© 2026 Red Letter Jobs. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a className="transition hover:text-white" href="#/terms-of-use">
              Terms
            </a>
            <a className="transition hover:text-white" href="#/privacy-policy">
              Privacy
            </a>
            <a className="transition hover:text-white" href="#/contact">
              Support
            </a>
            <a className="transition hover:text-white" href="#/faqs">
              FAQs
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

function JobBadge({ type }: { type: Job["type"] }) {
  return (
    <span
      className={`w-24 rounded px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white ${typeClass(type)}`}
    >
      {type}
    </span>
  )
}

function JobCard({
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
              className={`job-title truncate font-bold font-poppins tracking-tight text-gray-900 transition ${
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
            className={`${
              compact ? "mt-1 text-sm" : "mt-1 text-xs"
            } block truncate font-bold text-gray-700 hover:text-brand-red`}
          >
            {job.company}
          </a>
          <div
            className={`mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-bold ${metadataClassName}`}
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

function HomePage() {
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
              className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-white/60 bg-gray-950/55 px-4 py-2 text-xs font-bold backdrop-blur-sm transition hover:bg-gray-950/75 font-inter"
            >
              {icon("fa-cloud-arrow-up", "text-white")}
              <span className="text-white font-inter">Upload Your Resume</span>
            </a>
            <a
              href="#/post-a-job"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded border border-white/60 bg-gray-950/55 px-4 py-2 text-xs font-bold backdrop-blur-sm transition hover:bg-gray-950/75"
            >
              {icon("fa-briefcase", "text-white")}
              <span className="text-white">Hiring? Post a Job</span>
            </a>
          </div>
        </div>
      </section>
      <section className="mt-4 bg-header-white py-5">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-2">
            <h2 className="flex items-center text-xl font-sans font-extrabold uppercase tracking-tight text-brand-dark sm:text-2xl">
              {/* <span className="mr-2 h-2.5 w-2.5 bg-brand-red" /> */}
              Featured Ministry Opportunities
            </h2>
            <a href="#/jobs-listing"
              className="shrink-0 text-sm font-bold font-inter uppercase text-brand-red transition-colors duration-200 hover:text-brand-red-hover hover:underline"
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
                logoClassName="h-24 w-24 scale-90"
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
            {/* <span className="mr-2 h-2.5 w-2.5 bg-brand-charcoal" /> */}
            Popular Job Categories
          </h2>
          <a
            href="#/categories"
            className="shrink-0 text-sm font-bold font-inter uppercase text-brand-red hover:underline"
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
                {/* <span className="mr-2 h-2.5 w-2.5 bg-brand-red" /> */}
                Popular Denominations or Locations
              </h2>
            </div>
            <div className="flex flex-col items-start self-start sm:items-end sm:self-auto">
              <div className="inline-flex rounded border border-gray-200 bg-gray-100 p-0.5">
                <button
                  type="button"
                  onClick={() => setDirectoryMode("denominations")}
                  aria-pressed={directoryMode === "denominations"}
                  className={`rounded px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider transition ${
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
                  className={`rounded px-2 py-1.5 text-[9px] font-bold uppercase tracking-wider transition ${
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
                className="mt-1.5 inline-block text-xs font-bold font-inter uppercase text-brand-red hover:underline"
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
                className="group flex items-center justify-between border-b border-gray-200 py-3 text-base font-bold text-brand-dark transition hover:border-brand-red hover:text-brand-red"
              >
                <span>{item.name}</span>
                <span className="flex items-center gap-3 text-xs font-semibold text-gray-400">
                  {item.count} {item.count === 1 ? "opening" : "openings"}
                  {icon(
                    "fa-arrow-right",
                    "transition-transform group-hover:translate-x-1",
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
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 text-xs font-bold text-red-200">
                  {icon("fa-calendar-check")} Available when plans change
                </span>
                <h2 className="mt-3 text-3xl font-black uppercase leading-tight tracking-tight">
                  Ministry support for the moments that matter.
                </h2>
                <p className="mt-3 text-sm leading-6 text-gray-300">
                  Find trusted people for Sunday services, special gatherings,
                  and short-term ministry needs.
                </p>
                <a
                  href="#/pulpit-supply"
                  className="mt-4 inline-flex items-center rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white shadow-sm transition hover:bg-brand-red-hover"
                >
                  Explore Pulpit Supply {icon("fa-arrow-right", "ml-2")}
                </a>
              </div>
            </div>

            <div className="p-5 sm:p-6 lg:col-span-3">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">
                    Choose the support you need
                  </p>
                  <h3 className="mt-1 text-xl font-black text-brand-dark">
                    Two focused ways to find the right fit
                  </h3>
                </div>
                <a
                  href="#/candidate/pulpit-supply"
                  className="text-xs font-extrabold uppercase tracking-wider text-brand-red hover:underline"
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
                    className="group rounded border border-gray-200 p-4 transition hover:border-brand-red hover:shadow-md"
                  >
                    <span
                      className={`flex h-11 w-11 items-center justify-center rounded ${category.tone}`}
                    >
                      {icon(category.iconName)}
                    </span>
                    <strong className="mt-3 block text-base font-black text-brand-dark">
                      {category.title}
                    </strong>
                    <span className="mt-2 block text-sm leading-6 text-gray-600">
                      {category.description}
                    </span>
                    <span className="mt-3 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red">
                      Browse professionals{" "}
                      {icon(
                        "fa-arrow-right",
                        "ml-2 transition-transform group-hover:translate-x-1",
                      )}
                    </span>
                  </a>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-gray-200 pt-3 text-xs font-semibold text-gray-500">
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
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">
                Recently hiring
              </p>
              <h2 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
                Latest Organizations on Red Letter Jobs
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Explore churches and ministry organizations represented in the
                latest opportunities.
              </p>
            </div>
            <a
              href="#/jobs-listing"
              className="shrink-0 text-xs font-extrabold uppercase tracking-wider text-brand-red hover:underline"
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
                        className="flex w-56 shrink-0 items-center gap-3 rounded border border-gray-200 bg-white p-3 shadow-sm transition hover:border-brand-red hover:shadow-md"
                      >
                        <OrganizationLogo
                          name={job.company}
                          className="h-16 w-16"
                        />
                        <span className="min-w-0">
                          <strong className="block text-sm font-black leading-5 text-brand-dark">
                            {job.company}
                          </strong>
                          <span className="mt-1 block truncate text-xs text-gray-500">
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

const PREACHING_SUPPLY_TYPES = [
  "Sunday morning preaching",
  "Sunday evening preaching",
  "Wednesday services",
  "Guest preaching",
  "Revival meetings",
  "Special worship services",
  "Weekend assignments",
  "Short-term preaching assignments",
  "Evangelistic meetings",
  "Conference speakers",
  "Retired pastors available to preach",
  "Seminary students available for pulpit supply",
]

const WORSHIP_SUPPLY_TYPES = [
  "Guest worship leaders",
  "Substitute worship pastors",
  "Pianists",
  "Keyboardists",
  "Guitarists",
  "Drummers",
  "Bass guitarists",
  "Organists",
  "Vocalists",
  "Choir directors",
  "Instrumentalists",
  "Worship bands",
  "Guest soloists",
  "Special music performers",
]

function SupplyCandidateCard({
  candidate,
  actionHref,
  actionLabel = "View Profile",
  secondaryAction,
  viewAction,
  saveAction,
}: {
  candidate: SupplyCandidate
  actionHref: string
  actionLabel?: string
  secondaryAction?: () => void
  viewAction?: () => void
  saveAction?: () => void
}) {
  return (
    <article className="rounded border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-red">
      <div className="flex items-start gap-4">
        <img
          src={`https://i.pravatar.cc/160?img=${candidate.id + 20}`}
          alt={`${candidate.name} sample profile`}
          className="h-16 w-16 rounded-full object-cover"
        />
        <div className="min-w-0">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-brand-red">
            {candidate.category} Supply
          </span>
          <h3 className="mt-1 text-lg font-black text-brand-dark">
            {candidate.name}
          </h3>
          <p className="text-xs font-bold text-gray-600">
            {candidate.roles.join(" · ")}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            {candidate.city}, {candidate.state} · {candidate.experience} years
          </p>
        </div>
      </div>
      <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
        {candidate.biography}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {candidate.availabilityVisible &&
          candidate.availability.slice(0, 2).map((item) => (
            <span
              key={item}
              className="rounded bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800"
            >
              {item}
            </span>
          ))}
      </div>
      <div className="mt-5 flex flex-wrap gap-2 border-t border-gray-100 pt-4">
        {viewAction ? (
          <button
            type="button"
            onClick={viewAction}
            className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            {actionLabel}
          </button>
        ) : (
          <a
            href={actionHref}
            className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            {actionLabel}
          </a>
        )}
        {secondaryAction && (
          <button
            type="button"
            onClick={secondaryAction}
            className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
          >
            Invite to Serve
          </button>
        )}
        {saveAction && (
          <button
            type="button"
            onClick={saveAction}
            className="rounded border border-gray-300 px-3 py-2.5 text-gray-500 hover:border-brand-red hover:text-brand-red"
            aria-label={`Save ${candidate.name}`}
          >
            {icon("fa-heart")}
          </button>
        )}
      </div>
    </article>
  )
}

function PulpitSupplyPage({ supplyState }: { supplyState: SupplyState }) {
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [category, setCategory] = useState("")
  const visibleCandidates = supplyState.candidates.filter(
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
      (!category || candidate.category === category),
  )
  const faqs = [
    [
      "Is Pulpit Supply the same as applying for a permanent job?",
      "No. Supply profiles support temporary services and short-term ministry assignments while candidates may continue regular job searches.",
    ],
    [
      "Are theological questions required?",
      "No. Every theological field is optional, and candidates control whether responses are visible.",
    ],
    [
      "Does Red Letter Jobs process honorariums?",
      "Not in this staging prototype. Churches and candidates can discuss sample terms, but payment processing is not connected.",
    ],
  ]
  return (
    <>
      <section className="bg-brand-charcoal px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-red-300">
            Pulpit Supply & Worship Supply
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black uppercase tracking-tight sm:text-5xl">
            Find the Right Ministry Leader for Every Service.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-gray-300">
            Connect with available preachers, worship leaders, and musicians
            when your church needs them.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#/pulpit-supply"
              className="rounded bg-brand-red px-6 py-3 text-sm font-extrabold uppercase tracking-wider text-white"
            >
              Find Pulpit Supply
            </a>
            <a
              href="#/candidate/pulpit-supply"
              className="rounded border border-gray-500 px-6 py-3 text-sm font-bold uppercase tracking-wider text-white hover:border-white"
            >
              Offer Pulpit Supply
            </a>
          </div>
        </div>
      </section>
      <section id="search" className="border-b border-gray-200 bg-white px-6 py-8">
        <div className="mx-auto grid max-w-5xl gap-3 rounded border border-gray-200 bg-slate-50 p-4 shadow-sm md:grid-cols-4">
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Role, name, or ministry" aria-label="Search supply candidates" className="rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red md:col-span-2" />
          <input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="City or state" aria-label="Supply candidate location" className="rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red" />
          <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Supply category" className="rounded border border-gray-300 p-3 text-sm"><option value="">All supply roles</option><option>Preaching</option><option>Worship</option></select>
        </div>
      </section>
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {[
            ["Preaching & Ministry Supply", "fa-person-chalkboard", PREACHING_SUPPLY_TYPES],
            ["Worship & Music Supply", "fa-music", WORSHIP_SUPPLY_TYPES],
          ].map(([title, iconName, items]) => (
            <article key={String(title)} className="rounded border border-gray-200 bg-white p-6 shadow-sm">
              <span className="flex h-12 w-12 items-center justify-center rounded bg-red-50 text-xl text-brand-red">{icon(String(iconName))}</span>
              <h2 className="mt-4 text-2xl font-black uppercase tracking-tight text-brand-dark">{String(title)}</h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {(items as string[]).map((item) => <p key={item} className="flex gap-2 text-sm text-gray-600">{icon("fa-check", "mt-1 text-brand-red")}<span>{item}</span></p>)}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <AdminPageHeader title="Featured Available Candidates" description="Fictional demo professionals currently visible in Pulpit Supply search." />
          {visibleCandidates.length ? <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{visibleCandidates.slice(0, 6).map((candidate) => <SupplyCandidateCard key={candidate.id} candidate={candidate} actionHref={`#/pulpit-supply/candidate/${candidate.id}`} />)}</div> : <CandidateEmpty title="No matching supply candidates" description="Adjust the role or location search to see more available professionals." action="Clear Search" onAction={() => { setQuery(""); setLocation(""); setCategory("") }} />}
        </div>
      </section>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">Simple coordination</p><h2 className="mt-2 text-3xl font-black uppercase text-brand-dark">How It Works</h2></div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">{[["01", "Create a Supply Profile", "Ministry professionals share optional experience, beliefs, availability, and samples."], ["02", "Search and Invite", "Churches search visible profiles and send a private service request."], ["03", "Confirm and Serve", "Candidates respond, coordinate details, and track the engagement."]].map(([number, title, text]) => <article key={number} className="rounded border border-gray-200 bg-slate-50 p-6"><span className="text-4xl font-black text-gray-200">{number}</span><h3 className="mt-3 font-black text-brand-dark">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{text}</p></article>)}</div>
        </div>
      </section>
      <section className="border-y border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <article className="rounded bg-brand-charcoal p-7 text-white"><h2 className="text-2xl font-black uppercase">Benefits for Churches</h2><ul className="mt-5 space-y-3 text-sm text-gray-300">{["Search by role, location, availability, and shared ministry background", "Review sermon and music samples privately", "Coordinate invitations, bookings, calendars, and messages", "Keep private contact information protected"].map((item) => <li key={item}>{icon("fa-check", "mr-2 text-red-300")}{item}</li>)}</ul></article>
          <article className="rounded border border-gray-200 bg-white p-7"><h2 className="text-2xl font-black uppercase text-brand-dark">Benefits for Ministry Professionals</h2><ul className="mt-5 space-y-3 text-sm text-gray-600">{["Serve churches without leaving regular employment search", "Control theological, availability, contact, and honorarium visibility", "Share preaching or worship portfolios", "Accept, decline, and track invitations"].map((item) => <li key={item}>{icon("fa-check", "mr-2 text-brand-red")}{item}</li>)}</ul></article>
        </div>
      </section>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl"><div className="text-center"><h2 className="text-3xl font-black uppercase text-brand-dark">Frequently Asked Questions</h2></div><div className="mt-7 divide-y divide-gray-200 rounded border border-gray-200">{faqs.map(([question, answer]) => <details key={question} className="group p-5"><summary className="cursor-pointer list-none font-extrabold text-brand-dark">{question}{icon("fa-plus", "float-right text-brand-red")}</summary><p className="mt-3 text-sm leading-6 text-gray-600">{answer}</p></details>)}</div></div>
      </section>
      <section className="bg-brand-red px-6 py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left"><div><h2 className="text-2xl font-black uppercase">Ready to serve or find supply ministry?</h2><p className="mt-2 text-sm text-red-100">Registration and booking actions are clearly labeled staging interactions.</p></div><div className="flex flex-col gap-3 sm:flex-row"><a href="#/employer/pulpit-supply" className="rounded bg-white px-5 py-3 text-xs font-extrabold uppercase text-brand-red">Find Supply</a><a href="#/candidate/pulpit-supply" className="rounded border border-white px-5 py-3 text-xs font-extrabold uppercase text-white">Offer Supply</a></div></div>
      </section>
    </>
  )
}

function PublicSupplyCandidatePage({
  hash,
  supplyState,
}: {
  hash: string
  supplyState: SupplyState
}) {
  const id = Number(hash.split("/").pop())
  const candidate = [...supplyState.candidates, supplyState.profile].find(
    (item) => item.id === id && item.profileVisible,
  )
  if (!candidate)
    return (
      <CandidateEmpty
        title="Supply profile not available"
        description="This profile may be private or no longer accepting supply invitations."
        action="Browse Pulpit Supply"
        href="#/pulpit-supply"
      />
    )
  return (
    <>
      <PageBanner title="Pulpit Supply Profile" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <SupplyCandidateDetail
          candidate={candidate}
          close={() => {
            window.location.hash = "/pulpit-supply"
          }}
          invite={() => {
            window.location.hash = "/employer/pulpit-supply"
          }}
        />
      </div>
    </>
  )
}

function PageBanner({
  title,
  subtitle = "Connecting ministry professionals, churches, and Christian organizations",
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="border-b border-gray-800 bg-gray-900 px-6 py-6 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {title}
          </h1>
          <div className="mt-1 text-[11px] text-gray-400">
            <a href="#/" className="hover:text-white">
              Home
            </a>{" "}
            <span className="mx-1">›</span>{" "}
            <span className="uppercase text-red-400">{title}</span>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-gray-400 md:mt-0">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function JobListingsPage({ hash }: { hash: string }) {
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
        <div className="mx-auto max-w-7xl text-xs text-gray-500">
          <a href="#/" className="font-semibold hover:text-brand-red">
            Home
          </a>
          <span className="mx-2">›</span>
          <span className="font-bold text-brand-dark">{title}</span>
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
                  className="w-full py-2.5 text-sm font-medium text-gray-700 outline-none placeholder:font-medium placeholder:text-gray-500"
                />
              </label>
            </FilterBox>
            <FilterBox title="Locations" iconName="fa-location-dot">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setLocationMenuOpen((value) => !value)}
                  aria-expanded={locationMenuOpen}
                  className="flex w-full items-center justify-between rounded border border-gray-300 bg-white p-2.5 text-left text-sm font-medium text-gray-700"
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
                className="w-full rounded border border-gray-300 p-2.5 text-sm font-medium text-gray-700"
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
                className="w-full rounded border border-gray-300 p-2.5 text-sm font-medium text-gray-700"
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

function JobLocationMap({
  job,
  organizationMode = false,
}: {
  job: Job
  organizationMode?: boolean
}) {
  const mapElement = useRef<HTMLDivElement>(null)
  const coordinates = LOCATION_COORDINATES[`${job.city}, ${job.state}`]

  useEffect(() => {
    if (!mapElement.current || !coordinates) return

    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(coordinates, 10)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    L.marker(coordinates, {
      icon: L.divIcon({
        className: "",
        html: '<span class="job-map-marker"><i class="fa-solid fa-church"></i></span>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
      title: organizationMode
        ? `${job.company} in ${formatLocation(job)}`
        : `${job.title} in ${formatLocation(job)}`,
    })
      .addTo(map)
      .bindPopup(
        organizationMode
          ? `<strong>${job.company}</strong><br>${formatLocation(job)}`
          : `<strong>${job.title}</strong><br>${job.company}<br>${formatLocation(job)}`,
      )
      .openPopup()

    window.setTimeout(() => map.invalidateSize(), 0)
    return () => map.remove()
  }, [coordinates, job, organizationMode])

  if (!coordinates) return null

  return (
    <div
      ref={mapElement}
      className="mt-3 h-48 w-full overflow-hidden rounded border border-gray-200"
      aria-label={
        organizationMode
          ? `Map showing ${job.company} in ${formatLocation(job)}`
          : `Map showing ${formatLocation(job)}`
      }
    />
  )
}

function JobDetailPage({ hash }: { hash: string }) {
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

function FilterBox({
  title,
  iconName,
  children,
}: {
  title: string
  iconName: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900">
        <span>{title}</span>
        {icon(iconName, "text-gray-400")}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function MapModal({ close, jobs }: { close: () => void; jobs: Job[] })  {
  const mapElement = useRef<HTMLDivElement>(null)
  const locationGroups = useMemo(() => {
    const groups = new Map<string, { jobs: Job[]; coordinates: [number, number] }>()
    jobs.forEach((job) => {
      const key = `${job.city}, ${job.state}`
      const coordinates = LOCATION_COORDINATES[key]
      if (!coordinates) return
      const group = groups.get(key)
      if (group) group.jobs.push(job)
      else groups.set(key, { jobs: [job], coordinates })
    })
    return Array.from(groups, ([key, value]) => ({ key, ...value }))
  }, [jobs])
  const [selectedLocation, setSelectedLocation] = useState(
    locationGroups[0]?.key || "",
  )
  const selectedGroup =
    locationGroups.find((group) => group.key === selectedLocation) ||
    locationGroups[0]

  useEffect(() => {
    if (!mapElement.current) return

    const map = L.map(mapElement.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([39.5, -98.35], 4)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    const bounds: L.LatLngExpression[] = []
    locationGroups.forEach((group) => {
      bounds.push(group.coordinates)
      const marker = L.marker(group.coordinates, {
        icon: L.divIcon({
          className: "",
          html: `<span class="job-map-marker">${group.jobs.length}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
        title: `${group.jobs.length} jobs in ${group.key}`,
      }).addTo(map)
      marker.bindTooltip(
        `<strong>${group.key}</strong><br>${group.jobs.length} ${
          group.jobs.length === 1 ? "ministry job" : "ministry jobs"
        }`,
        { direction: "top", offset: [0, -14] },
      )
      marker.on("click", () => setSelectedLocation(group.key))
    })

    if (bounds.length) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [35, 35],
        maxZoom: 6,
      })
    }

    window.setTimeout(() => map.invalidateSize(), 0)
    return () => map.remove()
  }, [locationGroups])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={close}
    >
      <div
        className="map-popup w-full max-w-6xl rounded bg-white p-4 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Map of ministry positions"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase text-gray-800">
              {icon("fa-map-location-dot", "mr-2 text-brand-red")}Ministry Jobs
              Map
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {jobs.length} jobs across {locationGroups.length} locations
            </p>
          </div>
          <button
            onClick={close}
            className="text-xl font-bold text-gray-400 hover:text-gray-800"
            aria-label="Close map"
          >
            ×
          </button>
        </div>
        <div className="mt-4 grid overflow-hidden rounded border border-gray-300 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={mapElement} className="h-[28rem] min-h-80 w-full" />
          <aside className="max-h-[28rem] overflow-y-auto border-t border-gray-200 bg-gray-50 p-4 lg:border-l lg:border-t-0">
            {selectedGroup ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                  Selected location
                </p>
                <h3 className="mt-1 text-lg font-black text-brand-dark">
                  {selectedGroup.key}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedGroup.jobs.length}{" "}
                  {selectedGroup.jobs.length === 1 ? "opening" : "openings"}
                </p>
                <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {selectedGroup.jobs.slice(0, 8).map((job) => (
                    <a
                      key={job.id}
                      href={`#/job/${job.id}`}
                      onClick={close}
                      className="group block py-3"
                    >
                      <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-red">
                        {job.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {job.company}
                      </span>
                    </a>
                  ))}
                </div>
                {selectedGroup.jobs.length > 8 && (
                  <p className="mt-3 text-xs font-semibold text-gray-500">
                    +{selectedGroup.jobs.length - 8} more jobs at this location
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No mapped jobs match the current filters.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

function GridPage({ kind }: { kind: "categories" | "denominations" }) {
  const categories = kind === "categories"
  return (
    <>
      <PageBanner title={categories ? "Job Categories" : "Denominations"} />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className={
            categories
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        >
          {(categories ? CATEGORIES : DENOMINATIONS).map((item) => (
            <a
              key={item.slug}
              href={
                categories
                  ? `#/jobs/${item.slug}`
                  : `#/denomination/${item.slug}`
              }
              className={`group rounded border border-gray-200 bg-white shadow-sm transition hover:border-brand-red ${
                categories
                  ? "flex min-h-32 flex-col justify-between p-4"
                  : "flex h-20 items-center gap-3 p-3"
              }`}
            >
              {categories ? (
                <>
                  <span className="mb-3 flex h-12 w-12 items-center justify-center self-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-brand-red group-hover:text-white">
                    {icon("icon" in item ? item.icon : "fa-church")}
                  </span>
                  <div className="text-center">
                    <h2 className="text-xs font-bold uppercase text-gray-800 group-hover:text-brand-red">
                      {item.name}
                    </h2>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      ({item.count} Open Vacancies)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-100 bg-white p-1">
                    {"logo" in item && item.logo ? (
                      <img
                        src={item.logo}
                        alt={`${item.name} logo`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      icon("fa-church", "text-xl text-gray-400")
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold leading-4 text-gray-800 group-hover:text-brand-red">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      {item.count} open vacancies
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400 group-hover:text-brand-red">
                    {icon("fa-arrow-right")}
                  </span>
                </>
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

function LocationsPage() {
  return (
    <>
      <PageBanner title="Job Locations" />
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        <LocationGroup
          title="United States (50 States)"
          count="50 States Available"
          iconName="fa-flag-usa"
          items={US_STATES}
        />
        <LocationGroup
          title="Canada (10 Provinces & 3 Territories)"
          count="13 Jurisdictions"
          iconName="fa-leaf"
          items={CANADA_PROVINCES}
        />
        <div className="rounded border border-gray-300 bg-gray-100 p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-black uppercase text-gray-900">
              International Ministries & Missions
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Looking for non-US and non-Canada opportunities? View all
              international kingdom openings.
            </p>
          </div>
          <a
            href="#/jobs-listing?location=United%20Kingdom"
            className="mt-4 inline-block rounded bg-brand-charcoal px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white sm:mt-0"
          >
            View International Listings
          </a>
        </div>
      </div>
    </>
  )
}

function LocationGroup({
  title,
  count,
  iconName,
  items,
}: {
  title: string
  count: string
  iconName: string
  items: string[]
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-2">
        <h2 className="text-base font-black uppercase tracking-tight text-gray-900">
          {icon(iconName, "mr-2 text-brand-red")}
          {title}
        </h2>
        <span className="hidden text-xs font-bold text-gray-500 sm:block">
          {count}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item) => (
          <a
            key={item}
            href={`#/location/${item.replaceAll(" ", "-")}`}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-brand-red hover:text-brand-red"
          >
            <span>{item}</span>
            <span className="text-[10px] text-gray-400">View</span>
          </a>
        ))}
      </div>
    </section>
  )
}

function AuthPage({
  login,
}: {
  login: (role: "candidate" | "employer") => void
}) {
  const [role, setRole] = useState<"candidate" | "employer">("candidate")
  return (
    <div className="mx-auto my-12 max-w-md rounded border border-gray-200 bg-white p-6 shadow-md">
      <p className="mb-2 text-center text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
        Staging preview
      </p>
      <h1 className="mb-6 text-center text-xl font-bold uppercase tracking-tight text-gray-900">
        Sign In to Red Letter Jobs
      </h1>
      <p className="-mt-3 mb-6 text-center text-xs leading-5 text-gray-500">
        This form opens a simulated demo workspace. It does not authenticate an
        account or send information to a server.
      </p>
      <div className="space-y-4">
        <label className="block text-xs font-bold uppercase text-gray-700">
          Account Role
          <select
            value={role}
            onChange={(e) => setRole(e.target.value as typeof role)}
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-semibold"
          >
            <option value="candidate">Job Seeker (Candidate)</option>
            <option value="employer">Church / Employer</option>
          </select>
        </label>
        <label className="block text-xs font-bold uppercase text-gray-700">
          Email Address
          <input
            type="email"
            defaultValue="jordan@example.test"
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-normal normal-case"
          />
        </label>
        <label className="block text-xs font-bold uppercase text-gray-700">
          Password
          <input
            type="password"
            defaultValue="password"
            className="mt-1 w-full rounded border border-gray-300 p-2 text-xs font-normal"
          />
        </label>
        <button
          onClick={() => login(role)}
          className="w-full rounded bg-brand-red py-3 text-xs font-bold uppercase text-white transition hover:bg-brand-red-hover"
        >
          Continue to Demo
        </button>
      </div>
    </div>
  )
}

function EmployersPage() {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const benefits = [
    {
      icon: "fa-user-check",
      title: "Faith-centered talent pool",
      description:
        "Reach pastors and ministry professionals looking for their next opportunity to serve.",
    },
    {
      icon: "fa-pen-to-square",
      title: "Easy job-posting tools",
      description:
        "Build a complete listing with your mission, theology, salary range, expectations, and application process.",
    },
    {
      icon: "fa-filter",
      title: "Targeted ministry discovery",
      description:
        "Help candidates find your opening by role, denomination, job type, and location.",
    },
    {
      icon: "fa-list-check",
      title: "Organized candidate review",
      description:
        "Keep applications and candidate details together so your hiring team can evaluate the right fit.",
    },
  ]
  const steps = [
    {
      number: "01",
      title: "Create your church profile",
      description:
        "Share your mission, values, denomination, location, and what makes your ministry unique.",
    },
    {
      number: "02",
      title: "Post a ministry role",
      description:
        "Describe the position, responsibilities, salary range, qualifications, and ministry expectations.",
    },
    {
      number: "03",
      title: "Review potential candidates",
      description:
        "Compare applications and ministry experience from people interested in your role.",
    },
    {
      number: "04",
      title: "Connect and hire",
      description:
        "Begin conversations, schedule interviews, and invite the right leader to join your ministry.",
    },
  ]
  const audiences = [
    ["fa-church", "Churches", "From local congregations to multisite churches."],
    [
      "fa-cross",
      "Christian organizations",
      "Parachurch ministries, missions agencies, and ministry networks.",
    ],
    [
      "fa-people-group",
      "Leadership teams",
      "Pastors, elders, boards, and search committees building healthy teams.",
    ],
    [
      "fa-hand-holding-heart",
      "Faith-based nonprofits",
      "Christian charities and service organizations hiring mission-aligned staff.",
    ],
  ]
  const plans = [
    {
      name: "Standard Listing",
      price: "[Set price]",
      term: "[Set duration]",
      description: "[Add approved standard package description]",
      features: [
        "[Set listing duration]",
        "[Set application tools]",
        "[Set support level]",
        "[Set visibility details]",
      ],
      featured: false,
    },
    {
      name: "Featured Listing",
      price: "[Set price]",
      term: "[Set duration]",
      description: "[Add approved featured package description]",
      features: [
        "[Set featured placement]",
        "[Set listing duration]",
        "[Set employer tools]",
        "[Set support level]",
      ],
      featured: true,
    },
    {
      name: "Organization Package",
      price: "[Set price]",
      term: "[Set terms]",
      description: "[Add approved organization package description]",
      features: [
        "[Set listing allowance]",
        "[Set team access]",
        "[Set branding options]",
        "[Set support level]",
      ],
      featured: false,
    },
  ]

  return (
    <>
      <section className="bg-brand-charcoal px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-red-300">
              Ministry hiring, made clearer
            </p>
            <h1 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
              Find leaders who share your calling
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
              Connect with pastors and ministry professionals aligned with your
              mission, values, and vision for kingdom work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#/post-a-job"
                className="inline-flex items-center justify-center gap-2 rounded bg-brand-red px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition hover:bg-brand-red-hover"
              >
                <span className="text-white">Post a Job</span>
                {icon("fa-arrow-right", "text-white")}
              </a>
              <a
                href="#/employer/sign-up"
                className="inline-flex items-center justify-center rounded border border-gray-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:border-white"
              >
                <span className="text-white">Create Church Account</span>
              </a>
            </div>
          </div>
          <div className="rounded border border-gray-700 bg-gray-900 p-6 shadow-2xl lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-wider text-red-300">
              Built for ministry search teams
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded bg-gray-800 p-4">
                <strong className="block text-3xl font-black text-white">
                  {allJobs.length}
                </strong>
                <span className="mt-1 block text-xs text-gray-400">
                  Sample ministry opportunities
                </span>
              </div>
              <div className="rounded bg-gray-800 p-4">
                <strong className="block text-3xl font-black text-white">
                  31
                </strong>
                <span className="mt-1 block text-xs text-gray-400">
                  Sample denominational traditions
                </span>
              </div>
            </div>
            <div className="mt-4 rounded border border-gray-700 p-4">
              <p className="text-sm font-bold text-white">
                Purpose-built ministry search
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                Reach candidates through role, denomination, location, and job
                type discovery tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Who it’s for
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Serving ministries of every size
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Red Letter Jobs supports Christian employers searching for
              faithful, capable people to strengthen their teams.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([iconName, title, description]) => (
              <article
                key={title}
                className="rounded border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-brand-red">
                  {icon(iconName)}
                </span>
                <h3 className="mt-4 text-sm font-extrabold uppercase text-brand-dark">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-gray-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Why Red Letter Jobs
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              A better place to find ministry talent
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded border border-gray-200 bg-slate-50 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded bg-red-50 text-lg text-brand-red">
                  {icon(benefit.icon)}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-brand-dark">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Simple from start to finish
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              How ministry hiring works
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-black text-gray-200">
                  {step.number}
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-brand-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Employer package preview
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Post on your terms
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Package names, prices, terms, and included features remain
              editable placeholders pending commercial approval.
            </p>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded border p-6 ${
                  plan.featured
                    ? "border-brand-red shadow-lg"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-4 top-4 rounded bg-red-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-red">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-5">
                  <strong className="text-4xl font-black text-brand-dark">
                    {plan.price}
                  </strong>
                  <span className="ml-2 text-xs font-semibold text-gray-500">
                    / {plan.term}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      {icon("fa-check", "mt-1 text-brand-red")}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#/post-a-job"
                  className={`mt-6 flex items-center justify-center rounded px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition ${
                    plan.featured
                      ? "bg-brand-red hover:bg-brand-red-hover"
                      : "border border-gray-300 hover:border-brand-red"
                  }`}
                >
                  <span
                    className={
                      plan.featured ? "text-white" : "text-brand-dark"
                    }
                  >
                    Review Posting Options
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded bg-brand-red p-8 text-center shadow-lg md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Ready to meet your next ministry leader?
            </h2>
            <p className="mt-2 text-sm text-red-100">
              Create an employer account and publish your opportunity today.
            </p>
          </div>
          <a
            href="#/post-a-job"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-wider shadow-sm transition hover:bg-gray-100"
          >
            <span className="text-brand-red">Get Started</span>
            {icon("fa-arrow-right", "text-brand-red")}
          </a>
        </div>
      </section>
    </>
  )
}

function CandidateAuthPage({
  mode,
  enterDemo,
}: {
  mode: "sign-in" | "sign-up" | "recovery"
  enterDemo: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const title =
    mode === "sign-in"
      ? "Candidate Sign In"
      : mode === "sign-up"
        ? "Create Your Free Candidate Account"
        : "Recover Your Password"
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-md overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-brand-charcoal px-6 py-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
            Candidate access · Always free
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">
            {title}
          </h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (mode === "recovery") setSubmitted(true)
            else if (mode === "sign-up")
              window.location.hash = "/candidate/onboarding"
            else enterDemo()
          }}
          className="space-y-4 p-6"
        >
          <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            Demo access is simulated for staging. No account is created and
            credentials are not sent to a server.
          </p>
          {mode === "sign-up" && (
            <label className="block text-xs font-bold uppercase text-gray-700">
              Full name
              <input
                required
                defaultValue="Jordan Ellis"
                className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
              />
            </label>
          )}
          <label className="block text-xs font-bold uppercase text-gray-700">
            Email address
            <input
              required
              type="email"
              defaultValue="jordan@example.test"
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
            />
          </label>
          {mode !== "recovery" && (
            <label className="block text-xs font-bold uppercase text-gray-700">
              Password
              <input
                required
                type="password"
                defaultValue="demo-password"
                className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
              />
            </label>
          )}
          {mode === "sign-up" && (
            <label className="flex gap-2 text-xs leading-5 text-gray-600">
              <input required type="checkbox" className="mt-1 accent-red-700" />
              <span>
                I agree to the draft Terms of Use and acknowledge the draft
                Privacy Policy.
              </span>
            </label>
          )}
          <button
            type="submit"
            className="w-full rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
          >
            {mode === "sign-in"
              ? "Enter Candidate Demo"
              : mode === "sign-up"
                ? "Continue to Onboarding"
                : "Preview Recovery Request"}
          </button>
          {submitted && (
            <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
              Recovery preview complete. No email was sent because email
              delivery is not connected.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs font-bold">
            {mode !== "sign-in" && (
              <a href="#/candidate/sign-in" className="text-brand-red">
                Sign in
              </a>
            )}
            {mode !== "sign-up" && (
              <a href="#/candidate/sign-up" className="text-brand-red">
                Create free account
              </a>
            )}
            {mode !== "recovery" && (
              <a href="#/candidate/password-recovery" className="text-gray-500">
                Forgot password?
              </a>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function CandidateOnboarding({
  state,
  setState,
  enterDemo,
}: {
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
  enterDemo: () => void
}) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(state.profile)
  const update = (field: keyof CandidateProfile, value: string | boolean) =>
    setProfile((current) => ({ ...current, [field]: value }))
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-3xl rounded border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Free candidate onboarding · Step {step} of 3
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
            {step === 1
              ? "Introduce Yourself"
              : step === 2
                ? "Share Your Ministry Direction"
                : "Choose Your Privacy"}
          </h1>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-1.5 rounded-full ${
                  item <= step ? "bg-brand-red" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-5 p-6">
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <CandidateField
                  label="Full name"
                  value={profile.name}
                  onChange={(value) => update("name", value)}
                />
                <CandidateField
                  label="Professional headline"
                  value={profile.headline}
                  onChange={(value) => update("headline", value)}
                />
                <CandidateField
                  label="City"
                  value={profile.city}
                  onChange={(value) => update("city", value)}
                />
                <CandidateField
                  label="State"
                  value={profile.state}
                  onChange={(value) => update("state", value)}
                />
              </div>
              <CandidateField
                label="Ministry biography"
                value={profile.biography}
                onChange={(value) => update("biography", value)}
                multiline
              />
            </>
          )}
          {step === 2 && (
            <>
              <CandidateField
                label="Preferred roles"
                value={profile.preferredRoles}
                onChange={(value) => update("preferredRoles", value)}
                help="Separate role names with commas."
              />
              <CandidateField
                label="Preferred locations"
                value={profile.preferredLocations}
                onChange={(value) => update("preferredLocations", value)}
              />
              <CandidateField
                label="Denominational affiliation"
                value={profile.denomination}
                onChange={(value) => update("denomination", value)}
              />
            </>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <PrivacyControl
                title="Employer profile visibility"
                description="When off, employers cannot discover your candidate profile. You can still apply to jobs."
                checked={profile.profileVisible}
                onChange={(checked) => update("profileVisible", checked)}
              />
              <PrivacyControl
                title="Resume visibility"
                description="Your resume stays private by default. Turning this on would allow approved employers to view it in a connected product."
                checked={profile.resumeVisible}
                onChange={(checked) => update("resumeVisible", checked)}
              />
              <p className="rounded bg-red-50 p-3 text-xs leading-5 text-brand-red">
                Contact details and resumes are not public by default.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (step < 3) setStep((current) => current + 1)
                else {
                  setState((current) => ({ ...current, profile }))
                  enterDemo()
                }
              }}
              className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
            >
              {step === 3 ? "Complete Demo Onboarding" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

function CandidateField({
  label,
  value,
  onChange,
  multiline = false,
  help,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  help?: string
}) {
  return (
    <label className="block text-xs font-bold uppercase text-gray-700">
      {label}
      {multiline ? (
        <textarea
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal leading-6 normal-case outline-none focus:border-brand-red"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
        />
      )}
      {help && (
        <span className="mt-1 block text-[11px] font-normal normal-case text-gray-500">
          {help}
        </span>
      )}
    </label>
  )
}

function PrivacyControl({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-5 rounded border border-gray-200 bg-slate-50 p-4">
      <span>
        <strong className="block text-sm text-brand-dark">{title}</strong>
        <span className="mt-1 block text-xs leading-5 text-gray-600">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-red-700"
      />
    </label>
  )
}

function CandidateSupplyArea({
  state,
  setState,
}: {
  state: SupplyState
  setState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  const [tab, setTab] = useState("Overview")
  const [notice, setNotice] = useState("")
  const [date, setDate] = useState("")
  const profile = state.profile
  const update = (field: keyof SupplyCandidate, value: unknown) =>
    setState((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }))
  const tabs = [
    "Overview",
    "Ministry Profile",
    "Theology",
    "Preaching & Worship",
    "Portfolio",
    "Availability",
    "Honorarium",
    "Invitations",
  ]
  const invitations = state.bookings.filter(
    (booking) => booking.candidateId === profile.id,
  )
  const setBookingStatus = (id: number, status: SupplyBookingStatus) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    }))
    setNotice(`Invitation marked ${status}. This is a staging interaction.`)
  }
  return (
    <div>
      <EmployerPageHeader
        title="Pulpit Supply & Guest Ministry"
        description="Build an optional supply profile while continuing your regular employment search."
      />
      <PrivacyControl
        title="Available for Pulpit Supply Opportunities"
        description="Enable a specialized supply profile. Your regular candidate profile and job applications remain unchanged."
        checked={state.enabled}
        onChange={(checked) =>
          setState((current) => ({ ...current, enabled: checked }))
        }
      />
      {!state.enabled ? (
        <CandidateEmpty
          title="Pulpit Supply is optional"
          description="Enable availability above when you are ready to create a preaching or worship supply profile."
          action="Enable Pulpit Supply"
          onAction={() =>
            setState((current) => ({ ...current, enabled: true }))
          }
        />
      ) : (
        <>
          <div className="my-5 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`shrink-0 rounded px-3 py-2 text-xs font-bold uppercase ${
                  tab === item
                    ? "bg-brand-charcoal text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {tab === "Overview" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  [
                    "Upcoming engagements",
                    invitations.filter(
                      (item) => item.status === "Accepted",
                    ).length,
                  ],
                  [
                    "Pending invitations",
                    invitations.filter((item) =>
                      ["Request Sent", "Awaiting Response"].includes(
                        item.status,
                      ),
                    ).length,
                  ],
                  [
                    "Completed engagements",
                    invitations.filter(
                      (item) => item.status === "Completed",
                    ).length,
                  ],
                  ["Profile views", "24 demo"],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <strong className="text-2xl font-black text-brand-dark">
                      {value}
                    </strong>
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-brand-dark">
                      Supply Profile Status
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {state.profileApproved
                        ? "Approved demo profile"
                        : "Draft — complete and submit for admin review"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotice("Profile preview opened in staging mode.")}
                    className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark"
                  >
                    Profile Preview
                  </button>
                </div>
              </div>
            </div>
          )}
          {tab === "Ministry Profile" && (
            <CandidateFormSection title="Ministry Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <CandidateField
                  label="Primary ministry role"
                  value={profile.roles[0] || ""}
                  onChange={(value) =>
                    update("roles", [
                      value,
                      ...profile.roles.slice(1),
                    ])
                  }
                />
                <CandidateField
                  label="Current ministry position"
                  value="Community Ministry Director"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Years of ministry experience"
                  value={String(profile.experience)}
                  onChange={(value) =>
                    update("experience", Number(value) || 0)
                  }
                />
                <CandidateField
                  label="Ordaining or licensing organization"
                  value="Front Range Ministry Network"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Denominational affiliation"
                  value={profile.denomination}
                  onChange={(value) => update("denomination", value)}
                />
                <CandidateField
                  label="Seminary or theological education"
                  value="M.A. in Christian Ministry"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Languages spoken"
                  value={profile.languages.join(", ")}
                  onChange={(value) =>
                    update(
                      "languages",
                      value.split(",").map((item) => item.trim()),
                    )
                  }
                />
                <CandidateField
                  label="Ministry website"
                  value="https://jordan-ellis.example"
                  onChange={() => undefined}
                />
              </div>
              <CandidateField
                label="Ministry biography"
                value={profile.biography}
                onChange={(value) => update("biography", value)}
                multiline
              />
              <div>
                <p className="text-xs font-bold uppercase text-gray-700">
                  Multiple ministry roles
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    "Guest Preacher",
                    "Revival Speaker",
                    "Conference Speaker",
                    "Worship Leader",
                    "Worship Pastor",
                    "Vocalist",
                    "Pianist",
                    "Keyboardist",
                    "Acoustic Guitarist",
                    "Electric Guitarist",
                    "Bass Guitarist",
                    "Drummer",
                    "Organist",
                    "Choir Director",
                    "Guest Soloist",
                    "Worship Band",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={profile.roles.includes(role)}
                        onChange={() =>
                          update(
                            "roles",
                            profile.roles.includes(role)
                              ? profile.roles.filter((item) => item !== role)
                              : [...profile.roles, role],
                          )
                        }
                        className="accent-red-700"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </CandidateFormSection>
          )}
          {tab === "Theology" && (
            <CandidateFormSection title="Theological Background & Ministry Beliefs">
              <p className="text-sm leading-6 text-gray-600">
                Help churches understand your theological background and
                ministry convictions. Sharing this information can help connect
                you with churches that align with your beliefs.
              </p>
              <p className="rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
                Every question is optional. Categories may overlap, and your
                denomination does not determine your theological orientation.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [
                    "Theological orientation",
                    [
                      "Prefer not to specify",
                      "Calvinist",
                      "Arminian",
                      "Reformed",
                      "Wesleyan",
                      "Evangelical",
                      "Pentecostal",
                      "Charismatic",
                      "Other",
                    ],
                  ],
                  [
                    "Views on salvation",
                    [
                      "Prefer not to specify",
                      "Calvinist",
                      "Arminian",
                      "Molinist",
                      "Other",
                    ],
                  ],
                  [
                    "Spiritual gifts",
                    [
                      "Prefer not to specify",
                      "Continuationist",
                      "Cessationist",
                      "Open but cautious",
                      "Other",
                    ],
                  ],
                  [
                    "Baptism",
                    [
                      "Prefer not to specify",
                      "Believer’s baptism",
                      "Infant baptism",
                      "Both recognized",
                      "Other",
                    ],
                  ],
                  [
                    "Church governance",
                    [
                      "Prefer not to specify",
                      "Congregational",
                      "Elder-led",
                      "Presbyterian",
                      "Episcopal",
                      "Other",
                    ],
                  ],
                  [
                    "Women in ministry",
                    [
                      "Prefer not to specify",
                      "Complementarian",
                      "Egalitarian",
                      "Other",
                    ],
                  ],
                ].map(([label, options]) => (
                  <label key={String(label)} className="text-xs font-bold uppercase text-gray-700">
                    {String(label)} <span className="font-normal normal-case text-gray-400">(Optional)</span>
                    <select
                      value={
                        label === "Theological orientation"
                          ? profile.theology
                          : "Prefer not to specify"
                      }
                      onChange={(event) =>
                        label === "Theological orientation" &&
                        update("theology", event.target.value)
                      }
                      className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case"
                    >
                      {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <CandidateField label="Additional explanation (Optional)" value="" onChange={() => undefined} multiline />
              <CandidateField label="Biblical authority (Optional)" value="" onChange={() => undefined} multiline />
              <CandidateField label="Statement of faith — up to 2,000 characters (Optional)" value="" onChange={() => undefined} multiline />
              <div className="grid gap-3 sm:grid-cols-2">
                <CandidateField label="Statement of faith link (Optional)" value="" onChange={() => undefined} />
                <label className="text-xs font-bold uppercase text-gray-700">Statement PDF (Optional)<input type="file" accept=".pdf" className="mt-1.5 block w-full text-xs file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-white" /></label>
              </div>
            </CandidateFormSection>
          )}
          {tab === "Preaching & Worship" && (
            <div className="space-y-5">
              <CandidateFormSection title="Preaching Information">
                <CandidateField label="Preaching experience" value="Eight years of teaching and guest preaching experience." onChange={() => undefined} multiline />
                <div className="grid gap-4 sm:grid-cols-2">
                  <CandidateField label="Preferred sermon length" value="30–35 minutes" onChange={() => undefined} />
                  <CandidateField label="Languages available for preaching" value={profile.languages.join(", ")} onChange={() => undefined} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">{["Expository preaching", "Topical preaching", "Evangelistic preaching", "Teaching-oriented preaching", "Traditional worship experience", "Contemporary worship experience"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              </CandidateFormSection>
              <CandidateFormSection title="Worship & Music Supply Profile">
                <div className="grid gap-4 sm:grid-cols-2"><CandidateField label="Primary instrument" value={profile.instruments[0] || ""} onChange={(value) => update("instruments", [value, ...profile.instruments.slice(1)])} /><CandidateField label="Secondary instruments" value={profile.instruments.slice(1).join(", ")} onChange={() => undefined} /><CandidateField label="Vocal range" value="" onChange={() => undefined} /><CandidateField label="Number of musicians (bands)" value="" onChange={() => undefined} /></div>
                <div className="grid gap-2 sm:grid-cols-2">{["Traditional worship experience", "Contemporary worship experience", "Blended worship experience", "Gospel music experience", "Choir experience", "Lead congregational worship", "Work with existing worship teams", "Bring additional musicians", "Provide a complete worship band"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              </CandidateFormSection>
            </div>
          )}
          {tab === "Portfolio" && (
            <CandidateFormSection title="Sermon & Music Portfolio">
              <p className="text-sm text-gray-600">Add sermon videos, audio, YouTube links, manuscripts, performance samples, and ministry websites.</p>
              {profile.portfolio.map((item) => <div key={item} className="flex items-center justify-between rounded bg-slate-50 p-3 text-sm"><span>{icon("fa-play-circle", "mr-2 text-brand-red")}{item}</span><button type="button" className="text-xs font-bold text-brand-red">Remove</button></div>)}
              <CandidateField label="Add portfolio link" value="" onChange={() => undefined} />
              <label className="block text-xs font-bold uppercase text-gray-700">Choose demo media file<input type="file" className="mt-1.5 block w-full text-xs file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-white" /></label>
              <p className="rounded bg-amber-50 p-3 text-xs text-amber-950">Uploads are simulated and are not stored.</p>
            </CandidateFormSection>
          )}
          {tab === "Availability" && (
            <CandidateFormSection title="Availability Calendar">
              <div className="grid gap-2 sm:grid-cols-3">{["Sunday Morning", "Sunday Evening", "Wednesday Evening", "Weekdays", "Special Events", "Multi-day Engagements", "Virtual Preaching"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" checked={profile.availability.includes(item)} onChange={() => update("availability", profile.availability.includes(item) ? profile.availability.filter((value) => value !== item) : [...profile.availability, item])} className="accent-red-700" />{item}</label>)}</div>
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold uppercase text-gray-700">Unavailable date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm" /></label><CandidateField label="Maximum travel distance (miles)" value={String(profile.travelDistance)} onChange={(value) => update("travelDistance", Number(value) || 0)} /></div>
              <button type="button" disabled={!date} onClick={() => { setState((current) => ({ ...current, unavailableDates: [...current.unavailableDates, date] })); setDate("") }} className="rounded bg-brand-red px-4 py-2.5 text-xs font-bold uppercase text-white disabled:opacity-40">Mark Unavailable</button>
              <div className="flex flex-wrap gap-2">{state.unavailableDates.map((item) => <span key={item} className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red">{item}</span>)}</div>
              <div className="grid gap-2 sm:grid-cols-2">{["Overnight travel willingness", "Recurring availability", "Virtual preaching availability"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
            </CandidateFormSection>
          )}
          {tab === "Honorarium" && (
            <CandidateFormSection title="Honorarium & Travel">
              <CandidateField label="Suggested honorarium (Optional)" value={profile.honorarium} onChange={(value) => update("honorarium", value)} />
              <div className="grid gap-2 sm:grid-cols-2">{["Travel reimbursement requested", "Lodging required", "Willing to serve without honorarium", "Honorarium negotiable", "Instruments provided", "Sound equipment available"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              <PrivacyControl title="Display honorarium publicly" description="Off by default. Churches cannot see expectations unless you enable this." checked={profile.honorariumPublic} onChange={(checked) => update("honorariumPublic", checked)} />
              <CandidateField label="Equipment requirements (Optional)" value="" onChange={() => undefined} multiline />
            </CandidateFormSection>
          )}
          {tab === "Invitations" && (
            <div>
              <div className="grid gap-3 sm:grid-cols-4">{["Pending Invitations", "Upcoming Engagements", "Completed Engagements", "Cancelled Engagements"].map((title) => <div key={title} className="rounded border border-gray-200 bg-white p-4 text-center"><strong className="text-xl text-brand-dark">{invitations.filter((item) => title.startsWith("Pending") ? ["Request Sent", "Awaiting Response"].includes(item.status) : item.status === title.split(" ")[0].replace("Upcoming", "Accepted")).length}</strong><p className="mt-1 text-[10px] font-bold uppercase text-gray-500">{title}</p></div>)}</div>
              <div className="mt-5 space-y-3">{invitations.map((booking) => <article key={booking.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><ListingStatus status={booking.status as EmployerJobStatus} /><h3 className="mt-3 font-black text-brand-dark">{booking.role} at {booking.church}</h3><p className="mt-1 text-sm text-gray-500">{booking.date} · {booking.time} · {booking.location}</p><p className="mt-3 text-sm text-gray-600">{booking.description}</p></div>{["Request Sent", "Awaiting Response"].includes(booking.status) && <div className="flex gap-2 self-start"><button type="button" onClick={() => setBookingStatus(booking.id, "Accepted")} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold uppercase text-white">Accept</button><button type="button" onClick={() => setBookingStatus(booking.id, "Declined")} className="rounded border border-red-300 px-4 py-2 text-xs font-bold uppercase text-brand-red">Decline</button></div>}</div><button type="button" onClick={() => setNotice("Additional information request added to the staging message thread.")} className="mt-4 text-xs font-extrabold uppercase text-brand-red">Request Information</button></article>)}</div>
            </div>
          )}
          {tab !== "Overview" && tab !== "Invitations" && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setNotice(`${tab} saved for this demo session.`)} className="rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase text-white">Save {tab}</button>
              <button type="button" onClick={() => setNotice("Supply profile preview opened in staging mode.")} className="rounded border border-gray-300 px-5 py-3 text-xs font-bold uppercase text-brand-dark">Profile Preview</button>
            </div>
          )}
          <div className="mt-6 space-y-3">
            <PrivacyControl title="Appear in Pulpit Supply searches" description="When off, churches cannot discover this supply profile." checked={profile.profileVisible} onChange={(checked) => update("profileVisible", checked)} />
            <PrivacyControl title="Show theological preferences" description="All theological responses remain hidden unless you enable this." checked={profile.theologyVisible} onChange={(checked) => update("theologyVisible", checked)} />
            <PrivacyControl title="Show availability" description="Control whether churches can view your availability details." checked={profile.availabilityVisible} onChange={(checked) => update("availabilityVisible", checked)} />
            <PrivacyControl title="Allow direct church contact" description="Private contact details are never displayed publicly." checked={profile.directContact} onChange={(checked) => update("directContact", checked)} />
          </div>
        </>
      )}
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

function CandidateExperience({
  hash,
  state,
  setState,
  enterDemo,
  supplyState,
  setSupplyState,
}: {
  hash: string
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
  enterDemo: () => void
  supplyState: SupplyState
  setSupplyState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  if (hash === "/candidate/sign-in")
    return <CandidateAuthPage mode="sign-in" enterDemo={enterDemo} />
  if (hash === "/candidate/sign-up")
    return <CandidateAuthPage mode="sign-up" enterDemo={enterDemo} />
  if (hash === "/candidate/password-recovery")
    return <CandidateAuthPage mode="recovery" enterDemo={enterDemo} />
  if (hash === "/candidate/onboarding")
    return (
      <CandidateOnboarding
        state={state}
        setState={setState}
        enterDemo={enterDemo}
      />
    )

  const primaryNavigation = [
    ["My Applications", "/candidate/applications", "fa-file-lines"],
    ["Saved Jobs", "/candidate/saved-jobs", "fa-heart"],
    ["Recommendations", "/candidate/recommendations", "fa-wand-magic-sparkles"],
  ]
  const secondaryNavigation = [
    ["Profile", "/candidate/profile", "fa-user"],
    ["Resume", "/candidate/resume", "fa-file"],
    ["Messages", "/candidate/messages", "fa-envelope"],
    ["Job Alerts", "/candidate/alerts", "fa-bell"],
    ["Pulpit Supply", "/candidate/pulpit-supply", "fa-person-chalkboard"],
    ["Account Settings", "/candidate/settings", "fa-gear"],
  ]
  const active = (path: string) => hash.startsWith(path)
  return (
    <>
      <section className="border-b border-gray-800 bg-brand-charcoal px-6 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Candidate workspace · Always free
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
              <a href="#/candidate/dashboard" className="hover:text-red-200">
                {state.profile.name}
              </a>
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              {state.profile.headline}
            </p>
          </div>
          <span className="self-start rounded bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950 sm:self-auto">
            Demo mode · Changes are not saved
          </span>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav
            className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
            aria-label="Candidate dashboard"
          >
            <p className="px-4 pb-2 pt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
              Primary navigation
            </p>
            {primaryNavigation.map(([label, path, iconName]) => (
              <a
                key={path}
                href={`#${path}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  active(path)
                    ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-dark"
                }`}
              >
                {icon(iconName, "w-5 text-center")}
                {label}
              </a>
            ))}
            <p className="mx-4 mt-3 border-t border-gray-200 pb-2 pt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
              Account
            </p>
            {secondaryNavigation.map(([label, path, iconName]) => (
              <a
                key={path}
                href={`#${path}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  active(path)
                    ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-dark"
                }`}
              >
                {icon(iconName, "w-5 text-center")}
                {label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-9">
          {hash === "/candidate/pulpit-supply" ? (
            <CandidateSupplyArea
              state={supplyState}
              setState={setSupplyState}
            />
          ) : (
            <CandidateRouteContent
              hash={hash}
              state={state}
              setState={setState}
            />
          )}
        </div>
      </div>
    </>
  )
}

function CandidateRouteContent({
  hash,
  state,
  setState,
}: {
  hash: string
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const [notice, setNotice] = useState("")
  const [profileDraft, setProfileDraft] = useState(state.profile)
  const [selectedMessage, setSelectedMessage] = useState(0)
  const [reply, setReply] = useState("")
  const pageHeader = (eyebrow: string, title: string, description: string) => (
    <div className="mb-6 border-b border-gray-200 pb-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  )

  if (hash === "/candidate/dashboard") {
    return (
      <div>
        {pageHeader(
          "Dashboard overview",
          "Your Candidate Home",
          "Keep your free ministry search organized from one private workspace.",
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "My Applications",
              state.applications.length,
              "/candidate/applications",
              "fa-file-lines",
            ],
            [
              "Saved Jobs",
              (state.savedJobIds ?? []).length,
              "/candidate/saved-jobs",
              "fa-heart",
            ],
            [
              "Recommendations",
              state.recommendationsConfigured ? "Ready" : "Set up",
              "/candidate/recommendations",
              "fa-wand-magic-sparkles",
            ],
          ].map(([label, value, path, iconName]) => (
            <a
              key={label}
              href={`#${path}`}
              className="rounded border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-red"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-brand-red">
                {icon(String(iconName))}
              </span>
              <strong className="mt-4 block text-2xl font-black text-brand-dark">
                {value}
              </strong>
              <span className="mt-1 block text-xs font-extrabold uppercase tracking-wider text-gray-500">
                {label}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Profile privacy
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your profile is currently{" "}
              <strong>
                {state.profile.profileVisible ? "discoverable" : "private"}
              </strong>
              . Your resume is{" "}
              <strong>
                {state.profile.resumeVisible ? "visible" : "private"}
              </strong>
              .
            </p>
            <a
              href="#/candidate/profile"
              className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Review profile {icon("fa-arrow-right", "ml-2")}
            </a>
          </section>
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Job alerts
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Alert frequency: <strong>{state.alertFrequency}</strong>. Email
              delivery is not connected in this staging prototype.
            </p>
            <a
              href="#/candidate/alerts"
              className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Manage alerts {icon("fa-arrow-right", "ml-2")}
            </a>
          </section>
        </div>
      </div>
    )
  }

  if (hash.startsWith("/candidate/applications/")) {
    const application = state.applications.find(
      (item) => item.id === Number(hash.split("/").pop()),
    )
    const job = allJobs.find((item) => item.id === application?.jobId)
    if (!application || !job)
      return <CandidateEmpty title="Application not found" action="My Applications" href="#/candidate/applications" />
    return (
      <div>
        {pageHeader(
          "Application details",
          job.title,
          `${job.company} · Submitted ${formatJobDate(application.applied)}`,
        )}
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Status</p>
              <p className="mt-1 text-lg font-black text-brand-dark">
                {application.status}
              </p>
            </div>
            <span className="rounded bg-blue-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700">
              Sample application
            </span>
          </div>
          <dl className="mt-6 divide-y divide-gray-200 border-y border-gray-200 text-sm">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Position</dt>
              <dd className="font-bold text-brand-dark">{job.title}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Employer</dt>
              <dd className="font-bold text-brand-dark">{job.company}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Application date</dt>
              <dd className="font-bold text-brand-dark">
                {formatJobDate(application.applied)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Resume</dt>
              <dd className="text-right font-bold text-brand-dark">
                {application.resumeName}
              </dd>
            </div>
          </dl>
          <div className="mt-5">
            <p className="text-xs font-bold uppercase text-gray-500">
              Optional message
            </p>
            <p className="mt-2 rounded bg-slate-50 p-4 text-sm leading-6 text-gray-600">
              {application.message || "No message was included."}
            </p>
          </div>
          <p className="mt-5 rounded bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            {application.note}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`#/job/${job.id}`}
              className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
            >
              Open Job
            </a>
            <a
              href="#/candidate/applications"
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark"
            >
              Back to Applications
            </a>
          </div>
        </section>
      </div>
    )
  }

  if (hash === "/candidate/applications") {
    return (
      <div>
        {pageHeader(
          "Primary workspace",
          "My Applications",
          "Review sample application dates, employers, and current statuses.",
        )}
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          {state.applications.map((application) => {
            const job = allJobs.find((item) => item.id === application.jobId)
            if (!job) return null
            return (
              <article
                key={application.id}
                className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 last:border-0 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-extrabold text-brand-dark">{job.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    {job.company}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Applied {formatJobDate(application.applied)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                    {application.status}
                  </span>
                  <a
                    href={`#/candidate/applications/${application.id}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
                  >
                    View details
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  if (hash === "/candidate/saved-jobs") {
    const savedJobs = allJobs.filter((job) =>
      (state.savedJobIds ?? []).includes(job.id),
    )
    return (
      <div>
        {pageHeader(
          "Primary workspace",
          "Saved Jobs",
          "Revisit opportunities you are considering and remove those that no longer fit.",
        )}
        {savedJobs.length ? (
          <div className="space-y-3">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        ) : (
          <CandidateEmpty
            title="No saved jobs"
            description="Save promising opportunities while browsing, then return here to compare them."
            action="Browse Jobs"
            href="#/jobs-listing"
          />
        )}
      </div>
    )
  }

  if (hash === "/candidate/recommendations") {
    return (
      <CandidateRecommendations state={state} setState={setState} />
    )
  }

  if (hash === "/candidate/profile") {
    const update = (field: keyof CandidateProfile, value: string | boolean | string[]) =>
      setProfileDraft((current) => ({ ...current, [field]: value }))
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Edit Profile",
          "Keep your ministry experience, direction, and privacy choices current.",
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setState((current) => ({ ...current, profile: profileDraft }))
            setNotice("Profile changes saved for this demo session.")
          }}
          className="space-y-6"
        >
          <CandidateFormSection title="Personal and ministry summary">
            <div className="grid gap-4 sm:grid-cols-2">
              <CandidateField label="Name" value={profileDraft.name} onChange={(value) => update("name", value)} />
              <CandidateField label="Professional headline" value={profileDraft.headline} onChange={(value) => update("headline", value)} />
              <CandidateField label="City" value={profileDraft.city} onChange={(value) => update("city", value)} />
              <CandidateField label="State" value={profileDraft.state} onChange={(value) => update("state", value)} />
            </div>
            <CandidateField label="Ministry biography" value={profileDraft.biography} onChange={(value) => update("biography", value)} multiline />
          </CandidateFormSection>
          <CandidateFormSection title="Experience and preparation">
            <CandidateField
              label="Ministry experience and employment history"
              value={profileDraft.experience}
              onChange={(value) => update("experience", value)}
              multiline
            />
            <CandidateField label="Education" value={profileDraft.education} onChange={(value) => update("education", value)} />
            <CandidateField label="Ministry skills" value={profileDraft.skills} onChange={(value) => update("skills", value)} />
            <CandidateField label="Credentials" value={profileDraft.credentials} onChange={(value) => update("credentials", value)} />
          </CandidateFormSection>
          <CandidateFormSection title="Faith and ministry background">
            <CandidateField label="Denominational affiliation" value={profileDraft.denomination} onChange={(value) => update("denomination", value)} />
            <CandidateField label="Ministry / theological background (optional)" value={profileDraft.theologicalBackground} onChange={(value) => update("theologicalBackground", value)} multiline />
          </CandidateFormSection>
          <CandidateFormSection title="Job preferences and links">
            <CandidateField label="Preferred roles" value={profileDraft.preferredRoles} onChange={(value) => update("preferredRoles", value)} />
            <CandidateField label="Preferred locations" value={profileDraft.preferredLocations} onChange={(value) => update("preferredLocations", value)} />
            <div>
              <p className="text-xs font-bold uppercase text-gray-700">Employment types</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {(["FULL TIME", "PART TIME", "INTERNSHIP", "INTERIM"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={profileDraft.preferredTypes.includes(type)}
                      onChange={() =>
                        update(
                          "preferredTypes",
                          profileDraft.preferredTypes.includes(type)
                            ? profileDraft.preferredTypes.filter((item) => item !== type)
                            : [...profileDraft.preferredTypes, type],
                        )
                      }
                      className="accent-red-700"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <CandidateField label="Portfolio or ministry website" value={profileDraft.portfolio} onChange={(value) => update("portfolio", value)} />
          </CandidateFormSection>
          <CandidateFormSection title="Profile visibility">
            <PrivacyControl
              title="Discoverable candidate profile"
              description="When enabled, approved employers could find your professional profile. Your direct contact details remain private."
              checked={profileDraft.profileVisible}
              onChange={(checked) => update("profileVisible", checked)}
            />
            <PrivacyControl
              title="Resume visible to approved employers"
              description="Off by default. Your resume is never displayed on the public organization or job pages."
              checked={profileDraft.resumeVisible}
              onChange={(checked) => update("resumeVisible", checked)}
            />
          </CandidateFormSection>
          <button type="submit" className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
            Save Profile
          </button>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </form>
      </div>
    )
  }

  if (hash === "/candidate/resume") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Resume Management",
          "Manage the resume associated with your private candidate profile.",
        )}
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded bg-red-50 text-xl text-brand-red">
                {icon("fa-file-pdf")}
              </span>
              <div>
                <h3 className="font-extrabold text-brand-dark">
                  {state.resumeName}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Fictional demo resume · Private by default
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setState((current) => ({
                  ...current,
                  resumeName: "Jordan-Ellis-Updated-Resume.pdf",
                }))
                setNotice("Demo resume selection updated. No file was uploaded.")
              }}
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
            >
              Choose Demo Resume
            </button>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-5">
            <PrivacyControl
              title="Resume visibility"
              description="When off, employers only receive a resume through a candidate-initiated application. This control is off by default."
              checked={state.profile.resumeVisible}
              onChange={(checked) =>
                setState((current) => ({
                  ...current,
                  profile: { ...current.profile, resumeVisible: checked },
                }))
              }
            />
          </div>
          <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            File upload and document storage are not connected in this staging
            prototype.
          </p>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </section>
      </div>
    )
  }

  if (hash === "/candidate/messages") {
    const messages = [
      {
        sender: "Red Letter Jobs Demo",
        subject: "Welcome to your candidate workspace",
        body: "This sample message demonstrates how candidate and employer conversations could appear. Replies are not delivered.",
      },
      {
        sender: "Redeemer Fellowship — Sample",
        subject: "Application received",
        body: "Thank you for previewing the application experience. This organization and message are fictional.",
      },
    ]
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Messages",
          "Preview a staging inbox. Live messaging is not connected.",
        )}
        <div className="grid overflow-hidden rounded border border-gray-200 bg-white shadow-sm md:grid-cols-5">
          <div className="border-b border-gray-200 md:col-span-2 md:border-b-0 md:border-r">
            {messages.map((message, index) => (
              <button
                key={message.subject}
                type="button"
                onClick={() => setSelectedMessage(index)}
                className={`block w-full border-b border-gray-100 p-4 text-left ${
                  selectedMessage === index ? "bg-red-50" : "hover:bg-gray-50"
                }`}
              >
                <strong className="block text-sm text-brand-dark">
                  {message.sender}
                </strong>
                <span className="mt-1 block truncate text-xs text-gray-600">
                  {message.subject}
                </span>
              </button>
            ))}
          </div>
          <div className="p-5 md:col-span-3">
            <p className="text-xs font-bold uppercase text-brand-red">
              {messages[selectedMessage].sender}
            </p>
            <h3 className="mt-2 text-lg font-black text-brand-dark">
              {messages[selectedMessage].subject}
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {messages[selectedMessage].body}
            </p>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={4}
              placeholder="Write a staging reply..."
              aria-label="Reply to selected message"
              className="mt-6 w-full rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red"
            />
            <button
              type="button"
              onClick={() => {
                setReply("")
                setNotice("Reply preview complete. No message was sent.")
              }}
              className="mt-3 rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase text-white"
            >
              Preview Reply
            </button>
            {notice && <CandidateNotice>{notice}</CandidateNotice>}
          </div>
        </div>
      </div>
    )
  }

  if (hash === "/candidate/alerts") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Job Alerts & Notifications",
          "Choose staging notification preferences. No email or push delivery is connected.",
        )}
        <section className="space-y-5 rounded border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-xs font-bold uppercase text-gray-700">
            Job alert frequency
            <select
              value={state.alertFrequency}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  alertFrequency: event.target.value as CandidateState["alertFrequency"],
                }))
              }
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case sm:max-w-sm"
            >
              <option>Off</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </label>
          <PrivacyControl
            title="Application status updates"
            description="Preview notifications when a sample application status changes."
            checked={state.applicationUpdates}
            onChange={(checked) =>
              setState((current) => ({
                ...current,
                applicationUpdates: checked,
              }))
            }
          />
          <PrivacyControl
            title="Message notifications"
            description="Preview notifications for new staging inbox messages."
            checked={state.messageNotifications}
            onChange={(checked) =>
              setState((current) => ({
                ...current,
                messageNotifications: checked,
              }))
            }
          />
          <button
            type="button"
            onClick={() =>
              setNotice(
                "Notification preferences saved for this demo session. No emails will be sent.",
              )
            }
            className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase text-white"
          >
            Save Preferences
          </button>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </section>
      </div>
    )
  }

  if (hash === "/candidate/settings") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Account Settings",
          "Review sign-in, privacy, and account controls for the staging candidate experience.",
        )}
        <div className="space-y-5">
          <CandidateFormSection title="Sign-in details">
            <CandidateField
              label="Account email"
              value="jordan@example.test"
              onChange={() => undefined}
            />
            <button
              type="button"
              onClick={() =>
                setNotice("Password update previewed. No credential was changed.")
              }
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark"
            >
              Preview Password Change
            </button>
          </CandidateFormSection>
          <CandidateFormSection title="Privacy summary">
            <p className="text-sm leading-6 text-gray-600">
              Candidate contact details and resumes remain private unless you
              intentionally change visibility controls or submit an application.
              Public profile discovery is currently{" "}
              <strong>
                {state.profile.profileVisible ? "enabled" : "disabled"}
              </strong>
              .
            </p>
          </CandidateFormSection>
          <CandidateFormSection title="Account actions">
            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Account deletion previewed. No data was deleted or persisted.",
                )
              }
              className="rounded border border-red-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-red"
            >
              Preview Account Deletion
            </button>
          </CandidateFormSection>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </div>
      </div>
    )
  }

  return (
    <CandidateEmpty
      title="Candidate page not found"
      action="Return to Dashboard"
      href="#/candidate/dashboard"
    />
  )
}

function CandidateRecommendations({
  state,
  setState,
}: {
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const [editing, setEditing] = useState(!state.recommendationsConfigured)
  const [categories, setCategories] = useState(state.preferredCategories)
  const [locations, setLocations] = useState(state.preferredStates)
  const toggle = (
    value: string,
    current: string[],
    setCurrent: React.Dispatch<React.SetStateAction<string[]>>,
    limit: number,
  ) => {
    if (current.includes(value))
      setCurrent(current.filter((item) => item !== value))
    else if (current.length < limit) setCurrent([...current, value])
  }
  const matchingJobs = allJobs.filter(
    (job) =>
      state.preferredCategories.includes(job.category) &&
      state.preferredStates.includes(job.state),
  ).slice(0, 8)
  if (editing) {
    return (
      <div>
        <div className="mb-6 border-b border-gray-200 pb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Primary workspace
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
            Set Recommendation Preferences
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Recommendations begin with your choices, not a generic job feed.
          </p>
        </div>
        <div className="space-y-6">
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">
                  Choose up to 5 categories
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Select the ministry areas most relevant to your calling.
                </p>
              </div>
              <span className="rounded bg-red-50 px-3 py-1.5 text-xs font-extrabold text-brand-red">
                {categories.length} / 5 selected
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((category) => {
                const disabled =
                  categories.length >= 5 && !categories.includes(category.slug)
                return (
                  <label
                    key={category.slug}
                    className={`flex items-center gap-3 rounded border p-3 text-sm font-semibold ${
                      disabled
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                        : "border-gray-200 text-gray-700 hover:border-brand-red"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(category.slug)}
                      disabled={disabled}
                      onChange={() =>
                        toggle(category.slug, categories, setCategories, 5)
                      }
                      className="accent-red-700"
                    />
                    {category.name}
                  </label>
                )
              })}
            </div>
          </section>
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">
                  Choose up to 3 locations
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Select states where you would consider serving.
                </p>
              </div>
              <span className="rounded bg-red-50 px-3 py-1.5 text-xs font-extrabold text-brand-red">
                {locations.length} / 3 selected
              </span>
            </div>
            <div className="mt-5 grid max-h-72 gap-3 overflow-y-auto pr-2 sm:grid-cols-3">
              {US_STATES.map((location) => {
                const disabled =
                  locations.length >= 3 && !locations.includes(location)
                return (
                  <label
                    key={location}
                    className={`flex items-center gap-2 rounded border p-3 text-xs font-semibold ${
                      disabled
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                        : "border-gray-200 text-gray-700 hover:border-brand-red"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={locations.includes(location)}
                      disabled={disabled}
                      onChange={() =>
                        toggle(location, locations, setLocations, 3)
                      }
                      className="accent-red-700"
                    />
                    {location}
                  </label>
                )
              })}
            </div>
          </section>
          <button
            type="button"
            disabled={!categories.length || !locations.length}
            onClick={() => {
              setState((current) => ({
                ...current,
                preferredCategories: categories,
                preferredStates: locations,
                recommendationsConfigured: true,
              }))
              setEditing(false)
            }}
            className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Preferences & View Matches
          </button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Primary workspace
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
            Recommendations
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Prioritized from your selected ministry categories and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="self-start rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
        >
          Edit Preferences
        </button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[...state.preferredCategories, ...state.preferredStates].map((item) => (
          <span
            key={item}
            className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red"
          >
            {CATEGORIES.find((category) => category.slug === item)?.name || item}
          </span>
        ))}
      </div>
      {matchingJobs.length ? (
        <div className="space-y-3">
          {matchingJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <CandidateEmpty
          title="No matching opportunities right now"
          description="There are no sample jobs matching both your selected categories and locations. Edit your preferences to broaden the match."
          action="Edit Preferences"
          onAction={() => setEditing(true)}
        />
      )}
    </div>
  )
}

function CandidateFormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="border-b border-gray-100 pb-3 text-base font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h3>
      {children}
    </section>
  )
}

function CandidateNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
      {children}
    </p>
  )
}

function CandidateEmpty({
  title,
  description = "The requested candidate information is not available.",
  action,
  href,
  onAction,
}: {
  title: string
  description?: string
  action: string
  href?: string
  onAction?: () => void
}) {
  const className =
    "mt-5 inline-flex rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
  return (
    <div className="rounded border border-gray-200 bg-white p-10 text-center shadow-sm">
      <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-brand-red">
        {icon("fa-compass")}
      </span>
      <h3 className="mt-4 text-lg font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h3>
      <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-gray-600">
        {description}
      </p>
      {href ? (
        <a href={href} className={className}>
          {action}
        </a>
      ) : (
        <button type="button" onClick={onAction} className={className}>
          {action}
        </button>
      )}
    </div>
  )
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

function SupplyCandidateDetail({
  candidate,
  close,
  invite,
}: {
  candidate: SupplyCandidate
  close: () => void
  invite: () => void
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <button type="button" onClick={close} className="text-xs font-bold uppercase text-brand-red">{icon("fa-arrow-left", "mr-2")}Back to Search</button>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <img src={`https://i.pravatar.cc/200?img=${candidate.id + 20}`} alt={`${candidate.name} sample profile`} className="h-28 w-28 rounded-full object-cover" />
        <div><p className="text-xs font-extrabold uppercase text-brand-red">{candidate.category} Supply</p><h3 className="mt-1 text-3xl font-black text-brand-dark">{candidate.name}</h3><p className="mt-2 font-bold text-gray-600">{candidate.roles.join(" · ")}</p><p className="mt-1 text-sm text-gray-500">{candidate.city}, {candidate.state} · {candidate.experience} years</p></div>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section><h4 className="font-black uppercase text-brand-dark">Biography & Experience</h4><p className="mt-3 text-sm leading-7 text-gray-600">{candidate.biography}</p><p className="mt-3 text-sm text-gray-600">Education and credentials available in this fictional demo profile.</p></section>
        <section><h4 className="font-black uppercase text-brand-dark">Travel & Availability</h4><p className="mt-3 text-sm text-gray-600">Travel up to {candidate.travelDistance} miles</p>{candidate.availabilityVisible && <div className="mt-3 flex flex-wrap gap-2">{candidate.availability.map((item) => <span key={item} className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800">{item}</span>)}</div>}</section>
        {candidate.theologyVisible && <section><h4 className="font-black uppercase text-brand-dark">Shared Theological Background</h4><p className="mt-3 text-sm text-gray-600">{candidate.theology} · {candidate.denomination}</p></section>}
        <section><h4 className="font-black uppercase text-brand-dark">Media Portfolio</h4><div className="mt-3 space-y-2">{candidate.portfolio.map((item) => <p key={item} className="rounded bg-slate-50 p-3 text-sm text-brand-red">{icon("fa-play-circle", "mr-2")}{item}</p>)}</div></section>
        {candidate.honorariumPublic && <section><h4 className="font-black uppercase text-brand-dark">Honorarium</h4><p className="mt-3 text-sm text-gray-600">{candidate.honorarium}</p></section>}
      </div>
      <button type="button" onClick={invite} className="mt-7 rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase text-white">Invite to Serve</button>
    </div>
  )
}

function EmployerExperience({
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

function VerificationStatus({
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

function ListingStatus({ status }: { status: EmployerJobStatus }) {
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

function EmployerPageHeader({
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

function AdminExperience({
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

function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return <div className="mb-6 border-b border-gray-200 pb-5"><p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">Admin dashboard</p><h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">{title}</h2><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></div>
}

function AdminPagination({ page, pages, setPage }: { page: number; pages: number; setPage: (page: number) => void }) {
  return <div className="mt-4 flex items-center justify-between rounded border border-gray-200 bg-white p-3 text-xs text-gray-500"><span>Page {page} of {pages}</span><div className="flex gap-2"><button type="button" disabled={page === 1} onClick={() => setPage(Math.max(1, page - 1))} className="rounded border border-gray-300 px-3 py-1.5 font-bold disabled:opacity-40">Previous</button><button type="button" disabled={page === pages} onClick={() => setPage(Math.min(pages, page + 1))} className="rounded border border-gray-300 px-3 py-1.5 font-bold disabled:opacity-40">Next</button></div></div>
}

function AdminEmpty({ title, description }: { title: string; description: string }) {
  return <div className="rounded border border-gray-200 bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-brand-red">{icon("fa-magnifying-glass")}</span><h3 className="mt-4 font-black uppercase text-brand-dark">{title}</h3><p className="mt-2 text-sm leading-6 text-gray-600">{description}</p></div>
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

function DashboardPreview({
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

const RESOURCES = [
  {
    slug: "discerning-your-next-ministry-call",
    category: "Career discernment",
    title: "Discerning Your Next Ministry Call",
    summary:
      "A practical framework for evaluating fit, season, theology, and community as you consider a new ministry role.",
    readTime: "6 min read",
    sections: [
      [
        "Begin with clarity",
        "Before reviewing job descriptions, write down the kind of ministry work that gives you energy, the responsibilities you are equipped to carry, and the convictions that should shape your next community.",
      ],
      [
        "Evaluate the whole opportunity",
        "Role scope matters, but so do leadership culture, theological alignment, family considerations, location, expectations, and the health of the organization. Ask specific questions and allow time for honest conversations.",
      ],
      [
        "Invite trusted voices",
        "Discernment is stronger in community. Ask mentors, family members, and ministry peers to help you notice both opportunities and concerns that may be difficult to see on your own.",
      ],
    ],
  },
  {
    slug: "writing-a-clear-ministry-job-description",
    category: "Hiring guidance",
    title: "Writing a Clear Ministry Job Description",
    summary:
      "Help candidates understand your mission, expectations, leadership structure, and measures of success.",
    readTime: "5 min read",
    sections: [
      [
        "Lead with the mission",
        "Explain why the role exists and how it supports the organization’s ministry. A clear purpose gives candidates context for every responsibility that follows.",
      ],
      [
        "Separate needs from preferences",
        "Identify the qualifications that are truly required, then list preferred experience separately. This creates a more focused and accessible search.",
      ],
      [
        "Make expectations concrete",
        "Describe reporting relationships, weekly rhythms, team responsibilities, compensation, and the outcomes you hope to see during the first year.",
      ],
    ],
  },
  {
    slug: "questions-for-a-ministry-interview",
    category: "Interview preparation",
    title: "Questions to Ask in a Ministry Interview",
    summary:
      "Thoughtful prompts for discussing culture, doctrine, leadership, expectations, and congregational health.",
    readTime: "7 min read",
    sections: [
      [
        "Understand leadership culture",
        "Ask how decisions are made, how conflict is handled, and how staff members receive support and feedback. Examples are often more useful than general descriptions.",
      ],
      [
        "Discuss ministry philosophy",
        "Explore how the organization approaches discipleship, pastoral care, outreach, volunteers, and change. Look for alignment as well as room for healthy dialogue.",
      ],
      [
        "Clarify success and support",
        "Ask what success looks like after six and twelve months, which resources are available, and what challenges the previous or current team has experienced.",
      ],
    ],
  },
]

function OrganizationPage({ hash }: { hash: string }) {
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

function PostJobPage() {
  return (
    <>
      <PageBanner title="Post a Job" />
      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Reach ministry-minded candidates
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Start your ministry search with clarity
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Create an employer workspace, add your organization profile, and
              build a complete position listing for candidates to review.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Organization", "Share your mission and ministry context."],
                ["02", "Position", "Add responsibilities, qualifications, and pay."],
                ["03", "Review", "Confirm details before the sample publishing step."],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="rounded border border-gray-200 bg-slate-50 p-5"
                >
                  <span className="text-3xl font-black text-gray-200">{number}</span>
                  <h2 className="mt-2 text-sm font-extrabold uppercase text-brand-dark">
                    {title}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-gray-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="rounded border border-gray-200 bg-brand-charcoal p-6 text-white shadow-xl lg:col-span-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Employer entry
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              Prepare your listing
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {[
                "Organization overview and denomination",
                "Role responsibilities and qualifications",
                "Location, workplace type, and compensation",
                "Application deadline and instructions",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  {icon("fa-check", "mt-1 text-red-300")}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#/employer/sign-up"
              className="mt-6 flex items-center justify-center rounded bg-brand-red px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
            >
              Create Employer Account
            </a>
            <p className="mt-3 text-center text-xs leading-5 text-gray-400">
              Staging only. Publishing and payment processing are not connected.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

function PricingPage() {
  const plans = [
    {
      title: "Standard Listing",
      price: "[Set price]",
      duration: "[Set duration]",
      description: "[Add approved standard package description]",
      features: [
        "[Set listing duration]",
        "[Set included application tools]",
        "[Set support level]",
      ],
    },
    {
      title: "Featured Listing",
      price: "[Set price]",
      duration: "[Set duration]",
      description: "[Add approved featured package description]",
      features: [
        "[Set featured placement details]",
        "[Set listing duration]",
        "[Set included employer tools]",
      ],
    },
    {
      title: "Organization Package",
      price: "[Contact / set price]",
      duration: "[Set terms]",
      description: "[Add approved multi-listing package description]",
      features: [
        "[Set listing allowance]",
        "[Set team access details]",
        "[Set support level]",
      ],
    },
  ]
  return (
    <>
      <PageBanner title="Pricing" />
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Candidate access
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Job seekers use Red Letter Jobs free
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Candidates can browse, save, and apply to ministry opportunities
              without a subscription or application fee.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.title}
                className="rounded border border-dashed border-gray-300 bg-slate-50 p-6"
              >
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                  Editable placeholder
                </span>
                <h2 className="mt-4 text-xl font-black uppercase tracking-tight text-brand-dark">
                  {plan.title}
                </h2>
                <p className="mt-4 text-3xl font-black text-brand-red">
                  {plan.price}
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-500">
                  {plan.duration}
                </p>
                <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
                <ul className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      {icon("fa-pen", "mt-1 text-brand-red")}
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl rounded border border-amber-200 bg-amber-50 p-4 text-center text-xs leading-5 text-amber-950">
            Employer prices, package details, and payment terms are placeholders
            pending commercial approval. No payment processing is connected.
          </p>
        </div>
      </section>
    </>
  )
}

function ContactPage() {
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

function ResourcesPage() {
  return (
    <>
      <PageBanner title="Resources" />
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Practical ministry guidance
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Resources for thoughtful next steps
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Explore sample guides for candidates, churches, and Christian
              organizations navigating ministry employment.
            </p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((resource) => (
              <article
                key={resource.slug}
                className="group flex flex-col rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red hover:shadow-md"
              >
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-red">
                  {resource.category}
                </span>
                <h2 className="mt-3 text-xl font-black tracking-tight text-brand-dark">
                  {resource.title}
                </h2>
                <p className="mt-3 flex-grow text-sm leading-6 text-gray-600">
                  {resource.summary}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-500">{resource.readTime}</span>
                  <a
                    href={`#/resources/${resource.slug}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
                  >
                    Read article {icon("fa-arrow-right", "ml-1")}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function ResourceArticlePage({ hash }: { hash: string }) {
  const resource = RESOURCES.find((item) => hash.endsWith(item.slug))
  if (!resource) return <GenericPage path={hash} />
  return (
    <>
      <PageBanner title={resource.category} />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <a
          href="#/resources"
          className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
        >
          {icon("fa-arrow-left", "mr-2")}All resources
        </a>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-brand-dark">
          {resource.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">{resource.summary}</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Sample editorial resource · {resource.readTime}
        </p>
        <div className="mt-10 space-y-9 border-t border-gray-200 pt-8">
          {resource.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark">
                {heading}
              </h2>
              <p className="mt-3 text-base leading-8 text-gray-600">{body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded bg-brand-charcoal p-6 text-white">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Explore your next opportunity
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Browse sample ministry roles by calling, location, and tradition.
          </p>
          <a
            href="#/jobs-listing"
            className="mt-5 inline-flex rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            Browse Jobs
          </a>
        </div>
      </article>
    </>
  )
}

function FaqPage() {
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

const INFO_PAGES: Record<
  string,
  {
    title: string
    eyebrow: string
    introduction: string
    sections: { heading: string; body: string }[]
    legalReview?: boolean
  }
> = {
  "/about-us": {
    title: "About Us",
    eyebrow: "Our mission",
    introduction:
      "Red Letter Jobs helps churches, ministries, and Christian organizations connect with people who are ready to serve.",
    sections: [
      {
        heading: "Purpose-driven hiring",
        body: "We built a focused place for ministry opportunities so employers can reach qualified candidates without getting lost on a general-purpose job board.",
      },
      {
        heading: "For candidates",
        body: "Explore roles by ministry category, denomination, and location to find an opportunity aligned with your experience, gifts, and calling.",
      },
      {
        heading: "For employers",
        body: "Share openings with a ministry-minded audience and give candidates the information they need to discern whether a role is the right fit.",
      },
    ],
  },
  "/pricing": {
    title: "Pricing",
    eyebrow: "Simple options",
    introduction:
      "Choose the level of visibility and support that fits your ministry search. Final pricing and included features are shown before a listing is published.",
    sections: [
      {
        heading: "Candidate access",
        body: "Searching and exploring ministry opportunities is free for job seekers.",
      },
      {
        heading: "Standard listings",
        body: "Publish a complete ministry opening with role details, location, denomination, and application instructions.",
      },
      {
        heading: "Featured visibility",
        body: "Increase exposure for priority searches with featured placement and enhanced visibility across the job board.",
      },
    ],
  },
  "/cookie-policy": {
    title: "Cookie Policy",
    eyebrow: "Your choices",
    introduction:
      "This policy explains how Red Letter Jobs may use cookies and similar technologies to operate and improve the website.",
    sections: [
      {
        heading: "Essential cookies",
        body: "These technologies support core functions such as navigation, security, account access, and saved preferences.",
      },
      {
        heading: "Analytics",
        body: "We may use aggregated usage information to understand which pages and features are most helpful to visitors.",
      },
      {
        heading: "Managing cookies",
        body: "You can limit or remove cookies through your browser settings. Disabling essential cookies may affect some site features.",
      },
    ],
  },
  "/privacy-policy": {
    title: "Privacy Policy",
    eyebrow: "Protecting your information",
    introduction:
      "This draft placeholder outlines topics expected in a future privacy policy. It is not final legal language.",
    legalReview: true,
    sections: [
      {
        heading: "Information we collect",
        body: "We may collect account details, job-listing information, application activity, communications, and basic technical usage data.",
      },
      {
        heading: "How information is used",
        body: "Information helps us operate accounts, connect candidates and employers, respond to support requests, and protect the platform.",
      },
      {
        heading: "Your choices",
        body: "You may request access to, correction of, or deletion of eligible personal information by contacting our support team.",
      },
    ],
  },
  "/refund-policy": {
    title: "Refund Policy",
    eyebrow: "Fair and transparent",
    introduction:
      "We want employers to understand their purchase and listing options before a ministry opportunity is published.",
    sections: [
      {
        heading: "Before publication",
        body: "If a paid listing has not yet been published, contact us promptly so we can review cancellation and refund options.",
      },
      {
        heading: "Published listings",
        body: "Because publication provides immediate access to job-board visibility, completed listing purchases are generally non-refundable.",
      },
      {
        heading: "Billing issues",
        body: "Duplicate charges or technical billing errors will be reviewed and corrected when verified.",
      },
    ],
  },
  "/terms-of-use": {
    title: "Terms of Use",
    eyebrow: "Using Red Letter Jobs",
    introduction:
      "This draft placeholder outlines topics expected in future terms of use. It is not final legal language.",
    legalReview: true,
    sections: [
      {
        heading: "Accurate information",
        body: "Users are responsible for providing truthful account, organization, job, and application information.",
      },
      {
        heading: "Acceptable use",
        body: "The service may not be used for unlawful activity, misleading listings, harassment, unauthorized data collection, or platform disruption.",
      },
      {
        heading: "Listings and applications",
        body: "Employers make their own hiring decisions, and candidates are responsible for evaluating opportunities before applying or accepting a role.",
      },
    ],
  },
}

function GenericPage({ path }: { path: string }) {
  const infoPage = INFO_PAGES[path]
  if (infoPage) {
    return (
      <>
        <PageBanner title={infoPage.title} />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="border-b border-gray-200 pb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              {infoPage.eyebrow}
            </p>
            {infoPage.legalReview && (
              <p className="mb-4 inline-flex rounded bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950">
                Draft placeholder — legal review required
              </p>
            )}
            <p className="max-w-3xl text-base leading-7 text-gray-600">
              {infoPage.introduction}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {infoPage.sections.map((section) => (
              <section key={section.heading} className="py-7">
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
                  {section.heading}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
          <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-600">
            Have a question about this page?{" "}
            <a href="#/contact" className="font-bold text-brand-red underline">
              Contact our team
            </a>
            .
          </div>
        </div>
      </>
    )
  }

  const title =
    path.replace("/", "").replaceAll("-", " ").toUpperCase() || "PAGE"
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-black uppercase text-brand-dark">
        {title}
      </h1>
      <p className="mx-auto max-w-xl text-xs leading-relaxed text-gray-500">
        We couldn’t find the page you requested. It may have moved, or the link
        may no longer be available.
      </p>
      <a
        href="#/"
        className="mt-6 inline-block rounded bg-brand-red px-6 py-2.5 text-xs font-bold uppercase text-white"
      >
        Return to Home
      </a>
    </div>
  )
}

const DEMO_STORAGE_KEYS = {
  candidate: "rlj-demo-candidate",
  employer: "rlj-demo-employer",
  supply: "rlj-demo-pulpit-supply",
  session: "rlj-demo-session",
}

function normalizeJobType(type: string): Job["type"] {
  if (type === "FREELANCE" || type === "INTERN") return "INTERNSHIP"
  if (type === "TEMPORARY") return "INTERIM"
  return type as Job["type"]
}

function loadCandidateDemoState() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(DEMO_STORAGE_KEYS.candidate) || "null",
    ) as Partial<CandidateState> | null
    return stored
      ? {
          ...INITIAL_CANDIDATE_STATE,
          ...stored,
          profile: {
            ...INITIAL_CANDIDATE_STATE.profile,
            ...(stored.profile || {}),
            preferredTypes: (
              stored.profile?.preferredTypes ||
              INITIAL_CANDIDATE_STATE.profile.preferredTypes
            ).map(normalizeJobType),
          },
          applications:
            stored.applications || INITIAL_CANDIDATE_STATE.applications,
          savedJobIds:
            stored.savedJobIds || INITIAL_CANDIDATE_STATE.savedJobIds,
          preferredCategories:
            stored.preferredCategories ||
            INITIAL_CANDIDATE_STATE.preferredCategories,
          preferredStates:
            stored.preferredStates || INITIAL_CANDIDATE_STATE.preferredStates,
        }
      : INITIAL_CANDIDATE_STATE
  } catch {
    return INITIAL_CANDIDATE_STATE
  }
}

function loadEmployerDemoState() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(DEMO_STORAGE_KEYS.employer) || "null",
    ) as Partial<EmployerState> | null
    return stored
      ? {
          ...INITIAL_EMPLOYER_STATE,
          ...stored,
          organization: {
            ...INITIAL_EMPLOYER_STATE.organization,
            ...(stored.organization || {}),
          },
          listings: (
            stored.listings || INITIAL_EMPLOYER_STATE.listings
          ).map((listing) => ({
            ...listing,
            type: normalizeJobType(listing.type),
          })),
          internalNotes: stored.internalNotes || {},
          moderationHistory: stored.moderationHistory || {},
        }
      : INITIAL_EMPLOYER_STATE
  } catch {
    return INITIAL_EMPLOYER_STATE
  }
}

function loadDemoSession() {
  try {
    return JSON.parse(
      window.localStorage.getItem(DEMO_STORAGE_KEYS.session) || "null",
    ) as Session | null
  } catch {
    return null
  }
}

function loadSupplyDemoState() {
  try {
    const stored = JSON.parse(
      window.localStorage.getItem(DEMO_STORAGE_KEYS.supply) || "null",
    ) as Partial<SupplyState> | null
    return stored
      ? {
          ...INITIAL_SUPPLY_STATE,
          ...stored,
          profile: {
            ...INITIAL_SUPPLY_STATE.profile,
            ...(stored.profile || {}),
          },
          candidates: Array.from(
            new Map(
              [
                ...INITIAL_SUPPLY_STATE.candidates,
                ...(stored.candidates || []),
              ].map((candidate) => [candidate.id, candidate]),
            ).values(),
          ),
          bookings: stored.bookings || INITIAL_SUPPLY_STATE.bookings,
          savedCandidateIds: stored.savedCandidateIds || [],
          unavailableDates: stored.unavailableDates || [],
        }
      : INITIAL_SUPPLY_STATE
  } catch {
    return INITIAL_SUPPLY_STATE
  }
}

export default function App() {
  const hash = useHash() || "/"
  const [session, setSession] = useState<Session | null>(loadDemoSession)
  const [demoOpen, setDemoOpen] = useState(false)
  const [candidateState, setCandidateState] = useState<CandidateState>(
    loadCandidateDemoState,
  )
  const [employerState, setEmployerState] = useState<EmployerState>(
    loadEmployerDemoState,
  )
  const [supplyState, setSupplyState] =
    useState<SupplyState>(loadSupplyDemoState)
  const allJobs = useMemo(
    () => [
      ...employerState.listings
        .filter(
          (listing) =>
            listing.status === "Published" || listing.status === "Closed",
        )
        .map((listing) =>
          employerListingToJob(listing, employerState.organization),
        ),
      ...JOBS,
    ],
    [employerState],
  )
  const [applicationJob, setApplicationJob] = useState<Job | null>(null)
  const [applicationSuccess, setApplicationSuccess] = useState(false)
  useEffect(() => {
    if (!applicationSuccess) return
    const timeout = window.setTimeout(() => setApplicationSuccess(false), 6000)
    return () => window.clearTimeout(timeout)
  }, [applicationSuccess])
  useEffect(() => {
    window.localStorage.setItem(
      DEMO_STORAGE_KEYS.candidate,
      JSON.stringify(candidateState),
    )
  }, [candidateState])
  useEffect(() => {
    window.localStorage.setItem(
      DEMO_STORAGE_KEYS.employer,
      JSON.stringify(employerState),
    )
  }, [employerState])
  useEffect(() => {
    window.localStorage.setItem(
      DEMO_STORAGE_KEYS.supply,
      JSON.stringify(supplyState),
    )
  }, [supplyState])
  useEffect(() => {
    if (session)
      window.localStorage.setItem(
        DEMO_STORAGE_KEYS.session,
        JSON.stringify(session),
      )
    else window.localStorage.removeItem(DEMO_STORAGE_KEYS.session)
  }, [session])
  const login = (role: "candidate" | "employer") => {
    setSession({ role, demo: true })
    window.location.hash = DEMO_ROUTES[role]
  }
  const chooseDemoRole = (role: DemoRole) => {
    setSession({ role, demo: true })
    setDemoOpen(false)
    window.location.hash = DEMO_ROUTES[role]
  }
  const enterCandidateDemo = () => {
    setSession({ role: "candidate", demo: true })
    window.location.hash = "/candidate/dashboard"
  }
  const enterEmployerDemo = () => {
    setSession({ role: "employer", demo: true })
    window.location.hash = "/employer/dashboard"
  }
  const resetDemo = () => {
    if (
      !window.confirm(
        "Reset all candidate, employer, application, and moderation demo changes?",
      )
    )
      return
    window.localStorage.removeItem(DEMO_STORAGE_KEYS.candidate)
    window.localStorage.removeItem(DEMO_STORAGE_KEYS.employer)
    window.localStorage.removeItem(DEMO_STORAGE_KEYS.supply)
    window.localStorage.removeItem(DEMO_STORAGE_KEYS.session)
    setCandidateState(INITIAL_CANDIDATE_STATE)
    setEmployerState(INITIAL_EMPLOYER_STATE)
    setSupplyState(INITIAL_SUPPLY_STATE)
    setSession(null)
    setDemoOpen(false)
    setApplicationJob(null)
    setApplicationSuccess(false)
    window.location.hash = "/"
  }
  const submitApplication = (
    job: Job,
    resumeName: string,
    message: string,
  ) => {
    if (job.closed)
      return "Applications for this position are closed and cannot be submitted."
    if (candidateState.applications.some((item) => item.jobId === job.id))
      return "You have already applied to this position."
    if (!resumeName) return "Select a resume before submitting."
    const applied = new Date().toISOString().slice(0, 10)
    setCandidateState((current) => ({
      ...current,
      applications: [
        {
          id:
            Math.max(0, ...current.applications.map((item) => item.id)) + 1,
          jobId: job.id,
          applied,
          status: "New",
          note: "This simulated application is available in both the candidate and employer demo workspaces.",
          candidateName: current.profile.name,
          resumeName,
          message,
        },
        ...current.applications,
      ],
    }))
    setSession({ role: "candidate", demo: true })
    setApplicationJob(null)
    setApplicationSuccess(true)
    return null
  }
  const dashboardRole = (
    Object.entries(DEMO_ROUTES).find(([, route]) => hash === route)?.[0] ||
    null
  ) as DemoRole | null
  const page =
    hash === "/" ? (
      <HomePage />
    ) : hash.startsWith("/pulpit-supply/candidate/") ? (
      <PublicSupplyCandidatePage hash={hash} supplyState={supplyState} />
    ) : hash === "/pulpit-supply" ? (
      <PulpitSupplyPage supplyState={supplyState} />
    ) : hash.startsWith("/candidate/") ? (
      <CandidateExperience
        hash={hash}
        state={candidateState}
        setState={setCandidateState}
        enterDemo={enterCandidateDemo}
        supplyState={supplyState}
        setSupplyState={setSupplyState}
      />
    ) : hash.startsWith("/employer/") ? (
      <EmployerExperience
        hash={hash}
        state={employerState}
        setState={setEmployerState}
        candidateState={candidateState}
        setCandidateState={setCandidateState}
        enterDemo={enterEmployerDemo}
        supplyState={supplyState}
        setSupplyState={setSupplyState}
      />
    ) : hash.startsWith("/admin/") ? (
      <AdminExperience
        hash={hash}
        employerState={employerState}
        setEmployerState={setEmployerState}
        candidateState={candidateState}
        supplyState={supplyState}
        setSupplyState={setSupplyState}
      />
    ) : dashboardRole ? (
      <DashboardPreview
        role={dashboardRole}
        openDemo={() => setDemoOpen(true)}
      />
    ) : hash.startsWith("/organization/") ? (
      <OrganizationPage hash={hash} />
    ) : hash.startsWith("/job/") ? (
      <JobDetailPage hash={hash} />
    ) : hash.startsWith("/jobs-listing") ||
      hash.startsWith("/jobs/") ||
      hash.startsWith("/denomination/") ||
      hash.startsWith("/location/") ? (
      <JobListingsPage hash={hash} />
    ) : hash === "/categories" ? (
      <GridPage kind="categories" />
    ) : hash === "/denominations" ? (
      <GridPage kind="denominations" />
    ) : hash === "/locations" ? (
      <LocationsPage />
    ) : hash === "/for-employers" ? (
      <EmployersPage />
    ) : hash === "/post-a-job" ? (
      <PostJobPage />
    ) : hash === "/pricing" ? (
      <PricingPage />
    ) : hash === "/contact" ? (
      <ContactPage />
    ) : hash === "/resources" ? (
      <ResourcesPage />
    ) : hash.startsWith("/resources/") ? (
      <ResourceArticlePage hash={hash} />
    ) : hash === "/faqs" ? (
      <FaqPage />
    ) : hash === "/signin-signup" ? (
      <AuthPage login={login} />
    ) : (
      <GenericPage path={hash} />
    )
  return (
    <ApplicationContext.Provider
      value={{
        applications: candidateState.applications,
        openApplication: (job) => setApplicationJob(job),
        jobs: allJobs,
        employerListings: employerState.listings,
        savedJobIds: candidateState.savedJobIds ?? [],
        toggleSavedJob: (jobId) =>
          setCandidateState((current) => ({
            ...current,
            savedJobIds: (current.savedJobIds ?? []).includes(jobId)
              ? (current.savedJobIds ?? []).filter((id) => id !== jobId)
              : [...(current.savedJobIds ?? []), jobId],
          })),
      }}
    >
    <div className="flex min-h-screen flex-col bg-slate-50 text-gray-800">
      <Header
        hash={hash}
        openDemo={() => setDemoOpen(true)}
      />
      {session?.demo && (
        <DemoBanner
          session={session}
          openDemo={() => setDemoOpen(true)}
          exitDemo={() => {
            setSession(null)
            window.location.hash = "/"
          }}
          resetDemo={resetDemo}
        />
      )}
      <main className="compact-page flex-grow">{page}</main>
      <Footer />
      {demoOpen && (
        <DemoAccess
          close={() => setDemoOpen(false)}
          chooseRole={chooseDemoRole}
          resetDemo={resetDemo}
        />
      )}
      {applicationJob && (
        <ApplicationDialog
          job={applicationJob}
          profile={candidateState.profile}
          savedResume={candidateState.resumeName}
          close={() => setApplicationJob(null)}
          submit={(resumeName, message) =>
            submitApplication(applicationJob, resumeName, message)
          }
        />
      )}
      {applicationSuccess && (
        <ApplicationSuccess close={() => setApplicationSuccess(false)} />
      )}
    </div>
    </ApplicationContext.Provider>
  )
}
