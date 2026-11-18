import type { Metadata } from "next";
import { OverviewView } from "@/components/OverviewView";

export const metadata: Metadata = {
  title: "Oversikt · Nøtteskall",
};

export default function OversiktPage() {
  return <OverviewView />;
}
