"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ExternalLink, FileText, BookOpen } from "lucide-react";
import styles from "./Publications.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Publication {
  id: string;
  title: string;
  authors: string[];
  venue: string;
  year: string;
  type: string;
  abstract: string;
  doi: string;
  arxiv: string;
  pdf: string;
  tags: string[];
  status: string;
}

export default function Publications({ data }: { data: Publication[] }) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".pub-heading",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".pub-heading", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".pub-card",
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.15,
          scrollTrigger: { trigger: ".pub-card", start: "top 88%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="publications" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.2 }} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blob}`} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <div className="section-sep" />
            <span className="section-label">Publications</span>
          </div>
          <h2 className={`pub-heading section-heading`}>
            Research <span>Output</span>
          </h2>
          <p className={styles.subtext}>
            Peer-reviewed papers and academic contributions spanning NLP, Computer Vision, and Distributed Systems.
          </p>
        </div>

        <div className={styles.list}>
          {data.map((pub, i) => (
            <div key={pub.id} className={`pub-card glass-card ${styles.card}`}>
              {/* Number */}
              <div className={styles.pubNumber}>
                {String(i + 1).padStart(2, "0")}
              </div>

              <div className={styles.cardContent}>
                {/* Header */}
                <div className={styles.cardTop}>
                  <div className={styles.metaRow}>
                    <span className={`tag ${pub.status === "Published" ? "" : "tag-neutral"}`}>
                      {pub.type}
                    </span>
                    <span className={`${styles.statusPill} ${pub.status === "Published" ? styles.statusPublished : styles.statusReview}`}>
                      {pub.status}
                    </span>
                    <span className={styles.year}>{pub.year}</span>
                  </div>

                  {/* Title */}
                  <h3 className={styles.pubTitle}>{pub.title}</h3>

                  {/* Authors */}
                  <p className={styles.authors}>
                    {pub.authors.map((a, ai) => (
                      <span key={ai}>
                        <strong style={{ color: a.includes("Barina") ? "#FBBF24" : "inherit" }}>{a}</strong>
                        {ai < pub.authors.length - 1 && ", "}
                      </span>
                    ))}
                  </p>

                  {/* Venue */}
                  <p className={styles.venue}>
                    <BookOpen size={14} style={{ flexShrink: 0 }} />
                    {pub.venue}
                  </p>
                </div>

                {/* Abstract */}
                <p className={styles.abstract}>{pub.abstract}</p>

                {/* Tags */}
                <div className={styles.tagRow}>
                  {pub.tags.map((t) => (
                    <span key={t} className="tag tag-cyan" style={{ fontSize: "0.7rem" }}>{t}</span>
                  ))}
                </div>

                {/* Links */}
                <div className={styles.linkRow}>
                  {pub.arxiv && (
                    <a href={pub.arxiv} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                      <FileText size={13} /> arXiv
                    </a>
                  )}
                  {pub.doi && (
                    <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer" className="btn-ghost" style={{ fontSize: "0.78rem", padding: "6px 12px" }}>
                      <ExternalLink size={13} /> DOI
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
