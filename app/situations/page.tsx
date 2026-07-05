import { situations } from "@/data/situations";
import { Card, SectionHeader } from "@/components/ui";

export default function SituationsPage() {
  return (
    <div>
      <SectionHeader title="Situations" subtitle="What to say, when — go-to lines for common founder moments." />
      <div className="flex flex-col gap-4">
        {situations.map((s) => (
          <Card key={s.id}>
            <h2 className="text-lg font-semibold text-ink">{s.title}</h2>
            <ul className="mt-3 flex flex-col gap-2">
              {s.lines.map((line, idx) => (
                <li key={idx} className="rounded-lg bg-app px-3 py-2 text-ink">“{line}”</li>
              ))}
            </ul>
            {(s.dos || s.donts) && (
              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {s.dos && (
                  <div>
                    <p className="font-medium text-ink">Do</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">{s.dos.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
                {s.donts && (
                  <div>
                    <p className="font-medium text-ink">Don't</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">{s.donts.map((d, i) => <li key={i}>{d}</li>)}</ul>
                  </div>
                )}
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
