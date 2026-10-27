import { useState } from "react"
import { JOBS } from "../../data/jobs.data"

export function OrganizationLogo({
  name,
  className = "h-14 w-14",
}: {
  name: string
  className?: string
}) {
  const [failed, setFailed] = useState(false)
  const signature = Array.from(name).reduce((total, character) => total + character.charCodeAt(0),0,)
  const churchDomains = [
    "gracechurch.org",
    "redeemer.com",
    "life.church",
    "elevationchurch.org",
    "northpoint.org",
    "willowcreek.org",
    "saddleback.com",
    "summitchurch.com",
    "passioncitychurch.com",
    "gatewaypeople.com",
    "seacoast.org",
    "crossroads.net",
    "flatironschurch.com",
    "mosaic.org",
    "transformationchurch.us",
    "rivervalley.org",
    "crosspoint.tv",
    "newlifechurch.org",
    "ccclife.org",
    "journeychristian.com",
    "covlife.org",
    "liquidchurch.com",
    "churchome.org",
    "shorelinecity.church",
    "baysideonline.com",
  ]
  const knownOrganizations = [
    ...Array.from(new Set(JOBS.map((job) => job.company))),
    "Harbor City Church",
  ]
  const organizationIndex = knownOrganizations.indexOf(name)
  const domain = churchDomains[
      (organizationIndex >= 0 ? organizationIndex : signature) % churchDomains.length
    ]
  const palette = [
    "text-brand-red",
    "text-sky-700",
    "text-emerald-700",
    "text-amber-700",
    "text-indigo-700",
    "text-purple-700",
  ][signature % 6]
  const initials = name
    .split(" ")
    .filter((word) => !["of", "the", "and"].includes(word.toLowerCase()))
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase()

  return failed ? (
    <svg
      viewBox="0 0 48 48"
      className={`${className} shrink-0 ${palette}`}
      role="img"
      aria-label={`${name} logo fallback`}
    >
      <text
        x="24"
        y="29"
        textAnchor="middle"
        className="fill-current"
        fontFamily="Inter, sans-serif"
        fontSize="12"
        fontWeight="800"
        letterSpacing="0.5"
      >
        {initials}
      </text>
    </svg>
  ) : (
    <img
      src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`}
      alt={`${name} church logo`}
      className={`${className} shrink-0 object-contain`}
      onError={() => setFailed(true)}
    />
  )
}

export default OrganizationLogo

