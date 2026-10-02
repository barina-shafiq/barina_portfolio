"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Global ambient animations:
 * – Ambient blob drifts
 * – Section label / separator reveals
 * – Cursor spotlight glow (desktop)
 * – Scroll-driven navbar opacity
 */
export default function GlobalAnimations() {
  useEffect(() => {
    // ── 0. Cursor spotlight ──────────────────────────────────────
    const spotlight = document.createElement("div");
    spotlight.className = "cursor-spotlight";
    document.body.appendChild(spotlight);

    const moveCursor = (e: MouseEvent) => {
      gsap.to(spotlight, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.6,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    window.addEventListener("mousemove", moveCursor);


    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".ambient-blob-amber").forEach((blob, i) => {
        gsap.to(blob, {
          x: i % 2 === 0 ? 30 : -30,
          y: i % 2 === 0 ? -20 : 20,
          duration: 8 + i * 2,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      gsap.utils.toArray<HTMLElement>(".ambient-blob-cyan").forEach((blob, i) => {
        gsap.to(blob, {
          x: i % 2 === 0 ? -25 : 25,
          y: i % 2 === 0 ? 15 : -15,
          duration: 10 + i * 1.5,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });

      // ── 2. Section separator reveal ─────────────────────────────
      gsap.utils.toArray<HTMLElement>(".section-sep").forEach((sep) => {
        gsap.fromTo(
          sep,
          { scaleX: 0, opacity: 0 },
          {
            scaleX: 1, opacity: 1, duration: 0.6, ease: "expo.out",
            scrollTrigger: { trigger: sep, start: "top 90%" },
          }
        );
      });

      // ── 3. Section label fade ───────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".section-label").forEach((label) => {
        gsap.fromTo(
          label,
          { opacity: 0, letterSpacing: "0.35em" },
          {
            opacity: 0.8, letterSpacing: "0.2em", duration: 0.7,
            scrollTrigger: { trigger: label, start: "top 90%" },
          }
        );
      });
    });

    // ── 4. Glass card hover tilt (desktop only) ─────────────────
    const cardCleanups: Array<() => void> = [];
    if (window.innerWidth > 768) {
      const cards = document.querySelectorAll<HTMLElement>(".glass-card");
      cards.forEach((card) => {
        const onMove = (e: MouseEvent) => {
          const rect = card.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;   // -0.5 … 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          gsap.to(card, {
            rotateX: -y * 6,
            rotateY: x * 6,
            transformPerspective: 800,
            duration: 0.4,
            ease: "power2.out",
          });
        };
        const onLeave = () => {
          gsap.to(card, {
            rotateX: 0, rotateY: 0, duration: 0.5, ease: "power3.out",
          });
        };
        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseleave", onLeave);
        cardCleanups.push(() => {
          card.removeEventListener("mousemove", onMove);
          card.removeEventListener("mouseleave", onLeave);
        });
      });
    }

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      spotlight.remove();
      cardCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
