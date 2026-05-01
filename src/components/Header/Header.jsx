import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Logo, ProfileDropdown } from '../index'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: 'Home', slug: "/", active: true },
    { name: "Login", slug: "/login", active: !authStatus },
    { name: "Signup", slug: "/signup", active: !authStatus },
    { name: "All Posts", slug: "/all-posts", active: authStatus },
    { name: "Add Post", slug: "/add-post", active: authStatus },
  ]

  const isActive = (slug) => location.pathname === slug

  return (
    <header 
      className='sticky top-0 z-50 glass-surface elevation-1'
      style={{
        borderRadius: 0, // Header should span full width without rounded corners
        borderLeft: 'none',
        borderRight: 'none',
        borderTop: 'none',
      }}
    >
      <div className="container-strict px-4 lg:px-8 h-20 flex items-center justify-between">
        <div className='shrink-0'>
          <Link to='/' className='block transition-material hover:opacity-80'>
            <Logo width='64px' />
          </Link> 
        </div>

        {/* Desktop Nav */}
        <ul className='hidden md:flex items-center gap-2 ml-auto'>
          {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className='px-4 py-2 text-sm font-semibold uppercase tracking-wider transition-material relative group'
                  style={{
                    fontFamily: 'var(--font-body)',
                    color: isActive(item.slug) ? 'var(--color-ivory)' : 'var(--color-ivory-muted)',
                  }}
                >
                  {item.name}
                  {/* Burgundy active/hover underline */}
                  <span 
                    className='absolute bottom-0 left-0 w-full h-[3px] transition-material'
                    style={{
                      background: 'var(--color-burgundy)',
                      transform: isActive(item.slug) ? 'scaleX(1)' : 'scaleX(0)',
                      transformOrigin: 'left',
                    }}
                  />
                  {/* Hover effect without overwriting active state */}
                  <style>{`
                    button:hover span { transform: scaleX(1) !important; }
                    button:hover { color: var(--color-ivory) !important; }
                  `}</style>
                </button>
              </li>
            ) : null
          )}
          {authStatus && (
            <li className='ml-4'>
              <ProfileDropdown />
            </li>
          )}
        </ul>

        {/* Mobile Hamburger */}
        <button 
          className='md:hidden flex flex-col gap-[5px] p-2'
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle navigation"
        >
          <span className='block w-6 h-[2px] transition-material' style={{
            background: 'var(--color-ivory)',
            transform: mobileOpen ? 'rotate(45deg) translateY(5px)' : 'none'
          }}></span>
          <span className='block w-6 h-[2px] transition-material' style={{
            background: 'var(--color-ivory)',
            opacity: mobileOpen ? 0 : 1
          }}></span>
          <span className='block w-6 h-[2px] transition-material' style={{
            background: 'var(--color-ivory)',
            transform: mobileOpen ? 'rotate(-45deg) translateY(-5px)' : 'none'
          }}></span>
        </button>
      </div>

      {/* Mobile Menu Panel */}
      {mobileOpen && (
        <div className='md:hidden absolute top-full left-0 w-full glass-surface-heavy border-t-0 rounded-t-none animate-slide-up elevation-2'>
          <ul className='flex flex-col p-4 gap-2'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => { navigate(item.slug); setMobileOpen(false); }}
                    className='w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider rounded-lg transition-material'
                    style={{
                      fontFamily: 'var(--font-body)',
                      color: isActive(item.slug) ? 'var(--color-ivory)' : 'var(--color-ivory-muted)',
                      background: isActive(item.slug) ? 'var(--color-obsidian-lighter)' : 'transparent',
                      borderLeft: isActive(item.slug) ? '4px solid var(--color-burgundy)' : '4px solid transparent',
                    }}
                  >{item.name}</button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='mt-2 pt-4 border-t border-[var(--color-glass-border)]'>
                <div className='px-4'><ProfileDropdown /></div>
              </li>
            )}
          </ul>
        </div>
      )}
    </header>
  )
}

export default Header