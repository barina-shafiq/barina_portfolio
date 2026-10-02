"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./ResearchInterests.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ResearchItem {
  id: string;
  title: string;
  icon: string;
  description: string;
  keywords: string[];
}

export default function ResearchInterests({ data }: { data: ResearchItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".research-heading",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".research-heading", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".research-card",
        { y: 60, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 0.7, ease: "power3.out", stagger: 0.12,
          scrollTrigger: { trigger: ".research-card", start: "top 88%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="research" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.25 }} />
      <div className={`ambient-blob ambient-blob-cyan ${styles.blob}`} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <div className="section-sep" />
            <span className="section-label">Research Interests</span>
          </div>
          <h2 className={`research-heading section-heading`}>
            Areas of <span>Focus</span>
          </h2>
          <p className={styles.subtext}>
            My academic and research journey spans multiple exciting domains of Computer Science.
            Each area represents both a current expertise and a future direction I aim to pursue.
          </p>
        </div>

        <div className={styles.grid}>
          {data.map((item) => (
            <div
              key={item.id}
              className={`research-card glass-card ${styles.card} ${activeCard === item.id ? styles.cardActive : ""}`}
              onMouseEnter={() => setActiveCard(item.id)}
              onMouseLeave={() => setActiveCard(null)}
              tabIndex={0}
              onFocus={() => setActiveCard(item.id)}
              onBlur={() => setActiveCard(null)}
              role="article"
              aria-label={item.title}
            >
              {/* Top accent line */}
              <div className={styles.accentLine} />

              <div className={styles.cardContent}>
                {/* Icon */}
                <div className={styles.iconWrapper}>
                  <span className={styles.iconEmoji}>{item.icon}</span>
                  <div className={styles.iconGlow} />
                </div>

                {/* Title */}
                <h3 className={styles.cardTitle}>{item.title}</h3>

                {/* Description */}
                <p className={styles.cardDesc}>{item.description}</p>

                {/* Keywords */}
                <div className={styles.keywords}>
                  {item.keywords.map((kw) => (
                    <span key={kw} className="tag tag-cyan" style={{ fontSize: "0.7rem" }}>{kw}</span>
                  ))}
                </div>
              </div>

              {/* HUD corner */}
              <div className={styles.hudCorner}>
                <span className={styles.hudId}>{item.id.toUpperCase()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
