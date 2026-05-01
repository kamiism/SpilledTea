import React from 'react'

export default function Button({
    children,
    type = 'button',
    bgColor = '',
    textColor = '',
    className = '',
    ...props
}) {
  return (
    <button 
      type={type}
      className={`btn-nerv ${className}`}
      {...props}
    >
        {children}
    </button>
  )
}