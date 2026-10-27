export type Job = {
  id: number
  title: string
  company: string
  country: string
  state: string
  city: string
  type: "FULL TIME" | "PART TIME" | "INTERNSHIP" | "INTERIM"
  date: string
  featured: boolean
  category: string
  denomination: string
  salary?: string
  workplace: "On-site" | "Hybrid" | "Remote"
  deadline?: string
  closed?: boolean
}

export type JobDetail = {
  summary: string
  responsibilities: string[]
  qualifications: string[]
}
