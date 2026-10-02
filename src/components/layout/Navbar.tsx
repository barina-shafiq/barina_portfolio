"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

gsap.registerPlugin(ScrollTrigger);

const NAV_ITEMS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Publications", href: "#publications" },
  { label: "Resume", href: "#resume" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Find active section
      const sections = NAV_ITEMS.map((item) => item.href.slice(1));
      let currentSection = "hero";
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) {
          currentSection = id;
        }
      });
      setActiveSection(currentSection);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // GSAP entrance
    if (navRef.current) {
      gsap.fromTo(
        navRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.5 }
      );
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (href: string) => {
    setMobileOpen(false);
    const el = document.getElementById(href.slice(1));
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`${styles.nav} ${scrolled ? styles.navScrolled : ""}`}
        aria-label="Main navigation"
      >
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="Barina Shafique - Home">
            <span className={styles.logoText}>BS</span>
            <span className={styles.logoDot}>.</span>
          </Link>

          {/* Desktop nav items */}
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <button
                  className={`${styles.navLink} ${activeSection === item.href.slice(1) ? styles.navLinkActive : ""}`}
                  onClick={() => handleNavClick(item.href)}
                  aria-current={activeSection === item.href.slice(1) ? "page" : undefined}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          {/* CTA */}
          <a
            href="#contact"
            className={styles.ctaBtn}
            onClick={(e) => { e.preventDefault(); handleNavClick("#contact"); }}
          >
            Hire Me
          </a>

          {/* Mobile toggle */}
          <button
            className={styles.mobileToggle}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`${styles.mobileMenu} ${mobileOpen ? styles.mobileMenuOpen : ""}`}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.href}
              className={`${styles.mobileNavLink} ${activeSection === item.href.slice(1) ? styles.mobileNavLinkActive : ""}`}
              onClick={() => handleNavClick(item.href)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </nav>

      {/* Side dots navigation */}
      <div className={styles.sideDots} aria-label="Section navigation">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.href}
            className={`${styles.sideDot} ${activeSection === item.href.slice(1) ? styles.sideDotActive : ""}`}
            onClick={() => handleNavClick(item.href)}
            aria-label={`Navigate to ${item.label}`}
            title={item.label}
          />
        ))}
      </div>
    </>
  );
}
