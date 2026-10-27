import { CandidateApplication } from "./candidate.types"
import { EmployerListing } from "./employee.types"
import { Job } from "./job.types"

export type ApplicationContextValue = {
  applications: CandidateApplication[]
  openApplication: (job: Job) => void
  jobs: Job[]
  employerListings: EmployerListing[]
  savedJobIds: number[]
  toggleSavedJob: (jobId: number) => void
}

