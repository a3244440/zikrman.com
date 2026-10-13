import { motion, useMotionValue, useTransform, type MotionValue } from 'motion/react'
import { useId } from 'react'
import { site } from '../config'
import { LOGO_HEIGHT, LOGO_WIDTH, LOGO_WIDTH_WITH_MARK, logoLetters, registeredMark } from './logo-paths'

/** Логотип ZIKR. Цвет берётся из currentColor, размер — из className (например, h-7 w-auto). */
export function Logo({ className = '', mark = true }: { className?: string; mark?: boolean }) {
  const width = mark ? LOGO_WIDTH_WITH_MARK : LOGO_WIDTH
  const height = mark ? 128 : LOGO_HEIGHT
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={`block ${className}`} fill="currentColor" role="img" aria-label={site.brand}>
      {logoLetters.map((l) => (
        <path key={l.char} d={l.d} />
      ))}
      {mark && <path d={registeredMark} fillRule="evenodd" />}
    </svg>
  )
}

const ease = [0.16, 1, 0.3, 1] as const

/**
 * Логотип, который появляется по буквам (каждая выезжает снизу из своей маски).
 * Если передан progress (0…1), буквы разлетаются от центра и поворачиваются.
 */
export function AnimatedLogo({
  play,
  progress,
  className = '',
  delay = 0.15,
}: {
  play: boolean
  progress?: MotionValue<number>
  className?: string
  delay?: number
}) {
  const id = useId().replace(/:/g, '')
  const center = (logoLetters.length - 1) / 2
  return (
    <svg
      viewBox={`0 0 ${LOGO_WIDTH} ${LOGO_HEIGHT}`}
      className={`block overflow-visible ${className}`}
      fill="currentColor"
      role="img"
      aria-label={site.brand}
    >
      <defs>
        {logoLetters.map((l, i) => (
          <clipPath key={l.char} id={`${id}-${i}`}>
            <rect x={l.x0 - 2} y={-2} width={l.x1 - l.x0 + 4} height={LOGO_HEIGHT + 4} />
          </clipPath>
        ))}
      </defs>
      {logoLetters.map((l, i) => (
        <Letter key={l.char} d={l.d} clip={`url(#${id}-${i})`} offset={i - center} play={play} progress={progress} delay={delay} />
      ))}
    </svg>
  )
}

function Letter({
  d,
  clip,
  offset,
  play,
  progress,
  delay,
}: {
  d: string
  clip: string
  offset: number
  play: boolean
  progress?: MotionValue<number>
  delay: number
}) {
  const fallback = useMotionValue(0)
  const p = progress ?? fallback
  const x = useTransform(p, [0, 1], [0, offset * 75])
  const rotate = useTransform(p, [0, 1], [0, offset * 6])
  return (
    <motion.g style={{ x, rotate, transformBox: 'fill-box', transformOrigin: 'center' }}>
      <g clipPath={clip}>
        <motion.path
          d={d}
          initial={{ y: LOGO_HEIGHT * 1.1 }}
          animate={play ? { y: 0 } : undefined}
          transition={{ duration: 1.2, delay: delay + Math.abs(offset) * 0.12, ease }}
        />
      </g>
    </motion.g>
  )
}
