import { Suspense } from "react";
import { TopicPageView } from "@/components/TopicPageView";

export default async function TemaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<p className="text-sm text-slate-500">Laster tema…</p>}>
      <TopicPageView pageId={id} />
    </Suspense>
  );
}
