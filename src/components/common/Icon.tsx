export function Icon({
  name,
  className = "",
}: {
  name: string
  className?: string
}) {
  return <i className={`fa-solid ${name} ${className}`} aria-hidden="true" />
}

export const icon = (name: string, className = "") => (
  <i className={`fa-solid ${name} ${className}`} aria-hidden="true" />
)

export default Icon

