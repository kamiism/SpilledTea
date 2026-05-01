import { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ProfileDropdown } from '../index'

function Header() {
  const authStatus = useSelector((state) => state.auth.status)
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  const navItems = [
    { name: 'HOME', slug: "/", active: true },
    { name: "LOGIN", slug: "/login", active: !authStatus },
    { name: "SIGNUP", slug: "/signup", active: !authStatus },
    { name: "ALL POSTS", slug: "/all-posts", active: authStatus },
    { name: "ADD POST", slug: "/add-post", active: authStatus },
  ]

  const isActive = (slug) => location.pathname === slug

  return (
    <header 
      className='sticky top-0 z-50'
      style={{
        background: 'var(--color-eva-black)',
        borderBottom: '1px solid var(--color-eva-orange)',
        boxShadow: '0 1px 0 rgba(255,102,0,0.3)',
      }}
    >
      <div className="container-strict px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className='shrink-0 flex items-center gap-4'>
          <Link to='/' className='flex items-center gap-3'>
            <div className="w-8 h-8 flex items-center justify-center" style={{ background: 'var(--color-eva-orange)' }}>
              <svg viewBox="0 0 24 24" fill="var(--color-eva-black)" className="w-6 h-6">
                <path d="M12 2L2 22h20L12 2zm0 4.5l6.5 13.5h-13L12 6.5z"/>
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-eva-orange font-bold text-xl leading-none" style={{ fontFamily: 'var(--font-heading)', letterSpacing: '0.1em' }}>SPILLEDTEA</span>
              <span className="text-eva-green text-[10px] leading-none mt-1" style={{ fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>CLASSIFIED ARCHIVE SYSTEM</span>
            </div>
          </Link> 
        </div>

        {/* Desktop Nav */}
        <ul className='hidden md:flex items-center gap-6 ml-auto'>
          {navItems.map((item) => 
            item.active ? (
              <li key={item.name}>
                <button
                  onClick={() => navigate(item.slug)}
                  className='relative text-sm tracking-widest'
                  style={{
                    fontFamily: 'var(--font-heading)',
                    color: isActive(item.slug) ? 'var(--color-eva-orange)' : 'var(--color-eva-muted)',
                    textShadow: isActive(item.slug) ? '0 0 8px rgba(255,102,0,0.4)' : 'none'
                  }}
                >
                  {item.name}
                  {isActive(item.slug) && <span className="nav-cursor">▮</span>}
                  <span 
                    className='absolute -bottom-1 left-0 h-0.5 bg-eva-orange transition-all duration-300'
                    style={{
                      width: isActive(item.slug) ? '100%' : '0%',
                    }}
                  />
                  <style>{`
                    button:hover { color: var(--color-eva-orange) !important; }
                    button:hover span.absolute { width: 100% !important; }
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
          className='md:hidden flex flex-col gap-1.25 p-2'
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <span className='block w-6 h-0.5 bg-eva-orange'></span>
          <span className='block w-6 h-0.5 bg-eva-orange'></span>
          <span className='block w-6 h-0.5 bg-eva-orange'></span>
        </button>
      </div>

      {mobileOpen && (
        <div className='md:hidden absolute top-full left-0 w-full bg-eva-navy border-b border-eva-orange'>
          <ul className='flex flex-col p-4 gap-2'>
            {navItems.map((item) => 
              item.active ? (
                <li key={item.name}>
                  <button
                    onClick={() => { navigate(item.slug); setMobileOpen(false); }}
                    className='w-full text-left px-4 py-3 text-sm font-semibold uppercase tracking-wider transition-colors'
                    style={{
                      fontFamily: 'var(--font-heading)',
                      color: isActive(item.slug) ? 'var(--color-eva-orange)' : 'var(--color-eva-muted)',
                      borderLeft: isActive(item.slug) ? '2px solid var(--color-eva-orange)' : '2px solid transparent',
                      background: isActive(item.slug) ? 'rgba(255,102,0,0.05)' : 'transparent'
                    }}
                  >
                    {isActive(item.slug) ? `> ${item.name}` : item.name}
                  </button>
                </li>
              ) : null
            )}
            {authStatus && (
              <li className='mt-2 pt-4 border-t border-eva-border'>
                <div className='px-4 text-eva-orange'><ProfileDropdown /></div>
              </li>
            )}
          </ul>
        </div>
      )}

    </header>
  )
}

export default Header