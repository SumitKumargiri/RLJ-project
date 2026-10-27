
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
import { EmployerListing } from "@/types/employee.types"


type ApplicationProviderProps = {
  children: ReactNode
}

export const ApplicationContext =
  createContext<ApplicationContextValue | undefined>(undefined)

export function ApplicationProvider({
  children,
}: ApplicationProviderProps) {
  const [applications, setApplications] = useState<
    CandidateApplication[]
  >([])

  const [jobs] = useState<Job[]>([])

  const [employerListings] = useState<EmployerListing[]>([])

  const [savedJobIds, setSavedJobIds] = useState<number[]>([])

  const openApplication = useCallback((job: Job) => {
    // Add your application-opening logic here.
    console.log("Opening application for:", job.title)
  }, [])

  const toggleSavedJob = useCallback((jobId: number) => {
    setSavedJobIds((previousIds) =>
      previousIds.includes(jobId)
        ? previousIds.filter((id) => id !== jobId)
        : [...previousIds, jobId]
    )
  }, [])

  const value = useMemo<ApplicationContextValue>(
    () => ({
      applications,
      openApplication,
      jobs,
      employerListings,
      savedJobIds,
      toggleSavedJob,
    }),
    [
      applications,
      openApplication,
      jobs,
      employerListings,
      savedJobIds,
      toggleSavedJob,
    ]
  )

  return (
    <ApplicationContext.Provider value={value}>
      {children}
    </ApplicationContext.Provider>
  )
}

export function useApplication(): ApplicationContextValue {
  const context = useContext(ApplicationContext)

  if (context === undefined) {
    throw new Error(
      "useApplication must be used within ApplicationProvider"
    )
  }

  return context
}
