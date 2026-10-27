export type CandidateProfile = {
  name: string
  city: string
  state: string
  headline: string
  biography: string
  denomination: string
  theologicalBackground: string
  experience: string
  education: string
  skills: string
  credentials: string
  preferredRoles: string
  preferredLocations: string
  preferredTypes: string[]
  portfolio: string
  profileVisible: boolean
  resumeVisible: boolean
}

export type CandidateState = {
  profile: CandidateProfile
  savedJobIds: number[]
  preferredCategories: string[]
  preferredStates: string[]
  recommendationsConfigured: boolean
  resumeName: string
  alertFrequency: "Off" | "Daily" | "Weekly"
  applicationUpdates: boolean
  messageNotifications: boolean
  applications: CandidateApplication[]
}

export type CandidateApplication = {
  id: number
  jobId: number
  applied: string
  status: string
  note: string
  candidateName: string
  resumeName: string
  message: string
}

