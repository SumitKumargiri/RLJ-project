import * as React from "react"

export function CandidateField({
  label,
  value,
  onChange,
  multiline = false,
  help,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  multiline?: boolean
  help?: string
}) {
  return (
    <label className="block text-xs font-bold uppercase text-gray-700">
      {label}
      {multiline ? (
        <textarea
          rows={5}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal leading-6 normal-case outline-none focus:border-brand-red"
        />
      ) : (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="mt-1.5 w-full rounded border border-gray-300 p-3 text-sm font-normal normal-case outline-none focus:border-brand-red"
        />
      )}
      {help && (
        <span className="mt-1 block text-[11px] font-normal normal-case text-gray-500">
          {help}
        </span>
      )}
    </label>
  )
}

export function CandidateNotice({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-4 rounded bg-amber-50 p-3 text-xs leading-5 text-amber-950">
      {children}
    </p>
  )
}

export function PrivacyControl({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label className="flex items-start justify-between gap-5 rounded border border-gray-200 bg-slate-50 p-4">
      <span>
        <strong className="block text-sm text-brand-dark">{title}</strong>
        <span className="mt-1 block text-xs leading-5 text-gray-600">
          {description}
        </span>
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 shrink-0 accent-red-700"
      />
    </label>
  )
}
