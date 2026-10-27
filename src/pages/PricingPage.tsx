import { PageBanner } from "../components/common/PageBanner"
import { icon } from "../components/common/Icon"

export function PricingPage() {
  const plans = [
    {
      title: "Standard Listing",
      price: "[Set price]",
      duration: "[Set duration]",
      description: "[Add approved standard package description]",
      features: [
        "[Set listing duration]",
        "[Set included application tools]",
        "[Set support level]",
      ],
    },
    {
      title: "Featured Listing",
      price: "[Set price]",
      duration: "[Set duration]",
      description: "[Add approved featured package description]",
      features: [
        "[Set featured placement details]",
        "[Set listing duration]",
        "[Set included employer tools]",
      ],
    },
    {
      title: "Organization Package",
      price: "[Contact / set price]",
      duration: "[Set terms]",
      description: "[Add approved multi-listing package description]",
      features: [
        "[Set listing allowance]",
        "[Set team access details]",
        "[Set support level]",
      ],
    },
  ]
  return (
    <>
      <PageBanner title="Pricing" />
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
              Candidate access
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight text-brand-dark">
              Job seekers use Red Letter Jobs free
            </h1>
            <p className="mt-4 text-base leading-7 text-gray-600">
              Candidates can browse, save, and apply to ministry opportunities
              without a subscription or application fee.
            </p>
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {plans.map((plan) => (
              <article
                key={plan.title}
                className="rounded border border-dashed border-gray-300 bg-slate-50 p-6"
              >
                <span className="rounded bg-amber-100 px-2 py-1 text-[10px] font-extrabold uppercase tracking-wider text-amber-900">
                  Editable placeholder
                </span>
                <h2 className="mt-4 text-xl font-black uppercase tracking-tight text-brand-dark">
                  {plan.title}
                </h2>
                <p className="mt-4 text-3xl font-black text-brand-red">
                  {plan.price}
                </p>
                <p className="mt-1 text-xs font-bold uppercase text-gray-500">
                  {plan.duration}
                </p>
                <p className="mt-4 text-sm text-gray-600">{plan.description}</p>
                <ul className="mt-5 space-y-3 border-t border-gray-200 pt-5 text-sm text-gray-600">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      {icon("fa-pen", "mt-1 text-brand-red")}
                      {feature}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
          <p className="mx-auto mt-8 max-w-3xl rounded border border-amber-200 bg-amber-50 p-4 text-center text-xs leading-5 text-amber-950">
            Employer prices, package details, and payment terms are placeholders
            pending commercial approval. No payment processing is connected.
          </p>
        </div>
      </section>
    </>
  )
}

export default PricingPage

