import Link from "next/link";
import { DISCLAIMER, LAST_UPDATED, FOOTER_COLUMNS } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 bg-neutral-50">
      <div className="mx-auto max-w-5xl px-5 py-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {FOOTER_COLUMNS.map((col) => (
            <div key={col.heading}>
              <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-neutral-500">
                {col.heading}
              </h3>
              <ul className="space-y-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-neutral-700 hover:text-[#cc0000]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-8 border-t border-neutral-200 pt-6 text-xs leading-relaxed text-neutral-500">
          <p>{DISCLAIMER}</p>
          <p className="mt-3">
            Last updated: {LAST_UPDATED}. &copy; {new Date().getFullYear()}{" "}
            {" "}Target Pay and Benefits Guide. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
