import { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAnswers, setSelectedAnswers] = useState(null);
  const [viewAllAnswers, setViewAllAnswers] = useState(false);

  // Password state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const allowedPasswords = ["admin123", "secret456"]; // Change these

  useEffect(() => {
    if (!isAuthenticated) return;
    const fetchResults = async () => {
      try {
        const q = query(collection(db, "quizResults"), orderBy("submittedAt", "desc"));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
          setResults([]);
        } else {
          const fetchedResults = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              name: data.name || "N/A",
              email: data.email || "N/A",
              employeeId: data.employeeId || "N/A",
              answers: data.answers || {},
              submittedAt: data.submittedAt || null,
            };
          });
          setResults(fetchedResults);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [isAuthenticated]);

  const handleLogin = () => {
    if (allowedPasswords.includes(passwordInput.trim())) {
      setIsAuthenticated(true);
      setPasswordError("");
    } else {
      setPasswordError("Invalid password. Please try again.");
    }
  };

  // Print single user's answers
  const handlePrintSingle = (user) => {
    const printWindow = window.open("", "_blank");
    const formattedDate = user.submittedAt?.toDate
      ? user.submittedAt.toDate().toLocaleString()
      : "N/A";

    printWindow.document.write(`
      <html>
        <head>
          <title>${user.name} - Quiz Answers</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h2 { margin-bottom: 10px; }
            p { margin: 5px 0; }
            ul { margin-top: 10px; }
            li { margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h2>Quiz Submission Details</h2>
          <p><b>Name:</b> ${user.name}</p>
          <p><b>Department:</b> ${user.employeeId}</p>
          <p><b>Submitted At:</b> ${formattedDate}</p>
          <h3>Answers:</h3>
          <ul>
            ${Object.entries(user.answers)
              .map(([qId, ans]) => `<li><b>Q${qId}:</b> ${ans}</li>`)
              .join("")}
          </ul>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  // ✅ Export all results to Excel
  const exportToExcel = () => {
    if (results.length === 0) return;

    // Find max questions count
    const maxQuestions = Math.max(...results.map((u) => Object.keys(u.answers || {}).length));

    const data = results.map((user) => {
      const row = {
        Name: user.name,
        Department: user.employeeId,
        EmployeeID: user.email,
      };

      for (let i = 1; i <= maxQuestions; i++) {
        row[`Ans ${i}`] = user.answers?.[i] || "";
      }

      return row;
    });

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Quiz Results");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const fileData = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(fileData, "Quiz_Results.xlsx");
  };

  if (!isAuthenticated) {
    return (
      <div style={styles.loginContainer}>
        <div style={styles.loginCard}>
          <h2>🔐 Enter Password to View Results</h2>
          <input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            style={styles.passwordInput}
          />
          <button onClick={handleLogin} style={styles.button}>
            Submit
          </button>
          {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
        </div>
      </div>
    );
  }

  if (loading) return <h2 style={{ textAlign: "center" }}>Loading results...</h2>;
  if (error) return <h2 style={{ textAlign: "center", color: "red" }}>Failed to fetch results: {error}</h2>;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📊 Quiz Results</h1>
        {results.length === 0 ? (
          <p style={styles.text}>No results yet</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Department</th>
                <th style={styles.th}>Submitted At</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {results.map((r) => (
                <tr key={r.id}>
                  <td style={styles.td}>{r.name}</td>
                  <td style={styles.td}>{r.email}</td>
                  <td style={styles.td}>{r.employeeId}</td>
                  <td style={styles.td}>
                    {r.submittedAt?.toDate
                      ? r.submittedAt.toDate().toLocaleString()
                      : "N/A"}
                  </td>
                  <td style={styles.td}>
                    <button style={{ ...styles.button, marginRight: "5px" }} onClick={() => setSelectedAnswers(r.answers)}>View</button>
                    <button style={{ ...styles.button, background: "green" }} onClick={() => handlePrintSingle(r)}>🖨 Print</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        
        <button 
          style={{ ...styles.button, marginTop: "15px", background: "purple" }} 
          onClick={() => setViewAllAnswers(true)}
        >
          View All Answers
        </button>

        <button 
          style={{ ...styles.button, marginTop: "15px", background: "darkgreen", marginLeft: "10px" }} 
          onClick={exportToExcel}
        >
          📊 Export to Excel
        </button>

        {viewAllAnswers && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>All Users Answers</h2>
              {results.map((user) => (
                <div key={user.id} style={{ marginBottom: "20px", borderBottom: "1px solid #ccc", paddingBottom: "10px" }}>
                  <p><b>Name:</b> {user.name}</p>
                  <p><b>Email:</b> {user.email}</p>
                  <p><b>Department:</b> {user.employeeId}</p>
                  <p><b>Submitted At:</b> {user.submittedAt?.toDate ? user.submittedAt.toDate().toLocaleString() : "N/A"}</p>
                  <ul>
                    {Object.entries(user.answers).map(([qId, ans]) => (
                      <li key={qId}><b>Q{qId}:</b> {ans}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <button style={styles.closeButton} onClick={() => setViewAllAnswers(false)}>Close</button>
            </div>
          </div>
        )}

        {selectedAnswers && (
          <div style={styles.modalOverlay}>
            <div style={styles.modal}>
              <h2>User Answers</h2>
              <ul>
                {Object.entries(selectedAnswers).map(([qId, ans]) => (
                  <li key={qId}><b>Q{qId}:</b> {ans}</li>
                ))}
              </ul>
              <button style={styles.closeButton} onClick={() => setSelectedAnswers(null)}>Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  loginContainer: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #899596ff 0%, #425261ff 100%)",
  },
  loginCard: {
    background: "#fff",
    padding: "30px",
    borderRadius: "10px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  passwordInput: {
    padding: "8px",
    margin: "10px 0",
    width: "200px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #00f2fe 0%, #1a1b1dff 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    textAlign: "center",
    width: "100%",
    maxWidth: "900px",
    overflowX: "auto",
  },
  heading: { marginBottom: "15px", fontSize: "28px", color: "#333" },
  text: { fontSize: "16px", color: "#555", marginBottom: "20px" },
  th: { border: "1px solid #ddd", padding: "8px", background: "#f2f2f2" },
  td: { border: "1px solid #ddd", padding: "8px" },
  button: {
    padding: "6px 10px",
    background: "#0087fdff",
    border: "none",
    borderRadius: "5px",
    color: "#fff",
    cursor: "pointer",
  },
  modalOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
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
    padding: "8px 12px",
    background: "red",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px",
  },
};
