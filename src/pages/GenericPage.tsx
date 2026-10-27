import { PageBanner } from "../components/common/PageBanner"
import { INFO_PAGES } from "../data/infoPages.data"

export function GenericPage({ path }: { path: string }) {
  const infoPage = INFO_PAGES[path]
  if (infoPage) {
    return (
      <>
        <PageBanner title={infoPage.title} />
        <div className="mx-auto max-w-4xl px-6 py-12">
          <div className="border-b border-gray-200 pb-8">
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              {infoPage.eyebrow}
            </p>
            {infoPage.legalReview && (
              <p className="mb-4 inline-flex rounded bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950">
                Draft placeholder — legal review required
              </p>
            )}
            <p className="max-w-3xl text-base leading-7 text-gray-600">
              {infoPage.introduction}
            </p>
          </div>
          <div className="divide-y divide-gray-200">
            {infoPage.sections.map((section) => (
              <section key={section.heading} className="py-7">
                <h2 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
                  {section.heading}
                </h2>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {section.body}
                </p>
              </section>
            ))}
          </div>
          <div className="rounded border border-gray-200 bg-white p-5 text-sm text-gray-600">
            Have a question about this page?{" "}
            <a href="#/contact" className="font-bold text-brand-red underline">
              Contact our team
            </a>
            .
          </div>
        </div>
      </>
    )
  }

  const title =
    path.replace("/", "").replaceAll("-", " ").toUpperCase() || "PAGE"
  return (
    <div className="mx-auto max-w-4xl px-6 py-16 text-center">
      <h1 className="mb-4 text-3xl font-black uppercase text-brand-dark">
        {title}
      </h1>
      <p className="mx-auto max-w-xl text-xs leading-relaxed text-gray-500">
        We couldn’t find the page you requested. It may have moved, or the link
        may no longer be available.
      </p>
      <a
        href="#/"
        className="mt-6 inline-block rounded bg-brand-red px-6 py-2.5 text-xs font-bold uppercase text-white"
      >
        Return to Home
      </a>
    </div>
  )
}

export default GenericPage

