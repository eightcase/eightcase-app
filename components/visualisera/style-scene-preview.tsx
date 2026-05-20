import type { PoolStyle } from "@/lib/visualisera/types";

type StyleScenePreviewProps = {
  style: PoolStyle;
  className?: string;
};

export function StyleScenePreview({ style, className = "" }: StyleScenePreviewProps) {
  return (
    <div
      className={`relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#141412] ${className}`}
    >
      {style === "Modern" && <ModernScene />}
      {style === "Naturlig" && <NaturligScene />}
      {style === "Resort" && <ResortScene />}
      {style === "Familj" && <FamiljScene />}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10" />
    </div>
  );
}

function ModernScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a2e2c] to-[#1a1c1a]" />
      <div className="absolute bottom-[18%] left-[12%] right-[12%] h-[38%] rounded-2xl bg-gradient-to-b from-[#4a5550] to-[#323a38] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]" />
      <div className="absolute bottom-[22%] left-[18%] right-[18%] h-[2px] bg-white/20" />
      <div className="absolute top-[20%] right-[15%] h-16 w-24 rounded-sm bg-[#3a4038]/80" />
    </>
  );
}

function NaturligScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#252a24] to-[#161a14]" />
      <div className="absolute bottom-0 left-0 right-0 h-[45%] bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,#2a3528,transparent)]" />
      <div className="absolute bottom-[20%] left-[15%] right-[20%] h-[32%] rounded-[2rem] bg-gradient-to-b from-[#3d4a3a] to-[#2a3528]" />
      <div className="absolute top-[25%] left-[10%] h-12 w-8 rounded-full bg-[#2a3828]/90" />
      <div className="absolute top-[30%] right-[12%] h-14 w-10 rounded-full bg-[#253022]/90" />
    </>
  );
}

function ResortScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a3228] to-[#1a2018]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_20%,rgba(200,180,140,0.15),transparent)]" />
      <div className="absolute bottom-[18%] left-[10%] right-[10%] h-[40%] rounded-2xl bg-gradient-to-b from-[#4a6a7a] to-[#2a4555]" />
      <div className="absolute bottom-[55%] right-[18%] h-20 w-6 rounded-full bg-[#2a3820]/90" />
      <div className="absolute top-[15%] left-[20%] h-1 w-16 -rotate-8 rounded-full bg-white/10" />
    </>
  );
}

function FamiljScene() {
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-[#2a3028] to-[#1a1e18]" />
      <div className="absolute bottom-[15%] left-[8%] right-[8%] h-[42%] rounded-3xl bg-gradient-to-b from-[#4a7a9a] to-[#2a5568]" />
      <div className="absolute bottom-[48%] left-[12%] h-8 w-14 rounded-lg bg-[#3a4038]/90" />
      <div className="absolute bottom-[52%] right-[15%] h-6 w-10 rounded-full bg-[#8a9a82]/40" />
    </>
  );
}
