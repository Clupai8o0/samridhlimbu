'use client'

import { useEffect, useRef, useState } from 'react'

type Props = {
  texts: string[]
  speed?: number
  pauseDuration?: number
  startDelay?: number
  className?: string
  cursorClassName?: string
}

export function Typewriter({
  texts,
  speed = 80,
  pauseDuration = 2200,
  startDelay = 0,
  className,
  cursorClassName,
}: Props) {
  const longest = useRef(texts.reduce((a, b) => (a.length > b.length ? a : b), '')).current
  const [display, setDisplay] = useState(texts[0] ?? '')

  useEffect(() => {
    if (!texts.length) return
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(texts[0] ?? '')
      return
    }

    let textIndex = 0
    let charIndex = texts[0]?.length ?? 0
    let isDeleting = charIndex > 0
    let timer: ReturnType<typeof setTimeout>

    const step = () => {
      const current = texts[textIndex]
      if (isDeleting) {
        charIndex--
        setDisplay(current.substring(0, charIndex))
        if (charIndex === 0) {
          isDeleting = false
          textIndex = (textIndex + 1) % texts.length
          timer = setTimeout(step, speed * 2)
        } else {
          timer = setTimeout(step, speed / 2)
        }
      } else {
        charIndex++
        setDisplay(current.substring(0, charIndex))
        if (charIndex === current.length) {
          isDeleting = true
          timer = setTimeout(step, pauseDuration)
        } else {
          timer = setTimeout(step, speed + Math.random() * 30)
        }
      }
    }

    const initialDelay = (texts[0]?.length ?? 0) > 0 ? startDelay + pauseDuration : startDelay
    timer = setTimeout(step, initialDelay)
    return () => clearTimeout(timer)
  }, [texts, speed, pauseDuration, startDelay])

  return (
    <span style={{ display: 'inline-grid' }}>
      <span aria-hidden="true" style={{ gridArea: '1 / 1', visibility: 'hidden', whiteSpace: 'pre' }}>
        {longest}
      </span>
      <span style={{ gridArea: '1 / 1' }} className={className}>
        {display}
        <span className={cursorClassName ?? 't2-cursor thin'} />
      </span>
    </span>
  )
}
