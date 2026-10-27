import * as React from "react"
import { useContext, useState } from "react"
import {
  EmployerJobStatus,
  SupplyBookingStatus,
  SupplyCandidate,
  SupplyState,
} from "../types/employee.types"
import { CandidateProfile, CandidateState } from "../types/candidate.types"
import { ApplicationContext } from "../context/ApplicationContext"
import { CATEGORIES } from "../constants/categories.constants"
import { US_STATES } from "../constants/location.constants"
import { formatJobDate } from "../utils/formatters"
import { icon } from "../components/common/Icon"
import { CandidateEmpty } from "../components/common/CandidateEmpty"
import { JobCard } from "../components/jobs/JobCard"
import {
  CandidateField,
  CandidateNotice,
  PrivacyControl,
} from "../components/common/DemoFormFields"
import {
  EmployerPageHeader,
  ListingStatus,
} from "./EmployerWorkspacePage"

function CandidateAuthPage({
  mode,
  enterDemo,
}: {
  mode: "sign-in" | "sign-up" | "recovery"
  enterDemo: () => void
}) {
  const [submitted, setSubmitted] = useState(false)
  const title =
    mode === "sign-in"
      ? "Candidate Sign In"
      : mode === "sign-up"
        ? "Create Your Free Candidate Account"
        : "Recover Your Password"
  return (
    <section className="px-6 py-12">
      <div className="mx-auto max-w-md overflow-hidden rounded border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-brand-charcoal px-6 py-5 text-white">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
            Candidate access · Always free
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight">
            {title}
          </h1>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (mode === "recovery") setSubmitted(true)
            else if (mode === "sign-up")
              window.location.hash = "/candidate/onboarding"
            else enterDemo()
          }}
          className="space-y-4 p-6"
        >
          <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            Demo access is simulated for staging. No account is created and
            credentials are not sent to a server.
          </p>
          {mode === "sign-up" && (
            <label className="block text-xs font-bold uppercase text-gray-700">
              Full name
              <input
                required
                defaultValue="Jordan Ellis"
                className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
              />
            </label>
          )}
          <label className="block text-xs font-bold uppercase text-gray-700">
            Email address
            <input
              required
              type="email"
              defaultValue="jordan@example.test"
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
            />
          </label>
          {mode !== "recovery" && (
            <label className="block text-xs font-bold uppercase text-gray-700">
              Password
              <input
                required
                type="password"
                defaultValue="demo-password"
                className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
              />
            </label>
          )}
          {mode === "sign-up" && (
            <label className="flex gap-2 text-xs leading-5 text-gray-600">
              <input required type="checkbox" className="mt-1 accent-red-700" />
              <span>
                I agree to the draft Terms of Use and acknowledge the draft
                Privacy Policy.
              </span>
            </label>
          )}
          <button
            type="submit"
            className="w-full rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-white hover:bg-brand-red-hover"
          >
            {mode === "sign-in"
              ? "Enter Candidate Demo"
              : mode === "sign-up"
                ? "Continue to Onboarding"
                : "Preview Recovery Request"}
          </button>
          {submitted && (
            <p className="rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
              Recovery preview complete. No email was sent because email
              delivery is not connected.
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs font-bold">
            {mode !== "sign-in" && (
              <a href="#/candidate/sign-in" className="text-brand-red">
                Sign in
              </a>
            )}
            {mode !== "sign-up" && (
              <a href="#/candidate/sign-up" className="text-brand-red">
                Create free account
              </a>
            )}
            {mode !== "recovery" && (
              <a href="#/candidate/password-recovery" className="text-gray-500">
                Forgot password?
              </a>
            )}
          </div>
        </form>
      </div>
    </section>
  )
}

