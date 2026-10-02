"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, Zap } from "lucide-react";
import styles from "./login.module.css";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await res.json();

    if (data.success) {
      router.push("/admin");
    } else {
      setError("Invalid password. Access denied.");
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {/* Background grid */}
      <div className="tech-grid" />

      {/* Ambient blobs */}
      <div className="ambient-blob ambient-blob-amber" style={{ width: 400, height: 400, left: "-100px", top: "20%" }} />
      <div className="ambient-blob ambient-blob-cyan" style={{ width: 400, height: 400, right: "-100px", bottom: "20%" }} />

      <div className={styles.panel}>
        {/* Logo */}
        <div className={styles.logoRow}>
          <div className={styles.logoIcon}>
            <Zap size={24} />
          </div>
          <div>
            <h1 className={styles.logoText}>Admin Portal</h1>
            <p className={styles.logoSub}>Barina Shafique Portfolio</p>
          </div>
        </div>

        {/* Separator */}
        <div className={styles.sep} />

        <form onSubmit={handleLogin} className={styles.form}>
          <div className={styles.fieldGroup}>
            <label htmlFor="admin-password" className="admin-label">
              Admin Password
            </label>
            <div className={styles.inputWrapper}>
              <Lock size={16} className={styles.inputIcon} />
              <input
                id="admin-password"
                type={showPass ? "text" : "password"}
                className={`admin-input ${styles.input}`}
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                className={styles.showBtn}
                onClick={() => setShowPass(!showPass)}
                aria-label="Toggle password visibility"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <div className={styles.error}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            id="admin-login-btn"
            style={{ width: "100%", justifyContent: "center" }}
          >
            {loading ? "Authenticating..." : "Access Dashboard"}
          </button>
        </form>

        {/* <p className={styles.hint}>
          Default password: <code>barina2024admin</code><br />
          <small>Set ADMIN_PASSWORD in environment variables to customize.</small>
        </p> */}
      </div>
    </div>
  );
}
