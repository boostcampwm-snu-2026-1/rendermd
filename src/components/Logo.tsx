interface LogoProps {
  size?: number;
  strokeWidth?: number;
  className?: string;
  title?: string;
}

/**
 * rendermd wordmark glyph: a diamond outline with two text-line strokes
 * inside, suggesting "rendered text in a frame." Uses currentColor so it
 * tints to wherever it's placed (--accent for the brand, --fg for buttons).
 */
export function Logo({ size = 20, strokeWidth = 2, className, title = 'rendermd' }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      role="img"
      aria-label={title}
    >
      <path d="M12 2 L22 12 L12 22 L2 12 Z" />
      <line x1="8" y1="10" x2="16" y2="10" />
      <line x1="8" y1="14" x2="13" y2="14" />
    </svg>
  );
}
