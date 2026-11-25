import Link from "next/link";
import { SITE_NAME, NAV_ITEMS } from "@/lib/site";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
        <Link href="/" className="text-lg font-bold text-neutral-900">
          {SITE_NAME}
        </Link>
        <nav className="flex gap-4 overflow-x-auto text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap text-neutral-600 hover:text-[#cc0000]"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
