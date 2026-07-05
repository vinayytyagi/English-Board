import { intros } from "@/data/intros";
import { SectionHeader } from "@/components/ui";
import { IntroCard } from "@/components/intro-card";

export default function IntrosPage() {
  return (
    <div>
      <SectionHeader title="Intros" subtitle="Introduce yourself in any context — pick a length and say it aloud." />
      <div className="flex flex-col gap-4">
        {intros.map((i) => <IntroCard key={i.id} intro={i} />)}
      </div>
    </div>
  );
}
