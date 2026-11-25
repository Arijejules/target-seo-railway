import Link from "next/link";

interface RelatedLink {
  href: string;
  label: string;
}

export default function RelatedLinks({ links }: { links: RelatedLink[] }) {
  return (
    <nav className="mt-12 rounded-lg border border-neutral-200 bg-neutral-50 p-5">
      <h2 className="mb-3 text-lg font-bold text-neutral-900">Related pages</h2>
      <ul className="space-y-2 text-sm">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="font-medium text-[#cc0000] underline decoration-1 underline-offset-2"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
