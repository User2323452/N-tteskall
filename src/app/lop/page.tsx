import type { Metadata } from "next";
import { LopListView } from "@/components/LopListView";

export const metadata: Metadata = {
  title: "Løp · Nøtteskall",
};

export default function LopPage() {
  return <LopListView />;
}