function CandidateOnboarding({
  state,
  setState,
  enterDemo,
}: {
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
  enterDemo: () => void
}) {
  const [step, setStep] = useState(1)
  const [profile, setProfile] = useState(state.profile)
  const update = (field: keyof CandidateProfile, value: string | boolean) =>
    setProfile((current) => ({ ...current, [field]: value }))
  return (
    <section className="px-6 py-10">
      <div className="mx-auto max-w-3xl rounded border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 p-6">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Free candidate onboarding · Step {step} of 3
          </p>
          <h1 className="mt-2 text-2xl font-black uppercase tracking-tight text-brand-dark">
            {step === 1
              ? "Introduce Yourself"
              : step === 2
                ? "Share Your Ministry Direction"
                : "Choose Your Privacy"}
          </h1>
          <div className="mt-5 grid grid-cols-3 gap-2">
            {[1, 2, 3].map((item) => (
              <span
                key={item}
                className={`h-1.5 rounded-full ${
                  item <= step ? "bg-brand-red" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
        <div className="space-y-5 p-6">
          {step === 1 && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <CandidateField
                  label="Full name"
                  value={profile.name}
                  onChange={(value) => update("name", value)}
                />
                <CandidateField
                  label="Professional headline"
                  value={profile.headline}
                  onChange={(value) => update("headline", value)}
                />
                <CandidateField
                  label="City"
                  value={profile.city}
                  onChange={(value) => update("city", value)}
                />
                <CandidateField
                  label="State"
                  value={profile.state}
                  onChange={(value) => update("state", value)}
                />
              </div>
              <CandidateField
                label="Ministry biography"
                value={profile.biography}
                onChange={(value) => update("biography", value)}
                multiline
              />
            </>
          )}
          {step === 2 && (
            <>
              <CandidateField
                label="Preferred roles"
                value={profile.preferredRoles}
                onChange={(value) => update("preferredRoles", value)}
                help="Separate role names with commas."
              />
              <CandidateField
                label="Preferred locations"
                value={profile.preferredLocations}
                onChange={(value) => update("preferredLocations", value)}
              />
              <CandidateField
                label="Denominational affiliation"
                value={profile.denomination}
                onChange={(value) => update("denomination", value)}
              />
            </>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <PrivacyControl
                title="Employer profile visibility"
                description="When off, employers cannot discover your candidate profile. You can still apply to jobs."
                checked={profile.profileVisible}
                onChange={(checked) => update("profileVisible", checked)}
              />
              <PrivacyControl
                title="Resume visibility"
                description="Your resume stays private by default. Turning this on would allow approved employers to view it in a connected product."
                checked={profile.resumeVisible}
                onChange={(checked) => update("resumeVisible", checked)}
              />
              <p className="rounded bg-red-50 p-3 text-xs leading-5 text-brand-red">
                Contact details and resumes are not public by default.
              </p>
            </div>
          )}
          <div className="flex items-center justify-between border-t border-gray-100 pt-5">
            <button
              type="button"
              disabled={step === 1}
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              onClick={() => {
                if (step < 3) setStep((current) => current + 1)
                else {
                  setState((current) => ({ ...current, profile }))
                  enterDemo()
                }
              }}
              className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
            >
              {step === 3 ? "Complete Demo Onboarding" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}


function CandidateSupplyArea({
  state,
  setState,
}: {
  state: SupplyState
  setState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  const [tab, setTab] = useState("Overview")
  const [notice, setNotice] = useState("")
  const [date, setDate] = useState("")
  const profile = state.profile
  const update = (field: keyof SupplyCandidate, value: unknown) =>
    setState((current) => ({
      ...current,
      profile: { ...current.profile, [field]: value },
    }))
  const tabs = [
    "Overview",
    "Ministry Profile",
    "Theology",
    "Preaching & Worship",
    "Portfolio",
    "Availability",
    "Honorarium",
    "Invitations",
  ]
  const invitations = state.bookings.filter(
    (booking) => booking.candidateId === profile.id,
  )
  const setBookingStatus = (id: number, status: SupplyBookingStatus) => {
    setState((current) => ({
      ...current,
      bookings: current.bookings.map((booking) =>
        booking.id === id ? { ...booking, status } : booking,
      ),
    }))
    setNotice(`Invitation marked ${status}. This is a staging interaction.`)
  }
  return (
    <div>
      <EmployerPageHeader
        title="Pulpit Supply & Guest Ministry"
        description="Build an optional supply profile while continuing your regular employment search."
      />
      <PrivacyControl
        title="Available for Pulpit Supply Opportunities"
        description="Enable a specialized supply profile. Your regular candidate profile and job applications remain unchanged."
        checked={state.enabled}
        onChange={(checked) =>
          setState((current) => ({ ...current, enabled: checked }))
        }
      />
      {!state.enabled ? (
        <CandidateEmpty
          title="Pulpit Supply is optional"
          description="Enable availability above when you are ready to create a preaching or worship supply profile."
          action="Enable Pulpit Supply"
          onAction={() =>
            setState((current) => ({ ...current, enabled: true }))
          }
        />
      ) : (
        <>
          <div className="my-5 flex gap-2 overflow-x-auto pb-2">
            {tabs.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={`shrink-0 rounded px-3 py-2 text-xs font-bold uppercase ${
                  tab === item
                    ? "bg-brand-charcoal text-white"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
          {tab === "Overview" && (
            <div>
              <div className="grid gap-4 sm:grid-cols-4">
                {[
                  [
                    "Upcoming engagements",
                    invitations.filter(
                      (item) => item.status === "Accepted",
                    ).length,
                  ],
                  [
                    "Pending invitations",
                    invitations.filter((item) =>
                      ["Request Sent", "Awaiting Response"].includes(
                        item.status,
                      ),
                    ).length,
                  ],
                  [
                    "Completed engagements",
                    invitations.filter(
                      (item) => item.status === "Completed",
                    ).length,
                  ],
                  ["Profile views", "24 demo"],
                ].map(([label, value]) => (
                  <article
                    key={label}
                    className="rounded border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    <strong className="text-2xl font-black text-brand-dark">
                      {value}
                    </strong>
                    <p className="mt-1 text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                      {label}
                    </p>
                  </article>
                ))}
              </div>
              <div className="mt-5 rounded border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-black text-brand-dark">
                      Supply Profile Status
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      {state.profileApproved
                        ? "Approved demo profile"
                        : "Draft — complete and submit for admin review"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotice("Profile preview opened in staging mode.")}
                    className="rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark"
                  >
                    Profile Preview
                  </button>
                </div>
              </div>
            </div>
          )}
          {tab === "Ministry Profile" && (
            <CandidateFormSection title="Ministry Information">
              <div className="grid gap-4 sm:grid-cols-2">
                <CandidateField
                  label="Primary ministry role"
                  value={profile.roles[0] || ""}
                  onChange={(value) =>
                    update("roles", [
                      value,
                      ...profile.roles.slice(1),
                    ])
                  }
                />
                <CandidateField
                  label="Current ministry position"
                  value="Community Ministry Director"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Years of ministry experience"
                  value={String(profile.experience)}
                  onChange={(value) =>
                    update("experience", Number(value) || 0)
                  }
                />
                <CandidateField
                  label="Ordaining or licensing organization"
                  value="Front Range Ministry Network"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Denominational affiliation"
                  value={profile.denomination}
                  onChange={(value) => update("denomination", value)}
                />
                <CandidateField
                  label="Seminary or theological education"
                  value="M.A. in Christian Ministry"
                  onChange={() => undefined}
                />
                <CandidateField
                  label="Languages spoken"
                  value={profile.languages.join(", ")}
                  onChange={(value) =>
                    update(
                      "languages",
                      value.split(",").map((item) => item.trim()),
                    )
                  }
                />
                <CandidateField
                  label="Ministry website"
                  value="https://jordan-ellis.example"
                  onChange={() => undefined}
                />
              </div>
              <CandidateField
                label="Ministry biography"
                value={profile.biography}
                onChange={(value) => update("biography", value)}
                multiline
              />
              <div>
                <p className="text-xs font-bold uppercase text-gray-700">
                  Multiple ministry roles
                </p>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {[
                    "Guest Preacher",
                    "Revival Speaker",
                    "Conference Speaker",
                    "Worship Leader",
                    "Worship Pastor",
                    "Vocalist",
                    "Pianist",
                    "Keyboardist",
                    "Acoustic Guitarist",
                    "Electric Guitarist",
                    "Bass Guitarist",
                    "Drummer",
                    "Organist",
                    "Choir Director",
                    "Guest Soloist",
                    "Worship Band",
                  ].map((role) => (
                    <label key={role} className="flex items-center gap-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        checked={profile.roles.includes(role)}
                        onChange={() =>
                          update(
                            "roles",
                            profile.roles.includes(role)
                              ? profile.roles.filter((item) => item !== role)
                              : [...profile.roles, role],
                          )
                        }
                        className="accent-red-700"
                      />
                      {role}
                    </label>
                  ))}
                </div>
              </div>
            </CandidateFormSection>
          )}
          {tab === "Theology" && (
            <CandidateFormSection title="Theological Background & Ministry Beliefs">
              <p className="text-sm leading-6 text-gray-600">
                Help churches understand your theological background and
                ministry convictions. Sharing this information can help connect
                you with churches that align with your beliefs.
              </p>
              <p className="rounded bg-blue-50 p-3 text-xs leading-5 text-blue-950">
                Every question is optional. Categories may overlap, and your
                denomination does not determine your theological orientation.
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  [
                    "Theological orientation",
                    [
                      "Prefer not to specify",
                      "Calvinist",
                      "Arminian",
                      "Reformed",
                      "Wesleyan",
                      "Evangelical",
                      "Pentecostal",
                      "Charismatic",
                      "Other",
                    ],
                  ],
                  [
                    "Views on salvation",
                    [
                      "Prefer not to specify",
                      "Calvinist",
                      "Arminian",
                      "Molinist",
                      "Other",
                    ],
                  ],
                  [
                    "Spiritual gifts",
                    [
                      "Prefer not to specify",
                      "Continuationist",
                      "Cessationist",
                      "Open but cautious",
                      "Other",
                    ],
                  ],
                  [
                    "Baptism",
                    [
                      "Prefer not to specify",
                      "Believer’s baptism",
                      "Infant baptism",
                      "Both recognized",
                      "Other",
                    ],
                  ],
                  [
                    "Church governance",
                    [
                      "Prefer not to specify",
                      "Congregational",
                      "Elder-led",
                      "Presbyterian",
                      "Episcopal",
                      "Other",
                    ],
                  ],
                  [
                    "Women in ministry",
                    [
                      "Prefer not to specify",
                      "Complementarian",
                      "Egalitarian",
                      "Other",
                    ],
                  ],
                ].map(([label, options]) => (
                  <label key={String(label)} className="text-xs font-bold uppercase text-gray-700">
                    {String(label)} <span className="font-normal normal-case text-gray-400">(Optional)</span>
                    <select
                      value={
                        label === "Theological orientation"
                          ? profile.theology
                          : "Prefer not to specify"
                      }
                      onChange={(event) =>
                        label === "Theological orientation" &&
                        update("theology", event.target.value)
                      }
                      className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case"
                    >
                      {(options as string[]).map((option) => <option key={option}>{option}</option>)}
                    </select>
                  </label>
                ))}
              </div>
              <CandidateField label="Additional explanation (Optional)" value="" onChange={() => undefined} multiline />
              <CandidateField label="Biblical authority (Optional)" value="" onChange={() => undefined} multiline />
              <CandidateField label="Statement of faith — up to 2,000 characters (Optional)" value="" onChange={() => undefined} multiline />
              <div className="grid gap-3 sm:grid-cols-2">
                <CandidateField label="Statement of faith link (Optional)" value="" onChange={() => undefined} />
                <label className="text-xs font-bold uppercase text-gray-700">Statement PDF (Optional)<input type="file" accept=".pdf" className="mt-1.5 block w-full text-xs file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-white" /></label>
              </div>
            </CandidateFormSection>
          )}
          {tab === "Preaching & Worship" && (
            <div className="space-y-5">
              <CandidateFormSection title="Preaching Information">
                <CandidateField label="Preaching experience" value="Eight years of teaching and guest preaching experience." onChange={() => undefined} multiline />
                <div className="grid gap-4 sm:grid-cols-2">
                  <CandidateField label="Preferred sermon length" value="30–35 minutes" onChange={() => undefined} />
                  <CandidateField label="Languages available for preaching" value={profile.languages.join(", ")} onChange={() => undefined} />
                </div>
                <div className="grid gap-2 sm:grid-cols-2">{["Expository preaching", "Topical preaching", "Evangelistic preaching", "Teaching-oriented preaching", "Traditional worship experience", "Contemporary worship experience"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              </CandidateFormSection>
              <CandidateFormSection title="Worship & Music Supply Profile">
                <div className="grid gap-4 sm:grid-cols-2"><CandidateField label="Primary instrument" value={profile.instruments[0] || ""} onChange={(value) => update("instruments", [value, ...profile.instruments.slice(1)])} /><CandidateField label="Secondary instruments" value={profile.instruments.slice(1).join(", ")} onChange={() => undefined} /><CandidateField label="Vocal range" value="" onChange={() => undefined} /><CandidateField label="Number of musicians (bands)" value="" onChange={() => undefined} /></div>
                <div className="grid gap-2 sm:grid-cols-2">{["Traditional worship experience", "Contemporary worship experience", "Blended worship experience", "Gospel music experience", "Choir experience", "Lead congregational worship", "Work with existing worship teams", "Bring additional musicians", "Provide a complete worship band"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              </CandidateFormSection>
            </div>
          )}
          {tab === "Portfolio" && (
            <CandidateFormSection title="Sermon & Music Portfolio">
              <p className="text-sm text-gray-600">Add sermon videos, audio, YouTube links, manuscripts, performance samples, and ministry websites.</p>
              {profile.portfolio.map((item) => <div key={item} className="flex items-center justify-between rounded bg-slate-50 p-3 text-sm"><span>{icon("fa-play-circle", "mr-2 text-brand-red")}{item}</span><button type="button" className="text-xs font-bold text-brand-red">Remove</button></div>)}
              <CandidateField label="Add portfolio link" value="" onChange={() => undefined} />
              <label className="block text-xs font-bold uppercase text-gray-700">Choose demo media file<input type="file" className="mt-1.5 block w-full text-xs file:rounded file:border-0 file:bg-brand-charcoal file:px-3 file:py-2 file:text-white" /></label>
              <p className="rounded bg-amber-50 p-3 text-xs text-amber-950">Uploads are simulated and are not stored.</p>
            </CandidateFormSection>
          )}
          {tab === "Availability" && (
            <CandidateFormSection title="Availability Calendar">
              <div className="grid gap-2 sm:grid-cols-3">{["Sunday Morning", "Sunday Evening", "Wednesday Evening", "Weekdays", "Special Events", "Multi-day Engagements", "Virtual Preaching"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" checked={profile.availability.includes(item)} onChange={() => update("availability", profile.availability.includes(item) ? profile.availability.filter((value) => value !== item) : [...profile.availability, item])} className="accent-red-700" />{item}</label>)}</div>
              <div className="grid gap-4 sm:grid-cols-2"><label className="text-xs font-bold uppercase text-gray-700">Unavailable date<input type="date" value={date} onChange={(event) => setDate(event.target.value)} className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm" /></label><CandidateField label="Maximum travel distance (miles)" value={String(profile.travelDistance)} onChange={(value) => update("travelDistance", Number(value) || 0)} /></div>
              <button type="button" disabled={!date} onClick={() => { setState((current) => ({ ...current, unavailableDates: [...current.unavailableDates, date] })); setDate("") }} className="rounded bg-brand-red px-4 py-2.5 text-xs font-bold uppercase text-white disabled:opacity-40">Mark Unavailable</button>
              <div className="flex flex-wrap gap-2">{state.unavailableDates.map((item) => <span key={item} className="rounded bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red">{item}</span>)}</div>
              <div className="grid gap-2 sm:grid-cols-2">{["Overnight travel willingness", "Recurring availability", "Virtual preaching availability"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
            </CandidateFormSection>
          )}
          {tab === "Honorarium" && (
            <CandidateFormSection title="Honorarium & Travel">
              <CandidateField label="Suggested honorarium (Optional)" value={profile.honorarium} onChange={(value) => update("honorarium", value)} />
              <div className="grid gap-2 sm:grid-cols-2">{["Travel reimbursement requested", "Lodging required", "Willing to serve without honorarium", "Honorarium negotiable", "Instruments provided", "Sound equipment available"].map((item) => <label key={item} className="flex gap-2 text-sm text-gray-700"><input type="checkbox" className="accent-red-700" />{item}</label>)}</div>
              <PrivacyControl title="Display honorarium publicly" description="Off by default. Churches cannot see expectations unless you enable this." checked={profile.honorariumPublic} onChange={(checked) => update("honorariumPublic", checked)} />
              <CandidateField label="Equipment requirements (Optional)" value="" onChange={() => undefined} multiline />
            </CandidateFormSection>
          )}
          {tab === "Invitations" && (
            <div>
              <div className="grid gap-3 sm:grid-cols-4">{["Pending Invitations", "Upcoming Engagements", "Completed Engagements", "Cancelled Engagements"].map((title) => <div key={title} className="rounded border border-gray-200 bg-white p-4 text-center"><strong className="text-xl text-brand-dark">{invitations.filter((item) => title.startsWith("Pending") ? ["Request Sent", "Awaiting Response"].includes(item.status) : item.status === title.split(" ")[0].replace("Upcoming", "Accepted")).length}</strong><p className="mt-1 text-[10px] font-bold uppercase text-gray-500">{title}</p></div>)}</div>
              <div className="mt-5 space-y-3">{invitations.map((booking) => <article key={booking.id} className="rounded border border-gray-200 bg-white p-5 shadow-sm"><div className="flex flex-col justify-between gap-4 sm:flex-row"><div><ListingStatus status={booking.status as EmployerJobStatus} /><h3 className="mt-3 font-black text-brand-dark">{booking.role} at {booking.church}</h3><p className="mt-1 text-sm text-gray-500">{booking.date} · {booking.time} · {booking.location}</p><p className="mt-3 text-sm text-gray-600">{booking.description}</p></div>{["Request Sent", "Awaiting Response"].includes(booking.status) && <div className="flex gap-2 self-start"><button type="button" onClick={() => setBookingStatus(booking.id, "Accepted")} className="rounded bg-emerald-600 px-4 py-2 text-xs font-bold uppercase text-white">Accept</button><button type="button" onClick={() => setBookingStatus(booking.id, "Declined")} className="rounded border border-red-300 px-4 py-2 text-xs font-bold uppercase text-brand-red">Decline</button></div>}</div><button type="button" onClick={() => setNotice("Additional information request added to the staging message thread.")} className="mt-4 text-xs font-extrabold uppercase text-brand-red">Request Information</button></article>)}</div>
            </div>
          )}
          {tab !== "Overview" && tab !== "Invitations" && (
            <div className="mt-5 flex flex-wrap gap-3">
              <button type="button" onClick={() => setNotice(`${tab} saved for this demo session.`)} className="rounded bg-brand-red px-5 py-3 text-xs font-extrabold uppercase text-white">Save {tab}</button>
              <button type="button" onClick={() => setNotice("Supply profile preview opened in staging mode.")} className="rounded border border-gray-300 px-5 py-3 text-xs font-bold uppercase text-brand-dark">Profile Preview</button>
            </div>
          )}
          <div className="mt-6 space-y-3">
            <PrivacyControl title="Appear in Pulpit Supply searches" description="When off, churches cannot discover this supply profile." checked={profile.profileVisible} onChange={(checked) => update("profileVisible", checked)} />
            <PrivacyControl title="Show theological preferences" description="All theological responses remain hidden unless you enable this." checked={profile.theologyVisible} onChange={(checked) => update("theologyVisible", checked)} />
            <PrivacyControl title="Show availability" description="Control whether churches can view your availability details." checked={profile.availabilityVisible} onChange={(checked) => update("availabilityVisible", checked)} />
            <PrivacyControl title="Allow direct church contact" description="Private contact details are never displayed publicly." checked={profile.directContact} onChange={(checked) => update("directContact", checked)} />
          </div>
        </>
      )}
      {notice && <CandidateNotice>{notice}</CandidateNotice>}
    </div>
  )
}

export function CandidateExperience({
  hash,
  state,
  setState,
  enterDemo,
  supplyState,
  setSupplyState,
}: {
  hash: string
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
  enterDemo: () => void
  supplyState: SupplyState
  setSupplyState: React.Dispatch<React.SetStateAction<SupplyState>>
}) {
  if (hash === "/candidate/sign-in")
    return <CandidateAuthPage mode="sign-in" enterDemo={enterDemo} />
  if (hash === "/candidate/sign-up")
    return <CandidateAuthPage mode="sign-up" enterDemo={enterDemo} />
  if (hash === "/candidate/password-recovery")
    return <CandidateAuthPage mode="recovery" enterDemo={enterDemo} />
  if (hash === "/candidate/onboarding")
    return (
      <CandidateOnboarding
        state={state}
        setState={setState}
        enterDemo={enterDemo}
      />
    )

  const primaryNavigation = [
    ["My Applications", "/candidate/applications", "fa-file-lines"],
    ["Saved Jobs", "/candidate/saved-jobs", "fa-heart"],
    ["Recommendations", "/candidate/recommendations", "fa-wand-magic-sparkles"],
  ]
  const secondaryNavigation = [
    ["Profile", "/candidate/profile", "fa-user"],
    ["Resume", "/candidate/resume", "fa-file"],
    ["Messages", "/candidate/messages", "fa-envelope"],
    ["Job Alerts", "/candidate/alerts", "fa-bell"],
    ["Pulpit Supply", "/candidate/pulpit-supply", "fa-person-chalkboard"],
    ["Account Settings", "/candidate/settings", "fa-gear"],
  ]
  const active = (path: string) => hash.startsWith(path)
  return (
    <>
      <section className="border-b border-gray-800 bg-brand-charcoal px-6 py-7 text-white">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-red-300">
              Candidate workspace · Always free
            </p>
            <h1 className="mt-2 text-3xl font-black uppercase tracking-tight">
              <a href="#/candidate/dashboard" className="hover:text-red-200">
                {state.profile.name}
              </a>
            </h1>
            <p className="mt-1 text-sm text-gray-300">
              {state.profile.headline}
            </p>
          </div>
          <span className="self-start rounded bg-amber-100 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-amber-950 sm:self-auto">
            Demo mode · Changes are not saved
          </span>
        </div>
      </section>
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-12">
        <aside className="lg:col-span-3">
          <nav
            className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm"
            aria-label="Candidate dashboard"
          >
            <p className="px-4 pb-2 pt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
              Primary navigation
            </p>
            {primaryNavigation.map(([label, path, iconName]) => (
              <a
                key={path}
                href={`#${path}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  active(path)
                    ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-dark"
                }`}
              >
                {icon(iconName, "w-5 text-center")}
                {label}
              </a>
            ))}
            <p className="mx-4 mt-3 border-t border-gray-200 pb-2 pt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-gray-400">
              Account
            </p>
            {secondaryNavigation.map(([label, path, iconName]) => (
              <a
                key={path}
                href={`#${path}`}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-bold ${
                  active(path)
                    ? "border-l-4 border-brand-red bg-red-50 pl-3 text-brand-red"
                    : "text-gray-700 hover:bg-gray-50 hover:text-brand-dark"
                }`}
              >
                {icon(iconName, "w-5 text-center")}
                {label}
              </a>
            ))}
          </nav>
        </aside>
        <div className="lg:col-span-9">
          {hash === "/candidate/pulpit-supply" ? (
            <CandidateSupplyArea
              state={supplyState}
              setState={setSupplyState}
            />
          ) : (
            <CandidateRouteContent
              hash={hash}
              state={state}
              setState={setState}
            />
          )}
        </div>
      </div>
    </>
  )
}

function CandidateRouteContent({
  hash,
  state,
  setState,
}: {
  hash: string
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const [notice, setNotice] = useState("")
  const [profileDraft, setProfileDraft] = useState(state.profile)
  const [selectedMessage, setSelectedMessage] = useState(0)
  const [reply, setReply] = useState("")
  const pageHeader = (eyebrow: string, title: string, description: string) => (
    <div className="mb-6 border-b border-gray-200 pb-5">
      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
        {eyebrow}
      </p>
      <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>
    </div>
  )

  if (hash === "/candidate/dashboard") {
    return (
      <div>
        {pageHeader(
          "Dashboard overview",
          "Your Candidate Home",
          "Keep your free ministry search organized from one private workspace.",
        )}
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            [
              "My Applications",
              state.applications.length,
              "/candidate/applications",
              "fa-file-lines",
            ],
            [
              "Saved Jobs",
              (state.savedJobIds ?? []).length,
              "/candidate/saved-jobs",
              "fa-heart",
            ],
            [
              "Recommendations",
              state.recommendationsConfigured ? "Ready" : "Set up",
              "/candidate/recommendations",
              "fa-wand-magic-sparkles",
            ],
          ].map(([label, value, path, iconName]) => (
            <a
              key={label}
              href={`#${path}`}
              className="rounded border border-gray-200 bg-white p-5 shadow-sm transition hover:border-brand-red"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded bg-red-50 text-brand-red">
                {icon(String(iconName))}
              </span>
              <strong className="mt-4 block text-2xl font-black text-brand-dark">
                {value}
              </strong>
              <span className="mt-1 block text-xs font-extrabold uppercase tracking-wider text-gray-500">
                {label}
              </span>
            </a>
          ))}
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Profile privacy
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Your profile is currently{" "}
              <strong>
                {state.profile.profileVisible ? "discoverable" : "private"}
              </strong>
              . Your resume is{" "}
              <strong>
                {state.profile.resumeVisible ? "visible" : "private"}
              </strong>
              .
            </p>
            <a
              href="#/candidate/profile"
              className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Review profile {icon("fa-arrow-right", "ml-2")}
            </a>
          </section>
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-black uppercase tracking-tight text-brand-dark">
              Job alerts
            </h3>
            <p className="mt-3 text-sm leading-6 text-gray-600">
              Alert frequency: <strong>{state.alertFrequency}</strong>. Email
              delivery is not connected in this staging prototype.
            </p>
            <a
              href="#/candidate/alerts"
              className="mt-4 inline-flex text-xs font-extrabold uppercase tracking-wider text-brand-red"
            >
              Manage alerts {icon("fa-arrow-right", "ml-2")}
            </a>
          </section>
        </div>
      </div>
    )
  }

  if (hash.startsWith("/candidate/applications/")) {
    const application = state.applications.find(
      (item) => item.id === Number(hash.split("/").pop()),
    )
    const job = allJobs.find((item) => item.id === application?.jobId)
    if (!application || !job)
      return <CandidateEmpty title="Application not found" action="My Applications" href="#/candidate/applications" />
    return (
      <div>
        {pageHeader(
          "Application details",
          job.title,
          `${job.company} · Submitted ${formatJobDate(application.applied)}`,
        )}
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-gray-500">Status</p>
              <p className="mt-1 text-lg font-black text-brand-dark">
                {application.status}
              </p>
            </div>
            <span className="rounded bg-blue-50 px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider text-blue-700">
              Sample application
            </span>
          </div>
          <dl className="mt-6 divide-y divide-gray-200 border-y border-gray-200 text-sm">
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Position</dt>
              <dd className="font-bold text-brand-dark">{job.title}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Employer</dt>
              <dd className="font-bold text-brand-dark">{job.company}</dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Application date</dt>
              <dd className="font-bold text-brand-dark">
                {formatJobDate(application.applied)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 py-4">
              <dt className="text-gray-500">Resume</dt>
              <dd className="text-right font-bold text-brand-dark">
                {application.resumeName}
              </dd>
            </div>
          </dl>
          <div className="mt-5">
            <p className="text-xs font-bold uppercase text-gray-500">
              Optional message
            </p>
            <p className="mt-2 rounded bg-slate-50 p-4 text-sm leading-6 text-gray-600">
              {application.message || "No message was included."}
            </p>
          </div>
          <p className="mt-5 rounded bg-amber-50 p-4 text-xs leading-5 text-amber-950">
            {application.note}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={`#/job/${job.id}`}
              className="rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white"
            >
              Open Job
            </a>
            <a
              href="#/candidate/applications"
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark"
            >
              Back to Applications
            </a>
          </div>
        </section>
      </div>
    )
  }

  if (hash === "/candidate/applications") {
    return (
      <div>
        {pageHeader(
          "Primary workspace",
          "My Applications",
          "Review sample application dates, employers, and current statuses.",
        )}
        <div className="overflow-hidden rounded border border-gray-200 bg-white shadow-sm">
          {state.applications.map((application) => {
            const job = allJobs.find((item) => item.id === application.jobId)
            if (!job) return null
            return (
              <article
                key={application.id}
                className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 last:border-0 sm:flex-row sm:items-center"
              >
                <div>
                  <h3 className="font-extrabold text-brand-dark">{job.title}</h3>
                  <p className="mt-1 text-sm font-semibold text-gray-600">
                    {job.company}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">
                    Applied {formatJobDate(application.applied)}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="rounded bg-blue-50 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider text-blue-700">
                    {application.status}
                  </span>
                  <a
                    href={`#/candidate/applications/${application.id}`}
                    className="text-xs font-extrabold uppercase tracking-wider text-brand-red"
                  >
                    View details
                  </a>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    )
  }

  if (hash === "/candidate/saved-jobs") {
    const savedJobs = allJobs.filter((job) =>
      (state.savedJobIds ?? []).includes(job.id),
    )
    return (
      <div>
        {pageHeader(
          "Primary workspace",
          "Saved Jobs",
          "Revisit opportunities you are considering and remove those that no longer fit.",
        )}
        {savedJobs.length ? (
          <div className="space-y-3">
            {savedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
              />
            ))}
          </div>
        ) : (
          <CandidateEmpty
            title="No saved jobs"
            description="Save promising opportunities while browsing, then return here to compare them."
            action="Browse Jobs"
            href="#/jobs-listing"
          />
        )}
      </div>
    )
  }

  if (hash === "/candidate/recommendations") {
    return (
      <CandidateRecommendations state={state} setState={setState} />
    )
  }

  if (hash === "/candidate/profile") {
    const update = (field: keyof CandidateProfile, value: string | boolean | string[]) =>
      setProfileDraft((current) => ({ ...current, [field]: value }))
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Edit Profile",
          "Keep your ministry experience, direction, and privacy choices current.",
        )}
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setState((current) => ({ ...current, profile: profileDraft }))
            setNotice("Profile changes saved for this demo session.")
          }}
          className="space-y-6"
        >
          <CandidateFormSection title="Personal and ministry summary">
            <div className="grid gap-4 sm:grid-cols-2">
              <CandidateField label="Name" value={profileDraft.name} onChange={(value) => update("name", value)} />
              <CandidateField label="Professional headline" value={profileDraft.headline} onChange={(value) => update("headline", value)} />
              <CandidateField label="City" value={profileDraft.city} onChange={(value) => update("city", value)} />
              <CandidateField label="State" value={profileDraft.state} onChange={(value) => update("state", value)} />
            </div>
            <CandidateField label="Ministry biography" value={profileDraft.biography} onChange={(value) => update("biography", value)} multiline />
          </CandidateFormSection>
          <CandidateFormSection title="Experience and preparation">
            <CandidateField
              label="Ministry experience and employment history"
              value={profileDraft.experience}
              onChange={(value) => update("experience", value)}
              multiline
            />
            <CandidateField label="Education" value={profileDraft.education} onChange={(value) => update("education", value)} />
            <CandidateField label="Ministry skills" value={profileDraft.skills} onChange={(value) => update("skills", value)} />
            <CandidateField label="Credentials" value={profileDraft.credentials} onChange={(value) => update("credentials", value)} />
          </CandidateFormSection>
          <CandidateFormSection title="Faith and ministry background">
            <CandidateField label="Denominational affiliation" value={profileDraft.denomination} onChange={(value) => update("denomination", value)} />
            <CandidateField label="Ministry / theological background (optional)" value={profileDraft.theologicalBackground} onChange={(value) => update("theologicalBackground", value)} multiline />
          </CandidateFormSection>
          <CandidateFormSection title="Job preferences and links">
            <CandidateField label="Preferred roles" value={profileDraft.preferredRoles} onChange={(value) => update("preferredRoles", value)} />
            <CandidateField label="Preferred locations" value={profileDraft.preferredLocations} onChange={(value) => update("preferredLocations", value)} />
            <div>
              <p className="text-xs font-bold uppercase text-gray-700">Employment types</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {(["FULL TIME", "PART TIME", "INTERNSHIP", "INTERIM"] as const).map((type) => (
                  <label key={type} className="flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <input
                      type="checkbox"
                      checked={profileDraft.preferredTypes.includes(type)}
                      onChange={() =>
                        update(
                          "preferredTypes",
                          profileDraft.preferredTypes.includes(type)
                            ? profileDraft.preferredTypes.filter((item) => item !== type)
                            : [...profileDraft.preferredTypes, type],
                        )
                      }
                      className="accent-red-700"
                    />
                    {type}
                  </label>
                ))}
              </div>
            </div>
            <CandidateField label="Portfolio or ministry website" value={profileDraft.portfolio} onChange={(value) => update("portfolio", value)} />
          </CandidateFormSection>
          <CandidateFormSection title="Profile visibility">
            <PrivacyControl
              title="Discoverable candidate profile"
              description="When enabled, approved employers could find your professional profile. Your direct contact details remain private."
              checked={profileDraft.profileVisible}
              onChange={(checked) => update("profileVisible", checked)}
            />
            <PrivacyControl
              title="Resume visible to approved employers"
              description="Off by default. Your resume is never displayed on the public organization or job pages."
              checked={profileDraft.resumeVisible}
              onChange={(checked) => update("resumeVisible", checked)}
            />
          </CandidateFormSection>
          <button type="submit" className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white">
            Save Profile
          </button>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </form>
      </div>
    )
  }

  if (hash === "/candidate/resume") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Resume Management",
          "Manage the resume associated with your private candidate profile.",
        )}
        <section className="rounded border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <span className="flex h-12 w-12 items-center justify-center rounded bg-red-50 text-xl text-brand-red">
                {icon("fa-file-pdf")}
              </span>
              <div>
                <h3 className="font-extrabold text-brand-dark">
                  {state.resumeName}
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Fictional demo resume · Private by default
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setState((current) => ({
                  ...current,
                  resumeName: "Jordan-Ellis-Updated-Resume.pdf",
                }))
                setNotice("Demo resume selection updated. No file was uploaded.")
              }}
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
            >
              Choose Demo Resume
            </button>
          </div>
          <div className="mt-6 border-t border-gray-200 pt-5">
            <PrivacyControl
              title="Resume visibility"
              description="When off, employers only receive a resume through a candidate-initiated application. This control is off by default."
              checked={state.profile.resumeVisible}
              onChange={(checked) =>
                setState((current) => ({
                  ...current,
                  profile: { ...current.profile, resumeVisible: checked },
                }))
              }
            />
          </div>
          <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
            File upload and document storage are not connected in this staging
            prototype.
          </p>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </section>
      </div>
    )
  }

  if (hash === "/candidate/messages") {
    const messages = [
      {
        sender: "Red Letter Jobs Demo",
        subject: "Welcome to your candidate workspace",
        body: "This sample message demonstrates how candidate and employer conversations could appear. Replies are not delivered.",
      },
      {
        sender: "Redeemer Fellowship — Sample",
        subject: "Application received",
        body: "Thank you for previewing the application experience. This organization and message are fictional.",
      },
    ]
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Messages",
          "Preview a staging inbox. Live messaging is not connected.",
        )}
        <div className="grid overflow-hidden rounded border border-gray-200 bg-white shadow-sm md:grid-cols-5">
          <div className="border-b border-gray-200 md:col-span-2 md:border-b-0 md:border-r">
            {messages.map((message, index) => (
              <button
                key={message.subject}
                type="button"
                onClick={() => setSelectedMessage(index)}
                className={`block w-full border-b border-gray-100 p-4 text-left ${
                  selectedMessage === index ? "bg-red-50" : "hover:bg-gray-50"
                }`}
              >
                <strong className="block text-sm text-brand-dark">
                  {message.sender}
                </strong>
                <span className="mt-1 block truncate text-xs text-gray-600">
                  {message.subject}
                </span>
              </button>
            ))}
          </div>
          <div className="p-5 md:col-span-3">
            <p className="text-xs font-bold uppercase text-brand-red">
              {messages[selectedMessage].sender}
            </p>
            <h3 className="mt-2 text-lg font-black text-brand-dark">
              {messages[selectedMessage].subject}
            </h3>
            <p className="mt-4 text-sm leading-7 text-gray-600">
              {messages[selectedMessage].body}
            </p>
            <textarea
              value={reply}
              onChange={(event) => setReply(event.target.value)}
              rows={4}
              placeholder="Write a staging reply..."
              aria-label="Reply to selected message"
              className="mt-6 w-full rounded border border-gray-300 p-3 text-sm outline-none focus:border-brand-red"
            />
            <button
              type="button"
              onClick={() => {
                setReply("")
                setNotice("Reply preview complete. No message was sent.")
              }}
              className="mt-3 rounded bg-brand-red px-5 py-2.5 text-xs font-extrabold uppercase text-white"
            >
              Preview Reply
            </button>
            {notice && <CandidateNotice>{notice}</CandidateNotice>}
          </div>
        </div>
      </div>
    )
  }

  if (hash === "/candidate/alerts") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Job Alerts & Notifications",
          "Choose staging notification preferences. No email or push delivery is connected.",
        )}
        <section className="space-y-5 rounded border border-gray-200 bg-white p-6 shadow-sm">
          <label className="block text-xs font-bold uppercase text-gray-700">
            Job alert frequency
            <select
              value={state.alertFrequency}
              onChange={(event) =>
                setState((current) => ({
                  ...current,
                  alertFrequency: event.target.value as CandidateState["alertFrequency"],
                }))
              }
              className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case sm:max-w-sm"
            >
              <option>Off</option>
              <option>Daily</option>
              <option>Weekly</option>
            </select>
          </label>
          <PrivacyControl
            title="Application status updates"
            description="Preview notifications when a sample application status changes."
            checked={state.applicationUpdates}
            onChange={(checked) =>
              setState((current) => ({
                ...current,
                applicationUpdates: checked,
              }))
            }
          />
          <PrivacyControl
            title="Message notifications"
            description="Preview notifications for new staging inbox messages."
            checked={state.messageNotifications}
            onChange={(checked) =>
              setState((current) => ({
                ...current,
                messageNotifications: checked,
              }))
            }
          />
          <button
            type="button"
            onClick={() =>
              setNotice(
                "Notification preferences saved for this demo session. No emails will be sent.",
              )
            }
            className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase text-white"
          >
            Save Preferences
          </button>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </section>
      </div>
    )
  }

  if (hash === "/candidate/settings") {
    return (
      <div>
        {pageHeader(
          "Secondary navigation",
          "Account Settings",
          "Review sign-in, privacy, and account controls for the staging candidate experience.",
        )}
        <div className="space-y-5">
          <CandidateFormSection title="Sign-in details">
            <CandidateField
              label="Account email"
              value="jordan@example.test"
              onChange={() => undefined}
            />
            <button
              type="button"
              onClick={() =>
                setNotice("Password update previewed. No credential was changed.")
              }
              className="rounded border border-gray-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-dark"
            >
              Preview Password Change
            </button>
          </CandidateFormSection>
          <CandidateFormSection title="Privacy summary">
            <p className="text-sm leading-6 text-gray-600">
              Candidate contact details and resumes remain private unless you
              intentionally change visibility controls or submit an application.
              Public profile discovery is currently{" "}
              <strong>
                {state.profile.profileVisible ? "enabled" : "disabled"}
              </strong>
              .
            </p>
          </CandidateFormSection>
          <CandidateFormSection title="Account actions">
            <button
              type="button"
              onClick={() =>
                setNotice(
                  "Account deletion previewed. No data was deleted or persisted.",
                )
              }
              className="rounded border border-red-300 px-5 py-2.5 text-xs font-bold uppercase text-brand-red"
            >
              Preview Account Deletion
            </button>
          </CandidateFormSection>
          {notice && <CandidateNotice>{notice}</CandidateNotice>}
        </div>
      </div>
    )
  }

  return (
    <CandidateEmpty
      title="Candidate page not found"
      action="Return to Dashboard"
      href="#/candidate/dashboard"
    />
  )
}

