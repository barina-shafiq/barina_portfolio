"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Mail, MapPin, Send, Github, Linkedin, Twitter, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./Contact.module.css";

gsap.registerPlugin(ScrollTrigger);

interface ContactData {
  email: string;
  phone: string;
  location: string;
  github: string;
  linkedin: string;
  twitter: string;
  contact: {
    heading: string;
    subheading: string;
    formspreeId: string;
  };
}

export default function Contact({ data }: { data: ContactData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const [formState, setFormState] = useState({
    name: "", email: "", subject: "", message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".contact-heading",
        { y: 40, opacity: 0 },
        {
          y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-heading", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".contact-left",
        { x: -40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".contact-left", start: "top 85%" },
        }
      );

      gsap.fromTo(
        ".contact-right",
        { x: 40, opacity: 0 },
        {
          x: 0, opacity: 1, duration: 0.8, ease: "power2.out",
          scrollTrigger: { trigger: ".contact-right", start: "top 85%" },
        }
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");

    try {
      // If formspreeId is provided, use Formspree; else use mailto fallback
      if (data.contact.formspreeId) {
        const res = await fetch(`https://formspree.io/f/${data.contact.formspreeId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        if (res.ok) {
          setStatus("success");
          setFormState({ name: "", email: "", subject: "", message: "" });
        } else {
          setStatus("error");
        }
      } else {
        // Fallback: open mail client
        window.location.href = `mailto:${data.email}?subject=${encodeURIComponent(formState.subject)}&body=${encodeURIComponent(`Name: ${formState.name}\nEmail: ${formState.email}\n\n${formState.message}`)}`;
        setStatus("success");
        setFormState({ name: "", email: "", subject: "", message: "" });
      }
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <section ref={sectionRef} id="contact" className={styles.section}>
      <div className="tech-grid" style={{ opacity: 0.25 }} />
      <div className={`ambient-blob ambient-blob-amber ${styles.blobL}`} />
      <div className={`ambient-blob ambient-blob-cyan ${styles.blobR}`} />

      {/* Scan line */}
      <div className={`scan-line ${styles.scanLine}`} />

      <div className="container">
        <div className={styles.header}>
          <div className={styles.labelRow}>
            <div className="section-sep" />
            <span className="section-label">Contact</span>
          </div>
          <h2 className={`contact-heading section-heading`}>
            {data.contact.heading.split(" ").map((w, i) =>
              i === 1 ? <span key={i}>{w} </span> : `${w} `
            )}
          </h2>
          <p className={styles.subtext}>{data.contact.subheading}</p>
        </div>

        <div className={styles.grid}>
          {/* Left: Info */}
          <div className={`contact-left ${styles.infoCol}`}>
            <div className={`glass-card ${styles.infoCard}`}>
              <h3 className={styles.infoTitle}>Contact Information</h3>

              <div className={styles.infoList}>
                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className={styles.infoLabel}>Email</p>
                    <a href={`mailto:${data.email}`} className={styles.infoValue}>{data.email}</a>
                  </div>
                </div>

                <div className={styles.infoItem}>
                  <div className={styles.infoIcon}>
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className={styles.infoLabel}>Location</p>
                    <p className={styles.infoValue}>{data.location}</p>
                  </div>
                </div>
              </div>

              {/* Social links */}
              <div className={styles.socialSection}>
                <p className={styles.socialLabel}>Connect With Me</p>
                <div className={styles.socialGrid}>
                  <a href={data.github} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                    <Github size={20} />
                    <span>GitHub</span>
                  </a>
                  <a href={data.linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                    <Linkedin size={20} />
                    <span>LinkedIn</span>
                  </a>
                  <a href={data.twitter} target="_blank" rel="noopener noreferrer" className={styles.socialCard}>
                    <Twitter size={20} />
                    <span>Twitter</span>
                  </a>
                </div>
              </div>

              {/* Availability */}
              <div className={styles.availSection}>
                <div className={styles.availDot} />
                <div>
                  <p className={styles.availTitle}>Open to Opportunities</p>
                  <p className={styles.availDesc}>
                    Masters scholarship applications, research collaborations, and academic discussions.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className={`contact-right ${styles.formCol}`}>
            <form className={`glass-card ${styles.formCard}`} onSubmit={handleSubmit} noValidate>
              <h3 className={styles.formTitle}>Send a Message</h3>

              <div className={styles.formGrid}>
                <div className={styles.fieldGroup}>
                  <label htmlFor="name" className="admin-label">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="admin-input"
                    placeholder="Your full name"
                    value={formState.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label htmlFor="email" className="admin-label">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="admin-input"
                    placeholder="your@email.com"
                    value={formState.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="subject" className="admin-label">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  className="admin-input"
                  placeholder="What is this about?"
                  value={formState.subject}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className={styles.fieldGroup}>
                <label htmlFor="message" className="admin-label">Message</label>
                <textarea
                  id="message"
                  name="message"
                  className={`admin-input ${styles.textarea}`}
                  placeholder="Write your message here..."
                  rows={5}
                  value={formState.message}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Status */}
              {status === "success" && (
                <div className={`${styles.statusMsg} ${styles.statusSuccess}`}>
                  <CheckCircle size={16} />
                  Message sent successfully! I&apos;ll get back to you soon.
                </div>
              )}
              {status === "error" && (
                <div className={`${styles.statusMsg} ${styles.statusError}`}>
                  <AlertCircle size={16} />
                  Something went wrong. Please try emailing directly.
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={status === "sending"}
                id="contact-submit-btn"
                style={{ width: "100%", justifyContent: "center" }}
              >
                {status === "sending" ? "Sending..." : (
                  <>
                    <Send size={16} />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
