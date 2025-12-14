import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';

interface DialProps {
  targetValue: number; // 0-100
  currentValue: number; // 0-100
  onChange?: (val: number) => void;
  isInteractive: boolean;
  isRevealed: boolean;
  leftLabel: string;
  rightLabel: string;
  isCoverClosed: boolean;
  showNeedle?: boolean;
}

export const Dial: React.FC<DialProps> = React.memo(({
  targetValue,
  currentValue,
  onChange,
  isInteractive,
  isRevealed,
  leftLabel,
  rightLabel,
  isCoverClosed,
  showNeedle = true,
}) => {
  const dialRef = useRef<HTMLDivElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // Local state for smooth animation during drag
  // We initialize with currentValue, and sync it when not dragging
  const [internalValue, setInternalValue] = useState(currentValue);

  // Sync internal value with prop when not dragging
  // This allows external updates (like reset) to work, but ignores prop updates during drag loop to prevent jitter
  useEffect(() => {
    if (!isDragging) {
      setInternalValue(currentValue);
    }
  }, [currentValue, isDragging]);

  // Constants for geometry
  const STROKE_WIDTH = 40;
  const ONE_UNIT_DEG = 1.8;

  // Convert 0-100 value to degrees (-90 to 90)
  const valueToDegrees = (val: number) => (val / 100) * 180 - 90;
  
  // Memoize static background calculations - high contrast colors
  const TARGET_ZONES = useMemo(() => [
    { width: 20 * ONE_UNIT_DEG, color: '#fbbf24' }, // Amber/Gold outer (4 points)
    { width: 10 * ONE_UNIT_DEG, color: '#22d3ee' }, // Cyan middle (3 points)
    { width: 4 * ONE_UNIT_DEG, color: '#c084fc' },  // Light purple center (2 points - bullseye)
  ], []);

  const getPointerAngle = (val: number) => valueToDegrees(val);

  const handleInteraction = useCallback((clientX: number, clientY: number) => {
    if (!rectRef.current && dialRef.current) {
        rectRef.current = dialRef.current.getBoundingClientRect();
    }
    const rect = rectRef.current;
    if (!rect) return;

    // Anchor at bottom center of the container
    const x = clientX - rect.left - (rect.width / 2);
    const y = clientY - rect.top - (rect.height); 

    // Calculate angle in degrees from the negative x-axis (Left side)
    let angleRad = Math.atan2(y, x);
    let angleDeg = angleRad * (180 / Math.PI);

    let newValue = 50;

    // atan2 returns values from -180 to 180.
    // In our coordinate system (origin bottom-center):
    // -180 is Left (0%), -90 is Top (50%), 0 is Right (100%)
    
    if (angleDeg >= -180 && angleDeg <= 0) {
        newValue = ((angleDeg + 180) / 180) * 100;
    } else {
        // Clamp for lower half interactions to the nearest edge
        if (x < 0) newValue = 0;
        else newValue = 100;
    }

    const clampedValue = Math.max(0, Math.min(100, newValue));
    
    // Update local state immediately for 60fps feel
    setInternalValue(clampedValue);
    
    // Propagate to parent
    onChange?.(clampedValue);
  }, [onChange]);

  const handleStart = (clientX: number, clientY: number) => {
    if (!dialRef.current || !isInteractive || !showNeedle) return;
    rectRef.current = dialRef.current.getBoundingClientRect();
    setIsDragging(true);
    handleInteraction(clientX, clientY);
  };

  const onMouseDown = (e: React.MouseEvent) => {
    handleStart(e.clientX, e.clientY);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if(!isDragging) return;
    if(e.cancelable) e.preventDefault(); 
    handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleInteraction(e.clientX, e.clientY);
  };
  
  // Global release listeners
  useEffect(() => {
    const handleUp = () => {
        setIsDragging(false);
        rectRef.current = null; // Clear cache
    };
    window.addEventListener('mouseup', handleUp);
    window.addEventListener('touchend', handleUp);
    return () => {
        window.removeEventListener('mouseup', handleUp);
        window.removeEventListener('touchend', handleUp);
    }
  }, []);

  const shouldShowTarget = isRevealed || !isCoverClosed;

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto relative no-select select-none">
      
      <div 
        className="relative w-full aspect-[2/1] mb-6 cursor-pointer touch-none select-none"
        ref={dialRef}
        onMouseDown={onMouseDown}
        onTouchStart={onTouchStart}
        onMouseMove={onMouseMove}
        onTouchMove={onTouchMove}
      >
        {/* LAYER 1: Gradient Background Track */}
        <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full overflow-visible z-0 pointer-events-none">
          <defs>
            <linearGradient id="trackGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
              <stop offset="50%" stopColor="#6366f1" stopOpacity="0.2" />
              <stop offset="100%" stopColor="#ec4899" stopOpacity="0.3" />
            </linearGradient>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          <path 
            d="M 20 180 A 160 160 0 0 1 340 180" 
            fill="none" 
            stroke="url(#trackGradient)" 
            strokeWidth={STROKE_WIDTH} 
            strokeLinecap="round"
          />
        </svg>

        {/* LAYER 2: Target Zones */}
        <svg viewBox="0 0 360 180" className={`absolute inset-0 w-full h-full overflow-visible z-10 transition-opacity duration-500 ease-in-out ${shouldShowTarget ? 'opacity-100' : 'opacity-0'}`}>
          {TARGET_ZONES.map((zone, i) => {
            const r = 160;
            const c = 2 * Math.PI * r;
            const segmentLength = (zone.width / 360) * c;
            const gap = c - segmentLength;
            
            return (
              <circle
                key={i}
                cx="180"
                cy="180"
                r="160"
                fill="none"
                stroke={zone.color}
                strokeWidth={STROKE_WIDTH - 4}
                strokeDasharray={`${segmentLength} ${gap}`}
                strokeDashoffset={segmentLength / 2}
                transform={`rotate(${valueToDegrees(targetValue) - 90}, 180, 180)`}
              />
            )
          })}
        </svg>

        {/* LAYER 3: Hidden Indicator */}
        <div 
            className={`absolute inset-0 z-20 flex items-end justify-center pb-8 transition-opacity duration-500 ease-in-out pointer-events-none ${shouldShowTarget ? 'opacity-0' : 'opacity-100'}`}
        >
            <span className="text-zinc-600/40 font-black text-3xl tracking-[0.3em] select-none uppercase">Hidden</span>
        </div>

        {/* LAYER 4: Frame Overlay */}
        <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full overflow-visible z-30 pointer-events-none">
          <defs>
            <linearGradient id="frameGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
            <linearGradient id="pivotGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#6366f1" />
            </linearGradient>
          </defs>
          {/* Outer arc frame */}
          <path 
            d="M 20 180 A 160 160 0 0 1 340 180" 
            fill="none" 
            stroke="url(#frameGradient)" 
            strokeWidth={3} 
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Center tick mark */}
          <line x1="180" y1="8" x2="180" y2="28" stroke="#a855f7" strokeWidth="3" strokeLinecap="round" opacity="0.6" />
          {/* Center pivot */}
          <circle cx="180" cy="180" r="16" fill="#18181b" stroke="url(#pivotGradient)" strokeWidth="3" />
          <circle cx="180" cy="180" r="6" fill="#a855f7" />
        </svg>

        {/* LAYER 5: Needle */}
        {showNeedle && (
          <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full overflow-visible z-40 pointer-events-none">
            <defs>
              <linearGradient id="needleGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
              </linearGradient>
              <filter id="needleShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.5"/>
              </filter>
            </defs>
            <g 
              transform={`rotate(${getPointerAngle(internalValue)}, 180, 180)`} 
              className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} pointer-events-auto`}
              filter="url(#needleShadow)"
            >
              {/* Needle body */}
              <line x1="180" y1="170" x2="180" y2="30" stroke="white" strokeWidth="6" strokeLinecap="round" />
              {/* Needle tip */}
              <circle cx="180" cy="26" r="10" fill="#a855f7" stroke="white" strokeWidth="3" />
            </g>
          </svg>
        )}
      </div>

      <div className="flex justify-between w-full px-4 mt-2 text-sm md:text-xl font-black tracking-tight select-none z-0">
        <div className="w-1/2 text-left pr-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400 leading-tight">{leftLabel}</div>
        <div className="w-1/2 text-right pl-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-orange-400 leading-tight">{rightLabel}</div>
      </div>

    </div>
  );
});

Dial.displayName = 'Dial';