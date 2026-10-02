"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CheckCircle, Lightbulb } from "lucide-react";
import styles from "./About.module.css";

gsap.registerPlugin(ScrollTrigger);

interface AboutData {
  heading: string;
  description: string;
  highlights: string[];
  interests: string[];
}

interface PersonalData {
  bio: string;
  stats: { label: string; value: string; icon: string }[];
}

export default function About({
  about,
  personal,
}: {
  about: AboutData;
  personal: PersonalData;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textColRef = useRef<HTMLDivElement>(null);
  const visualColRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      // ── Heading slides in + scrub parallax ─────────────────────
      gsap.fromTo(
        headingRef.current,
        { x: -80, opacity: 0, skewX: -3 },
        {
          x: 0, opacity: 1, skewX: 0, duration: 1, ease: "expo.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // ── Text column: staggered children ────────────────────────
      const textChildren = textColRef.current?.querySelectorAll(
        "p, h3, li, .tag-group, .interest-row"
      );
      if (textChildren) {
        gsap.fromTo(
          textChildren,
          { y: 35, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.65, ease: "power3.out", stagger: 0.08,
            scrollTrigger: {
              trigger: textColRef.current,
              start: "top 80%",
            },
          }
        );
      }

      // ── Highlight items: slide from left with stagger ───────────
      gsap.fromTo(
        ".about-highlight",
        { x: -30, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out",
          scrollTrigger: { trigger: ".about-highlight", start: "top 85%" },
        }
      );

      // ── Visual column: slide from right ─────────────────────────
      gsap.fromTo(
        visualColRef.current,
        { x: 60, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 1, ease: "expo.out",
          scrollTrigger: {
            trigger: visualColRef.current,
            start: "top 82%",
          },
        }
      );

      // ── Stat cards: staggered bounce-in ─────────────────────────
      gsap.fromTo(
        ".stat-card-item",
        { y: 50, opacity: 0, scale: 0.85 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.6, ease: "back.out(1.6)", stagger: 0.1,
          scrollTrigger: { trigger: statsRef.current, start: "top 85%" },
        }
      );

      // ── Stat counters: animated number roll ─────────────────────
      personal.stats.forEach((stat) => {
        const el = sectionRef.current?.querySelector(`[data-stat="${stat.label}"]`);
        if (!el) return;
        const target = parseFloat(stat.value);
        if (isNaN(target)) return;
        const suffix = stat.value.replace(/[0-9.]/g, "");
        const proxy = { val: 0 };
        gsap.to(proxy, {
          val: target,
          duration: 2.2,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent =
              (Number.isInteger(target) ? Math.round(proxy.val) : proxy.val.toFixed(2)) + suffix;
          },
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 85%",
            once: true,
          },
        });
      });

      // ── Sticky parallax: section heading floats at different speed
      gsap.to(headingRef.current, {
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

    }, sectionRef.current);

    return () => ctx.revert();
  }, [personal.stats]);

  return (
    <section ref={sectionRef} id="about" className={styles.about}>
      <div className="tech-grid" style={{ opacity: 0.3 }} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blob}`} />

      <div className="container">
        <div className={styles.labelRow}>
          <div className="section-sep" />
          <span className="section-label">About Me</span>
        </div>

        <div className={styles.grid}>
          {/* Left: Text */}
          <div ref={textColRef} className={styles.textCol}>
            <h2 ref={headingRef} className={`section-heading ${styles.heading}`}>
              Who is <span>Barina</span>?
            </h2>

            <p className={styles.bio}>{personal.bio}</p>

            <h3 className={styles.subHeading}>
              <Lightbulb size={18} style={{ color: "#FBBF24", flexShrink: 0 }} />
              Key Highlights
            </h3>

            <ul className={styles.highlightList}>
              {about.highlights.map((item, i) => (
                <li key={i} className={`about-highlight ${styles.highlightItem}`}>
                  <CheckCircle size={16} className={styles.checkIcon} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <div className={`interest-row ${styles.interestRow}`}>
              <p className={styles.interestLabel}>Research Interests:</p>
              <div className={`tag-group ${styles.tagGroup}`}>
                {about.interests.map((interest) => (
                  <span key={interest} className="tag tag-cyan">{interest}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div ref={visualColRef} className={styles.visualCol}>
            {/* Code card */}
            <div className={`glass-card ${styles.codeCard}`}>
              <div className={styles.codeHeader}>
                <div className={styles.codeDots}>
                  <span style={{ background: "#FF5F57" }} />
                  <span style={{ background: "#FFBD2E" }} />
                  <span style={{ background: "#28CA41" }} />
                </div>
                <span className={styles.codeTitle}>barina.profile.ts</span>
              </div>
              <pre className={styles.codeBody}>
{`const barina = {
  role: "CS Graduate",
  focus: ["ML", "NLP", "Research"],
  seeking: "Masters Scholarship",
  gpa: 3.82,
  papers: 3,
  available: true,
  motto: "Code. Research. Impact."
};`}
              </pre>
            </div>

            {/* Stats grid */}
            <div ref={statsRef} className={styles.statsGrid}>
              {personal.stats.map((stat) => (
                <div
                  key={stat.label}
                  className={`stat-card-item glass-card stat-card ${styles.statCard}`}
                >
                  <div className="stat-value">
                    <span data-stat={stat.label}>{stat.value}</span>
                  </div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
