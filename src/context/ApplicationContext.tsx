import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react"

import type { ApplicationContextValue } from "../types/application.types"
import type { CandidateApplication } from "../types/candidate.types"
import type { Job } from "../types/job.types"
import type { EmployerListing } from "../types/employee.types"

export const defaultApplicationContextValue: ApplicationContextValue = {
  applications: [],
  openApplication: () => {},
  jobs: [],
  employerListings: [],
  savedJobIds: [],
  toggleSavedJob: () => {},
}

export const ApplicationContext = createContext<ApplicationContextValue>(
  defaultApplicationContextValue
)

type ApplicationProviderProps = {
  children: ReactNode
  value?: ApplicationContextValue
}

export function ApplicationProvider({
  children,
  value: controlledValue,
}: ApplicationProviderProps) {
  const [applications, setApplications] = useState<CandidateApplication[]>([])
  const [jobs] = useState<Job[]>([])
  const [employerListings] = useState<EmployerListing[]>([])
  const [savedJobIds, setSavedJobIds] = useState<number[]>([])

  const openApplication = useCallback((job: Job) => {
    console.log("Opening application for:", job.title)
  }, [])

  const toggleSavedJob = useCallback((jobId: number) => {
    setSavedJobIds((previousIds) =>
      previousIds.includes(jobId)
        ? previousIds.filter((id) => id !== jobId)
        : [...previousIds, jobId]
    )
  }, [])

  const internalValue = useMemo<ApplicationContextValue>(
    () => ({
      applications,
      openApplication,
      jobs,
      employerListings,
      savedJobIds,
      toggleSavedJob,
    }),
    [applications, openApplication, jobs, employerListings, savedJobIds, toggleSavedJob]
  )

  return (
    <ApplicationContext.Provider value={controlledValue || internalValue}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication(): ApplicationContextValue {
  return useContext(ApplicationContext)
}

export default ApplicationProvider
