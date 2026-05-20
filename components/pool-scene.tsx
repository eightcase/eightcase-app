/** CSS placeholder pool / yard scenes for before-after */

export function PoolScene({
  variant = "after",
  className = "",
}: {
  variant?: "before" | "after";
  className?: string;
}) {
  if (variant === "before") {
    return (
      <div
        className={`absolute inset-0 bg-gradient-to-br from-[#1a1a18] via-[#141412] to-[#0c0c0b] ${className}`}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_70%_at_20%_85%,rgba(80,75,65,0.3),transparent_55%)]" />
        <div className="absolute bottom-[10%] left-[6%] right-[30%] h-[34%] rounded-t-[4rem] bg-[#22201c]" />
      </div>
    );
  }
  return (
    <div
      className={`absolute inset-0 bg-gradient-to-bl from-[#1e2420] via-[#141614] to-[#0c0c0b] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_75%_55%_at_75%_25%,rgba(138,154,130,0.18),transparent_50%)]" />
      <div className="absolute top-[14%] right-[8%] left-[12%] h-[44%] rounded-[2rem] bg-gradient-to-b from-[#3a4540] to-[#252a28] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]" />
      <div className="absolute bottom-[12%] right-[10%] left-[16%] h-[11%] rounded-md bg-[#2a302c]/95" />
    </div>
  );
}
