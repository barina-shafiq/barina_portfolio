"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, FolderKanban, User, BookOpen, Cpu, FileText,
  LogOut, Plus, Trash2, Edit3, Save, X, ChevronDown, ChevronUp, RefreshCw
} from "lucide-react";
import styles from "./admin.module.css";

// Types
interface Project {
  id: string; title: string; category: string; tags: string[];
  description: string; longDescription: string; image: string;
  github: string; demo: string; featured: boolean; order: number;
  year: string; status: string;
}

interface PortfolioData {
  personal: {
    name: string; title: string; tagline: string; subtitle: string;
    bio: string; email: string; phone: string; location: string;
    github: string; linkedin: string; twitter: string;
    resumeUrl: string;
    stats: { label: string; value: string; icon: string }[];
    heroTags?: string[];
    typingWords?: string[];
  };
  about: { heading: string; description: string; highlights: string[]; interests: string[] };
  researchInterests: { id: string; title: string; icon: string; description: string; keywords: string[] }[];
  contact: { heading: string; subheading: string; formspreeId: string };
}

type AdminTab = "overview" | "personal" | "projects" | "research" | "skills" | "publications" | "resume";

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Load data
  useEffect(() => {
    const load = async () => {
      try {
        const [portfolioRes, projectsRes] = await Promise.all([
          fetch("/api/admin/data?file=portfolio.json"),
          fetch("/api/admin/data?file=projects.json"),
        ]);

        if (portfolioRes.status === 401) {
          router.push("/admin/login");
          return;
        }

        const portfolioJson = await portfolioRes.json();
        const projectsJson = await projectsRes.json();

        setPortfolioData(portfolioJson.data);
        setProjects(projectsJson.data);
      } catch (err) {
        console.error(err);
        router.push("/admin/login");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [router]);

  const saveFile = async (file: string, data: unknown) => {
    setSaving(true);
    setSaveMsg("");
    const res = await fetch("/api/admin/data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ file, data }),
    });

    if (res.ok) {
      setSaveMsg("✓ Saved successfully");
    } else {
      setSaveMsg("✗ Save failed");
    }
    setSaving(false);
    setTimeout(() => setSaveMsg(""), 3000);
  };

  const handleLogout = async () => {
    await fetch("/api/admin/auth", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handlePersonalChange = (field: string, value: string) => {
    if (!portfolioData) return;
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, [field]: value },
    });
  };

  const handleStatChange = (index: number, field: "label" | "value", value: string) => {
    if (!portfolioData) return;
    const stats = [...(portfolioData.personal.stats || [])];
    if (stats[index]) {
      stats[index] = { ...stats[index], [field]: value };
      setPortfolioData({
        ...portfolioData,
        personal: { ...portfolioData.personal, stats },
      });
    }
  };

  const handleAddStat = () => {
    if (!portfolioData) return;
    const stats = [
      ...(portfolioData.personal.stats || []),
      { label: "New Metric", value: "10+", icon: "star" },
    ];
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, stats },
    });
  };

  const handleRemoveStat = (index: number) => {
    if (!portfolioData) return;
    const stats = (portfolioData.personal.stats || []).filter((_, i) => i !== index);
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, stats },
    });
  };

  const handleQuickMetricChange = (keyword: string, defaultLabel: string, value: string) => {
    if (!portfolioData) return;
    const stats = [...(portfolioData.personal.stats || [])];
    const index = stats.findIndex((s) => s.label.toLowerCase().includes(keyword.toLowerCase()));
    if (index >= 0) {
      stats[index] = { ...stats[index], value };
    } else {
      stats.push({ label: defaultLabel, value, icon: "star" });
    }
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, stats },
    });
  };

  const handleHeroTagChange = (index: number, value: string) => {
    if (!portfolioData) return;
    const heroTags = [...(portfolioData.personal.heroTags || ["Machine Learning", "Full Stack", "NLP", "Research", "Open Source"])];
    heroTags[index] = value;
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, heroTags },
    });
  };

  const handleAddHeroTag = () => {
    if (!portfolioData) return;
    const heroTags = [...(portfolioData.personal.heroTags || ["Machine Learning", "Full Stack", "NLP", "Research", "Open Source"]), "New Tag"];
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, heroTags },
    });
  };

  const handleRemoveHeroTag = (index: number) => {
    if (!portfolioData) return;
    const heroTags = (portfolioData.personal.heroTags || []).filter((_, i) => i !== index);
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, heroTags },
    });
  };

  const handleTypingWordChange = (index: number, value: string) => {
    if (!portfolioData) return;
    const typingWords = [...(portfolioData.personal.typingWords || ["Machine Learning", "NLP Researcher", "Full Stack Dev", "CS Scholar", "AI Enthusiast"])];
    typingWords[index] = value;
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, typingWords },
    });
  };

  const handleAddTypingWord = () => {
    if (!portfolioData) return;
    const typingWords = [...(portfolioData.personal.typingWords || []), "New Role"];
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, typingWords },
    });
  };

  const handleRemoveTypingWord = (index: number) => {
    if (!portfolioData) return;
    const typingWords = (portfolioData.personal.typingWords || []).filter((_, i) => i !== index);
    setPortfolioData({
      ...portfolioData,
      personal: { ...portfolioData.personal, typingWords },
    });
  };

  const handleAboutChange = (field: string, value: string | string[]) => {
    if (!portfolioData) return;
    setPortfolioData({
      ...portfolioData,
      about: { ...portfolioData.about, [field]: value },
    });
  };

  const handleDeleteProject = (id: string) => {
    if (confirm("Delete this project?")) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const handleSaveProject = (project: Project) => {
    if (projects.find((p) => p.id === project.id)) {
      setProjects(projects.map((p) => p.id === project.id ? project : p));
    } else {
      setProjects([...projects, project]);
    }
    setEditingProject(null);
    setShowProjectForm(false);
  };

  const newProject = (): Project => ({
    id: `proj${Date.now()}`,
    title: "", category: "Machine Learning", tags: [], description: "",
    longDescription: "", image: "", github: "", demo: "",
    featured: false, order: projects.length + 1, year: new Date().getFullYear().toString(),
    status: "In Progress",
  });

  const TABS: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
    { id: "personal", label: "Personal Info", icon: <User size={16} /> },
    { id: "projects", label: "Projects", icon: <FolderKanban size={16} /> },
    { id: "research", label: "Research", icon: <BookOpen size={16} /> },
    { id: "skills", label: "Skills", icon: <Cpu size={16} /> },
    { id: "publications", label: "Publications", icon: <FileText size={16} /> },
  ];

  if (loading) {
    return (
      <div className={styles.loading}>
        <RefreshCw size={24} className={styles.spinIcon} />
        <p>Loading admin panel...</p>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarLogo}>
          <span className={styles.logoText}>BS</span>
          <span className={styles.logoDot}>.</span>
          <span className={styles.adminLabel}>Admin</span>
        </div>

        <nav className={styles.sideNav}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.navItem} ${activeTab === tab.id ? styles.navItemActive : ""}`}
              onClick={() => setActiveTab(tab.id)}
              id={`admin-tab-${tab.id}`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>

        <div className={styles.sidebarBottom}>
          <a href="/" target="_blank" className={styles.viewSiteBtn}>
            View Site ↗
          </a>
          <button className={styles.logoutBtn} onClick={handleLogout}>
            <LogOut size={14} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>
        {/* Save bar */}
        {saveMsg && (
          <div className={`${styles.saveBar} ${saveMsg.includes("✓") ? styles.saveSuccess : styles.saveError}`}>
            {saveMsg}
          </div>
        )}

        {/* Overview tab */}
        {activeTab === "overview" && (
          <div className={styles.content}>
            <h1 className={styles.pageTitle}>Dashboard Overview</h1>
            <div className={styles.statsGrid}>
              <div className={`${styles.statCard}`}>
                <div className={styles.statNum}>{projects.length}</div>
                <div className={styles.statLbl}>Total Projects</div>
              </div>
              <div className={`${styles.statCard}`}>
                <div className={styles.statNum}>{projects.filter((p) => p.featured).length}</div>
                <div className={styles.statLbl}>Featured Projects</div>
              </div>
              <div className={`${styles.statCard}`}>
                <div className={styles.statNum}>{portfolioData?.researchInterests.length || 0}</div>
                <div className={styles.statLbl}>Research Areas</div>
              </div>
            </div>

            <div className={styles.quickActions}>
              <h2 className={styles.sectionTitle}>Quick Actions</h2>
              <div className={styles.actionBtns}>
                <button className="btn-primary" onClick={() => { setActiveTab("projects"); setShowProjectForm(true); setEditingProject(newProject()); }}>
                  <Plus size={16} /> Add Project
                </button>
                <button className="btn-secondary" onClick={() => setActiveTab("personal")}>
                  <Edit3 size={16} /> Edit Bio
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Personal Info tab */}
        {activeTab === "personal" && portfolioData && (
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Personal Information</h1>
              <button
                className="btn-primary"
                onClick={() => saveFile("portfolio.json", portfolioData)}
                disabled={saving}
                id="save-personal-btn"
              >
                <Save size={16} />
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <div className={styles.formGrid}>
              {[
                { field: "name", label: "Full Name" },
                { field: "title", label: "Title / Role" },
                { field: "tagline", label: "Tagline" },
                { field: "email", label: "Email" },
                { field: "phone", label: "Phone" },
                { field: "location", label: "Location" },
                { field: "github", label: "GitHub URL" },
                { field: "linkedin", label: "LinkedIn URL" },
                { field: "twitter", label: "Twitter URL" },
                { field: "resumeUrl", label: "Resume URL" },
              ].map(({ field, label }) => (
                <div key={field} className={styles.fieldGroup}>
                  <label className="admin-label">{label}</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={(portfolioData.personal as unknown as Record<string, string>)[field] || ""}
                    onChange={(e) => handlePersonalChange(field, e.target.value)}
                    id={`personal-${field}`}
                  />
                </div>
              ))}
            </div>

            {/* Bio textarea */}
            <div className={styles.fieldGroup} style={{ marginTop: "20px" }}>
              <label className="admin-label">Bio (Full paragraph)</label>
              <textarea
                className={`admin-input ${styles.textarea}`}
                rows={5}
                value={portfolioData.personal.bio}
                onChange={(e) => handlePersonalChange("bio", e.target.value)}
                id="personal-bio"
              />
            </div>

            {/* Subtitle */}
            <div className={styles.fieldGroup} style={{ marginTop: "16px" }}>
              <label className="admin-label">Hero Subtitle (shown on homepage)</label>
              <input
                type="text"
                className="admin-input"
                value={portfolioData.personal.subtitle}
                onChange={(e) => handlePersonalChange("subtitle", e.target.value)}
                id="personal-subtitle"
              />
            </div>

            {/* ── Hero Badges & Key Metrics ── */}
            <div className={styles.heroBadgeCard}>
              <h2 className={styles.sectionTitle} style={{ marginBottom: "8px" }}>
                Hero Floating Chips &amp; Key Metrics
              </h2>
              <p className={styles.subheadingHint}>
                These values directly control the floating badges in the Hero orbit animation (GPA, Research Papers, Projects Completed) and the animated number counters in the About section.
              </p>

              {/* Quick Hero 3-Badge Controls */}
              <div className={styles.formGrid} style={{ marginBottom: "20px" }}>
                <div className={styles.fieldGroup}>
                  <label className="admin-label">
                    Hero GPA Chip <span className={styles.statBadge}>Hero Orbit</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={portfolioData.personal.stats?.find((s) => s.label.toLowerCase().includes("gpa"))?.value || ""}
                    placeholder="e.g. 3.82"
                    onChange={(e) => handleQuickMetricChange("gpa", "GPA", e.target.value)}
                    id="hero-quick-gpa"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className="admin-label">
                    Hero Papers Chip <span className={styles.statBadge}>Hero Orbit</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={portfolioData.personal.stats?.find((s) => s.label.toLowerCase().includes("paper"))?.value || ""}
                    placeholder="e.g. 3"
                    onChange={(e) => handleQuickMetricChange("paper", "Research Papers", e.target.value)}
                    id="hero-quick-papers"
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className="admin-label">
                    Hero Projects Chip <span className={styles.statBadge}>Hero Orbit</span>
                  </label>
                  <input
                    type="text"
                    className="admin-input"
                    value={portfolioData.personal.stats?.find((s) => s.label.toLowerCase().includes("project"))?.value || ""}
                    placeholder="e.g. 15+"
                    onChange={(e) => handleQuickMetricChange("project", "Projects Completed", e.target.value)}
                    id="hero-quick-projects"
                  />
                </div>
              </div>

              {/* Full Metrics / Stats Table */}
              <label className="admin-label" style={{ marginBottom: "8px", display: "block" }}>
                All Metrics &amp; About Counters
              </label>

              {portfolioData.personal.stats?.map((stat, idx) => {
                const isHeroChip =
                  stat.label.toLowerCase().includes("gpa") ||
                  stat.label.toLowerCase().includes("paper") ||
                  stat.label.toLowerCase().includes("project");

                return (
                  <div key={idx} className={styles.statRow}>
                    <input
                      type="text"
                      className="admin-input"
                      value={stat.label}
                      placeholder="Metric label (e.g. GPA)"
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      id={`stat-label-${idx}`}
                    />
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <input
                        type="text"
                        className="admin-input"
                        value={stat.value}
                        placeholder="Value (e.g. 3.82)"
                        onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                        id={`stat-val-${idx}`}
                      />
                      {isHeroChip && (
                        <span className={styles.statBadge} title="Linked to Hero floating chip">
                          Hero
                        </span>
                      )}
                    </div>
                    <button
                      className={styles.removeBtn}
                      onClick={() => handleRemoveStat(idx)}
                      title="Remove metric"
                      type="button"
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}

              <button
                type="button"
                className="btn-ghost"
                style={{ marginTop: "8px" }}
                onClick={handleAddStat}
                id="add-stat-metric-btn"
              >
                <Plus size={14} /> Add Metric
              </button>
            </div>

            {/* ── Hero Specialization Tags ── */}
            <div style={{ marginTop: "24px" }}>
              <h2 className={styles.sectionTitle}>Hero Specialization Tags</h2>
              <p className={styles.subheadingHint}>
                Pill badges displayed underneath the animated name and typing subtitle in the Hero section.
              </p>
              {(portfolioData.personal.heroTags || ["Machine Learning", "Full Stack", "NLP", "Research", "Open Source"]).map((tag, i) => (
                <div key={i} className={styles.listItemRow}>
                  <input
                    type="text"
                    className="admin-input"
                    value={tag}
                    onChange={(e) => handleHeroTagChange(i, e.target.value)}
                    id={`hero-tag-${i}`}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveHeroTag(i)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost"
                style={{ marginTop: "8px" }}
                onClick={handleAddHeroTag}
              >
                <Plus size={14} /> Add Tag
              </button>
            </div>

            {/* ── Hero Rotating Titles (Typing Animation) ── */}
            <div style={{ marginTop: "24px" }}>
              <h2 className={styles.sectionTitle}>Hero Rotating Roles (Typing Effect)</h2>
              <p className={styles.subheadingHint}>
                Phrases that automatically type out and backspace in the terminal-style animation on the Hero.
              </p>
              {(portfolioData.personal.typingWords || ["Machine Learning", "NLP Researcher", "Full Stack Dev", "CS Scholar", "AI Enthusiast"]).map((word, i) => (
                <div key={i} className={styles.listItemRow}>
                  <input
                    type="text"
                    className="admin-input"
                    value={word}
                    onChange={(e) => handleTypingWordChange(i, e.target.value)}
                    id={`typing-word-${i}`}
                  />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => handleRemoveTypingWord(i)}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="btn-ghost"
                style={{ marginTop: "8px" }}
                onClick={handleAddTypingWord}
              >
                <Plus size={14} /> Add Role
              </button>
            </div>

            {/* About highlights */}
            <div style={{ marginTop: "32px" }}>
              <h2 className={styles.sectionTitle}>About Highlights</h2>
              {portfolioData.about.highlights.map((h, i) => (
                <div key={i} className={styles.listItemRow}>
                  <input
                    type="text"
                    className="admin-input"
                    value={h}
                    onChange={(e) => {
                      const updated = [...portfolioData.about.highlights];
                      updated[i] = e.target.value;
                      handleAboutChange("highlights", updated);
                    }}
                    id={`highlight-${i}`}
                  />
                  <button className={styles.removeBtn} onClick={() => {
                    handleAboutChange("highlights", portfolioData.about.highlights.filter((_, j) => j !== i));
                  }}>
                    <X size={14} />
                  </button>
                </div>
              ))}
              <button className="btn-ghost" style={{ marginTop: "8px" }} onClick={() => handleAboutChange("highlights", [...portfolioData.about.highlights, ""])}>
                <Plus size={14} /> Add Highlight
              </button>
            </div>
          </div>
        )}

        {/* Projects tab */}
        {activeTab === "projects" && (
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Projects</h1>
              <div className={styles.headerActions}>
                <button
                  className="btn-primary"
                  onClick={() => { setEditingProject(newProject()); setShowProjectForm(true); }}
                  id="add-project-btn"
                >
                  <Plus size={16} /> Add Project
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => saveFile("projects.json", projects)}
                  disabled={saving}
                  id="save-projects-btn"
                >
                  <Save size={16} /> {saving ? "Saving..." : "Save All"}
                </button>
              </div>
            </div>

            {/* Project form */}
            {showProjectForm && editingProject && (
              <ProjectForm
                project={editingProject}
                onSave={handleSaveProject}
                onCancel={() => { setShowProjectForm(false); setEditingProject(null); }}
              />
            )}

            {/* Projects list */}
            <div className={styles.projectsList}>
              {projects.map((project) => (
                <div key={project.id} className={styles.projectRow}>
                  <div className={styles.projectRowLeft}>
                    <div className={styles.projectRowTitle}>{project.title}</div>
                    <div className={styles.projectRowMeta}>
                      <span className="tag" style={{ fontSize: "0.7rem" }}>{project.category}</span>
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{project.year}</span>
                      {project.featured && <span className="tag" style={{ background: "rgba(251,191,36,0.15)", fontSize: "0.68rem" }}>Featured</span>}
                    </div>
                  </div>
                  <div className={styles.projectRowActions}>
                    <button className="btn-ghost" style={{ fontSize: "0.78rem", padding: "6px 12px" }}
                      onClick={() => { setEditingProject({ ...project }); setShowProjectForm(true); }}>
                      <Edit3 size={13} /> Edit
                    </button>
                    <button className={styles.deleteBtn} onClick={() => handleDeleteProject(project.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Research tab */}
        {activeTab === "research" && portfolioData && (
          <div className={styles.content}>
            <div className={styles.contentHeader}>
              <h1 className={styles.pageTitle}>Research Interests</h1>
              <button className="btn-primary" onClick={() => saveFile("portfolio.json", portfolioData)} disabled={saving} id="save-research-btn">
                <Save size={16} /> {saving ? "Saving..." : "Save"}
              </button>
            </div>

            {portfolioData.researchInterests.map((ri, i) => (
              <div key={ri.id} className={`${styles.researchCard}`}>
                <div className={styles.researchCardHeader}>
                  <span className={styles.researchNum}>{String(i+1).padStart(2,"0")}</span>
                  <button className={styles.removeBtn} onClick={() => {
                    setPortfolioData({
                      ...portfolioData,
                      researchInterests: portfolioData.researchInterests.filter((_, j) => j !== i),
                    });
                  }}>
                    <X size={14} />
                  </button>
                </div>

                <div className={styles.formGrid}>
                  {[
                    { field: "icon", label: "Icon (emoji)" },
                    { field: "title", label: "Title" },
                  ].map(({ field, label }) => (
                    <div key={field} className={styles.fieldGroup}>
                      <label className="admin-label">{label}</label>
                      <input
                        type="text"
                        className="admin-input"
                        value={(ri as unknown as Record<string, string>)[field]}
                        onChange={(e) => {
                          const updated = [...portfolioData.researchInterests];
                          updated[i] = { ...ri, [field]: e.target.value };
                          setPortfolioData({ ...portfolioData, researchInterests: updated });
                        }}
                        id={`ri-${i}-${field}`}
                      />
                    </div>
                  ))}
                </div>

                <div className={styles.fieldGroup}>
                  <label className="admin-label">Description</label>
                  <textarea
                    className={`admin-input ${styles.textareaSmall}`}
                    rows={3}
                    value={ri.description}
                    onChange={(e) => {
                      const updated = [...portfolioData.researchInterests];
                      updated[i] = { ...ri, description: e.target.value };
                      setPortfolioData({ ...portfolioData, researchInterests: updated });
                    }}
                    id={`ri-${i}-description`}
                  />
                </div>

                <div className={styles.fieldGroup}>
                  <label className="admin-label">Keywords (comma-separated)</label>
                  <input
                    type="text"
                    className="admin-input"
                    value={ri.keywords.join(", ")}
                    onChange={(e) => {
                      const updated = [...portfolioData.researchInterests];
                      updated[i] = { ...ri, keywords: e.target.value.split(",").map((k) => k.trim()) };
                      setPortfolioData({ ...portfolioData, researchInterests: updated });
                    }}
                    id={`ri-${i}-keywords`}
                  />
                </div>
              </div>
            ))}

            <button className="btn-ghost" style={{ marginTop: "16px" }} onClick={() => {
              setPortfolioData({
                ...portfolioData,
                researchInterests: [...portfolioData.researchInterests, {
                  id: `ri${Date.now()}`, title: "New Research Area", icon: "🔬",
                  description: "Description here.", keywords: []
                }]
              });
            }}>
              <Plus size={14} /> Add Research Area
            </button>
          </div>
        )}

        {/* Placeholder for skills & publications */}
        {(activeTab === "skills" || activeTab === "publications") && (
          <div className={styles.content}>
            <h1 className={styles.pageTitle}>
              {activeTab === "skills" ? "Skills" : "Publications"} Editor
            </h1>
            <div className={styles.placeholderNote}>
              <p>Advanced JSON editor for this section:</p>
              <a
                href={`/api/admin/data?file=${activeTab === "skills" ? "skills" : "publications"}.json`}
                target="_blank"
                className="btn-secondary"
                style={{ marginTop: "16px", display: "inline-flex" }}
              >
                View / Edit Raw JSON ↗
              </a>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Project Form Component
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project;
  onSave: (p: Project) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState<Project>({ ...project });

  const handleChange = (field: keyof Project, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="glass-card" style={{ padding: "28px", marginBottom: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h3 style={{ fontFamily: "Orbitron, sans-serif", fontSize: "0.95rem", color: "#FBBF24" }}>
          {project.title ? "Edit Project" : "New Project"}
        </h3>
        <button onClick={onCancel} style={{ background: "none", border: "none", color: "#64748B", cursor: "pointer" }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {[
          { field: "title", label: "Title" },
          { field: "category", label: "Category" },
          { field: "year", label: "Year" },
          { field: "status", label: "Status" },
          { field: "github", label: "GitHub URL" },
          { field: "demo", label: "Demo URL" },
        ].map(({ field, label }) => (
          <div key={field}>
            <label className="admin-label">{label}</label>
            <input
              type="text"
              className="admin-input"
              value={(form as unknown as Record<string, string>)[field] || ""}
              onChange={(e) => handleChange(field as keyof Project, e.target.value)}
              id={`proj-form-${field}`}
            />
          </div>
        ))}
      </div>

      <div style={{ marginTop: "16px" }}>
        <label className="admin-label">Tags (comma-separated)</label>
        <input
          type="text"
          className="admin-input"
          value={form.tags.join(", ")}
          onChange={(e) => handleChange("tags", e.target.value.split(",").map((t) => t.trim()))}
          id="proj-form-tags"
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <label className="admin-label">Short Description</label>
        <textarea
          className="admin-input"
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          id="proj-form-description"
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <label className="admin-label">Long Description (for modal)</label>
        <textarea
          className="admin-input"
          rows={4}
          value={form.longDescription}
          onChange={(e) => handleChange("longDescription", e.target.value)}
          id="proj-form-long-description"
        />
      </div>

      <div style={{ marginTop: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
        <input
          type="checkbox"
          id="proj-form-featured"
          checked={form.featured}
          onChange={(e) => handleChange("featured", e.target.checked)}
        />
        <label htmlFor="proj-form-featured" className="admin-label" style={{ marginBottom: 0 }}>
          Mark as Featured
        </label>
      </div>

      <div style={{ marginTop: "24px", display: "flex", gap: "12px", justifyContent: "flex-end" }}>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
        <button className="btn-primary" onClick={() => onSave(form)} id="save-project-btn">
          <Save size={16} /> Save Project
        </button>
      </div>
    </div>
  );
}
