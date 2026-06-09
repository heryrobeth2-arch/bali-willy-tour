import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    // Initialize state outside of effect to avoid cascading renders
    const initialValue = window.innerWidth < MOBILE_BREAKPOINT
    // Use queueMicrotask to defer setState outside the synchronous effect body
    queueMicrotask(() => setIsMobile(initialValue))
    return () => mql.removeEventListener("change", onChange)
  }, [])

  return !!isMobile
}
