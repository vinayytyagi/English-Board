import { SectionHeader } from "@/components/ui";
import { PracticeRunner } from "@/components/practice-runner";

export default function PracticePage() {
  return (
    <div>
      <SectionHeader title="Daily Practice" subtitle="Read each one out loud, clearly. Then mark it practiced." />
      <PracticeRunner />
    </div>
  );
}
