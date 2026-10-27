import { PageBanner } from "../components/common/PageBanner"
import { CATEGORIES } from "../constants/categories.constants"
import { DENOMINATIONS } from "../constants/ministry.constants"
import { icon } from "../components/common/Icon"

export function GridPage({ kind }: { kind: "categories" | "denominations" }) {
  const categories = kind === "categories"
  return (
    <>
      <PageBanner title={categories ? "Job Categories" : "Denominations"} />
      <div className="mx-auto max-w-7xl px-6 py-8">
        <div
          className={
            categories
              ? "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4"
              : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          }
        >
          {(categories ? CATEGORIES : DENOMINATIONS).map((item) => (
            <a
              key={item.slug}
              href={
                categories
                  ? `#/jobs/${item.slug}`
                  : `#/denomination/${item.slug}`
              }
              className={`group rounded border border-gray-200 bg-white shadow-sm transition hover:border-brand-red ${
                categories
                  ? "flex min-h-32 flex-col justify-between p-4"
                  : "flex h-20 items-center gap-3 p-3"
              }`}
            >
              {categories ? (
                <>
                  <span className="mb-3 flex h-12 w-12 items-center justify-center self-center rounded-full bg-blue-50 text-blue-600 transition group-hover:bg-brand-red group-hover:text-white">
                    {icon("icon" in item ? item.icon : "fa-church")}
                  </span>
                  <div className="text-center">
                    <h2 className="text-xs font-bold uppercase text-gray-800 group-hover:text-brand-red">
                      {item.name}
                    </h2>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      ({item.count} Open Vacancies)
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded border border-gray-100 bg-white p-1">
                    {"logo" in item && item.logo ? (
                      <img
                        src={item.logo}
                        alt={`${item.name} logo`}
                        className="h-full w-full object-contain"
                        loading="lazy"
                      />
                    ) : (
                      icon("fa-church", "text-xl text-gray-400")
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-bold leading-4 text-gray-800 group-hover:text-brand-red">
                      {item.name}
                    </span>
                    <span className="mt-1 block text-[11px] text-gray-400">
                      {item.count} open vacancies
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-gray-400 group-hover:text-brand-red">
                    {icon("fa-arrow-right")}
                  </span>
                </>
              )}
            </a>
          ))}
        </div>
      </div>
    </>
  )
}

export default GridPage

