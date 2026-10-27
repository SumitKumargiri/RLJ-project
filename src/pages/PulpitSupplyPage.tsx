import { useState } from "react";
import { SupplyState } from "../types/employee.types";
import {
  PREACHING_SUPPLY_TYPES,
  WORSHIP_SUPPLY_TYPES,
} from "../constants/supply.constants";
import { icon } from "../components/common/Icon";
import { AdminPageHeader } from "../components/admin/AdminComponents";
import { CandidateEmpty } from "../components/common/CandidateEmpty";
import { SupplyCandidateCard } from "../components/supply/SupplyCandidateCard";

export function PulpitSupplyPage({
  supplyState,
}: {
  supplyState: SupplyState;
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const visibleCandidates = supplyState.candidates.filter(
    (candidate) =>
      candidate.profileVisible &&
      (!query ||
        `${candidate.name} ${candidate.roles.join(" ")} ${candidate.biography}`
          .toLowerCase()
          .includes(query.toLowerCase())) &&
      (!location ||
        `${candidate.city} ${candidate.state}`
          .toLowerCase()
          .includes(location.toLowerCase())) &&
      (!category || candidate.category === category),
  );
  const faqs = [
    [
      "Is Pulpit Supply the same as applying for a permanent job?",
      "No. Supply profiles support temporary services and short-term ministry assignments while candidates may continue regular job searches.",
    ],
    [
      "Are theological questions required?",
      "No. Every theological field is optional, and candidates control whether responses are visible.",
    ],
    [
      "Does Red Letter Jobs process honorariums?",
      "Not in this staging prototype. Churches and candidates can discuss sample terms, but payment processing is not connected.",
    ],
  ];
  return (
    <>
      <section className="bg-brand-charcoal px-6 py-14 text-white">
        <div className="mx-auto max-w-7xl text-center">
          <p className="text-xs font-extrabold font-sans uppercase tracking-[0.22em] text-red-300">
            Pulpit Supply & Worship Supply
          </p>
          <h1 className="mx-auto mt-3 max-w-4xl text-4xl font-black font-sans uppercase tracking-tight sm:text-5xl">
            Find the Right Ministry Leader for Every Service.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-inter leading-7 text-gray-300">
            Connect with available preachers, worship leaders, and musicians
            when your church needs them.
          </p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <a
              href="#/pulpit-supply"
              className="rounded bg-brand-red px-6 py-3 text-sm font-bold font-inter uppercase tracking-wider text-white"
            >
              Find Pulpit Supply
            </a>
            <a
              href="#/candidate/pulpit-supply"
              className="rounded border border-gray-500 px-6 py-3 text-sm font-bold font-inter uppercase tracking-wider text-white hover:border-white"
            >
              Offer Pulpit Supply
            </a>
          </div>
        </div>
      </section>
      <section
        id="search"
        className="border-b border-gray-200 bg-white px-6 py-8"
      >
        <div className="mx-auto grid max-w-5xl gap-3 rounded border border-gray-200 bg-slate-50 p-4 shadow-sm md:grid-cols-4">
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Role, name, or ministry"
            aria-label="Search supply candidates"
            className="rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red md:col-span-2"
          />
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="City or state"
            aria-label="Supply candidate location"
            className="rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red"
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            aria-label="Supply category"
            className="rounded border border-gray-300 p-3 text-sm font-inter"
          >
            <option value="">All supply roles</option>
            <option>Preaching</option>
            <option>Worship</option>
          </select>
        </div>
      </section>
      <section className="px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
          {[
            [
              "Preaching & Ministry Supply",
              "fa-person-chalkboard",
              PREACHING_SUPPLY_TYPES,
            ],
            ["Worship & Music Supply", "fa-music", WORSHIP_SUPPLY_TYPES],
          ].map(([title, iconName, items]) => (
            <article
              key={String(title)}
              className="rounded border border-gray-200 bg-white p-6 shadow-sm"
            >
              <span className="flex h-12 w-12 items-center justify-center rounded bg-red-50 text-xl text-brand-red">
                {icon(String(iconName))}
              </span>
              <h2 className="mt-4 text-2xl font-black font-sans uppercase tracking-tight text-brand-dark">
                {String(title)}
              </h2>
              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {(items as string[]).map((item) => (
                  <p key={item} className="flex gap-2 text-sm text-gray-600 font-inter">
                    {icon("fa-check", "mt-1 text-brand-red")}
                    <span>{item}</span>
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="border-y border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <AdminPageHeader
            title="Featured Available Candidates"
            description="Fictional demo professionals currently visible in Pulpit Supply search."
          />
          {visibleCandidates.length ? (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleCandidates.slice(0, 6).map((candidate) => (
                <SupplyCandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  actionHref={`#/pulpit-supply/candidate/${candidate.id}`}
                />
              ))}
            </div>
          ) : (
            <CandidateEmpty
              title="No matching supply candidates"
              description="Adjust the role or location search to see more available professionals."
              action="Clear Search"
              onAction={() => {
                setQuery("");
                setLocation("");
                setCategory("");
              }}
            />
          )}
        </div>
      </section>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="text-center">
            <p className="text-xs font-extrabold font-sans uppercase tracking-[0.2em] text-brand-red">
              Simple coordination
            </p>
            <h2 className="mt-2 text-3xl font-black font-sans uppercase text-brand-dark">
              How It Works
            </h2>
          </div>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              [
                "01",
                "Create a Supply Profile",
                "Ministry professionals share optional experience, beliefs, availability, and samples.",
              ],
              [
                "02",
                "Search and Invite",
                "Churches search visible profiles and send a private service request.",
              ],
              [
                "03",
                "Confirm and Serve",
                "Candidates respond, coordinate details, and track the engagement.",
              ],
            ].map(([number, title, text]) => (
              <article
                key={number}
                className="rounded border border-gray-200 bg-slate-50 p-6"
              >
                <span className="text-4xl font-black text-gray-200">
                  {number}
                </span>
                <h3 className="mt-3 font-black text-brand-dark font-sans">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-600 font-inter">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="border-y border-gray-200 bg-slate-50 px-6 py-12">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          <article className="rounded bg-brand-charcoal p-7 text-white">
            <h2 className="text-2xl font-black font-sans uppercase">
              Benefits for Churches
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-300">
              {[
                "Search by role, location, availability, and shared ministry background",
                "Review sermon and music samples privately",
                "Coordinate invitations, bookings, calendars, and messages",
                "Keep private contact information protected",
              ].map((item) => (
                <li key={item} className="font-inter">
                  {icon("fa-check", "mr-2 text-red-300")}
                  {item}
                </li>
              ))}
            </ul>
          </article>
          <article className="rounded border border-gray-200 bg-white p-7">
            <h2 className="text-2xl font-black font-sans uppercase text-brand-dark">
              Benefits for Ministry Professionals
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-gray-600">
              {[
                "Serve churches without leaving regular employment search",
                "Control theological, availability, contact, and honorarium visibility",
                "Share preaching or worship portfolios",
                "Accept, decline, and track invitations",
              ].map((item) => (
                <li key={item} className="font-inter">
                  {icon("fa-check", "mr-2 text-brand-red")}
                  {item}
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <h2 className="text-3xl font-black font-sans uppercase text-brand-dark">
              Frequently Asked Questions
            </h2>
          </div>
          <div className="mt-7 divide-y divide-gray-200 rounded border border-gray-200">
            {faqs.map(([question, answer]) => (
              <details key={question} className="group p-5">
                <summary className="cursor-pointer list-none font-extrabold font-sans text-brand-dark">
                  {question}
                  {icon("fa-plus", "float-right text-brand-red")}
                </summary>
                <p className="mt-3 text-sm leading-6 text-gray-600 font-inter">{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
      <section className="bg-brand-red px-6 py-10 text-white">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-2xl font-black font-sans uppercase">
              Ready to serve or find supply ministry?
            </h2>
            <p className="mt-2 text-sm font-inter text-red-100">
              Registration and booking actions are clearly labeled staging
              interactions.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <a
              href="#/employer/pulpit-supply"
              className="rounded bg-white px-5 py-3 text-xs font-extrabold font-sans uppercase text-brand-red !no-underline"
            >
              Find Supply
            </a>
            <a
              href="#/candidate/pulpit-supply"
              className="rounded border border-white px-5 py-3 text-xs font-extrabold font-sans uppercase text-white !no-underline"
            >
              Offer Supply
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

export default PulpitSupplyPage;
