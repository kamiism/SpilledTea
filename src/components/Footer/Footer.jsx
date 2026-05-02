import { Link } from 'react-router-dom'
import { Logo } from '../index'

function Footer() {
  return (
    <footer 
      className="mt-auto py-6 border-t border-[var(--color-eva-border)] bg-[var(--color-eva-navy)] relative overflow-hidden"
    >
        {/* Neon accent line */}
        <div className="absolute top-0 left-0 w-full h-[1px] bg-eva-cyan opacity-30 shadow-[0_0_10px_var(--color-eva-cyan)]"></div>
        
        <div className="container-strict px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Brand & Copyright */}
                <div className="flex flex-col items-center md:items-start gap-2">
                    <div className="flex items-center gap-3">
                        <Logo width="40px" />
                        <span className="font-heading text-lg tracking-widest text-eva-white">SPILL_TEA</span>
                    </div>
                    <p className="font-mono text-[10px] text-eva-muted uppercase tracking-widest">
                        &copy; {new Date().getFullYear()} NERV_LOG_SYSTEM // DATA_PROTECTED
                    </p>
                </div>

                {/* Tactical Links (Simplified) */}
                <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 font-mono text-[10px] uppercase tracking-[0.2em]">
                    <Link to="/" className="text-eva-cyan hover:text-eva-white transition-colors">&gt; ARCHIVE</Link>
                    <Link to="/" className="text-eva-cyan hover:text-eva-white transition-colors">&gt; PROTOCOLS</Link>
                    <Link to="/" className="text-eva-cyan hover:text-eva-white transition-colors">&gt; DEPLOYMENT</Link>
                    <Link to="/" className="text-eva-cyan hover:text-eva-white transition-colors">&gt; INTEL_LEGAL</Link>
                </div>

                {/* Status indicator */}
                <div className="hidden lg:flex items-center gap-3 font-mono text-[10px] text-eva-cyan opacity-70">
                    <span className="w-1.5 h-1.5 rounded-full bg-eva-cyan animate-pulse shadow-[0_0_6px_var(--color-eva-cyan)]"></span>
                    <span>MAGI_SYSTEM: SECURE</span>
                </div>
            </div>
            
            {/* Minimalist tagline */}
            <div className="mt-6 pt-4 border-t border-eva-cyan/5 text-center">
                <span className="text-[9px] font-mono text-eva-muted tracking-[0.5em] uppercase">
                    transmitting from sector-07 // terminal_v3.4.1
                </span>
            </div>
        </div>
    </footer>
  )
}

export default Footer