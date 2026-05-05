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
        {label && <label htmlFor={id} className='block mb-2 font-mono text-[var(--color-eva-green)] text-xs uppercase tracking-widest'>{label}</label>}
        <div className='relative'>
          <select
            {...props}
            id={id}
            ref={ref}
            className={`w-full bg-[rgba(0,255,65,0.02)] border border-[var(--color-eva-border)] text-[var(--color-eva-white)] font-mono text-sm px-4 py-3 outline-none appearance-none hover:border-[var(--color-eva-orange)] transition-colors rounded-none ${className}`}
          >
              {options?.map((option) => (
                  <option key={option} value={option} className="bg-[var(--color-eva-panel)] text-[var(--color-eva-white)] uppercase tracking-widest">
                      {option}
                  </option>
              ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
              <span className="text-[var(--color-eva-green)] font-mono text-xs">▼</span>
          </div>
        </div>
    </div>
  )
}

export default React.forwardRef(Select)