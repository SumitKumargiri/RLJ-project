import { useEffect, useMemo, useRef, useState } from "react"
import * as L from "leaflet"
import { Job } from "../../types/job.types"
import { LOCATION_COORDINATES } from "../../constants/location.constants"
import { icon } from "../common/Icon"

export function MapModal({ close, jobs }: { close: () => void; jobs: Job[] }) {
  const mapElement = useRef<HTMLDivElement>(null)
  const locationGroups = useMemo(() => {
    const groups = new Map<string, { jobs: Job[]; coordinates: [number, number] }>()
    jobs.forEach((job) => {
      const key = `${job.city}, ${job.state}`
      const coordinates = LOCATION_COORDINATES[key]
      if (!coordinates) return
      const group = groups.get(key)
      if (group) group.jobs.push(job)
      else groups.set(key, { jobs: [job], coordinates })
    })
    return Array.from(groups, ([key, value]) => ({ key, ...value }))
  }, [jobs])
  const [selectedLocation, setSelectedLocation] = useState(
    locationGroups[0]?.key || "",
  )
  const selectedGroup =
    locationGroups.find((group) => group.key === selectedLocation) ||
    locationGroups[0]

  useEffect(() => {
    if (!mapElement.current) return

    const map = L.map(mapElement.current, {
      scrollWheelZoom: true,
      zoomControl: true,
    }).setView([39.5, -98.35], 4)

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map)

    const bounds: L.LatLngExpression[] = []
    locationGroups.forEach((group) => {
      bounds.push(group.coordinates)
      const marker = L.marker(group.coordinates, {
        icon: L.divIcon({
          className: "",
          html: `<span class="job-map-marker">${group.jobs.length}</span>`,
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        }),
        title: `${group.jobs.length} jobs in ${group.key}`,
      }).addTo(map)
      marker.bindTooltip(
        `<strong>${group.key}</strong><br>${group.jobs.length} ${
          group.jobs.length === 1 ? "ministry job" : "ministry jobs"
        }`,
        { direction: "top", offset: [0, -14] },
      )
      marker.on("click", () => setSelectedLocation(group.key))
    })

    if (bounds.length) {
      map.fitBounds(L.latLngBounds(bounds), {
        padding: [35, 35],
        maxZoom: 6,
      })
    }

    window.setTimeout(() => map.invalidateSize(), 0)
    return () => {
      map.remove()
    }
  }, [locationGroups])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={close}
    >
      <div
        className="map-popup w-full max-w-6xl rounded bg-white p-4 shadow-2xl"
        onMouseDown={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Map of ministry positions"
      >
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <div>
            <h2 className="text-sm font-black uppercase text-gray-800">
              {icon("fa-map-location-dot", "mr-2 text-brand-red")}Ministry Jobs
              Map
            </h2>
            <p className="mt-1 text-xs text-gray-500">
              {jobs.length} jobs across {locationGroups.length} locations
            </p>
          </div>
          <button
            onClick={close}
            className="text-xl font-bold text-gray-400 hover:text-gray-800"
            aria-label="Close map"
          >
            ×
          </button>
        </div>
        <div className="mt-4 grid overflow-hidden rounded border border-gray-300 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div ref={mapElement} className="h-[28rem] min-h-80 w-full" />
          <aside className="max-h-[28rem] overflow-y-auto border-t border-gray-200 bg-gray-50 p-4 lg:border-l lg:border-t-0">
            {selectedGroup ? (
              <>
                <p className="text-[10px] font-bold uppercase tracking-wider text-brand-red">
                  Selected location
                </p>
                <h3 className="mt-1 text-lg font-black text-brand-dark">
                  {selectedGroup.key}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  {selectedGroup.jobs.length}{" "}
                  {selectedGroup.jobs.length === 1 ? "opening" : "openings"}
                </p>
                <div className="mt-4 divide-y divide-gray-200 border-y border-gray-200">
                  {selectedGroup.jobs.slice(0, 8).map((job) => (
                    <a
                      key={job.id}
                      href={`#/job/${job.id}`}
                      onClick={close}
                      className="group block py-3"
                    >
                      <span className="block text-sm font-bold text-brand-dark group-hover:text-brand-red">
                        {job.title}
                      </span>
                      <span className="mt-1 block text-xs text-gray-500">
                        {job.company}
                      </span>
                    </a>
                  ))}
                </div>
                {selectedGroup.jobs.length > 8 && (
                  <p className="mt-3 text-xs font-semibold text-gray-500">
                    +{selectedGroup.jobs.length - 8} more jobs at this location
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-gray-500">
                No mapped jobs match the current filters.
              </p>
            )}
          </aside>
        </div>
      </div>
    </div>
  )
}

export default MapModal

