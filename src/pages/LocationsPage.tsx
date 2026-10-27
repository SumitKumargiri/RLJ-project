import { PageBanner } from "../components/common/PageBanner"
import { US_STATES, CANADA_PROVINCES } from "../constants/location.constants"
import { icon } from "../components/common/Icon"

export function LocationGroup({
  title,
  count,
  iconName,
  items,
}: {
  title: string
  count: string
  iconName: string
  items: string[]
}) {
  return (
    <section>
      <div className="mb-4 flex items-center justify-between border-b border-gray-300 pb-2">
        <h2 className="text-base font-black uppercase tracking-tight text-gray-900">
          {icon(iconName, "mr-2 text-brand-red")}
          {title}
        </h2>
        <span className="hidden text-xs font-bold text-gray-500 sm:block">
          {count}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        {items.map((item) => (
          <a
            key={item}
            href={`#/location/${item.replaceAll(" ", "-")}`}
            className="flex items-center justify-between rounded border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-brand-red hover:text-brand-red"
          >
            <span>{item}</span>
            <span className="text-[10px] text-gray-400">View</span>
          </a>
        ))}
      </div>
    </section>
  )
}

export function LocationsPage() {
  return (
    <>
      <PageBanner title="Job Locations" />
      <div className="mx-auto max-w-7xl space-y-10 px-6 py-8">
        <LocationGroup
          title="United States (50 States)"
          count="50 States Available"
          iconName="fa-flag-usa"
          items={US_STATES}
        />
        <LocationGroup
          title="Canada (10 Provinces & 3 Territories)"
          count="13 Jurisdictions"
          iconName="fa-leaf"
          items={CANADA_PROVINCES}
        />
        <div className="rounded border border-gray-300 bg-gray-100 p-6 sm:flex sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-black uppercase text-gray-900">
              International Ministries & Missions
            </h2>
            <p className="mt-1 text-xs text-gray-600">
              Looking for non-US and non-Canada opportunities? View all
              international kingdom openings.
            </p>
          </div>
          <a
            href="#/jobs-listing?location=United%20Kingdom"
            className="mt-4 inline-block rounded bg-brand-charcoal px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white sm:mt-0"
          >
            View International Listings
          </a>
        </div>
      </div>
    </>
  )
}

export default LocationsPage

