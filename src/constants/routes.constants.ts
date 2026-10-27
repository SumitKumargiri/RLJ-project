import { DemoRole } from "../types/session.types"

export const DEMO_ROUTES: Record<DemoRole, string> = {
  candidate: "/candidate/dashboard",
  employer: "/employer/dashboard",
  admin: "/admin/dashboard",
}

export const DEMO_STORAGE_KEYS = {
  candidate: "rlj-demo-candidate",
  employer: "rlj-demo-employer",
  supply: "rlj-demo-pulpit-supply",
  session: "rlj-demo-session",
} as const

