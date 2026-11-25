export default function StepList({ steps }: { steps: string[] }) {
  return (
    <ol className="mt-4 space-y-3 pl-0">
      {steps.map((step, i) => (
        <li key={i} className="flex gap-3 text-neutral-700">
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#cc0000] text-xs font-bold text-white">
            {i + 1}
          </span>
          <span className="leading-relaxed">{step}</span>
        </li>
      ))}
    </ol>
  );
}
