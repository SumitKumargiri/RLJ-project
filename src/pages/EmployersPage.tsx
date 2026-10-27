import { useContext } from "react"
import { ApplicationContext } from "../context/ApplicationContext"
import { icon } from "../components/common/Icon"

export function EmployersPage() {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const benefits = [
    {
      icon: "fa-user-check",
      title: "Faith-centered talent pool",
      description:
        "Reach pastors and ministry professionals looking for their next opportunity to serve.",
    },
    {
      icon: "fa-pen-to-square",
      title: "Easy job-posting tools",
      description:
        "Build a complete listing with your mission, theology, salary range, expectations, and application process.",
    },
    {
      icon: "fa-filter",
      title: "Targeted ministry discovery",
      description:
        "Help candidates find your opening by role, denomination, job type, and location.",
    },
    {
      icon: "fa-list-check",
      title: "Organized candidate review",
      description:
        "Keep applications and candidate details together so your hiring team can evaluate the right fit.",
    },
  ]
  const steps = [
    {
      number: "01",
      title: "Create your church profile",
      description:
        "Share your mission, values, denomination, location, and what makes your ministry unique.",
    },
    {
      number: "02",
      title: "Post a ministry role",
      description:
        "Describe the position, responsibilities, salary range, qualifications, and ministry expectations.",
    },
    {
      number: "03",
      title: "Review potential candidates",
      description:
        "Compare applications and ministry experience from people interested in your role.",
    },
    {
      number: "04",
      title: "Connect and hire",
      description:
        "Begin conversations, schedule interviews, and invite the right leader to join your ministry.",
    },
  ]
  const audiences = [
    ["fa-church", "Churches", "From local congregations to multisite churches."],
    [
      "fa-cross",
      "Christian organizations",
      "Parachurch ministries, missions agencies, and ministry networks.",
    ],
    [
      "fa-people-group",
      "Leadership teams",
      "Pastors, elders, boards, and search committees building healthy teams.",
    ],
    [
      "fa-hand-holding-heart",
      "Faith-based nonprofits",
      "Christian charities and service organizations hiring mission-aligned staff.",
    ],
  ]
  const plans = [
    {
      name: "Standard Listing",
      price: "[Set price]",
      term: "[Set duration]",
      description: "[Add approved standard package description]",
      features: [
        "[Set listing duration]",
        "[Set application tools]",
        "[Set support level]",
        "[Set visibility details]",
      ],
      featured: false,
    },
    {
      name: "Featured Listing",
      price: "[Set price]",
      term: "[Set duration]",
      description: "[Add approved featured package description]",
      features: [
        "[Set featured placement]",
        "[Set listing duration]",
        "[Set employer tools]",
        "[Set support level]",
      ],
      featured: true,
    },
    {
      name: "Organization Package",
      price: "[Set price]",
      term: "[Set terms]",
      description: "[Add approved organization package description]",
      features: [
        "[Set listing allowance]",
        "[Set team access]",
        "[Set branding options]",
        "[Set support level]",
      ],
      featured: false,
    },
  ]

  return (
    <>
      <section className="bg-brand-charcoal px-6 py-16 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-red-300">
              Ministry hiring, made clearer
            </p>
            <h1 className="max-w-3xl text-4xl font-black uppercase leading-tight tracking-tight sm:text-5xl">
              Find leaders who share your calling
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-gray-300">
              Connect with pastors and ministry professionals aligned with your
              mission, values, and vision for kingdom work.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#/post-a-job"
                className="inline-flex items-center justify-center gap-2 rounded bg-brand-red px-6 py-3.5 text-sm font-extrabold uppercase tracking-wider transition hover:bg-brand-red-hover"
              >
                <span className="text-white">Post a Job</span>
                {icon("fa-arrow-right", "text-white")}
              </a>
              <a
                href="#/employer/sign-up"
                className="inline-flex items-center justify-center rounded border border-gray-500 px-6 py-3.5 text-sm font-bold uppercase tracking-wider transition hover:border-white"
              >
                <span className="text-white">Create Church Account</span>
              </a>
            </div>
          </div>
          <div className="rounded border border-gray-700 bg-gray-900 p-6 shadow-2xl lg:col-span-5">
            <p className="text-xs font-bold uppercase tracking-wider text-red-300">
              Built for ministry search teams
            </p>
            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded bg-gray-800 p-4">
                <strong className="block text-3xl font-black text-white">
                  {allJobs.length}
                </strong>
                <span className="mt-1 block text-xs text-gray-400">
                  Sample ministry opportunities
                </span>
              </div>
              <div className="rounded bg-gray-800 p-4">
                <strong className="block text-3xl font-black text-white">
                  31
                </strong>
                <span className="mt-1 block text-xs text-gray-400">
                  Sample denominational traditions
                </span>
              </div>
            </div>
            <div className="mt-4 rounded border border-gray-700 p-4">
              <p className="text-sm font-bold text-white">
                Purpose-built ministry search
              </p>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                Reach candidates through role, denomination, location, and job
                type discovery tools.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Who it’s for
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Serving ministries of every size
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-gray-600">
              Red Letter Jobs supports Christian employers searching for
              faithful, capable people to strengthen their teams.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {audiences.map(([iconName, title, description]) => (
              <article
                key={title}
                className="rounded border border-gray-200 bg-white p-5 text-center shadow-sm"
              >
                <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-brand-red">
                  {icon(iconName)}
                </span>
                <h3 className="mt-4 text-sm font-extrabold uppercase text-brand-dark">
                  {title}
                </h3>
                <p className="mt-2 text-xs leading-5 text-gray-600">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Why Red Letter Jobs
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              A better place to find ministry talent
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="rounded border border-gray-200 bg-slate-50 p-6"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded bg-red-50 text-lg text-brand-red">
                  {icon(benefit.icon)}
                </span>
                <h3 className="mt-5 text-lg font-extrabold text-brand-dark">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-200 bg-slate-50 px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Simple from start to finish
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              How ministry hiring works
            </h2>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step) => (
              <div key={step.number} className="relative">
                <span className="text-5xl font-black text-gray-200">
                  {step.number}
                </span>
                <h3 className="mt-2 text-lg font-extrabold text-brand-dark">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-600">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-red">
              Employer package preview
            </p>
            <h2 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Post on your terms
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Package names, prices, terms, and included features remain
              editable placeholders pending commercial approval.
            </p>
          </div>
          <div className="mt-9 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative rounded border p-6 ${
                  plan.featured
                    ? "border-brand-red shadow-lg"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {plan.featured && (
                  <span className="absolute right-4 top-4 rounded bg-red-50 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-brand-red">
                    Most popular
                  </span>
                )}
                <h3 className="text-lg font-extrabold uppercase tracking-tight text-brand-dark">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                <div className="mt-5">
                  <strong className="text-4xl font-black text-brand-dark">
                    {plan.price}
                  </strong>
                  <span className="ml-2 text-xs font-semibold text-gray-500">
                    / {plan.term}
                  </span>
                </div>
                <ul className="mt-6 space-y-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      {icon("fa-check", "mt-1 text-brand-red")}
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="#/post-a-job"
                  className={`mt-6 flex items-center justify-center rounded px-5 py-3 text-xs font-extrabold uppercase tracking-wider transition ${
                    plan.featured
                      ? "bg-brand-red hover:bg-brand-red-hover"
                      : "border border-gray-300 hover:border-brand-red"
                  }`}
                >
                  <span
                    className={
                      plan.featured ? "text-white" : "text-brand-dark"
                    }
                  >
                    Review Posting Options
                  </span>
                </a>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 rounded bg-brand-red p-8 text-center shadow-lg md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight text-white">
              Ready to meet your next ministry leader?
            </h2>
            <p className="mt-2 text-sm text-red-100">
              Create an employer account and publish your opportunity today.
            </p>
          </div>
          <a
            href="#/post-a-job"
            className="inline-flex shrink-0 items-center gap-2 rounded bg-white px-6 py-3 text-sm font-extrabold uppercase tracking-wider shadow-sm transition hover:bg-gray-100"
          >
            <span className="text-brand-red">Get Started</span>
            {icon("fa-arrow-right", "text-brand-red")}
          </a>
        </div>
      </section>
    </>
  )
}

export default EmployersPage

