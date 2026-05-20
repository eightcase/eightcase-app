/**
 * Editorial Didone double-story “g” for eightcase.
 * Upper bowl + hairline link + deep lower loop (subtle figure-eight silhouette).
 * Baseline in viewBox: y = 30
 */
export function EightcaseGMark({
  className,
  fill = "currentColor",
}: {
  className?: string;
  fill?: string;
}) {
  const hairline = 0.7;

  return (
    <svg
      viewBox="0 0 42 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      {/* Ear */}
      <path
        d="M23.4 5.2h3.8"
        stroke={fill}
        strokeWidth={hairline}
        strokeLinecap="round"
      />

      {/* Upper bowl — thick vertical, open counter */}
      <path
        fill={fill}
        d="M8.8 19
           C5.8 19 3.6 16.4 3.6 12.8
           C3.6 8.2 7.8 4.4 13.2 4.4
           C19 4.4 23 8 23 12.2
           C23 15 21.4 17.2 19 18
           L19 19.2
           C18.2 19.8 17.2 19.4 17 18.6
           C15.2 16.8 14 14.4 14 11.8
           C14 9.2 16 7.2 18.4 7.2
           C20.4 7.2 21.8 8.4 22.2 10.2
           C22.5 11.6 21.8 12.8 20.6 13.4
           L20.2 18.6
           L22.8 18.2
           L23 20.8
           L18.6 21.4
           Z"
      />

      {/* Hairline bridge */}
      <path
        d="M18.8 20.4 C18.4 22.2 17.8 24.2 17.4 26"
        stroke={fill}
        strokeWidth={hairline}
        strokeLinecap="round"
      />

      {/* Lower loop — large, descends below baseline; echoes “8” with upper bowl */}
      <ellipse
        cx="16.8"
        cy="35.5"
        rx="9.2"
        ry="9"
        stroke={fill}
        strokeWidth="2.65"
        fill="none"
      />
      <path
        d="M17.4 26.2
           C13.6 24.6 9.6 26.8 8.4 31
           C7 36.2 10.4 41.4 16 42.2
           C22.2 43.2 28 38.4 28 32.4
           C28 27.6 24.2 23.8 19.2 24.4"
        stroke={fill}
        strokeWidth={hairline}
        strokeLinecap="round"
        fill="none"
      />
      {/* Counter cut on lower loop (right opening) */}
      <path
        d="M22.4 26.8 C24.8 28.2 26.2 30.6 26.2 33.2"
        stroke={fill}
        strokeWidth={hairline}
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

/** Baseline coordinate inside the g mark viewBox */
export const EIGHTCASE_G_BASELINE = 30;
