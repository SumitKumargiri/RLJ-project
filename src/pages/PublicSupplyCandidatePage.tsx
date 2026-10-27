import { SupplyState } from "../types/employee.types"
import { PageBanner } from "../components/common/PageBanner"
import { CandidateEmpty } from "../components/common/CandidateEmpty"
import { SupplyCandidateDetail } from "../components/supply/SupplyCandidateDetail"

export function PublicSupplyCandidatePage({
  hash,
  supplyState,
}: {
  hash: string
  supplyState: SupplyState
}) {
  const id = Number(hash.split("/").pop())
  const candidate = [...supplyState.candidates, supplyState.profile].find(
    (item) => item.id === id && item.profileVisible,
  )
  if (!candidate)
    return (
      <CandidateEmpty
        title="Supply profile not available"
        description="This profile may be private or no longer accepting supply invitations."
        action="Browse Pulpit Supply"
        href="#/pulpit-supply"
      />
    )
  return (
    <>
      <PageBanner title="Pulpit Supply Profile" />
      <div className="mx-auto max-w-5xl px-6 py-10">
        <SupplyCandidateDetail
          candidate={candidate}
          close={() => {
            window.location.hash = "/pulpit-supply"
          }}
          invite={() => {
            window.location.hash = "/employer/pulpit-supply"
          }}
        />
      </div>
    </>
  )
}

export default PublicSupplyCandidatePage

