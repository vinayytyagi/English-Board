import { phraseGroups } from "@/data/toolkit";
import { Card, SectionHeader } from "@/components/ui";

export default function ToolkitPage() {
  return (
    <div>
      <SectionHeader title="Phrase Toolkit" subtitle="Ready phrases for every job in a conversation." />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {phraseGroups.map((g) => (
          <Card key={g.id}>
            <h2 className="text-base font-semibold text-ink">{g.fn}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {g.phrases.map((p, i) => (
                <li key={i} className="rounded-lg bg-app px-3 py-2 text-ink">“{p}”</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
