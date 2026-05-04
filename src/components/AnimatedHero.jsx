import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedHero({ title = "SPILLEDTEA", className = "" }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className={`relative w-full h-auto ${className}`}>
      {/* Aurora Background */}
      <div
        className="relative w-full min-h-screen flex items-center justify-center"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              100deg,
              rgba(255,80,0,0.08) 0%,
              rgba(255,80,0,0.08) 7%,
              transparent 10%,
              transparent 12%,
              rgba(255,80,0,0.08) 16%
            ),
            repeating-linear-gradient(
              100deg,
              #1a0a2e 10%,
              #0d1f3c 15%,
              #1a0a2e 20%,
              #0a1628 25%,
              #2d0a1a 30%
            )
          `,
          backgroundSize: "300%, 200%",
          backgroundPosition: "50% 50%, 50% 50%",
          filter: "blur(8px) opacity(0.85) saturate(2)",
          maskImage: "radial-gradient(ellipse at 60% 50%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at 60% 50%, black 30%, transparent 80%)",
        }}
      >
        <div
          className="absolute inset-0 animate-aurora-bg"
          style={{
            backgroundImage: `
              repeating-linear-gradient(
                100deg,
                rgba(255,80,0,0.05) 0%,
                rgba(255,80,0,0.05) 7%,
                transparent 10%,
                transparent 12%,
                rgba(100,0,255,0.05) 16%
              ),
              repeating-linear-gradient(
                100deg,
                #1a0a2e 10%,
                #0d1f3c 15%,
                #3d0a2e 20%,
                #0a1628 25%,
                #1a0a2e 30%
              )
            `,
            backgroundSize: "200%, 100%",
            backgroundAttachment: "fixed",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Title */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="font-black relative leading-tight tracking-tight select-none text-center px-4"
          style={{ fontSize: "clamp(4rem, 2rem + 8vw, 10rem)" }}
        >
          {/* Base visible text */}
          <span
            style={{
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,100,0,0.6)',
              display: 'block',
            }}
          >
            {title}
          </span>
          {/* Glowing overlay text */}
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ff6600 0%, #cc4400 30%, #7b2fff 60%, #4e8ca0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'blur(0px)',
            }}
          >
            {title}
          </span>
          {/* Glow bloom */}
          <span
            className="absolute inset-0 flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, #ff6600 0%, #7b2fff 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'blur(12px)',
              opacity: 0.4,
            }}
          >
            {title}
          </span>
        </motion.h1>
      </div>
    </section>
  );
}

export default AnimatedHero;