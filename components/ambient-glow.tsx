export function AmbientGlow() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
      <div className="absolute inset-0 bg-ec-bg" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_80%_-5%,rgba(168,181,160,0.12),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_10%_100%,rgba(235,230,220,0.5),transparent_45%)]" />
    </div>
  );
}
