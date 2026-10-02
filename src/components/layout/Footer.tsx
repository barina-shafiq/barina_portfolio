import { Github, Linkedin, Twitter, Heart } from "lucide-react";
import styles from "./Footer.module.css";

export default function Footer({
  name,
  github,
  linkedin,
  twitter,
}: {
  name: string;
  github: string;
  linkedin: string;
  twitter: string;
}) {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.topLine} />

      <div className="container">
        <div className={styles.inner}>
          <div className={styles.left}>
            <span className={styles.logo}>
              BS<span className={styles.logoDot}>.</span>
            </span>
            <p className={styles.tagline}>
              Bridging research and innovation.
            </p>
          </div>

          <div className={styles.center}>
            <p className={styles.copy}>
              © {year} {name}. Built with{" "}
              <Heart size={12} style={{ display: "inline", color: "#FBBF24", verticalAlign: "middle" }} />{" "}
              using Next.js & GSAP.
            </p>
          </div>

          <div className={styles.right}>
            <a href={github} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="GitHub">
              <Github size={18} />
            </a>
            <a href={linkedin} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
            <a href={twitter} target="_blank" rel="noopener noreferrer" className={styles.socialLink} aria-label="Twitter">
              <Twitter size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
