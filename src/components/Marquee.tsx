import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from 'motion/react'
import { useRef } from 'react'

function wrap(min: number, max: number, v: number) {
  const range = max - min
  return ((((v - min) % range) + range) % range) + min
}

/** Бегущая строка, которая ускоряется и меняет направление при прокрутке. */
export function Marquee({ items, baseVelocity = -2.5, className = '' }: {
  items: string[]
  baseVelocity?: number
  className?: string
}) {
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const scrollVelocity = useVelocity(scrollY)
  const smoothVelocity = useSpring(scrollVelocity, { damping: 50, stiffness: 400 })
  const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const direction = useRef(1)

  useAnimationFrame((_, delta) => {
    let moveBy = direction.current * baseVelocity * (delta / 1000)
    const vf = velocityFactor.get()
    if (vf < 0) direction.current = -1
    else if (vf > 0) direction.current = 1
    moveBy += direction.current * moveBy * vf
    baseX.set(baseX.get() + moveBy)
  })

  const row = (
    <span className="flex shrink-0 items-center">
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
        {row}
        {row}
        {row}
        {row}
      </motion.div>
    </div>
  )
}
