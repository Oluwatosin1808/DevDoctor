"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { Logo } from "@/components/ui/Logo";
import { ANCHORS, LINKS } from "@/lib/site";

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  // Root-relative so they keep working from routes other than `/`, where the
  // bare `#section` form would point at an anchor that does not exist.
  // Only sections that actually exist on the page belong here.
  { label: "Privacy", href: `/#${ANCHORS.privacy}`, id: ANCHORS.privacy },
];

const DESKTOP_LINK_CLASS =
  "relative text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:outline-none focus-visible:text-foreground";

const MOBILE_LINK_CLASS =
  "block rounded-lg px-3 py-2.5 text-base text-muted transition-colors duration-150 hover:bg-white/5 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  /* Solidify the bar once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Track which section is currently in the reading band. */
  useEffect(() => {
    const targets = NAV_ITEMS.map(({ id }) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null,
    );
    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        }
      },
      { rootMargin: "-20% 0px -65% 0px", threshold: 0 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Lock page scroll while the mobile panel is open. */
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [menuOpen]);

  /* Escape closes and hands focus back to the toggle. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      toggleRef.current?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Clicking outside the header dismisses the panel. */
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  /* Move focus to the first item when the panel opens. */
  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header
      ref={headerRef}
      className={[
        "sticky top-0 z-40 w-full transition-colors duration-300",
        scrolled || menuOpen
          ? "border-b border-line bg-surface/85 backdrop-blur-xl"
          : "border-b border-transparent bg-surface/40 backdrop-blur-md",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          href="/#top"
          className="shrink-0 rounded-md focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          aria-label="DevDoctor — back to top"
        >
          <Logo />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Primary"
          className="hidden items-center gap-7 lg:flex"
        >
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                aria-current={active ? "true" : undefined}
                className={DESKTOP_LINK_CLASS}
              >
                <span className={active ? "text-foreground" : undefined}>
                  {item.label}
                </span>
                <span
                  aria-hidden
                  className={[
                    "absolute -bottom-1.5 left-0 h-px bg-accent transition-all duration-300",
                    active ? "w-full opacity-100" : "w-0 opacity-0",
                  ].join(" ")}
                />
              </a>
            );
          })}

          <ExternalAction
            linkKey="docs"
            href={LINKS.docs}
            showSoonChip={false}
            className={`${DESKTOP_LINK_CLASS} inline-flex items-center gap-1`}
          >
            Documentation
          </ExternalAction>
        </nav>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-3 lg:flex">
          <ExternalAction
            linkKey="github"
            href={LINKS.github}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm text-muted transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none"
          >
            GitHub
          </ExternalAction>

          <ButtonLink href="/docs" size="sm">
            Run your first checkup
          </ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-10 items-center justify-center rounded-lg border border-line bg-raised text-foreground transition-colors duration-150 hover:bg-overlay focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface focus-visible:outline-none lg:hidden"
        >
          {menuOpen ? (
            <X aria-hidden className="size-5" />
          ) : (
            <Menu aria-hidden className="size-5" />
          )}
        </button>
      </div>

      {/* Mobile panel */}
      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-surface lg:hidden"
          >
            <nav
              aria-label="Mobile"
              className="scrollbar-slim max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 py-4 sm:px-6"
            >
              <ul className="flex flex-col gap-0.5">
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.id}>
                    <a
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={item.href}
                      onClick={closeMenu}
                      className={MOBILE_LINK_CLASS}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li>
                  <ExternalAction
                    linkKey="docs"
                    href={LINKS.docs}
                    className={MOBILE_LINK_CLASS}
                    onClick={closeMenu}
                  >
                    Documentation
                  </ExternalAction>
                </li>
                <li>
                  <ExternalAction
                    linkKey="github"
                    href={LINKS.github}
                    className={MOBILE_LINK_CLASS}
                  >
                    GitHub
                  </ExternalAction>
                </li>
              </ul>

              <div className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
                <ButtonLink
                  href="/docs"
                  onClick={closeMenu}
                  size="lg"
                  className="w-full"
                >
                  Run your first checkup
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
