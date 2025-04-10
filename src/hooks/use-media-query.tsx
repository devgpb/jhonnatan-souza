"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)

    // Atualiza o estado inicial
    if (media.matches !== matches) {
      setMatches(media.matches)
    }

    // Callback para quando o media query mudar
    const listener = () => {
      setMatches(media.matches)
    }

    // Adiciona o listener
    media.addEventListener("change", listener)

    // Cleanup
    return () => {
      media.removeEventListener("change", listener)
    }
  }, [matches, query])

  return matches
}
