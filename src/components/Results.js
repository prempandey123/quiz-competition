import { useState } from "react";
import { db } from "../firebase";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  writeBatch,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ResultsPCM_Aptitude() {
  const [results, setResults] = useState([]);
  const [quizTitles, setQuizTitles] = useState([]);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(null);

  const [showQuestions, setShowQuestions] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [deletingId, setDeletingId] = useState(null);
  const [deletingQuiz, setDeletingQuiz] = useState(false);

  const allowedPasswords = ["admin123", "secret456"];

  const cleanText = (t) => (t || "").replace(/\s+/g, " ").trim();

  const getTotalQuestions = (u) => {
    if (Array.isArray(u.questions) && u.questions.length > 0) return u.questions.length;
    // fallback: max question id from answers (not perfect but OK for very old records)
    const keys = Object.keys(u.answers || {});
    return keys.length ? keys.length : 0;
  };

  const getAttempted = (u) => Object.keys(u.answers || {}).length;

  // ---------------- LOGIN ----------------
  const handleLogin = async () => {
    if (allowedPasswords.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      await fetchQuizTitles();
    } else {
      setPasswordError("Invalid password!");
    }
  };

  // ---------------- FETCH QUIZ TITLES ----------------
  const fetchQuizTitles = async () => {
    setLoading(true);
    try {
      const snapshot = await getDocs(collection(db, "quizResults"));
      const titles = new Set();

      snapshot.docs.forEach((d) => {
        const data = d.data();
        if (data.quizTitle) titles.add(cleanText(data.quizTitle));
      });

      setQuizTitles([...titles].sort((a, b) => a.localeCompare(b)));
    } catch (err) {
      console.error("Error fetching titles:", err);
    }
    setLoading(false);
  };

  // ---------------- FETCH RESULTS ----------------
  const fetchResultsByTitle = async () => {
    if (!selectedQuizTitle) return alert("Please select a quiz title.");

    setLoading(true);
    try {
      const cleanedTitle = cleanText(selectedQuizTitle);

      const qRef = query(
        collection(db, "quizResults"),
        where("quizTitle", "==", cleanedTitle)
      );
      const snapshot = await getDocs(qRef);

      const list = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));

      list.sort((a, b) => {
        if (!a.submittedAt || !b.submittedAt) return 0;
        return b.submittedAt.seconds - a.submittedAt.seconds;
      });

      setResults(list);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to fetch results. Check console.");
    }
    setLoading(false);
  };

  // ---------------- EXPORT EXCEL ----------------
  const exportToExcel = () => {
    if (!results.length) return alert("No data to export!");

    const rows = results.map((u) => {
      const attempted = getAttempted(u);
      const total = getTotalQuestions(u);

      return {
        QuizTitle: cleanText(u.quizTitle),
        Name: u.name,
        College: u.college || "",
        Branch: u.branch || "",
        Marks: `${u.marks} / ${attempted} / ${total || ""}`,
        SubmittedAt: u.submittedAt?.toDate ? u.submittedAt.toDate().toLocaleString() : "N/A",
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(
      new Blob([buf], { type: "application/octet-stream" }),
      `${selectedQuizTitle}_Results.xlsx`
    );
  };

  // ---------------- PRINT SINGLE ----------------
  const handlePrintSingle = (user) => {
    const win = window.open("", "_blank");

    const date = user.submittedAt?.toDate ? user.submittedAt.toDate().toLocaleString() : "N/A";
    const attempted = getAttempted(user);
    const total = getTotalQuestions(user);

    const hasQuestions = Array.isArray(user.questions) && user.questions.length > 0;

    const questionsHtml = hasQuestions
      ? user.questions
          .map((q) => {
            const chosen = user.answers?.[q.id];

            const isNewFormat =
              Array.isArray(q.options) && typeof q.options?.[0] === "object";

            const correctKey = q.answerKey || null;

            const renderOptText = (opt) => {
              if (typeof opt === "string") return opt; // old
              return `${opt.key}. ${opt.en || ""}`; // new (english only)
            };

            const optKey = (opt) => {
              if (typeof opt === "string") return opt;
              return opt.key;
            };

            const opts = (q.options || [])
              .map((opt) => {
                const key = optKey(opt);
                const isCorrect = isNewFormat ? correctKey === key : q.answer === opt;
                const isChosen = chosen === key;

                return `<li style="margin:6px 0;">
                  ${renderOptText(opt)}
                  ${isCorrect ? " ✅ <b>(Correct)</b>" : ""}
                  ${isChosen ? " <b>(Your Answer)</b>" : ""}
                </li>`;
              })
              .join("");

            const questionText = q.q || q.q_en || "";

            return `
              <div style="border:1px solid #ddd; padding:12px; border-radius:10px; margin:10px 0;">
                <p style="margin:0 0 8px 0;"><b>Q${q.id}:</b> ${questionText}</p>
                <ol style="margin:0 0 8px 18px; padding:0;">
                  ${opts}
                </ol>
                <p style="margin:0;"><b>Your Answer:</b> ${chosen || "Not Answered"}</p>
              </div>
            `;
          })
          .join("")
      : `
        <h3 style="margin-top:16px;">Answers:</h3>
        <ul>
          ${Object.entries(user.answers || {})
            .map(([id, ans]) => `<li><b>Q${id}:</b> ${ans}</li>`)
            .join("")}
        </ul>
      `;

    win.document.write(`
      <html>
      <head>
        <title>Print Quiz Submission</title>
        <style>
          body { font-family: Arial; padding: 20px; line-height: 1.6; }
          h2 { margin-bottom: 10px; }
          .box { border: 1px solid #ddd; padding: 14px; border-radius: 10px; }
        </style>
      </head>
      <body>
        <h2>Quiz Submission Details</h2>
        <div class="box">
          <p><b>Quiz Title:</b> ${cleanText(user.quizTitle)}</p>
          <p><b>Name:</b> ${user.name || ""}</p>
          <p><b>College:</b> ${user.college || ""}</p>
          <p><b>Branch:</b> ${user.branch || ""}</p>
          <p><b>Marks:</b> ${user.marks} / ${attempted} / ${total || ""}</p>
          <p><b>Submitted At:</b> ${date}</p>
        </div>

        <h3 style="margin-top:16px;">${hasQuestions ? "Questions & Answers" : ""}</h3>
        ${questionsHtml}
      </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // ---------------- DELETE SINGLE ----------------
  const handleDeleteSingle = async (user) => {
    const ok = window.confirm(
      `Delete this result?\n\nName: ${user.name}\nQuiz: ${cleanText(user.quizTitle)}`
    );
    if (!ok) return;

    try {
      setDeletingId(user.id);
      await deleteDoc(doc(db, "quizResults", user.id));
      setResults((prev) => prev.filter((r) => r.id !== user.id));
      if (selectedAnswers?.id === user.id) setSelectedAnswers(null);
    } catch (err) {
      console.error("Delete single error:", err);
      alert("Failed to delete. Check console.");
    } finally {
      setDeletingId(null);
    }
  };

  // ---------------- DELETE QUIZ WISE ----------------
  const handleDeleteQuizWise = async () => {
    if (!selectedQuizTitle) return alert("Select a quiz title first!");

    const ok = window.confirm(
      `⚠️ This will delete ALL results for:\n\n"${cleanText(
        selectedQuizTitle
      )}"\n\nThis action cannot be undone. Continue?`
    );
    if (!ok) return;

    setDeletingQuiz(true);

    try {
      const cleanedTitle = cleanText(selectedQuizTitle);
      const qRef = query(
        collection(db, "quizResults"),
        where("quizTitle", "==", cleanedTitle)
      );

      const snap = await getDocs(qRef);

      if (snap.empty) {
        alert("No results found to delete for this quiz.");
        setDeletingQuiz(false);
        return;
      }

      let batch = writeBatch(db);
      let opCount = 0;
      let totalDeleted = 0;

      for (const d of snap.docs) {
        batch.delete(d.ref);
        opCount += 1;
        totalDeleted += 1;

        if (opCount === 500) {
          await batch.commit();
          batch = writeBatch(db);
          opCount = 0;
        }
      }

      if (opCount > 0) await batch.commit();

      setResults([]);
      setSelectedAnswers(null);
      await fetchQuizTitles();

      alert(`Deleted ${totalDeleted} results for "${cleanedTitle}".`);
    } catch (err) {
      console.error("Delete quiz wise error:", err);
      alert("Failed to delete quiz results. Check console.");
    }

    setDeletingQuiz(false);
  };

  // ---------------- UI ----------------
  if (!isAuthenticated)
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <div style={styles.brandRow}>
            <div style={styles.brandLogo}>QZ</div>
            <div>
              <h2 style={{ margin: 0 }}>Admin Login</h2>
              <p style={styles.subText}>Secure access for the results dashboard</p>
            </div>
          </div>

          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => {
              setPasswordInput(e.target.value);
              setPasswordError("");
            }}
            style={styles.passwordInput}
          />

          <button onClick={handleLogin} style={styles.primaryBtn}>
            Login
          </button>

          {passwordError && <p style={styles.errorText}>{passwordError}</p>}
        </div>
      </div>
    );

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div>
          <div style={styles.titleRow}>
            <h1 style={styles.pageTitle}>📊 Results Dashboard (New Quiz)</h1>
            <span style={styles.badge}>
              {selectedQuizTitle ? cleanText(selectedQuizTitle) : "No Quiz Selected"}
            </span>
          </div>
          <p style={styles.subText2}>
            Load results, view answers, print, export, and delete securely.
          </p>
        </div>

        <div style={styles.actionsRight}>
          <button
            style={{
              ...styles.dangerBtn,
              opacity: deletingQuiz || loading ? 0.6 : 1,
              cursor: deletingQuiz || loading ? "not-allowed" : "pointer",
            }}
            onClick={handleDeleteQuizWise}
            disabled={deletingQuiz || loading}
            title="Delete all results for selected quiz"
          >
            {deletingQuiz ? "Deleting..." : "🗑 Delete Quiz Results"}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        {/* QUIZ SELECTOR */}
        <div style={styles.filters}>
          <div style={styles.selectWrap}>
            <span style={styles.label}>Quiz Title</span>
            <select
              value={selectedQuizTitle}
              onChange={(e) => setSelectedQuizTitle(e.target.value)}
              style={styles.dropdown}
            >
              <option value="">-- Select Quiz Title --</option>
              {quizTitles.map((title) => (
                <option key={title} value={title}>
                  {cleanText(title)}
                </option>
              ))}
            </select>
          </div>

          <button
            style={{
              ...styles.primaryBtn,
              opacity: loading ? 0.6 : 1,
              cursor: loading ? "not-allowed" : "pointer",
            }}
            onClick={fetchResultsByTitle}
            disabled={loading}
          >
            {loading ? "Loading..." : "Load Results"}
          </button>

          <button
            style={{
              ...styles.secondaryBtn,
              opacity: results.length === 0 ? 0.5 : 1,
              cursor: results.length === 0 ? "not-allowed" : "pointer",
            }}
            onClick={exportToExcel}
            disabled={results.length === 0}
          >
            ⬇ Export Excel
          </button>
        </div>

        {/* CONTENT */}
        {loading ? (
          <p style={styles.infoText}>Loading...</p>
        ) : results.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={styles.emptyIcon}>📄</div>
            <h3 style={{ margin: "6px 0" }}>No results found</h3>
            <p style={styles.muted}>
              Select a quiz title and click <b>Load Results</b>.
            </p>
          </div>
        ) : (
          <div style={styles.tableWrap}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>College</th>
                  <th style={styles.th}>Branch</th>
                  <th style={styles.th}>Marks</th>
                  <th style={styles.th}>Submitted At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => {
                  const attempted = getAttempted(r);
                  const total = getTotalQuestions(r);

                  return (
                    <tr key={r.id} style={styles.tr}>
                      <td style={styles.tdStrong}>
                        <div style={styles.nameCell}>
                          <div style={styles.avatar}>
                            {(r.name || "U").trim().charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={styles.nameText}>{r.name}</div>
                            <div style={styles.smallText}>{cleanText(r.quizTitle)}</div>
                          </div>
                        </div>
                      </td>

                      <td style={styles.td}>{r.college || "—"}</td>
                      <td style={styles.td}>{r.branch || "—"}</td>

                      <td style={styles.td}>
                        <span style={styles.marksPill}>
                          {r.marks} / {attempted} / {total || "—"}
                        </span>
                      </td>

                      <td style={styles.td}>
                        {r.submittedAt?.toDate ? r.submittedAt.toDate().toLocaleString() : "N/A"}
                      </td>

                      <td style={styles.td}>
                        <div style={styles.btnRow}>
                          <button
                            style={styles.viewBtn}
                            onClick={() => {
                              setSelectedAnswers(r);
                              setShowQuestions(false);
                            }}
                          >
                            View
                          </button>

                          <button
                            style={styles.questionsBtn}
                            onClick={() => {
                              setSelectedAnswers(r);
                              setShowQuestions(true);
                            }}
                          >
                            ❓ Questions
                          </button>

                          <button style={styles.printBtn} onClick={() => handlePrintSingle(r)}>
                            🖨 Print
                          </button>

                          <button
                            style={{
                              ...styles.deleteBtn,
                              opacity: deletingId === r.id ? 0.6 : 1,
                              cursor: deletingId === r.id ? "not-allowed" : "pointer",
                            }}
                            onClick={() => handleDeleteSingle(r)}
                            disabled={deletingId === r.id}
                          >
                            {deletingId === r.id ? "Deleting..." : "🗑 Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* MODAL */}
        {selectedAnswers && (
          <div style={styles.modalOverlay} onClick={() => setSelectedAnswers(null)}>
            <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h2 style={{ margin: 0 }}>
                    {showQuestions ? "Questions & Answers" : "User Answers"}
                  </h2>
                  <p style={styles.muted}>
                    {selectedAnswers.name} • {selectedAnswers.college || "—"} •{" "}
                    {selectedAnswers.branch || "—"}
                  </p>
                </div>

                <button style={styles.xBtn} onClick={() => setSelectedAnswers(null)}>
                  ✕
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.metaGrid}>
                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>College</div>
                    <div style={styles.metaValue}>{selectedAnswers.college || "—"}</div>
                  </div>
                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>Branch</div>
                    <div style={styles.metaValue}>{selectedAnswers.branch || "—"}</div>
                  </div>
                  <div style={styles.metaCard}>
                    <div style={styles.metaLabel}>Marks</div>
                    <div style={styles.metaValue}>
                      {selectedAnswers.marks} / {getAttempted(selectedAnswers)} /{" "}
                      {getTotalQuestions(selectedAnswers) || "—"}
                    </div>
                  </div>
                </div>

                {!showQuestions && (
                  <div style={styles.answersBox}>
                    <h3 style={{ marginTop: 0 }}>Answers</h3>
                    <ul style={styles.answerList}>
                      {Object.entries(selectedAnswers.answers || {}).map(([q, ans]) => (
                        <li key={q} style={styles.answerItem}>
                          <span style={styles.qBadge}>Q{q}</span>
                          <span>{ans}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {showQuestions && (
                  <div style={{ ...styles.answersBox, marginTop: "0px" }}>
                    <h3 style={{ marginTop: 0 }}>Questions & Answers</h3>

                    {Array.isArray(selectedAnswers.questions) ? (
                      selectedAnswers.questions.map((q) => {
                        const chosen = selectedAnswers.answers?.[q.id];

                        const isNewFormat =
                          Array.isArray(q.options) && typeof q.options?.[0] === "object";

                        const correctKey = q.answerKey || null;

                        const renderOptText = (opt) => {
                          if (typeof opt === "string") return opt;
                          return `${opt.key}. ${opt.en || ""}`;
                        };

                        const optKey = (opt) => {
                          if (typeof opt === "string") return opt;
                          return opt.key;
                        };

                        const questionText = q.q || q.q_en || "";

                        return (
                          <div key={q.id} style={styles.qBlock}>
                            <div style={styles.qLine}>
                              <span style={styles.qBadge}>Q{q.id}</span>
                              <span style={{ fontWeight: 800 }}>{questionText}</span>
                            </div>

                            <div style={{ marginTop: 8 }}>
                              {(q.options || []).map((opt) => {
                                const key = optKey(opt);
                                const isChosen = chosen === key;

                                const isCorrect = isNewFormat
                                  ? correctKey === key
                                  : q.answer === opt;

                                return (
                                  <div
                                    key={key}
                                    style={{
                                      ...styles.optLine,
                                      ...(isCorrect ? styles.optCorrect : {}),
                                      ...(isChosen ? styles.optChosen : {}),
                                    }}
                                  >
                                    {renderOptText(opt)}
                                    {isCorrect ? " ✅" : ""}
                                    {isChosen ? " (Your answer)" : ""}
                                  </div>
                                );
                              })}
                            </div>

                            <div style={styles.answerMeta}>
                              <b>Your Answer:</b> {chosen || "Not Answered"}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p style={styles.muted}>Questions are not available for this attempt.</p>
                    )}
                  </div>
                )}

                <div style={styles.modalFooter}>
                  <button style={styles.secondaryBtn} onClick={() => setShowQuestions((s) => !s)}>
                    {showQuestions ? "Hide Questions" : "Show Questions"}
                  </button>

                  <button style={styles.printBtn} onClick={() => handlePrintSingle(selectedAnswers)}>
                    🖨 Print
                  </button>

                  <button
                    style={{
                      ...styles.deleteBtn,
                      opacity: deletingId === selectedAnswers.id ? 0.6 : 1,
                      cursor: deletingId === selectedAnswers.id ? "not-allowed" : "pointer",
                    }}
                    onClick={() => handleDeleteSingle(selectedAnswers)}
                    disabled={deletingId === selectedAnswers.id}
                  >
                    {deletingId === selectedAnswers.id ? "Deleting..." : "🗑 Delete Result"}
                  </button>

                  <button style={styles.secondaryBtn} onClick={() => setSelectedAnswers(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={styles.footerNote}>
        Tip: Quiz-wise delete is powerful — use it only when necessary.
      </div>
    </div>
  );
}

// -------------------- STYLES (same look & feel) ------------------------
const styles = {
  loginContainer: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 10%, #0f172a 0%, #111827 35%, #0b1220 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    color: "#e5e7eb",
  },
  loginCard: {
    width: "min(520px, 100%)",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },
  brandRow: { display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" },
  brandLogo: {
    width: "44px",
    height: "44px",
    borderRadius: "14px",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
    color: "#fff",
    background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(59,130,246,0.8))",
    border: "1px solid rgba(255,255,255,0.20)",
  },
  subText: { margin: "4px 0 0 0", color: "rgba(229,231,235,0.75)", fontSize: "13px" },
  passwordInput: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(17,24,39,0.55)",
    color: "#e5e7eb",
    marginTop: "10px",
    marginBottom: "10px",
  },
  errorText: { color: "#fecaca", marginTop: "10px", fontWeight: 800 },

  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at 10% 10%, #0f172a 0%, #111827 35%, #0b1220 100%)",
    padding: "26px",
    color: "#e5e7eb",
  },
  topBar: {
    maxWidth: "1250px",
    margin: "0 auto 16px auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "14px",
  },
  titleRow: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  pageTitle: { margin: 0, fontSize: "28px", letterSpacing: "0.2px" },
  badge: {
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: "12px",
  },
  subText2: { margin: "6px 0 0 0", color: "rgba(229,231,235,0.75)", fontSize: "13px" },
  actionsRight: { display: "flex", gap: "10px", alignItems: "center" },

  card: {
    maxWidth: "1250px",
    margin: "0 auto",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: "18px",
    padding: "18px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    backdropFilter: "blur(10px)",
  },

  filters: {
    display: "flex",
    gap: "12px",
    alignItems: "flex-end",
    flexWrap: "wrap",
    paddingBottom: "14px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    marginBottom: "14px",
  },
  selectWrap: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "12px", color: "rgba(229,231,235,0.7)" },
  dropdown: {
    padding: "12px 12px",
    width: "320px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(17,24,39,0.55)",
    color: "#e5e7eb",
  },

  primaryBtn: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(59,130,246,0.35)",
    background: "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(37,99,235,0.85))",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  secondaryBtn: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 700,
  },
  dangerBtn: {
    padding: "12px 14px",
    borderRadius: "12px",
    border: "1px solid rgba(239,68,68,0.35)",
    background: "linear-gradient(135deg, rgba(239,68,68,0.95), rgba(220,38,38,0.85))",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },

  tableWrap: { width: "100%", overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "separate",
    borderSpacing: "0",
    overflow: "hidden",
    borderRadius: "14px",
  },
  th: {
    textAlign: "left",
    padding: "14px 12px",
    fontWeight: 800,
    fontSize: "13px",
    background: "rgba(255,255,255,0.08)",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    position: "sticky",
    top: 0,
    backdropFilter: "blur(10px)",
    color: "rgba(255,255,255,0.92)",
  },
  tr: { background: "rgba(255,255,255,0.03)" },
  td: {
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(229,231,235,0.92)",
    fontSize: "13px",
    verticalAlign: "middle",
  },
  tdStrong: {
    padding: "12px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "#fff",
    fontSize: "13px",
    verticalAlign: "middle",
    fontWeight: 700,
  },

  nameCell: { display: "flex", alignItems: "center", gap: "10px" },
  avatar: {
    height: "36px",
    width: "36px",
    borderRadius: "12px",
    display: "grid",
    placeItems: "center",
    background: "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(59,130,246,0.8))",
    color: "#fff",
    fontWeight: 900,
    border: "1px solid rgba(255,255,255,0.20)",
  },
  nameText: { fontWeight: 800, lineHeight: 1.1 },
  smallText: { fontSize: "12px", color: "rgba(229,231,235,0.65)", marginTop: "2px" },

  marksPill: {
    display: "inline-block",
    padding: "6px 10px",
    borderRadius: "999px",
    background: "rgba(59,130,246,0.16)",
    border: "1px solid rgba(59,130,246,0.25)",
    fontWeight: 800,
    color: "#dbeafe",
    fontSize: "12px",
  },

  btnRow: { display: "flex", gap: "8px", flexWrap: "wrap" },
  viewBtn: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  questionsBtn: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(59,130,246,0.35)",
    background: "rgba(59,130,246,0.18)",
    color: "#dbeafe",
    cursor: "pointer",
    fontWeight: 900,
  },
  printBtn: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(17,24,39,0.55)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 800,
  },
  deleteBtn: {
    padding: "8px 10px",
    borderRadius: "10px",
    border: "1px solid rgba(239,68,68,0.35)",
    background: "rgba(239,68,68,0.18)",
    color: "#fecaca",
    cursor: "pointer",
    fontWeight: 900,
  },

  emptyState: { padding: "34px 10px", textAlign: "center" },
  emptyIcon: {
    fontSize: "34px",
    width: "60px",
    height: "60px",
    borderRadius: "18px",
    margin: "0 auto 10px auto",
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  muted: { color: "rgba(229,231,235,0.65)", margin: 0 },
  infoText: { color: "rgba(229,231,235,0.75)" },

  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "16px",
    zIndex: 50,
  },
  modal: {
    width: "min(720px, 100%)",
    background: "rgba(17,24,39,0.88)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: "18px",
    boxShadow: "0 25px 80px rgba(0,0,0,0.55)",
    overflow: "hidden",
    color: "#e5e7eb",
  },
  modalHeader: {
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,0.10)",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  xBtn: {
    width: "40px",
    height: "40px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.06)",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },
  modalBody: { padding: "16px" },
  metaGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "10px",
    marginBottom: "14px",
  },
  metaCard: {
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  metaLabel: { fontSize: "12px", color: "rgba(229,231,235,0.65)" },
  metaValue: { fontSize: "13px", fontWeight: 900, marginTop: "4px" },

  answersBox: {
    padding: "12px",
    borderRadius: "14px",
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
  },
  answerList: { margin: 0, paddingLeft: "0", listStyle: "none" },
  answerItem: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(0,0,0,0.12)",
    marginBottom: "8px",
    alignItems: "flex-start",
  },
  qBadge: {
    padding: "4px 10px",
    borderRadius: "999px",
    background: "rgba(16,185,129,0.18)",
    border: "1px solid rgba(16,185,129,0.28)",
    color: "#bbf7d0",
    fontWeight: 900,
    fontSize: "12px",
    whiteSpace: "nowrap",
    marginTop: "1px",
  },
  modalFooter: {
    display: "flex",
    gap: "10px",
    justifyContent: "flex-end",
    flexWrap: "wrap",
    marginTop: "14px",
  },

  qBlock: {
    padding: "12px",
    borderRadius: "14px",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(0,0,0,0.10)",
    marginBottom: "10px",
  },
  qLine: { display: "flex", gap: "10px", alignItems: "flex-start" },
  optLine: {
    padding: "8px 10px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.04)",
    marginBottom: "8px",
    fontSize: "13px",
  },
  optCorrect: {
    border: "1px solid rgba(34,197,94,0.35)",
    background: "rgba(34,197,94,0.12)",
  },
  optChosen: {
    border: "1px solid rgba(251,191,36,0.35)",
    background: "rgba(251,191,36,0.10)",
  },
  answerMeta: {
    marginTop: 8,
    fontSize: "13px",
    color: "rgba(229,231,235,0.92)",
  },

  footerNote: {
    maxWidth: "1250px",
    margin: "14px auto 0 auto",
    color: "rgba(229,231,235,0.65)",
    fontSize: "12px",
    textAlign: "center",
  },
};