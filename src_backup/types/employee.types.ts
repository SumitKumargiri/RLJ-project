import { Job } from "./job.types"

export type EmployerJobStatus =
  | "Draft"
  | "Pending Review"
  | "Published"
  | "Closed"
  | "Changes Requested"
  | "Rejected"

export type EmployerListing = {
  id: number
  title: string
  category: string
  city: string
  state: string
  workplace: Job["workplace"]
  type: Job["type"]
  denomination: string
  description: string
  responsibilities: string
  qualifications: string
  salaryMin: string
  salaryMax: string
  benefits: string
  deadline: string
  applicationInstructions: string
  status: EmployerJobStatus
  created: string
}

export type EmployerState = {
  organization: {
    name: string
    city: string
    state: string
    denomination: string
    website: string
    overview: string
    verification: "Unverified" | "Pending Review" | "Verified Demo"
  }
  listings: EmployerListing[]
  internalNotes: Record<number, string>
  moderationHistory: Record<
    number,
    { action: string; reason: string; date: string }[]
  >
}


export type SupplyBookingStatus =
  | "Request Sent"
  | "Awaiting Response"
  | "Accepted"
  | "Declined"
  | "Cancelled"
  | "Completed"

export type SupplyCandidate = {
  id: number
  name: string
  category: "Preaching" | "Worship"
  roles: string[]
  city: string
  state: string
  denomination: string
  theology: string
  experience: number
  ordained: boolean
  languages: string[]
  biography: string
  availability: string[]
  travelDistance: number
  honorarium: string
  honorariumPublic: boolean
  profileVisible: boolean
  theologyVisible: boolean
  availabilityVisible: boolean
  directContact: boolean
  portfolio: string[]
  instruments: string[]
}

export type SupplyBooking = {
  id: number
  candidateId: number
  church: string
  contactPerson: string
  date: string
  time: string
  role: string
  location: string
  description: string
  congregationSize: string
  serviceFormat: string
  theologicalPreference: string
  honorarium: string
  travelReimbursement: string
  lodging: string
  instructions: string
  status: SupplyBookingStatus
  messages: string[]
}


export type SupplyState = {
  enabled: boolean
  profileApproved: boolean
  profile: SupplyCandidate
  candidates: SupplyCandidate[]
  bookings: SupplyBooking[]
  savedCandidateIds: number[]
  unavailableDates: string[]
}