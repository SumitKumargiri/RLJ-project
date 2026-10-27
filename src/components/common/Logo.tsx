import redLetterJobsLogo from "../../assets/red-letter-jobs-logo.png"

export function Logo() {
  return (
    <a
      href="#/"
      className="flex shrink-0 items-center"
      aria-label="Red Letter Jobs home"
    >
      <img
        src={redLetterJobsLogo}
        alt="Red Letter Jobs — Find your calling"
        className="h-9 w-auto sm:h-14"
      />
    </a>
  )
}

export default Logo

