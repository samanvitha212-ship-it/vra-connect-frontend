import { useEffect, useRef, useState } from 'react'

export default function FadeIn({ children, delay = 0, className = '', as: Tag = 'div' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold: 0.15 })
    if (el) obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <Tag
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        animation: visible ? `fade-up 0.7s cubic-bezier(0.25,0.1,0.25,1) ${delay}s both` : 'none',
      }}
    >
      {children}
    </Tag>
  )
}