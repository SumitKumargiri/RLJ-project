import { Job } from "../../types/job.types"
import { typeClass } from "../../utils/job.utils"

export function JobBadge({ type }: { type: Job["type"] }) {
  return (
    <span
      className={`w-24 rounded px-2 py-1 text-center text-[10px] font-bold uppercase tracking-wider text-white ${typeClass(type)}`}
    >
      {type}
    </span>
  )
}

export default JobBadge

