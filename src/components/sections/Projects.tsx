"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Github, ExternalLink, X, Calendar, Tag } from "lucide-react";
import styles from "./Projects.module.css";

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: string; title: string; category: string; tags: string[];
  description: string; longDescription: string; image: string;
  github: string; demo: string; featured: boolean; order: number;
  year: string; status: string;
}

const CATEGORIES = ["All", "Machine Learning", "NLP", "Systems", "Mobile", "Blockchain", "Full Stack"];

export default function Projects({ data }: { data: Project[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const filtered = activeCategory === "All"
    ? data
    : data.filter((p) => p.category === activeCategory);

  // ── Heading entrance ──────────────────────────────────────────
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

      // Parallax: heading drifts up slower than scroll
      gsap.to(headingRef.current, {
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      // Filter buttons slide up
      gsap.fromTo(
        ".filter-btn",
        { y: 20, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.5, stagger: 0.05, ease: "power2.out",
          scrollTrigger: { trigger: ".filter-btn", start: "top 90%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // ── Card animations on category change ────────────────────────
  useEffect(() => {
    const cards = document.querySelectorAll(".proj-card");
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { y: 60, opacity: 0, scale: 0.93, rotateY: 6 },
      {
        y: 0, opacity: 1, scale: 1, rotateY: 0,
        duration: 0.65, ease: "expo.out", stagger: 0.07,
        clearProps: "transform",
      }
    );
  }, [filtered.length, activeCategory]);

  // ── ScrollTrigger for each card ────────────────────────────────
  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".proj-card");
      cards.forEach((card, i) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top 90%",
          onEnter: () => {
            gsap.to(card, {
              boxShadow: "0 0 0 1px rgba(251,191,36,0.15), 0 20px 60px rgba(0,0,0,0.4)",
              duration: 0.3,
            });
          },
        });
      });
    });
    return () => ctx.revert();
  }, [filtered]);

  return (
    <section ref={sectionRef} id="projects" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.2 }} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blob}`} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <div className="section-sep" />
            <span className="section-label">Projects</span>
          </div>
          <h2 ref={headingRef} className={`section-heading`}>
            Things I&apos;ve <span>Built</span>
          </h2>
          <p className={styles.subtext}>
            A showcase of academic, research, and personal projects that demonstrate
            my technical breadth and depth across CS domains.
          </p>
        </div>

        {/* Filter buttons */}
        <div className={styles.filters} role="tablist">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${styles.filterBtn} ${activeCategory === cat ? styles.filterBtnActive : ""}`}
              onClick={() => setActiveCategory(cat)}
              role="tab"
              aria-selected={activeCategory === cat}
              id={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured note */}
        {activeCategory === "All" && (
          <p className={styles.featuredNote}>
            <span className={styles.starSpan}>★</span> Featured projects highlighted
          </p>
        )}

        {/* Grid */}
        <div className={styles.grid}>
          {filtered.map((project) => (
            <div
              key={project.id}
              className={`proj-card glass-card ${styles.card} ${project.featured ? styles.cardFeatured : ""}`}
              onClick={() => setSelectedProject(project)}
              tabIndex={0}
              role="button"
              aria-label={`View ${project.title}`}
              onKeyDown={(e) => e.key === "Enter" && setSelectedProject(project)}
            >
              {project.featured && <div className={styles.featuredBadge}>Featured</div>}
              <div className={`${styles.statusBadge} ${project.status === "Completed" ? styles.statusDone : styles.statusProgress}`}>
                {project.status}
              </div>

              <div className={styles.cardContent}>
                <div className={styles.cardMeta}>
                  <span className="tag">{project.category}</span>
                  <span className={styles.cardYear}><Calendar size={12} />{project.year}</span>
                </div>
                <h3 className={styles.cardTitle}>{project.title}</h3>
                <p className={styles.cardDesc}>{project.description}</p>
                <div className={styles.tagRow}>
                  {project.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag tag-neutral">{tag}</span>
                  ))}
                </div>
                <div className={styles.linkRow}>
                  {project.github && (
                    <a href={project.github} target="_blank" rel="noopener noreferrer"
                      className={`btn-ghost ${styles.linkBtn}`} onClick={(e) => e.stopPropagation()}>
                      <Github size={14} /> Code
                    </a>
                  )}
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                      className={`btn-ghost ${styles.linkBtn}`} onClick={(e) => e.stopPropagation()}>
                      <ExternalLink size={14} /> Demo
                    </a>
                  )}
                  <button className={styles.detailBtn} tabIndex={-1}>Details →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {selectedProject && (
        <div className={styles.modalOverlay} onClick={() => setSelectedProject(null)}
          role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={`glass-card ${styles.modal}`} onClick={(e) => e.stopPropagation()}>
            <button className={styles.modalClose} onClick={() => setSelectedProject(null)} aria-label="Close">
              <X size={20} />
            </button>
            <div className={styles.modalHeader}>
              <div className={styles.cardMeta}>
                <span className="tag">{selectedProject.category}</span>
                <span className={styles.cardYear}><Calendar size={12} />{selectedProject.year}</span>
              </div>
              <h2 id="modal-title" className={styles.modalTitle}>{selectedProject.title}</h2>
            </div>
            <p className={styles.modalDesc}>{selectedProject.longDescription}</p>
            <div className={styles.modalTags}>
              <Tag size={14} style={{ color: "#FBBF24" }} />
              {selectedProject.tags.map((tag) => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
            <div className={styles.modalLinks}>
              {selectedProject.github && (
                <a href={selectedProject.github} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <Github size={16} /> View Code
                </a>
              )}
              {selectedProject.demo && (
                <a href={selectedProject.demo} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  <ExternalLink size={16} /> Live Demo
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
