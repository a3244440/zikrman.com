import { motion, type HTMLMotionProps } from 'motion/react'

const ease = [0.16, 1, 0.3, 1] as const

/** Плавное появление блока при прокрутке. */
export function Reveal({
  delay = 0,
  y = 40,
  children,
  ...props
}: HTMLMotionProps<'div'> & { delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, delay, ease }}
      {...props}
    >
      {children}
    </motion.div>
  )
}

/** Текст, который выезжает снизу из «маски» по словам. */
export function MaskText({
  text,
  className,
  delay = 0,
  stagger = 0.08,
  as = 'span',
}: {
  text: string
  className?: string
  delay?: number
  stagger?: number
  as?: 'span' | 'h1' | 'h2' | 'h3' | 'p'
}) {
  // Следим за видимостью обёртки: сами слова спрятаны маской и никогда не «видны».
  const Tag = motion[as] as typeof motion.span
  const lines = text.split('\n')
  let index = 0
  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-5% 0px' }}
    >
      <span className="sr-only">{text.replace(/\n/g, ' ')}</span>
      {lines.map((line, li) => {
        const words = line.split(' ')
        return (
          <span key={li} className="block" aria-hidden>
            {words.map((word, wi) => {
              const i = index++
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                  <motion.span
                    className="inline-block"
                    variants={{ hidden: { y: '110%' }, show: { y: 0 } }}
                    transition={{ duration: 1, delay: delay + i * stagger, ease }}
                  >
                    {word}
                    {wi < words.length - 1 ? '\u00a0' : ''}
                  </motion.span>
                </span>
              )
            })}
          </span>
        )
      })}
    </Tag>
  )
}
