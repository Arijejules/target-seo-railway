import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-neutral-500">
      {items.map((item, i) => (
        <span key={item.href}>
          {i > 0 && <span className="mx-1">/</span>}
          {i === items.length - 1 ? (
            <span className="text-neutral-700">{item.name}</span>
          ) : (
            <Link href={item.href} className="hover:text-[#cc0000]">
              {item.name}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
