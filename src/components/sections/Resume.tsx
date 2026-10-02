"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Download, GraduationCap, Briefcase, Award, Star } from "lucide-react";
import styles from "./Resume.module.css";

gsap.registerPlugin(ScrollTrigger);

interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  location: string;
  year: string;
  gpa: string;
  grade: string;
  description: string;
  achievements: string[];
}

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  type: string;
  year: string;
  description: string;
  responsibilities: string[];
}

interface CertItem {
  id: string;
  name: string;
  issuer: string;
  year: string;
  credential: string;
}

interface AwardItem {
  id: string;
  title: string;
  organization: string;
  year: string;
  description: string;
}

interface ResumeData {
  education: EducationItem[];
  experience: ExperienceItem[];
  certifications: CertItem[];
  awards: AwardItem[];
}

export default function Resume({
  data,
  resumeUrl,
}: {
  data: ResumeData;
  resumeUrl: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".resume-heading",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".resume-heading", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".timeline-item",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.1,
          scrollTrigger: { trigger: ".timeline-item", start: "top 88%" },
        }
      );

      gsap.fromTo(
        ".cert-item",
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1, scale: 1, duration: 0.5, ease: "back.out(1.5)", stagger: 0.08,
          scrollTrigger: { trigger: ".cert-item", start: "top 88%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Research": return "#22D3EE";
      case "Academic": return "#A78BFA";
      case "Industry": return "#FBBF24";
      default: return "#94A3B8";
    }
  };

  return (
    <section ref={sectionRef} id="resume" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.2 }} />
      <div className={`ambient-blob ambient-blob-cyan ${styles.blobL}`} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blobR}`} />

      <div className="container">
        <div className={styles.sectionHeader}>
          <div>
            <div className={styles.labelRow}>
              <div className="section-sep" />
              <span className="section-label">Resume</span>
            </div>
            <h2 className={`resume-heading section-heading`}>
              Academic <span>Journey</span>
            </h2>
          </div>
          <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" id="download-resume-btn">
            <Download size={16} />
            Download CV
          </a>
        </div>

        <div className={styles.layout}>
          {/* Left: Education + Awards */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <GraduationCap size={18} style={{ color: "#FBBF24" }} />
              <h3 className={styles.colTitle}>Education</h3>
            </div>

            <div className={styles.timeline}>
              <div className="timeline-line" />
              {data.education.map((edu) => (
                <div key={edu.id} className={`timeline-item ${styles.timelineItem}`}>
                  <div className={styles.timelineDot} />
                  <div className={`glass-card ${styles.timelineCard}`}>
                    <div className={styles.cardYear}>{edu.year}</div>
                    <h4 className={styles.cardTitle}>{edu.degree}</h4>
                    <p className={styles.cardOrg}>{edu.institution}, {edu.location}</p>
                    {edu.gpa && (
                      <div className={styles.gpaRow}>
                        <span className={styles.gpaLabel}>GPA</span>
                        <span className={styles.gpaValue}>{edu.gpa}</span>
                        <span className={styles.gradeValue}>{edu.grade}</span>
                      </div>
                    )}
                    {!edu.gpa && (
                      <div className={styles.gpaRow}>
                        <span className={styles.gradeValue}>{edu.grade}</span>
                      </div>
                    )}
                    <p className={styles.cardDesc}>{edu.description}</p>
                    <ul className={styles.achieveList}>
                      {edu.achievements.map((a, i) => (
                        <li key={i} className={styles.achieveItem}>
                          <span className={styles.achieveDot}>›</span>
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Awards */}
            <div className={styles.colHeader} style={{ marginTop: "40px" }}>
              <Award size={18} style={{ color: "#FBBF24" }} />
              <h3 className={styles.colTitle}>Awards & Honors</h3>
            </div>
            <div className={styles.awardsList}>
              {data.awards.map((aw) => (
                <div key={aw.id} className={`cert-item glass-card ${styles.awardCard}`}>
                  <div className={styles.awardLeft}>
                    <Star size={16} style={{ color: "#FBBF24", flexShrink: 0 }} />
                    <div>
                      <p className={styles.awardTitle}>{aw.title}</p>
                      <p className={styles.awardOrg}>{aw.organization} · {aw.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Experience + Certifications */}
          <div className={styles.col}>
            <div className={styles.colHeader}>
              <Briefcase size={18} style={{ color: "#22D3EE" }} />
              <h3 className={styles.colTitle}>Experience</h3>
            </div>

            <div className={styles.timeline}>
              <div className="timeline-line" />
              {data.experience.map((exp) => (
                <div key={exp.id} className={`timeline-item ${styles.timelineItem}`}>
                  <div className={styles.timelineDot} style={{ background: getTypeColor(exp.type) }} />
                  <div className={`glass-card ${styles.timelineCard}`}>
                    <div className={styles.expTopRow}>
                      <div className={styles.cardYear}>{exp.year}</div>
                      <span
                        className={styles.expType}
                        style={{ color: getTypeColor(exp.type), borderColor: `${getTypeColor(exp.type)}40` }}
                      >
                        {exp.type}
                      </span>
                    </div>
                    <h4 className={styles.cardTitle}>{exp.role}</h4>
                    <p className={styles.cardOrg}>{exp.organization}</p>
                    <p className={styles.cardDesc}>{exp.description}</p>
                    <ul className={styles.achieveList}>
                      {exp.responsibilities.slice(0, 3).map((r, i) => (
                        <li key={i} className={styles.achieveItem}>
                          <span className={styles.achieveDot}>›</span>
                          {r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>

            {/* Certifications */}
            <div className={styles.colHeader} style={{ marginTop: "40px" }}>
              <Star size={18} style={{ color: "#A78BFA" }} />
              <h3 className={styles.colTitle}>Certifications</h3>
            </div>
            <div className={styles.certsList}>
              {data.certifications.map((cert) => (
                <a
                  key={cert.id}
                  href={cert.credential}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`cert-item glass-card ${styles.certCard}`}
                >
                  <div className={styles.certLeft}>
                    <div className={styles.certIcon}>✓</div>
                    <div>
                      <p className={styles.certName}>{cert.name}</p>
                      <p className={styles.certIssuer}>{cert.issuer} · {cert.year}</p>
                    </div>
                  </div>
                  <span className={styles.certArrow}>↗</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
