import { EightcaseBrandLoader } from "@/components/brand";

export default function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ec-bg">
      <EightcaseBrandLoader size="xl" tone="forest" loop label="Laddar Eightcase" />
    </div>
  );
}
