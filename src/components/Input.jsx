import React, { useId } from 'react'

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId()
    return (
        <div className='w-full'>
            {label && <label 
                className='block mb-2 font-mono text-[var(--color-eva-green)] text-xs uppercase tracking-widest' 
                htmlFor={id}>
                {label}
            </label>}
            <input
                type={type}
                className={`w-full bg-[rgba(0,255,65,0.02)] border border-[var(--color-eva-border)] text-[var(--color-eva-white)] font-mono text-sm px-4 py-3 outline-none transition-all focus:border-[var(--color-eva-orange)] focus:shadow-[0_0_8px_rgba(255,102,0,0.2)] placeholder:text-[rgba(232,232,232,0.3)] rounded-none ${className}`}
                ref={ref}
                {...props}
                id={id}
                style={{ cursor: 'none' }}
            />
        </div>
    )
})

export default Input