import { useState } from "react"
import { Logo } from "../common/Logo"
import { icon } from "../common/Icon"

export function Header({
  hash,
  openDemo,
}: {
  hash?: string
  openDemo: () => void
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const currentPath = hash || "/"
  const links: { label: string; href: string }[] = [
    { label: "Home", href: "/" },
    { label: "Browse Jobs", href: "/jobs-listing" },
    { label: "Pulpit Supply", href: "/pulpit-supply" },
    { label: "Resources", href: "/resources" },
    { label: "For Employers", href: "/for-employers" },
    { label: "Pricing", href: "/pricing" },
    { label: "View Demos", href: "/demos" },
  ]
  const isActive = (href: string) =>
    href === "/" ? currentPath === "/" : currentPath.startsWith(href)
  return (
    <>
      <div className="border-b border-brand-red-hover bg-brand-red px-4 py-2 text-center text-xs font-bold text-white sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2">
          <span>
            Connecting Christ-Centered Ministers with Faithful Churches
          </span>
          <a
            href="#/jobs-listing"
            className="hidden underline decoration-2 underline-offset-2 transition hover:text-white sm:inline"
          >
            Browse open roles
          </a>
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-gray-200 bg-header-white shadow-sm">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Logo />
          <nav className="primary-navigation hidden font-sans items-center gap-4.5 text-[12px] font-bold uppercase tracking-wider text-gray-700 xl:flex"
            aria-label="Primary navigation"
          >
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href === "/demos" ? "#/demos" : `#${href}`}
                onClick={
                  href === "/demos"
                    ? (event) => {
                        event.preventDefault()
                        openDemo()
                      }
                    : undefined
                }
                aria-current={isActive(href) ? "page" : undefined}
                className={`border-b-2 py-2 transition hover:text-brand-red font-poppins hover:no-underline ${
                  isActive(href)
                    ? "border-brand-red text-brand-red"
                    : "border-transparent"
                }`}
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="#/post-a-job"
              className="header-post-job-link rounded bg-action-red px-3 py-2.5 text-xs font-extrabold uppercase tracking-wider shadow-sm transition hover:bg-action-red-hover sm:px-4"
            >
              <span className="text-white font-sans text-[12px]">Post a Job</span>
            </a>
            <button
              onClick={() => setMenuOpen((value) => !value)}
              className="rounded border border-gray-200 p-2.5 text-gray-700 xl:hidden"
              aria-label="Toggle navigation"
              aria-expanded={menuOpen}
            >
              {icon(menuOpen ? "fa-xmark" : "fa-bars")}
            </button>
          </div>
        </div>
        {menuOpen && (
          <nav className="grid border-t border-gray-100 bg-header-white px-6 py-3 text-[13px] font-bold uppercase tracking-wider text-gray-700 xl:hidden">
            {links.map(({ label, href }) => (
              <a
                key={href}
                href={href === "/demos" ? "#/demos" : `#${href}`}
                onClick={(event) => {
                  setMenuOpen(false)
                  if (href === "/demos") {
                    event.preventDefault()
                    openDemo()
                  }
                }}
                className="border-b border-gray-100 py-3 last:border-0"
              >
                {label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}

export default Header
