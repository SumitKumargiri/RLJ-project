import { SupplyCandidate } from "../../types/employee.types"
import { icon } from "../common/Icon"

export function SupplyCandidateDetail({
  candidate,
  close,
  invite,
}: {
  candidate: SupplyCandidate
  close: () => void
  invite: () => void
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-6 shadow-sm">
      <button type="button" onClick={close} className="text-xs font-bold uppercase text-brand-red">{icon("fa-arrow-left", "mr-2")}Back to Search</button>
      <div className="mt-5 flex flex-col gap-5 sm:flex-row">
        <img src={`https://i.pravatar.cc/200?img=${candidate.id + 20}`} alt={`${candidate.name} sample profile`} className="h-28 w-28 rounded-full object-cover" />
        <div><p className="text-xs font-extrabold uppercase text-brand-red">{candidate.category} Supply</p><h3 className="mt-1 text-3xl font-black text-brand-dark">{candidate.name}</h3><p className="mt-2 font-bold text-gray-600">{candidate.roles.join(" · ")}</p><p className="mt-1 text-sm text-gray-500">{candidate.city}, {candidate.state} · {candidate.experience} years</p></div>
      </div>
      <div className="mt-7 grid gap-6 lg:grid-cols-2">
        <section><h4 className="font-black uppercase text-brand-dark">Biography & Experience</h4><p className="mt-3 text-sm leading-7 text-gray-600">{candidate.biography}</p><p className="mt-3 text-sm text-gray-600">Education and credentials available in this fictional demo profile.</p></section>
        <section><h4 className="font-black uppercase text-brand-dark">Travel & Availability</h4><p className="mt-3 text-sm text-gray-600">Travel up to {candidate.travelDistance} miles</p>{candidate.availabilityVisible && <div className="mt-3 flex flex-wrap gap-2">{candidate.availability.map((item) => <span key={item} className="rounded bg-emerald-50 px-2 py-1 text-xs text-emerald-800">{item}</span>)}</div>}</section>
        {candidate.theologyVisible && <section><h4 className="font-black uppercase text-brand-dark">Shared Theological Background</h4><p className="mt-3 text-sm text-gray-600">{candidate.theology} · {candidate.denomination}</p></section>}
        <section><h4 className="font-black uppercase text-brand-dark">Media Portfolio</h4><div className="mt-3 space-y-2">{candidate.portfolio.map((item) => <p key={item} className="rounded bg-slate-50 p-3 text-sm text-brand-red">{icon("fa-play-circle", "mr-2")}{item}</p>)}</div></section>
        {candidate.honorariumPublic && <section><h4 className="font-black uppercase text-brand-dark">Honorarium</h4><p className="mt-3 text-sm text-gray-600">{candidate.honorarium}</p></section>}
      </div>
      <button type="button" onClick={invite} className="mt-7 rounded bg-brand-red px-6 py-3 text-xs font-extrabold uppercase text-white">Invite to Serve</button>
    </div>
  )
}

export default SupplyCandidateDetail

