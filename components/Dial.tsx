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
  
  // Memoize static background calculations
  const TARGET_ZONES = useMemo(() => [
    { width: 20 * ONE_UNIT_DEG, color: '#eab308' }, // Yellow
    { width: 10 * ONE_UNIT_DEG, color: '#3b82f6' }, // Blue
    { width: 4 * ONE_UNIT_DEG, color: '#22c55e' },  // Green
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
        {/* LAYER 1: Target Zones */}
        <svg viewBox="0 0 360 180" className={`absolute inset-0 w-full h-full overflow-visible z-0 transition-opacity duration-500 ease-in-out ${shouldShowTarget ? 'opacity-100' : 'opacity-0'}`}>
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
                strokeWidth={STROKE_WIDTH}
                strokeDasharray={`${segmentLength} ${gap}`}
                strokeDashoffset={segmentLength / 2}
                transform={`rotate(${valueToDegrees(targetValue) - 90}, 180, 180)`}
               />
             )
           })}
        </svg>

        {/* LAYER 2: Hidden Indicator (Replaces Cover) */}
        <div 
            className={`absolute inset-0 z-10 flex items-end justify-center pb-8 transition-opacity duration-500 ease-in-out pointer-events-none ${shouldShowTarget ? 'opacity-0' : 'opacity-100'}`}
        >
            <span className="text-zinc-700/50 font-black text-4xl tracking-[0.2em] select-none">HIDDEN</span>
        </div>

        {/* LAYER 3: Base Track (Always Visible Frame) */}
        <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full overflow-visible z-20 pointer-events-none drop-shadow-xl">
           <path 
            d="M 20 180 A 160 160 0 0 1 340 180" 
            fill="none" 
            stroke="#374151" 
            strokeWidth={10} 
            strokeLinecap="butt"
          />
           <line x1="180" y1="10" x2="180" y2="30" stroke="#4b5563" strokeWidth="4" />
           <circle cx="180" cy="180" r="14" fill="white" stroke="#1f2937" strokeWidth="4" />
        </svg>

        {/* LAYER 4: Needle */}
        {showNeedle && (
          <svg viewBox="0 0 360 180" className="absolute inset-0 w-full h-full overflow-visible z-30 pointer-events-none">
            <g 
              transform={`rotate(${getPointerAngle(internalValue)}, 180, 180)`} 
              className={`${isDragging ? 'cursor-grabbing' : 'cursor-grab'} transition-transform duration-0 ease-linear pointer-events-auto`}
            >
              <line x1="180" y1="180" x2="180" y2="20" stroke="white" strokeWidth="4" strokeLinecap="round" className="drop-shadow-md" />
              <circle cx="180" cy="20" r="6" fill="#ef4444" stroke="white" strokeWidth="2" />
            </g>
          </svg>
        )}
      </div>

      <div className="flex justify-between w-full px-4 mt-2 text-sm md:text-xl font-black tracking-tight select-none z-0">
        <div className="w-1/2 text-left pr-4 text-blue-300 leading-tight drop-shadow-lg">{leftLabel}</div>
        <div className="w-1/2 text-right pl-4 text-red-300 leading-tight drop-shadow-lg">{rightLabel}</div>
      </div>

    </div>
  );
});

Dial.displayName = 'Dial';