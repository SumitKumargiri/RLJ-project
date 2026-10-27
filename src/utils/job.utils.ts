import { Job } from "../types/job.types"
import { EmployerListing, EmployerState } from "../types/employee.types"

export function normalizeJobType(type: string): Job["type"] {
  if (type === "FREELANCE" || type === "INTERN") return "INTERNSHIP"
  if (type === "TEMPORARY") return "INTERIM"
  return type as Job["type"]
}

export function employerListingToJob(
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

export function typeClass(type: Job["type"]) {
  if (type === "FULL TIME") return "bg-sky-600"
  if (type === "PART TIME") return "bg-orange-600"
  if (type === "INTERNSHIP") return "bg-emerald-600"
  return "bg-purple-600"
}

