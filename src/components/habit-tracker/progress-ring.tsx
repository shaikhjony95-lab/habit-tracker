"use client";

import { motion } from "framer-motion";

interface ProgressRingProps {
  /** Progress value between 0 and 1 */
  progress: number;
  /** Diameter of the ring in pixels */
  size?: number;
  /** Width of the ring stroke in pixels */
  strokeWidth?: number;
  /** Color for the progress stroke (any valid CSS color) */
  color?: string;
  /** Whether to show the percentage label in the center */
  showLabel?: boolean;
  /** Optional label text displayed below the percentage */
  label?: string;
  /** Additional CSS class names */
  className?: string;
}

export function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  color = "hsl(var(--primary))",
  showLabel = true,
  label,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const clampedProgress = Math.min(1, Math.max(0, progress));

  const center = size / 2;

  return (
    <div className={`relative inline-flex items-center justify-center ${className ?? ""}`}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {/* Background ring */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted-foreground/20"
        />

        {/* Progress ring */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: circumference * (1 - clampedProgress) }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      {/* Center label */}
      {showLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="text-muted-foreground leading-none font-semibold tabular-nums"
            style={{ fontSize: `${Math.max(size * 0.2, 12)}px` }}
          >
            {Math.round(clampedProgress * 100)}%
          </span>
          {label && (
            <span
              className="text-muted-foreground/70 mt-0.5 truncate max-w-[70%] text-center leading-tight"
              style={{ fontSize: `${Math.max(size * 0.1, 8)}px` }}
            >
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
