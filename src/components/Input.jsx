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
                className='inline-block mb-1 pl-1 brutalist-label' 
                htmlFor={id}>
                {label}
            </label>}
            <input
                type={type}
                className={`w-full px-4 py-3 rounded-t-lg outline-none transition-material ${className}`}
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
                ref={ref}
                {...props}
                id={id}
            />
        </div>
    )
})

export default Input