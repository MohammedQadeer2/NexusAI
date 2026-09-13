import { CheckCircle2, ListChecks, Sparkles } from "lucide-react";

const cardDetails = {
  steps: { label: "Suggested steps", icon: ListChecks },
  checklist: { label: "Checklist", icon: CheckCircle2 },
  summary: { label: "Quick summary", icon: Sparkles },
};

export default function GenerativeUiCard({ ui }) {
  const { label, icon: Icon } = cardDetails[ui.type];

  return (
    <section className="overflow-hidden rounded-2xl border border-indigo-400/20 bg-indigo-500/5">
      <header className="flex items-center gap-2 border-b border-indigo-400/15 px-4 py-3 text-sm font-medium text-indigo-200">
        <Icon className="h-4 w-4" />
        {label}
      </header>
      <div className="p-4">
        <h3 className="font-semibold text-slate-100">{ui.title}</h3>
        <ol className="mt-3 space-y-2.5">
          {ui.items.map((item, index) => (
            <li key={`${item}-${index}`} className="flex gap-3 text-sm leading-6 text-slate-300">
              <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-indigo-500/15 text-xs font-semibold text-indigo-200">
                {ui.type === "checklist" ? "✓" : index + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
