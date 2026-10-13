import { animate, AnimatePresence, motion, useMotionValue, useTransform } from 'motion/react'
import { useEffect, useState, useSyncExternalStore } from 'react'
import { site } from '../config'
import { AnimatedLogo, Logo } from './Logo'

/* Простое общее состояние: закончилась ли заставка. Hero ждёт его, чтобы стартовать анимацию. */
const SEEN_KEY = 'zikrman:intro-seen'
let done = (() => {
  try {
    return sessionStorage.getItem(SEEN_KEY) === '1'
  } catch {
    return false
  }
})()
const listeners = new Set<() => void>()
export function skipIntro() {
  if (!done) finish()
}
function finish() {
  done = true
  try {
    sessionStorage.setItem(SEEN_KEY, '1')
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l())
}

export function useIntroDone() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l)
      return () => listeners.delete(l)
    },
    () => done,
  )
}

const ease = [0.76, 0, 0.24, 1] as const

export function Preloader() {
  const introDone = useIntroDone()
  const [visible, setVisible] = useState(!introDone)
  const count = useMotionValue(0)
  const rounded = useTransform(count, (v) => String(Math.round(v)).padStart(3, '0'))
  const width = useTransform(count, (v) => `${v}%`)

  useEffect(() => {
    if (!visible) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const controls = animate(count, 100, {
      duration: reduce ? 0.2 : 1.9,
      ease: [0.65, 0, 0.35, 1],
      onComplete: () => {
        setVisible(false)
        finish()
      },
    })
    return () => controls.stop()
  }, [visible, count])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-ink p-6 text-paper md:p-10"
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          initial={{ clipPath: 'inset(0 0 0% 0)' }}
          transition={{ duration: 1, ease }}
        >
          <div className="flex items-center justify-between eyebrow text-paper/60">
            <Logo className="h-3.5 w-auto" />
            <span>{site.collection}</span>
          </div>

          <div className="flex justify-center">
            <AnimatedLogo play className="h-auto w-[64vw] md:w-[38vw]" />
          </div>

          <div className="flex items-end justify-between">
            <span className="eyebrow text-paper/60">Загрузка коллекции</span>
            <motion.span className="font-display text-5xl font-light tabular-nums md:text-7xl">
              {rounded}
            </motion.span>
          </div>
          <motion.div
            className="absolute bottom-0 left-0 h-[3px] bg-paper"
            style={{ width }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
