import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ResearchInterests from "@/components/sections/ResearchInterests";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Publications from "@/components/sections/Publications";
import Resume from "@/components/sections/Resume";
import Contact from "@/components/sections/Contact";
import GlobalAnimations from "@/components/ui/GlobalAnimations";

// Import data
import portfolioData from "@/data/portfolio.json";
import projectsData from "@/data/projects.json";
import skillsData from "@/data/skills.json";
import publicationsData from "@/data/publications.json";
import resumeData from "@/data/resume.json";

export default function HomePage() {
  return (
    <>
      {/* Global GSAP ambient animations (client-only) */}
      <GlobalAnimations />

      <Navbar />

      <main>
        <Hero data={portfolioData.personal} />
        <About about={portfolioData.about} personal={portfolioData.personal} />
        <ResearchInterests data={portfolioData.researchInterests} />
        <Projects data={projectsData} />
        <Skills data={skillsData} />
        <Publications data={publicationsData} />
        <Resume data={resumeData} resumeUrl={portfolioData.personal.resumeUrl} />
        <Contact data={{ ...portfolioData.personal, contact: portfolioData.contact }} />
      </main>

      <Footer
        name={portfolioData.personal.name}
        github={portfolioData.personal.github}
        linkedin={portfolioData.personal.linkedin}
        twitter={portfolioData.personal.twitter}
      />
    </>
  );
}
