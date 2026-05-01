import React, { useId } from 'react'

function Select({
    options,
    label,
    className = "",
    ...props
}, ref) {
    const id = useId()
  return (
    <div className='w-full'>
        {label && <label htmlFor={id} className='inline-block mb-1 pl-1 brutalist-label'>{label}</label>}
        <div className='relative'>
          <select
            {...props}
            id={id}
            ref={ref}
            className={`w-full px-4 py-3 rounded-t-lg outline-none transition-material appearance-none cursor-pointer ${className}`}
            style={{
              background: 'var(--color-glass)',
              color: 'var(--color-ivory)',
              fontFamily: 'var(--font-body)',
              borderBottom: '2px solid var(--color-umber)',
            }}
            onFocus={(e) => {
              e.target.style.borderBottomColor = 'var(--color-burgundy)'
              e.target.style.background = 'var(--color-glass-heavy)'
            }}
            onBlur={(e) => {
              e.target.style.borderBottomColor = 'var(--color-umber)'
              e.target.style.background = 'var(--color-glass)'
            }}
          >
              {options?.map((option) => (
                  <option key={option} value={option} style={{ background: 'var(--color-obsidian-light)', color: 'var(--color-ivory)' }}>
                      {option}
                  </option>
              ))}
          </select>
          {/* Custom SVG arrow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <svg className="w-4 h-4" style={{ fill: 'var(--color-taupe)' }} viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
          </div>
        </div>
    </div>
  )
}

export default React.forwardRef(Select)