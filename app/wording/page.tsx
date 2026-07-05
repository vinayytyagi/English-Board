import { swaps, powerWords } from "@/data/wording";
import { Card, SectionHeader } from "@/components/ui";

export default function WordingPage() {
  return (
    <div>
      <SectionHeader title="Better Wording" subtitle="Small swaps, stronger presence." />

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Weak → Strong</h2>
      <div className="flex flex-col gap-3">
        {swaps.map((s) => (
          <Card key={s.id}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <span className="text-muted line-through">{s.weak}</span>
              <span className="text-accent">→</span>
              <span className="text-ink font-medium">{s.strong}</span>
            </div>
            {s.note && <p className="mt-2 text-sm text-muted">{s.note}</p>}
          </Card>
        ))}
      </div>

      <h2 className="mt-8 mb-3 text-sm font-semibold uppercase tracking-wide text-muted">Power words</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {powerWords.map((w) => (
          <Card key={w.id}>
            <p className="text-lg font-semibold text-ink">{w.word}</p>
            <p className="text-sm text-muted">{w.meaning}</p>
            <p className="mt-2 text-ink">“{w.example}”</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
