import { useEffect, useMemo, useState } from "react"
import { Job } from "./types/job.types"
import { DemoRole, Session } from "./types/session.types"
import {
  EmployerState,
  SupplyState,
} from "./types/employee.types"
import { CandidateState } from "./types/candidate.types"
import { ApplicationContext } from "./context/ApplicationContext"
import { JOBS } from "./constants/ministry.constants"
import { INITIAL_CANDIDATE_STATE } from "./data/initialCandidateState"
import { INITIAL_EMPLOYER_STATE } from "./data/initialEmployerState"
import { INITIAL_SUPPLY_STATE } from "./data/initialSupplyState"
import { DEMO_ROUTES, DEMO_STORAGE_KEYS } from "./constants/routes.constants"
import { useHash } from "./hooks/useHash"
import { employerListingToJob, normalizeJobType } from "./utils/job.utils"
import { AuthPage } from "./pages/AuthPage"
import { ContactPage } from "./pages/ContactPage"
import { EmployersPage } from "./pages/EmployersPage"
import { FaqPage } from "./pages/FaqPage"
import { GridPage } from "./pages/GridPage"
import { LocationsPage } from "./pages/LocationsPage"
import { OrganizationPage } from "./pages/OrganizationPage"
import { PostJobPage } from "./pages/PostJobPage"
import { PricingPage } from "./pages/PricingPage"
import { PublicSupplyCandidatePage } from "./pages/PublicSupplyCandidatePage"
import { ResourceArticlePage } from "./pages/ResourceArticlePage"
import { ResourcesPage } from "./pages/ResourcesPage"
import { HomePage } from "./pages/HomePage"
import { JobDetailPage } from "./pages/JobDetailPage"
import { JobListingsPage } from "./pages/JobListingsPage"
import { PulpitSupplyPage } from "./pages/PulpitSupplyPage"
import { GenericPage } from "./pages/GenericPage"
import { DemoAccess } from "./components/common/DemoAccess"
import { ApplicationDialog } from "./components/common/ApplicationDialog"
import { ApplicationSuccess } from "./components/common/ApplicationSuccess"
import { DashboardPreview } from "./components/common/DashboardPreview"
import { DemoBanner } from "./components/layout/DemoBanner"
import { Footer } from "./components/layout/Footer"
import { Header } from "./components/layout/Header"
import { AdminExperience } from "./pages/AdminWorkspacePage"
import { CandidateExperience } from "./pages/CandidateWorkspacePage"
import { EmployerExperience } from "./pages/EmployerWorkspacePage"


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
