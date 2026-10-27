import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"
import { RESOURCES } from "../data/resources.data"
import { GenericPage } from "./GenericPage"

export function ResourceArticlePage({ hash }: { hash: string }) {
  const resource = RESOURCES.find((item) => hash.endsWith(item.slug))
  if (!resource) return <GenericPage path={hash} />
  return (
    <>
      <PageBanner title={resource.category} />
      <article className="mx-auto max-w-3xl px-6 py-12">
        <a
          href="#/resources"
          className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
        >
          {icon("fa-arrow-left", "mr-2")}All resources
        </a>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-brand-dark">
          {resource.title}
        </h1>
        <p className="mt-4 text-lg leading-8 text-gray-600">{resource.summary}</p>
        <p className="mt-4 text-xs font-bold uppercase tracking-wider text-gray-400">
          Sample editorial resource · {resource.readTime}
        </p>
        <div className="mt-10 space-y-9 border-t border-gray-200 pt-8">
          {resource.sections.map(([heading, body]) => (
            <section key={heading}>
              <h2 className="text-xl font-black uppercase tracking-tight text-brand-dark">
                {heading}
              </h2>
              <p className="mt-3 text-base leading-8 text-gray-600">{body}</p>
            </section>
          ))}
        </div>
        <div className="mt-10 rounded bg-brand-charcoal p-6 text-white">
          <h2 className="text-xl font-black uppercase tracking-tight">
            Explore your next opportunity
          </h2>
          <p className="mt-2 text-sm text-gray-300">
            Browse sample ministry roles by calling, location, and tradition.
          </p>
          <a
            href="#/jobs-listing"
            className="mt-5 inline-flex rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white"
          >
            Browse Jobs
          </a>
        </div>
      </article>
    </>
  )
}

export default ResourceArticlePage

