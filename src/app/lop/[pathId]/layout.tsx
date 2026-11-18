import { PathView } from "@/components/PathView";

export default async function PathLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ pathId: string }>;
}) {
  const { pathId } = await params;
  return <PathView pathId={pathId}>{children}</PathView>;
}
