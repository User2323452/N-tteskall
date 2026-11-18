import { conceptFigures, figureSitsBeside } from "@/data/concept-figures";
import { InteractiveFigure } from "@/components/figures/InteractiveFigure";
import { PlainFigure } from "@/components/figures/PlainFigure";

export function ConceptFigure({ id }: { id: string }) {
  const spec = conceptFigures[id];
  if (!spec) return null;
  if (spec.type === "interactive") {
    return <InteractiveFigure id={spec.id} focus={spec.focus} />;
  }
  return <PlainFigure spec={spec} />;
}

/** Teksten står igjen. Figuren legges ved siden av, eller under når den trenger bredde. */
export function ConceptTeaching({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  const spec = conceptFigures[id];
  if (!spec) return <div className="mt-5">{children}</div>;
  if (!figureSitsBeside(spec)) {
    return (
      <div className="mt-5 space-y-4">
        <div>{children}</div>
        <ConceptFigure id={id} />
      </div>
    );
  }
  return (
    <div className="mt-5 grid items-start gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
      <div>{children}</div>
      <ConceptFigure id={id} />
    </div>
  );
}
