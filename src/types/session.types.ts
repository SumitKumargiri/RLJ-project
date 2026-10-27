export type DemoRole = "candidate" | "employer" | "admin"

export type Session = {
  role: DemoRole
  demo: boolean
}