import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"

export function PostJobPage() {
  return (
    <>
      <PageBanner title="Post a Job" />
      <section className="bg-white px-6 py-12">
        <div className="mx-auto grid max-w-7xl items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Reach ministry-minded candidates
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Start your ministry search with clarity
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">
              Create an employer workspace, add your organization profile, and
              build a complete position listing for candidates to review.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                ["01", "Organization", "Share your mission and ministry context."],
                ["02", "Position", "Add responsibilities, qualifications, and pay."],
                ["03", "Review", "Confirm details before the sample publishing step."],
              ].map(([number, title, description]) => (
                <article
                  key={number}
                  className="rounded border border-gray-200 bg-slate-50 p-5"
                >
                  <span className="text-3xl font-black text-gray-200">{number}</span>
                  <h2 className="mt-2 text-sm font-extrabold uppercase text-brand-dark">
                    {title}
                  </h2>
                  <p className="mt-2 text-xs leading-5 text-gray-600">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>
          <aside className="rounded border border-gray-200 bg-brand-charcoal p-6 text-white shadow-xl lg:col-span-5">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Employer entry
            </p>
            <h2 className="mt-2 text-2xl font-black uppercase tracking-tight">
              Prepare your listing
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {[
                "Organization overview and denomination",
                "Role responsibilities and qualifications",
                "Location, workplace type, and compensation",
                "Application deadline and instructions",
              ].map((item) => (
                <li key={item} className="flex gap-3">
                  {icon("fa-check", "mt-1 text-red-300")}
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="#/employer/sign-up"
              className="mt-6 flex items-center justify-center rounded bg-brand-red px-5 py-3 text-sm font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
            >
              Create Employer Account
            </a>
            <p className="mt-3 text-center text-xs leading-5 text-gray-400">
              Staging only. Publishing and payment processing are not connected.
            </p>
          </aside>
        </div>
      </section>
    </>
  )
}

export default PostJobPage

