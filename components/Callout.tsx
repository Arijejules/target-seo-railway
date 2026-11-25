interface CalloutProps {
  tone: "info" | "warn";
  title: string;
  children: React.ReactNode;
}

export default function Callout({ tone, title, children }: CalloutProps) {
  const border = tone === "warn" ? "border-amber-400" : "border-[#cc0000]";
  const bg = tone === "warn" ? "bg-amber-50" : "bg-neutral-50";
  return (
    <aside className={`mt-6 rounded-lg border-l-4 ${border} ${bg} px-5 py-4`}>
      <p className="mb-2 font-semibold text-neutral-900">{title}</p>
      <div className="text-sm leading-relaxed text-neutral-700">{children}</div>
    </aside>
  );
}
