import { Job } from "../types/job.types"

export function formatLocation(job: Job) {
  return job.country === "United States" || job.country === "Canada"
    ? `${job.city}, ${job.state}`
    : `${job.city}, ${job.country}`
}

export function formatJobDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function formatApplicationDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`))
}

export function organizationSlug(name: string) {
  return name
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, "-")
    .replaceAll(/(^-|-$)/g, "")
}

