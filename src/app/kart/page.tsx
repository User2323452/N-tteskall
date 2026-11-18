import type { Metadata } from "next";
import { KartView } from "@/components/KartView";

export const metadata: Metadata = {
  title: "Kart · Nøtteskall",
};

export default function KartPage() {
  return <KartView />;
}
