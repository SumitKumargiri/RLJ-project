import type { ReactNode } from "react"
import { icon } from "../common/Icon"

export function FilterBox({
  title,
  iconName,
  children,
}: {
  title: string
  iconName: string
  children: ReactNode
}) {
  return (
    <div className="rounded border border-gray-200 bg-white p-4 shadow-sm">
      <h2 className="mb-3 flex items-center justify-between text-xs font-bold font-poppins uppercase tracking-wider text-gray-900">
        <span>{title}</span>
        {icon(iconName, "text-gray-400")}
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

export default FilterBox

