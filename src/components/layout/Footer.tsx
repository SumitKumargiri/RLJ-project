import redLetterJobsLogo from "../../assets/red-letter-jobs-logo.png"
import { icon } from "../common/Icon"

export function Footer() {
  return (
    <footer className="border-t-4 border-brand-red bg-brand-charcoal text-gray-300">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-12">
          <div className="sm:col-span-2 lg:col-span-4">
            <a
              href="#/"
              className="inline-flex rounded bg-white p-2 shadow-sm"
              aria-label="Red Letter Jobs home"
            >
              <img
                src={redLetterJobsLogo}
                alt="Red Letter Jobs — Find your calling"
                className="h-10 w-56"
              />
            </a>
            <p className="mt-4 max-w-sm text-sm leading-6 font-inter text-gray-400">
              Connecting churches, Christian organizations, and ministry
              professionals with opportunities to serve.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="#/jobs-listing"
                className="rounded bg-brand-red px-4 py-2.5 text-xs font-extrabold font-poppins uppercase tracking-wider text-white transition hover:bg-brand-red-hover !no-underline"
              >
                Find Jobs
              </a>
              <a
                href="#/post-a-job"
                className="rounded border border-gray-600 px-4 py-2.5 text-xs font-extrabold font-poppins uppercase tracking-wider text-white transition hover:border-white !no-underline"
              >
                Post a Job
              </a>
            </div>
            <a
              href="https://x.com/RedLetterJobs"
              target="_blank"
              rel="noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-gray-400 transition hover:text-white"
              aria-label="Follow Red Letter Jobs on X"
            >
              <i
                className="fa-brands fa-x-twitter text-base"
                aria-hidden="true"
              />
              @RedLetterJobs
            </a>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold  font-poppins uppercase tracking-widest text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["Find Jobs", "/jobs-listing"],
                ["Pulpit Supply", "/pulpit-supply"],
                ["Job Categories", "/categories"],
                ["Locations", "/locations"],
                ["Denominations", "/denominations"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition font-inter hover:text-white !no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase font-poppins tracking-widest text-white">
              Candidates
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["Candidate Sign In", "/candidate/sign-in"],
                ["Create Free Account", "/candidate/sign-up"],
                ["Candidate Dashboard", "/candidate/dashboard"],
                ["Resources", "/resources"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition font-inter hover:text-white !no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase font-poppins tracking-widest text-white">
              Employers
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["For Employers", "/for-employers"],
                ["Post a Job", "/post-a-job"],
                ["Employer Sign In", "/employer/sign-in"],
                ["Pricing", "/pricing"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition font-inter hover:text-white !no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h3 className="text-xs font-extrabold uppercase font-poppins tracking-widest text-white">
              Company
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-gray-400">
              {[
                ["About", "/about-us"],
                ["FAQs", "/faqs"],
                ["Contact", "/contact"],
                ["Privacy Policy", "/privacy-policy"],
                ["Terms of Use", "/terms-of-use"],
              ].map(([item, href]) => (
                <li key={href}>
                  <a href={`#${href}`} className="transition font-inter hover:text-white !no-underline">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-y border-gray-700 py-4 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between font-inter">
          <p>
            {icon("fa-shield-halved", "mr-2 font-inter text-red-300")}
            Purpose-built for ministry hiring and short-term service connections.
          </p>
          <a
            href="#/contact"
            className="font-bold text-white transition font-inter hover:text-red-200 !no-underline"
          >
            Need help? Contact support
          </a>
        </div>

        <div className="flex flex-col items-center font-inter justify-between gap-3 py-5 text-xs text-gray-500 sm:flex-row">
          <span>© 2026 Red Letter Jobs. All rights reserved.</span>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a className="transition font-inter hover:text-white" href="#/terms-of-use">
              Terms
            </a>
            <a className="transition font-inter hover:text-white" href="#/privacy-policy">
              Privacy
            </a>
            <a className="transition font-inter hover:text-white" href="#/contact">
              Support
            </a>
            <a className="transition font-inter hover:text-white" href="#/faqs">
              FAQs
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer

