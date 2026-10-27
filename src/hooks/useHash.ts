import { useEffect, useState } from "react"

export function useHash() {
  const [hash, setHash] = useState(window.location.hash.slice(1) || "/")
  useEffect(() => {
    const update = () => {
      setHash(window.location.hash.slice(1) || "/")
      window.scrollTo(0, 0)
    }
    window.addEventListener("hashchange", update)
    return () => window.removeEventListener("hashchange", update)
  }, [])
  return hash
}

export default useHash

