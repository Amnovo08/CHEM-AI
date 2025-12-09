import React, { useEffect, useState } from 'react';

export type AnimationType = 'mixing' | 'fire' | 'gas' | 'solid' | 'neutral' | 'idle';

interface ReactionAnimatorProps {
  status: AnimationType;
  color1?: string; // Hex or tailwind class representative
  color2?: string;
  liquidColor?: string; // Explicit override for liquid color
  showBall?: boolean; // Show a floating metal ball (e.g. Sodium)
  flameColor?: string; // Override flame color
  particleColor?: string; // Color of solid particles/precipitate
}

const ReactionAnimator: React.FC<ReactionAnimatorProps> = ({ 
    status, 
    color1 = '#3b82f6', 
    color2 = '#a855f7',
    liquidColor,
    showBall = false,
    flameColor = '#f97316',
    particleColor = '#ffffff'
}) => {
  const [bubbles, setBubbles] = useState<{id: number, x: number, delay: number, size: number}[]>([]);
  const [particles, setParticles] = useState<{id: number, x: number, y: number, angle: number, speed: number, delay: number}[]>([]);

  // Initialize random elements based on status
  useEffect(() => {
    if (status === 'gas' || status === 'mixing' || status === 'neutral' || (status === 'fire' && showBall)) {
      const newBubbles = Array.from({ length: 15 }).map((_, i) => ({
        id: i,
        x: 20 + Math.random() * 60,
        delay: Math.random() * 2,
        size: 2 + Math.random() * 4
      }));
      setBubbles(newBubbles);
    } else {
      setBubbles([]);
    }

    if ((status === 'fire' && !showBall) || status === 'solid') {
       const newParticles = Array.from({ length: 25 }).map((_, i) => ({
         id: i,
         x: 30 + Math.random() * 40,
         y: 40,
         angle: Math.random() * 360,
         speed: 1.5 + Math.random() * 2,
         delay: Math.random() * 2
       }));
       setParticles(newParticles);
    } else {
        setParticles([]);
    }
  }, [status, showBall]);

  if (status === 'idle') return null;

  // Determine effective liquid color
  let effectiveLiquidColor = "url(#gradMix)";
  
  if (liquidColor) {
      effectiveLiquidColor = liquidColor;
  } else {
      if (status === 'fire') effectiveLiquidColor = "#ef4444";
      if (status === 'gas') effectiveLiquidColor = "#22d3ee";
      if (status === 'solid') effectiveLiquidColor = "#cbd5e1"; // Light gray/clear for precipitate default
      if (status === 'neutral') effectiveLiquidColor = "#10b981";
  }

  return (
    <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
      <style>{`
        @keyframes floatBubble {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-60px) scale(1.2); opacity: 0; }
        }
        @keyframes shakeFlask {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
        @keyframes liquidWave {
          0% { transform: skewY(0deg); }
          25% { transform: skewY(2deg); }
          75% { transform: skewY(-2deg); }
          100% { transform: skewY(0deg); }
        }
        @keyframes explode {
           0% { transform: scale(0); opacity: 1; }
           100% { transform: scale(2); opacity: 0; }
        }
        @keyframes precipitateFall {
            0% { transform: translateY(0) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            90% { transform: translateY(50px) rotate(180deg); opacity: 1; }
            100% { transform: translateY(55px) rotate(180deg); opacity: 0; } /* Fade out as they "settle" conceptually */
        }
        @keyframes moveWildly {
            0% { transform: translate(0, 0); }
            20% { transform: translate(-15px, 2px); }
            40% { transform: translate(10px, -2px); }
            60% { transform: translate(-5px, 1px); }
            80% { transform: translate(15px, -1px); }
            100% { transform: translate(0, 0); }
        }
      `}</style>

      <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl overflow-visible">
        <defs>
          <linearGradient id="gradMix" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color1} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color2} stopOpacity="0.8" />
          </linearGradient>
          <radialGradient id="gradFire" cx="50%" cy="50%" r="50%">
             <stop offset="0%" stopColor="#fef08a" />
             <stop offset="50%" stopColor={flameColor} />
             <stop offset="100%" stopColor={flameColor} stopOpacity="0" />
          </radialGradient>
          <radialGradient id="gradSilver" cx="40%" cy="40%" r="60%">
             <stop offset="0%" stopColor="#ffffff" />
             <stop offset="100%" stopColor="#94a3b8" />
          </radialGradient>
        </defs>

        {/* Effects Layer Behind Flask */}
        {status === 'fire' && (
            <circle cx="50" cy="70" r="40" fill="url(#gradFire)" className="animate-pulse" style={{ animationDuration: '0.3s' }} />
        )}

        {/* Flask Body */}
        <g className={status === 'mixing' || (status === 'fire' && !showBall) ? 'animate-[shakeFlask_0.5s_ease-in-out_infinite]' : ''} style={{ transformOrigin: '50% 80%' }}>
            {/* Glass Container */}
            <path 
                d="M 35 10 L 35 40 L 15 90 Q 10 100 25 105 L 75 105 Q 90 100 85 90 L 65 40 L 65 10 Z" 
                fill="rgba(255, 255, 255, 0.1)" 
                stroke="rgba(255, 255, 255, 0.5)" 
                strokeWidth="2"
            />
            
            {/* Liquid */}
            <clipPath id="flaskClip">
                <path d="M 36 45 L 17 90 Q 12 100 25 103 L 75 103 Q 88 100 83 90 L 64 45 Z" />
            </clipPath>
            
            <g clipPath="url(#flaskClip)">
                <rect 
                    x="0" y="40" width="100" height="70" 
                    fill={effectiveLiquidColor} 
                    className={status === 'mixing' || showBall ? 'animate-[liquidWave_1s_ease-in-out_infinite]' : ''}
                    style={{ transition: 'fill 1s ease' }}
                />
                
                {/* Floating Metal Ball (e.g. Sodium) */}
                {showBall && (
                    <circle 
                        cx="50" cy="48" r="6" 
                        fill="url(#gradSilver)" 
                        className="animate-[moveWildly_2s_ease-in-out_infinite]"
                        style={{ filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.3))" }}
                    />
                )}

                {/* Bubbles for Gas/Mixing */}
                {(status === 'gas' || status === 'mixing' || status === 'neutral' || showBall) && bubbles.map(b => (
                    <circle 
                        key={b.id} 
                        cx={b.x} 
                        cy={100} 
                        r={b.size} 
                        fill="rgba(255,255,255,0.4)"
                        style={{ 
                            animation: `floatBubble ${2 + b.delay}s infinite linear`,
                            animationDelay: `${b.delay}s`
                        }}
                    />
                ))}

                {/* Solid Precipitate/Crystal Particles */}
                {status === 'solid' && (
                    <>
                        {/* Falling particles */}
                        {particles.map(p => (
                            <rect
                                key={p.id}
                                x={p.x}
                                y={45}
                                width={4}
                                height={4}
                                fill={particleColor}
                                style={{
                                    animation: `precipitateFall ${2 + p.speed}s linear infinite`,
                                    animationDelay: `${p.delay}s`,
                                    opacity: 0.8
                                }}
                            />
                        ))}
                        {/* Accumulated Sediment at bottom */}
                        <path 
                            d="M 20 100 Q 50 95 80 100 L 80 105 L 20 105 Z" 
                            fill={particleColor} 
                            opacity="0.9"
                            className="animate-pulse"
                            style={{ animationDuration: '3s' }}
                        />
                    </>
                )}
            </g>

            {/* Flask Highlights */}
            <path d="M 75 105 Q 85 100 80 90 L 65 50" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" />
            <path d="M 25 105 Q 15 100 20 90 L 30 60" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Explosive Particles Layer (Front) */}
        {status === 'fire' && !showBall && (
             <g transform="translate(50, 60)">
                {particles.map(p => (
                    <circle 
                        key={p.id}
                        cx="0" cy="0" r="2"
                        fill={flameColor}
                        style={{
                            animation: `explode 0.8s ease-out infinite`,
                            animationDelay: `${Math.random() * 0.5}s`,
                            transformBox: 'fill-box',
                            transformOrigin: 'center',
                        }}
                    />
                ))}
             </g>
        )}
      </svg>
    </div>
  );
};

export default ReactionAnimator;