"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./Skills.module.css";

gsap.registerPlugin(ScrollTrigger);

interface SkillItem { id: string; name: string; level: number; icon: string; }
interface SkillCategory { id: string; name: string; skills: SkillItem[]; }

export default function Skills({ data }: { data: { categories: SkillCategory[] } }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>(data.categories[0]?.id || "");

  const activeData = data.categories.find((c) => c.id === activeCategory);

  // ── Heading entrance + parallax ───────────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.9, ease: "expo.out",
          scrollTrigger: { trigger: headingRef.current, start: "top 85%" },
        }
      );

      gsap.to(headingRef.current, {
        y: -35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      // Category tabs slide in
      gsap.fromTo(
        ".cat-btn",
        { x: -20, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.45, stagger: 0.07, ease: "power2.out",
          scrollTrigger: { trigger: ".cat-btn", start: "top 88%" },
        }
      );

      // Hex grid items
      gsap.fromTo(
        ".hex-item",
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4, stagger: 0.04, ease: "back.out(1.5)",
          scrollTrigger: { trigger: ".hex-item", start: "top 90%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // ── Skill bar + item animations on category switch ─────────────
  useEffect(() => {
    if (!activeData || !sectionRef.current) return;

    const items = sectionRef.current.querySelectorAll(".skill-item");
    if (items.length > 0) {
      gsap.fromTo(
        items,
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 0.38, stagger: 0.055, ease: "power2.out" }
      );
    }

    // Bars: scrub-fill per skill
    activeData.skills.forEach((skill) => {
      const bar = sectionRef.current?.querySelector(`[data-skill-id="${skill.id}"] .skill-bar-fill`) as HTMLElement | null;
      if (!bar) return;

      gsap.fromTo(
        bar,
        { scaleX: 0 },
        {
          scaleX: skill.level / 100,
          duration: 1.2,
          ease: "expo.out",
          delay: 0.15,
          overwrite: "auto",
        }
      );
    });
  }, [activeCategory, activeData]);

  const getLevelLabel = (level: number) => {
    if (level >= 90) return "Expert";
    if (level >= 75) return "Advanced";
    if (level >= 60) return "Intermediate";
    return "Familiar";
  };

  const getLevelColor = (level: number) => {
    if (level >= 90) return "#FBBF24";
    if (level >= 75) return "#22D3EE";
    if (level >= 60) return "#A78BFA";
    return "#94A3B8";
  };

  return (
    <section ref={sectionRef} id="skills" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.2 }} />
      <div className={`ambient-blob ambient-blob-cyan ${styles.blobL}`} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blobR}`} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <div className="section-sep" />
            <span className="section-label">Skills</span>
          </div>
          <h2 ref={headingRef} className={`section-heading`}>
            Tech <span>Arsenal</span>
          </h2>
          <p className={styles.subtext}>
            A comprehensive toolkit built through academic coursework, research projects, and self-directed learning.
          </p>
        </div>

        <div className={styles.layout}>
          {/* Category tabs */}
          <div className={styles.categoryTabs}>
            {data.categories.map((cat) => (
              <button
                key={cat.id}
                className={`cat-btn ${styles.catBtn} ${activeCategory === cat.id ? styles.catBtnActive : ""}`}
                onClick={() => setActiveCategory(cat.id)}
                id={`skill-cat-${cat.id}`}
              >
                <span className={styles.catCount}>{cat.skills.length}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Skills list */}
          <div className={styles.skillsList}>
            {activeData?.skills.map((skill) => (
              <div
                key={skill.id}
                className={`skill-item ${styles.skillItem}`}
                data-skill-id={skill.id}
              >
                <div className={styles.skillHeader}>
                  <span className={styles.skillName}>{skill.name}</span>
                  <div className={styles.skillRight}>
                    <span className={styles.skillLabel} style={{ color: getLevelColor(skill.level) }}>
                      {getLevelLabel(skill.level)}
                    </span>
                    <span className={styles.skillPct}>{skill.level}%</span>
                  </div>
                </div>

                <div className="skill-bar">
                  <div
                    className="skill-bar-fill"
                    style={{ "--level": skill.level } as React.CSSProperties}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hex decoration */}
        <div className={styles.hexGrid}>
          {data.categories.flatMap((c) => c.skills).slice(0, 12).map((skill) => (
            <div key={skill.id} className={`hex-item ${styles.hexItem}`} title={skill.name}>
              <div className={styles.hexInner}>
                <span className={styles.hexName}>{skill.name.split(" ")[0].slice(0, 6)}</span>
                <span className={styles.hexLevel}>{skill.level}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
