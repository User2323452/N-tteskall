import type { Metadata } from "next";
import { ProfileView } from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "Profil · Nøtteskall",
};

export default function ProfilPage() {
  return <ProfileView />;
}
