import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"
import { RESOURCES } from "../data/resources.data"

export function ResourcesPage() {
  return (
    <>
      <PageBanner title="Resources" />
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Practical ministry guidance
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Resources for thoughtful next steps
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Explore sample guides for candidates, churches, and Christian
              organizations navigating ministry employment.
            </p>
          </div>
          <div className="mt-9 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {RESOURCES.map((resource) => (
              <article
                key={resource.slug}
                className="group flex flex-col rounded border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-brand-red hover:shadow-md"
              >
                <span className="text-xs font-extrabold uppercase tracking-wider text-brand-red">
                  {resource.category}
                </span>
                <h2 className="mt-3 text-xl font-black tracking-tight text-brand-dark">
                  {resource.title}
                </h2>
                <p className="mt-3 flex-grow text-sm leading-6 text-gray-600">
                  {resource.summary}
                </p>
                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4">
                  <span className="text-xs text-gray-500">{resource.readTime}</span>
                  <a
                    href={`#/resources/${resource.slug}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
                  >
                    Read article {icon("fa-arrow-right", "ml-1")}
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export default ResourcesPage

