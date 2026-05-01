import { Link } from 'react-router-dom'
import { Logo } from '../index'

function Footer() {
  return (
    <footer 
      className="mt-auto pt-16 pb-8"
      style={{
        background: 'var(--color-obsidian)',
        borderTop: '3px solid var(--color-burgundy)', // Brutalist accent
      }}
    >
        <div className="container-strict px-4 lg:px-8">
            <div className="flex flex-wrap -m-6 mb-12">
                <div className="w-full md:w-1/2 lg:w-5/12 p-6">
                    <div className="flex flex-col justify-between h-full">
                        <div className="mb-6">
                            <Logo width="100px" />
                            <p 
                              className="mt-6 text-base"
                              style={{ color: 'var(--color-ivory-muted)', maxWidth: '280px' }}
                            >
                              A premium space where every story finds its voice. Brew your thoughts, spill the teas.
                            </p>
                        </div>
                        <div>
                            <p className="text-sm" style={{ color: 'var(--color-umber)' }}>
                                &copy; {new Date().getFullYear()} SpilledTea. All rights reserved.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="w-full sm:w-1/2 lg:w-2/12 p-6">
                    <h4 className="mb-6 brutalist-label">Company</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Features
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Pricing
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Press Kit
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="w-full sm:w-1/2 lg:w-2/12 p-6">
                    <h4 className="mb-6 brutalist-label">Support</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Account
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Help Center
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="w-full sm:w-1/2 lg:w-3/12 p-6">
                    <h4 className="mb-6 brutalist-label">Legals</h4>
                    <ul className="space-y-4">
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Terms &amp; Conditions
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link className="text-base hover:text-[var(--color-taupe)] transition-material" to="/" style={{ color: 'var(--color-ivory-muted)' }}>
                                Licensing
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            <div 
              className="pt-8 border-t flex justify-center text-sm"
              style={{ 
                borderColor: 'var(--color-umber)', 
                color: 'var(--color-taupe-muted)' 
              }}
            >
                Brewed with care ☕
            </div>
        </div>
    </footer>
  )
}

export default Footer