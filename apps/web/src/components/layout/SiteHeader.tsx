"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { ExternalAction } from "@/components/ui/ExternalAction";
import { Logo } from "@/components/ui/Logo";
import { ANCHORS, HERO, LINKS } from "@/lib/site";

interface NavItem {
  label: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Preview", id: ANCHORS.demo },
  { label: "Features", id: ANCHORS.features },
  { label: "How it works", id: ANCHORS.howItWorks },
  { label: "Findings", id: ANCHORS.findings },
  { label: "Open source", id: ANCHORS.openSource },
];

const LINK_CLASS =
  "relative py-1 text-[13px] font-medium text-dark-muted transition-colors duration-150 hover:text-dark-ink focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none";

const MOBILE_LINK_CLASS =
  "flex min-h-11 items-center rounded-lg px-3 py-2.5 text-[15px] font-medium text-dark-muted transition-colors duration-150 hover:bg-white/5 hover:text-dark-ink focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none";

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();

  const headerRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstMobileLinkRef = useRef<HTMLAnchorElement>(null);

  /* Solidify the bottom rule once the page has moved. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Highlight the last section whose top has passed the reading band. */
  useEffect(() => {
    const onScroll = () => {
      let current: string | null = null;
      for (const item of NAV_ITEMS) {
        const el = document.getElementById(item.id);
        if (el && el.getBoundingClientRect().top <= 144) current = item.id;
      }
      setActiveId(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
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

  /* Close on Escape, keep Tab inside the panel, and restore focus. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Outside clicks dismiss the panel. */
  useEffect(() => {
    if (!menuOpen) return;
    const onPointerDown = (event: MouseEvent) => {
      if (!headerRef.current?.contains(event.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [menuOpen]);

  /* Close on desktop resize and move focus to the first item when opened. */
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const frame = requestAnimationFrame(() => firstMobileLinkRef.current?.focus());
    return () => cancelAnimationFrame(frame);
  }, [menuOpen]);

  return (
    <header
      ref={headerRef}
      data-theme="dark"
      className={[
        "sticky top-0 z-50 w-full border-b text-dark-ink transition-colors duration-150",
        scrolled || menuOpen ? "border-rule-dark bg-charcoal" : "border-transparent bg-charcoal",
      ].join(" ")}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1152px] items-center justify-between gap-4 px-5 sm:px-6 lg:px-8">
        <Link
          href="/#top"
          className="shrink-0 rounded-lg focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none"
          aria-label="cDoc — back to top"
        >
          <Logo wordmarkClassName="text-dark-ink" />
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = activeId === item.id;
            return (
              <a
                key={item.id}
                href={`/#${item.id}`}
                aria-current={active ? "location" : undefined}
                className={LINK_CLASS}
              >
                <span className={active ? "text-dark-ink" : undefined}>{item.label}</span>
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-px bg-lime transition-all duration-200 ${
                    active ? "w-full opacity-100" : "w-0 opacity-0"
                  }`}
                />
              </a>
            );
          })}

          <ExternalAction
            linkKey="docs"
            href={LINKS.docs}
            showSoonChip={false}
            className={`${LINK_CLASS} inline-flex items-center gap-1`}
          >
            Docs
          </ExternalAction>
        </nav>

        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <ExternalAction
            linkKey="github"
            href={LINKS.github}
            showSoonChip={false}
            className={`${LINK_CLASS} inline-flex items-center gap-1`}
          >
            GitHub
          </ExternalAction>

          <ButtonLink href="/#get-started" size="sm">
            {HERO.primaryCta}
          </ButtonLink>
        </div>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          className="inline-flex size-11 items-center justify-center rounded-lg border border-rule-dark text-dark-ink transition-colors duration-150 hover:border-lime focus-visible:ring-2 focus-visible:ring-lime focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal focus-visible:outline-none lg:hidden"
        >
          {menuOpen ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.div
            ref={panelRef}
            id="mobile-menu"
            key="mobile-menu"
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: [0.2, 0, 0, 1] }}
            className="overflow-hidden border-t border-rule-dark bg-charcoal lg:hidden"
          >
            <nav aria-label="Mobile" className="scrollbar-slim max-h-[calc(100dvh-4rem)] overflow-y-auto px-5 py-4 sm:px-6">
              <ul className="flex flex-col">
                {NAV_ITEMS.map((item, index) => (
                  <li key={item.id} className="border-b border-rule-dark/70 last:border-b-0">
                    <a
                      ref={index === 0 ? firstMobileLinkRef : undefined}
                      href={`/#${item.id}`}
                      onClick={() => setMenuOpen(false)}
                      className={MOBILE_LINK_CLASS}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
                <li className="border-b border-rule-dark/70">
                  <ExternalAction
                    linkKey="docs"
                    href={LINKS.docs}
                    showSoonChip={false}
                    className={MOBILE_LINK_CLASS}
                    onClick={() => setMenuOpen(false)}
                  >
                    Documentation
                  </ExternalAction>
                </li>
                <li>
                  <ExternalAction
                    linkKey="github"
                    href={LINKS.github}
                    showSoonChip={false}
                    className={MOBILE_LINK_CLASS}
                    onClick={() => setMenuOpen(false)}
                  >
                    GitHub
                  </ExternalAction>
                </li>
              </ul>

              <ButtonLink
                href="/#get-started"
                size="lg"
                onClick={() => setMenuOpen(false)}
                className="mt-5 w-full"
              >
                {HERO.primaryCta}
              </ButtonLink>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
