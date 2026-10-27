import { useEffect, useRef } from "react"
import * as L from "leaflet"
import { Job } from "../../types/job.types"
import { LOCATION_COORDINATES } from "../../constants/location.constants"
import { formatLocation } from "../../utils/formatters"

export function JobLocationMap({
  job,
  organizationMode = false,
}: {
  job: Job
  organizationMode?: boolean
}) {
  const mapElement = useRef<HTMLDivElement>(null)
  const coordinates = LOCATION_COORDINATES[`${job.city}, ${job.state}`]

  useEffect(() => {
    if (!mapElement.current || !coordinates) return

    const map = L.map(mapElement.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView(coordinates, 10)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 18,
    }).addTo(map)

    L.marker(coordinates, {
      icon: L.divIcon({
        className: "",
        html: '<span class="job-map-marker"><i class="fa-solid fa-church"></i></span>',
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      }),
      title: organizationMode
        ? `${job.company} in ${formatLocation(job)}`
        : `${job.title} in ${formatLocation(job)}`,
    })
      .addTo(map)
      .bindPopup(
        organizationMode
          ? `<strong>${job.company}</strong><br>${formatLocation(job)}`
          : `<strong>${job.title}</strong><br>${job.company}<br>${formatLocation(job)}`,
      )
      .openPopup()

    window.setTimeout(() => map.invalidateSize(), 0)
    return () => {
      map.remove()
    }
  }, [coordinates, job, organizationMode])

  if (!coordinates) return null

  return (
    <div
      ref={mapElement}
      className="mt-3 h-48 w-full overflow-hidden rounded border border-gray-200"
      aria-label={
        organizationMode
          ? `Map showing ${job.company} in ${formatLocation(job)}`
          : `Map showing ${formatLocation(job)}`
      }
    />
  )
}

export default JobLocationMap

