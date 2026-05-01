import React from 'react'

export default function Button({
    children,
    type = 'button',
    bgColor = 'bg-burgundy', // kept for backwards compatibility but we override via style
    textColor = 'text-white',
    className = '',
    ...props
}) {
  const isBurgundy = bgColor.includes('burgundy') || !bgColor.includes('red') && !bgColor.includes('green')
  
  return (
    <button 
      className={`px-6 py-3 font-semibold uppercase tracking-wider text-sm rounded-lg tea-ripple transition-material elevation-1 ${className}`}
      style={{
        fontFamily: 'var(--font-body)',
        color: 'var(--color-ivory)',
        background: isBurgundy ? 'var(--color-burgundy)' : `var(--color-${bgColor.split('-')[1]})`,
        border: isBurgundy ? '2px solid var(--color-burgundy)' : '2px solid transparent',
      }}
      onMouseEnter={(e) => {
        if (!props.disabled) {
          e.target.style.transform = 'translateY(-2px)'
          e.target.style.boxShadow = isBurgundy ? 'var(--shadow-glow-burgundy)' : 'var(--shadow-elevation-2)'
          if (isBurgundy) {
            e.target.style.background = 'var(--color-burgundy-light)'
            e.target.style.borderColor = 'var(--color-burgundy-light)'
          }
        }
      }}
      onMouseLeave={(e) => {
        if (!props.disabled) {
          e.target.style.transform = 'translateY(0)'
          e.target.style.boxShadow = 'var(--shadow-elevation-1)'
          if (isBurgundy) {
            e.target.style.background = 'var(--color-burgundy)'
            e.target.style.borderColor = 'var(--color-burgundy)'
          }
        }
      }}
      {...props}
    >
        {children}
    </button>
  )
}