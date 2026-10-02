"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowDown, Github, Linkedin, Twitter, Download } from "lucide-react";
import StarField from "@/components/ui/StarField";
import styles from "./Hero.module.css";

gsap.registerPlugin(ScrollTrigger);

interface HeroStat {
  label: string;
  value: string;
  icon?: string;
}

interface HeroData {
  name: string;
  title: string;
  tagline: string;
  subtitle: string;
  github: string;
  linkedin: string;
  twitter: string;
  resumeUrl: string;
  profileImage: string;
  stats?: HeroStat[];
  heroTags?: string[];
  typingWords?: string[];
  gpa?: string;
  papersCount?: string;
  projectsCount?: string;
}

const DEFAULT_TYPING_WORDS = [
  "Machine Learning",
  "NLP Researcher",
  "Full Stack Dev",
  "CS Scholar",
  "AI Enthusiast",
];

export default function Hero({ data }: { data: HeroData }) {
  const sectionRef = useRef<HTMLElement>(null);
  const pinContainerRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const orbitRef = useRef<HTMLDivElement>(null);
  const portraitRef = useRef<HTMLImageElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const [typedText, setTypedText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  // Dynamic metrics from data.stats or direct fields
  const getStatValue = (keyword: string, fallback: string) => {
    const match = data.stats?.find((s) =>
      s.label.toLowerCase().includes(keyword.toLowerCase())
    );
    return match ? match.value : fallback;
  };

  const gpaValue = data.gpa || getStatValue("gpa", "3.82");
  const papersValue = data.papersCount || getStatValue("paper", "3");
  const projectsValue = data.projectsCount || getStatValue("project", "15+");

  const heroTags =
    data.heroTags && data.heroTags.length > 0
      ? data.heroTags
      : ["Machine Learning", "Full Stack", "NLP", "Research", "Open Source"];

  const activeTypingWords =
    data.typingWords && data.typingWords.length > 0
      ? data.typingWords
      : DEFAULT_TYPING_WORDS;

  const fullName = data.name || "BARINA SHAFIQUE";
  const nameParts = fullName.trim().toUpperCase().split(/\s+/);
  const firstName = nameParts[0] || "BARINA";
  const lastName = nameParts.slice(1).join(" ") || "SHAFIQUE";
  const initials = ((nameParts[0]?.[0] || "B") + (nameParts[1]?.[0] || "S")).toUpperCase();

  // ─── Entrance + sticky scroll animations ───────────────────────────
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // ── 1. ENTRANCE TIMELINE ──────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.2 });

      // Background grid zoom-in
      tl.fromTo(
        bgGridRef.current,
        { scale: 1.5, opacity: 0 },
        { scale: 1, opacity: 0.6, duration: 1.8, ease: "power4.out" },
        0
      );

      // Ambient blobs drift in
      tl.fromTo(
        ".hero-blob",
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 0.12, duration: 2, ease: "power3.out", stagger: 0.2 },
        0.1
      );

      // Name chars flip in with 3D perspective
      if (nameRef.current) {
        const chars = nameRef.current.querySelectorAll(".char");
        tl.fromTo(
          chars,
          { y: 140, opacity: 0, rotateX: -90, filter: "blur(8px)" },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.9,
            ease: "expo.out",
            stagger: 0.025,
          },
          0.3
        );
      }

      // Subtitle glides up
      tl.fromTo(
        subtitleRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" },
        "-=0.5"
      );

      // Tags slide in from left
      const tags = tagsRef.current?.querySelectorAll(".hero-tag");
      if (tags) {
        tl.fromTo(
          tags,
          { x: -40, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.5, stagger: 0.08, ease: "back.out(1.5)" },
          "-=0.4"
        );
      }

      // CTA buttons bounce up
      tl.fromTo(
        ctaRef.current,
        { y: 30, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.4)" },
        "-=0.2"
      );

      // HUD panel slides in from right
      tl.fromTo(
        hudRef.current,
        { x: 30, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        "-=0.5"
      );

      // Cyber rings expand in background
      if (orbitRef.current) {
        tl.fromTo(
          orbitRef.current,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.2, ease: "expo.out" },
          0.1
        );
      }

      // Portrait fades in in 100ms with zero rotation
      if (portraitRef.current) {
        tl.fromTo(
          portraitRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.1, ease: "power1.out" },
          0.1
        );
      }

      // Float chips ping in
      tl.fromTo(
        ".float-chip",
        { scale: 0, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 0.5,
          ease: "back.out(2)",
          stagger: 0.12,
        },
        "-=0.8"
      );

      // HUD corner elements
      tl.fromTo(
        ".hud-corner",
        { opacity: 0 },
        { opacity: 0.5, duration: 0.4, stagger: 0.1 },
        "-=0.6"
      );

      // ── 2. CONTINUOUS ORBIT ROTATIONS ────────────────────────────
      gsap.to(".orbit-ring-2", {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });
      gsap.to(".orbit-ring-3", {
        rotation: -360,
        duration: 16,
        repeat: -1,
        ease: "none",
        transformOrigin: "center center",
      });

      // Float chips gentle levitation
      gsap.to(".float-chip", {
        y: -8,
        duration: 2.5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        stagger: 0.5,
      });

      // ── 3. STICKY SCROLL-SCRUB PARALLAX ─────────────────────────
      // The hero section pins for 150% of viewport height, giving
      // the feeling of "scrolling through" the hero cinematically.
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=120%",          // pin lasts 120vh of scroll
          pin: pinContainerRef.current,
          scrub: 1.2,             // silky scrub (higher = more lag)
          anticipatePin: 1,
        },
      });

      // Name scales up & fades as you scroll out
      scrollTl.to(
        nameRef.current,
        {
          y: -60,
          opacity: 0,
          scale: 1.05,
          filter: "blur(4px)",
          duration: 1,
          ease: "none",
        },
        0
      );

      // Cyber rings fade out on scroll
      if (orbitRef.current) {
        scrollTl.to(
          orbitRef.current,
          {
            opacity: 0,
            duration: 0.8,
            ease: "power2.in",
          },
          0
        );
      }

      // Portrait blurs out smoothly while scrolling instead of disappearing instantly
      if (portraitRef.current) {
        scrollTl.fromTo(
          portraitRef.current,
          {
            filter: "blur(0px)",
            opacity: 1,
            y: 0,
          },
          {
            filter: "blur(28px)",
            opacity: 0,
            y: -35,
            duration: 1,
            ease: "power2.in",
          },
          0
        );
      }

      // Floating chips blur and fade out
      scrollTl.fromTo(
        ".float-chip",
        {
          filter: "blur(0px)",
          opacity: 1,
          y: 0,
        },
        {
          filter: "blur(12px)",
          opacity: 0,
          y: -25,
          duration: 0.9,
          ease: "power2.in",
        },
        0
      );

      // Subtitle & tags fade out sooner
      scrollTl.to(
        [subtitleRef.current, tagsRef.current, ctaRef.current],
        {
          y: -30,
          opacity: 0,
          duration: 0.6,
          ease: "none",
        },
        0
      );

      // Background grid zooms toward you (parallax depth)
      scrollTl.to(
        bgGridRef.current,
        {
          scale: 1.3,
          opacity: 0.1,
          duration: 1,
          ease: "none",
        },
        0
      );

      // Progress bar fills as you scroll through the hero
      scrollTl.to(
        progressBarRef.current,
        {
          scaleX: 1,
          duration: 1,
          ease: "none",
        },
        0
      );

      // HUD slides away
      scrollTl.to(
        hudRef.current,
        {
          x: 30,
          opacity: 0,
          duration: 0.4,
          ease: "none",
        },
        0
      );
    }, sectionRef.current);

    return () => ctx.revert();
  }, []);

  // ─── Typing effect ───────────────────────────────────────────────
  useEffect(() => {
    const currentWord = activeTypingWords[wordIdx % activeTypingWords.length];
    const speed = isDeleting ? 45 : 90;
    const pause = 2200;

    let timeout: NodeJS.Timeout;

    if (!isDeleting && typedText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), pause);
    } else if (isDeleting && typedText === "") {
      setIsDeleting(false);
      setWordIdx((prev) => (prev + 1) % activeTypingWords.length);
    } else {
      timeout = setTimeout(() => {
        setTypedText((prev) =>
          isDeleting ? prev.slice(0, -1) : currentWord.slice(0, prev.length + 1)
        );
      }, speed);
    }
    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, wordIdx, activeTypingWords]);

  const splitName = (text: string) =>
    text.split("").map((char, i) => (
      <span
        key={i}
        className="char"
        style={{ display: "inline-block" }}
      >
        {char === " " ? "\u00A0" : char}
      </span>
    ));

  const scrollToAbout = () =>
    document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });

  return (
    // Extra height so the pin has room to work
    <section ref={sectionRef} id="hero" className={styles.hero}>

      {/* ── Pinned inner ─────────────────────────────────────── */}
      <div ref={pinContainerRef} className={styles.pinContainer}>

        {/* Background layers */}
        <StarField count={200} className={styles.starField} />
        <div ref={bgGridRef} className={`tech-grid ${styles.techGrid}`} />

        {/* Ambient blobs */}
        <div className={`hero-blob ambient-blob ambient-blob-amber ${styles.blobLeft}`} />
        <div className={`hero-blob ambient-blob ambient-blob-cyan ${styles.blobRight}`} />
        <div className={`hero-blob ambient-blob ambient-blob-amber ${styles.blobBottom}`} />

        {/* HUD corner brackets */}
        <div className={`hud-corner ${styles.cornerTL}`} />
        <div className={`hud-corner ${styles.cornerTR}`} />
        <div className={`hud-corner ${styles.cornerBL}`} />
        <div className={`hud-corner ${styles.cornerBR}`} />

        {/* Scroll progress bar */}
        <div className={styles.progressTrack}>
          <div ref={progressBarRef} className={styles.progressBar} />
        </div>

        {/* HUD panel */}
        <div ref={hudRef} className={styles.hudPanel}>
          {[
            { label: "SYS_STATUS", value: "ONLINE", color: "#22D3EE" },
            { label: "LOC", value: "PKS // LHR", color: "#94A3B8" },
            { label: "MODE", value: "RESEARCH", color: "#FBBF24" },
            { label: "AVAIL", value: "TRUE", color: "#22C55E" },
          ].map(({ label, value, color }) => (
            <div key={label} className={`hud-item ${styles.hudItem}`}>
              <span className={styles.hudLabel}>{label}</span>
              <span className={styles.hudValue} style={{ color }}>{value}</span>
            </div>
          ))}
        </div>

        {/* ── Main content ───────────────────────────────────── */}
        <div className={styles.content}>

          {/* Left: Text */}
          <div className={styles.textContent}>
            <div className={styles.topLabel}>
              <span className={styles.labelDot} />
              <span className="section-label">Portfolio // 2024</span>
            </div>

            <p className={styles.greeting}>Hi There! I&apos;m</p>

            {/* Name with 3-D flip chars */}
            <div
              ref={nameRef}
              className={styles.nameWrapper}
              style={{ perspective: "800px" }}
              aria-label={fullName}
            >
              <div className={styles.nameLine1}>{splitName(firstName)}</div>
              {lastName && <div className={styles.nameLine2}>{splitName(lastName)}</div>}
            </div>

            {/* Typing subtitle */}
            <div ref={subtitleRef} className={styles.typingWrapper}>
              <span className={styles.typingPrefix}>&gt; </span>
              <span className={styles.typedText}>{typedText}</span>
              <span className="typing-cursor" />
            </div>

            {/* Tags */}
            <div ref={tagsRef} className={styles.tagRow}>
              {heroTags.map((tag) => (
                <span key={tag} className={`hero-tag tag`}>{tag}</span>
              ))}
            </div>

            {/* Bio snippet */}
            <p className={styles.bioBrief}>{data.subtitle}</p>

            {/* CTA */}
            <div ref={ctaRef} className={styles.ctaRow}>
              <button
                className="btn-primary"
                onClick={() =>
                  document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" })
                }
                id="hero-explore-btn"
              >
                Explore My Work
                <ArrowDown size={16} />
              </button>
              <a
                href={data.resumeUrl}
                className="btn-secondary"
                target="_blank"
                rel="noopener noreferrer"
                id="hero-resume-btn"
              >
                <Download size={16} />
                Download CV
              </a>
            </div>

            {/* Social row */}
            <div className={styles.socialRow}>
              {[
                { href: data.github, Icon: Github, label: "GitHub" },
                { href: data.linkedin, Icon: Linkedin, label: "LinkedIn" },
                { href: data.twitter, Icon: Twitter, label: "Twitter" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialLink}
                  aria-label={label}
                >
                  <Icon size={18} />
                </a>
              ))}
              <div className={styles.socialDivider} />
              <span className={styles.availableText}>
                <span className={styles.availableDot} />
                Available for opportunities
              </span>
            </div>
          </div>

          {/* Right: Hero Portrait & Interactive Telemetry */}
          <div className={styles.portraitContainer}>
            {/* Ambient sci-fi aura behind the portrait */}
            <div className={styles.portraitBackdropGlow} />

            {/* Orbit / Cyber rings behind her head & shoulders */}
            <div ref={orbitRef} className={styles.cyberRingWrapper}>
              <div className={`${styles.orbitRing} ${styles.orbitRing1}`} />
              <div className={`orbit-ring-2 ${styles.orbitRing} ${styles.orbitRing2}`}>
                <div className={styles.orbitDot} style={{ top: "10px", left: "50%", transform: "translateX(-50%)" }} />
                <div className={styles.orbitDotCyan} style={{ bottom: "10px", left: "50%", transform: "translateX(-50%)" }} />
              </div>
              <div className={`orbit-ring-3 ${styles.orbitRing} ${styles.orbitRing3}`}>
                <div className={styles.orbitDot} style={{ top: "50%", right: "8px", transform: "translateY(-50%)" }} />
              </div>
            </div>

            {/* Hero Cutout Portrait - full height reaching bottom of hero */}
            <div className={styles.portraitWrapper}>
              <img
                ref={portraitRef}
                src="/pic/profile.png"
                alt={fullName}
                className={styles.portraitImg}
              />
              <div className={styles.portraitScanLine} />
            </div>

            {/* Adjusted Floating Stat Chips around the portrait */}
            {/* 1. GPA Chip - Floating upper-left near shoulder */}
            <div className={`float-chip ${styles.floatChip} ${styles.chipGpa}`}>
              <div className={styles.chipHeader}>
                <span className={styles.chipDot} style={{ background: "#FBBF24" }} />
                <span className={styles.chipLabel}>GPA</span>
              </div>
              <span className={styles.chipValue}>{gpaValue}</span>
            </div>

            {/* 2. Papers Chip - Floating mid-right near hair edge */}
            <div className={`float-chip ${styles.floatChip} ${styles.chipPapers}`}>
              <div className={styles.chipHeader}>
                <span className={styles.chipDot} style={{ background: "#22D3EE" }} />
                <span className={styles.chipLabel}>Papers</span>
              </div>
              <span className={styles.chipValue}>{papersValue}</span>
            </div>

            {/* 3. Projects Chip - Floating lower-left near torso */}
            <div className={`float-chip ${styles.floatChip} ${styles.chipProjects}`}>
              <div className={styles.chipHeader}>
                <span className={styles.chipDot} style={{ background: "#C084FC" }} />
                <span className={styles.chipLabel}>Projects</span>
              </div>
              <span className={styles.chipValue}>{projectsValue}</span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          className={styles.scrollIndicator}
          onClick={scrollToAbout}
          aria-label="Scroll to about section"
        >
          <div className={styles.scrollMouse}>
            <div className={styles.scrollDot} />
          </div>
          <span>SCROLL</span>
        </button>
      </div>
    </section>
  );
}
