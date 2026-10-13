import { motion, useAnimationFrame, useMotionValue, useReducedMotion } from 'motion/react'
import { useRef } from 'react'

/** Бегущая строка с постоянной спокойной скоростью (пикселей в секунду), не зависит от прокрутки. */
export function Marquee({ items, speed = 40, className = '' }: {
  items: string[]
  speed?: number
  className?: string
}) {
  const x = useMotionValue(0)
  const rowRef = useRef<HTMLSpanElement>(null)
  const reduceMotion = useReducedMotion()

  useAnimationFrame((_, delta) => {
    const width = rowRef.current?.offsetWidth ?? 0
    if (!width || reduceMotion) return
    // Сдвигаем на ширину одной копии строки и бесшовно возвращаемся в начало
    let next = x.get() - (speed * delta) / 1000
    if (next <= -width) next += width
    x.set(next)
  })

  const row = (ref?: typeof rowRef) => (
    <span ref={ref} className="flex shrink-0 items-center">
      {items.map((item, i) => (
        <span key={i} className="flex items-center">
          <span className="px-6 md:px-10">{item}</span>
          <span aria-hidden className="text-[0.5em]">✦</span>
        </span>
      ))}
    </span>
  )

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`} aria-label={items.join(', ')}>
      <motion.div className="flex w-max" style={{ x }} aria-hidden>
        {row(rowRef)}
        {row()}
        {row()}
      </motion.div>
    </div>
  )
}
