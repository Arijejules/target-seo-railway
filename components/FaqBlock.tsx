interface FaqItem {
  q: string;
  a: string;
}

export default function FaqBlock({ items }: { items: FaqItem[] }) {
  return (
    <dl className="mt-4 space-y-5">
      {items.map((item) => (
        <div key={item.q}>
          <dt className="font-semibold text-neutral-900">{item.q}</dt>
          <dd className="mt-1 leading-relaxed text-neutral-700">{item.a}</dd>
        </div>
      ))}
    </dl>
  );
}
