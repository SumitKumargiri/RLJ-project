export function PageBanner({
  title,
  subtitle = "Connecting ministry professionals, churches, and Christian organizations",
}: {
  title: string
  subtitle?: string
}) {
  return (
    <div className="border-b border-gray-800 bg-gray-900 px-6 py-6 text-white">
      <div className="mx-auto flex max-w-7xl flex-col justify-between md:flex-row md:items-end">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            {title}
          </h1>
          <div className="mt-1 text-[11px] text-gray-400">
            <a href="#/" className="hover:text-white">
              Home
            </a>{" "}
            <span className="mx-1">›</span>{" "}
            <span className="uppercase text-red-400">{title}</span>
          </div>
        </div>
        <p className="mt-2 text-xs font-medium text-gray-400 md:mt-0">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

export default PageBanner

