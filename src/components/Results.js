import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Results() {
  const [results, setResults] = useState([]);
  const [quizTitles, setQuizTitles] = useState([]);
  const [selectedQuizTitle, setSelectedQuizTitle] = useState("");

  const [loading, setLoading] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState(null);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const allowedPasswords = ["admin123", "secret456"];

  const cleanText = (t) => (t || "").replace(/\s+/g, " ").trim();

  // ---------------- LOGIN ----------------
  const handleLogin = () => {
    if (allowedPasswords.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      fetchQuizTitles();
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

      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        if (data.quizTitle) titles.add(cleanText(data.quizTitle));
      });

      setQuizTitles([...titles]);
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

      const q = query(collection(db, "quizResults"), where("quizTitle", "==", cleanedTitle));
      const snapshot = await getDocs(q);

      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      list.sort((a, b) => {
        if (!a.submittedAt || !b.submittedAt) return 0;
        return b.submittedAt.seconds - a.submittedAt.seconds;
      });

      setResults(list);
    } catch (err) {
      console.error("Error:", err);
    }

    setLoading(false);
  };

  // ---------------- EXPORT EXCEL ----------------
  const exportToExcel = () => {
    if (!results.length) return alert("No data to export!");

    const rows = results.map((u) => {
      const attempted = Object.keys(u.answers || {}).length;

      return {
        QuizTitle: cleanText(u.quizTitle),
        Name: u.name,
        Department: u.department,
        Designation: u.designation,
        EmployeeID: u.employeeId,
        Marks: `${u.marks} / ${attempted} / 20`,
      };
    });

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Results");

    const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    saveAs(new Blob([buf], { type: "application/octet-stream" }), `${selectedQuizTitle}_Results.xlsx`);
  };

  // ---------------- PRINT SINGLE ----------------
  const handlePrintSingle = (user) => {
    const win = window.open("", "_blank");

    const date = user.submittedAt?.toDate
      ? user.submittedAt.toDate().toLocaleString()
      : "N/A";

    const attempted = Object.keys(user.answers).length;

    win.document.write(`
      <html>
      <head>
        <title>Print Quiz Answers</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          h2 { margin-bottom: 10px; }
        </style>
      </head>
      <body>
        <h2>Quiz Submission Details</h2>

        <p><b>Quiz Title:</b> ${cleanText(user.quizTitle)}</p>
        <p><b>Name:</b> ${user.name}</p>
        <p><b>Department:</b> ${user.department}</p>
        <p><b>Designation:</b> ${user.designation}</p>
        <p><b>Employee ID:</b> ${user.employeeId}</p>

        <p><b>Marks:</b> ${user.marks} / ${attempted} / 20</p>
        <p><b>Submitted At:</b> ${date}</p>

        <h3>Answers:</h3>
        <ul>
          ${Object.entries(user.answers)
            .map(([id, ans]) => `<li><b>Q${id}:</b> ${ans}</li>`)
            .join("")}
        </ul>

      </body>
      </html>
    `);

    win.document.close();
    win.print();
  };

  // ---------------- UI ----------------
  if (!isAuthenticated)
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h2>🔐 Admin Login</h2>

          <input
            type="password"
            placeholder="Enter Password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            style={styles.passwordInput}
          />

          <button onClick={handleLogin} style={styles.button}>Login</button>

          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
      </div>
    );

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* QUIZ SELECTOR */}
        <div style={{ marginBottom: "20px" }}>
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

          <button
            style={{ ...styles.button, marginLeft: "10px", background: "green" }}
            onClick={fetchResultsByTitle}
          >
            Load Results
          </button>
        </div>

        <h1 style={{ marginBottom: "20px" }}>📊 Quiz Results</h1>

        {loading ? (
          <p>Loading...</p>
        ) : results.length === 0 ? (
          <p>No results found.</p>
        ) : (
          <>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={styles.th}>Name</th>
                  <th style={styles.th}>Department</th>
                  <th style={styles.th}>Designation</th>
                  <th style={styles.th}>Employee ID</th>
                  <th style={styles.th}>Marks/Attempted/Total</th>
                  <th style={styles.th}>Submitted At</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.map((r) => {
                  const attempted = Object.keys(r.answers || {}).length;

                  return (
                    <tr key={r.id}>
                      <td style={styles.td}>{r.name}</td>
                      <td style={styles.td}>{r.department}</td>
                      <td style={styles.td}>{r.designation}</td>
                      <td style={styles.td}>{r.employeeId}</td>

                      <td style={styles.td}>
                        <b>{r.marks} / {attempted} / 20</b>
                      </td>

                      <td style={styles.td}>
                        {r.submittedAt?.toDate
                          ? r.submittedAt.toDate().toLocaleString()
                          : "N/A"}
                      </td>

                      <td style={styles.td}>
                        <button
                          style={{ ...styles.button, marginRight: "5px" }}
                          onClick={() => setSelectedAnswers(r)}
                        >
                          View
                        </button>

                        <button
                          style={{ ...styles.button, background: "black" }}
                          onClick={() => handlePrintSingle(r)}
                        >
                          🖨 Print
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <button
              style={{ ...styles.button, background: "darkblue", marginTop: "15px" }}
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </>
        )}

        {/* MODAL */}
        {selectedAnswers && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>User Answers</h2>

              <p><b>Name:</b> {selectedAnswers.name}</p>
              <p><b>Department:</b> {selectedAnswers.department}</p>
              <p><b>Designation:</b> {selectedAnswers.designation}</p>
              <p><b>Employee ID:</b> {selectedAnswers.employeeId}</p>

              <p>
                <b>Marks:</b> {selectedAnswers.marks} / {Object.keys(selectedAnswers.answers).length} / 20
              </p>

              <ul>
                {Object.entries(selectedAnswers.answers).map(([q, ans]) => (
                  <li key={q}><b>Q{q}:</b> {ans}</li>
                ))}
              </ul>

              <button style={styles.closeButton} onClick={() => setSelectedAnswers(null)}>
                Close
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

// -------------------- STYLES ------------------------
const styles = {
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #31394eff, #2d2d2dff)",
  },
  loginCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.2)",
    textAlign: "center",
  },
  passwordInput: {
    padding: "10px",
    width: "220px",
    margin: "10px 0",
    borderRadius: "6px",
    border: "1px solid #aaa",
  },
  container: {
    minHeight: "100vh",
    background: "#f0f2f5",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  dropdown: {
    padding: "10px",
    width: "260px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  card: {
    background: "#fff",
    padding: "30px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "1200px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    overflowX: "auto",
  },
  th: { border: "1px solid #ddd", padding: "10px", background: "#f2f2f2", fontWeight: 600 },
  td: { border: "1px solid #ddd", padding: "8px" },
  button: { padding: "8px 12px", background: "blue", borderRadius: "5px", border: "none", color: "#fff", cursor: "pointer" },
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
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "400px",
    maxHeight: "80vh",
    overflowY: "auto",
  },
  closeButton: {
    marginTop: "15px",
    padding: "10px",
    background: "red",
    border: "none",
    borderRadius: "6px",
    color: "#fff",
    cursor: "pointer",
  },
};
