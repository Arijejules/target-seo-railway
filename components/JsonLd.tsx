interface JsonLdProps {
  graph: Record<string, unknown>[];
}

export default function JsonLd({ graph }: JsonLdProps) {
  const data = {
    "@context": "https://schema.org",
    "@graph": graph,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
