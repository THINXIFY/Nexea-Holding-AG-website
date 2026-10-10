/**
 * Decorative globe drawn as pure linework (meridians + parallels). It is an
 * abstract ornament: it does not plot or imply any operating location.
 */
export function GlobeLines({ className = "" }: { className?: string }) {
  const r = 280;
  const meridians = [0.18, 0.4, 0.62, 0.82];
  const parallels = [-0.72, -0.45, -0.2, 0.05, 0.3, 0.55, 0.78];
  return (
    <svg
      aria-hidden
      focusable="false"
      viewBox="0 0 600 600"
      fill="none"
      className={className}
    >
      <g stroke="currentColor" strokeWidth="1">
        <circle cx="300" cy="300" r={r} />
        <line x1="300" y1={300 - r} x2="300" y2={300 + r} />
        {meridians.map((m) => (
          <ellipse key={m} cx="300" cy="300" rx={r * m} ry={r} />
        ))}
        <line x1={300 - r} y1="300" x2={300 + r} y2="300" />
        {parallels.map((p) => {
          const y = 300 + r * p;
          const half = Math.sqrt(r * r - (r * p) ** 2);
          return (
            <ellipse key={p} cx="300" cy={y} rx={half} ry={half * 0.12} />
          );
        })}
      </g>
    </svg>
  );
}