function CandidateRecommendations({
  state,
  setState,
}: {
  state: CandidateState
  setState: React.Dispatch<React.SetStateAction<CandidateState>>
}) {
  const { jobs: allJobs } = useContext(ApplicationContext)
  const [editing, setEditing] = useState(!state.recommendationsConfigured)
  const [categories, setCategories] = useState(state.preferredCategories)
  const [locations, setLocations] = useState(state.preferredStates)
  const toggle = (
    value: string,
    current: string[],
    setCurrent: React.Dispatch<React.SetStateAction<string[]>>,
    limit: number,
  ) => {
    if (current.includes(value))
      setCurrent(current.filter((item) => item !== value))
    else if (current.length < limit) setCurrent([...current, value])
  }
  const matchingJobs = allJobs.filter(
    (job) =>
      state.preferredCategories.includes(job.category) &&
      state.preferredStates.includes(job.state),
  ).slice(0, 8)
  if (editing) {
    return (
      <div>
        <div className="mb-6 border-b border-gray-200 pb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Primary workspace
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
            Set Recommendation Preferences
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Recommendations begin with your choices, not a generic job feed.
          </p>
        </div>
        <div className="space-y-6">
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">
                  Choose up to 5 categories
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Select the ministry areas most relevant to your calling.
                </p>
              </div>
              <span className="rounded bg-red-50 px-3 py-1.5 text-xs font-extrabold text-brand-red">
                {categories.length} / 5 selected
              </span>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {CATEGORIES.map((category) => {
                const disabled =
                  categories.length >= 5 && !categories.includes(category.slug)
                return (
                  <label
                    key={category.slug}
                    className={`flex items-center gap-3 rounded border p-3 text-sm font-semibold ${
                      disabled
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                        : "border-gray-200 text-gray-700 hover:border-brand-red"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={categories.includes(category.slug)}
                      disabled={disabled}
                      onChange={() =>
                        toggle(category.slug, categories, setCategories, 5)
                      }
                      className="accent-red-700"
                    />
                    {category.name}
                  </label>
                )
              })}
            </div>
          </section>
          <section className="rounded border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-black uppercase tracking-tight text-brand-dark">
                  Choose up to 3 locations
                </h3>
                <p className="mt-1 text-xs text-gray-500">
                  Select states where you would consider serving.
                </p>
              </div>
              <span className="rounded bg-red-50 px-3 py-1.5 text-xs font-extrabold text-brand-red">
                {locations.length} / 3 selected
              </span>
            </div>
            <div className="mt-5 grid max-h-72 gap-3 overflow-y-auto pr-2 sm:grid-cols-3">
              {US_STATES.map((location) => {
                const disabled =
                  locations.length >= 3 && !locations.includes(location)
                return (
                  <label
                    key={location}
                    className={`flex items-center gap-2 rounded border p-3 text-xs font-semibold ${
                      disabled
                        ? "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                        : "border-gray-200 text-gray-700 hover:border-brand-red"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={locations.includes(location)}
                      disabled={disabled}
                      onChange={() =>
                        toggle(location, locations, setLocations, 3)
                      }
                      className="accent-red-700"
                    />
                    {location}
                  </label>
                )
              })}
            </div>
          </section>
          <button
            type="button"
            disabled={!categories.length || !locations.length}
            onClick={() => {
              setState((current) => ({
                ...current,
                preferredCategories: categories,
                preferredStates: locations,
                recommendationsConfigured: true,
              }))
              setEditing(false)
            }}
            className="rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            Save Preferences & View Matches
          </button>
        </div>
      </div>
    )
  }
  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red">
            Primary workspace
          </p>
          <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-brand-dark">
            Recommendations
          </h2>
          <p className="mt-2 text-sm leading-6 text-gray-600">
            Prioritized from your selected ministry categories and locations.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="self-start rounded border border-gray-300 px-4 py-2.5 text-xs font-bold uppercase text-brand-dark hover:border-brand-red"
        >
          Edit Preferences
        </button>
      </div>
      <div className="mb-5 flex flex-wrap gap-2">
        {[...state.preferredCategories, ...state.preferredStates].map((item) => (
          <span
            key={item}
            className="rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-brand-red"
          >
            {CATEGORIES.find((category) => category.slug === item)?.name || item}
          </span>
        ))}
      </div>
      {matchingJobs.length ? (
        <div className="space-y-3">
          {matchingJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      ) : (
        <CandidateEmpty
          title="No matching opportunities right now"
          description="There are no sample jobs matching both your selected categories and locations. Edit your preferences to broaden the match."
          action="Edit Preferences"
          onAction={() => setEditing(true)}
        />
      )}
    </div>
  )
}

function CandidateFormSection({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="border-b border-gray-100 pb-3 text-base font-black uppercase tracking-tight text-brand-dark">
        {title}
      </h3>
      {children}
    </section>
  )
}
