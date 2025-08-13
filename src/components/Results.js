import { useEffect, useState } from "react";
import { db } from "../firebase"; // अपने firebase.js/ts का सही path डालें
import { collection, getDocs, orderBy, query } from "firebase/firestore";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, "quizResults"), orderBy("submittedAt", "desc"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setResults(data);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📊 Quiz Results</h1>
        {loading ? (
          <p style={styles.text}>Loading...</p>
        ) : results.length === 0 ? (
          <div style={styles.placeholderBox}>
            <span style={styles.placeholderText}>No results yet</span>
          </div>
        ) : (
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Submitted At</th>
              </tr>
            </thead>
            <tbody>
              {results.map((res) => (
                <tr key={res.id}>
                  <td style={styles.td}>{res.name}</td>
                  <td style={styles.td}>{res.email}</td>
                  <td style={styles.td}>{res.employeeId}</td>
                  <td style={styles.td}>
                    {res.submittedAt?.toDate
                      ? res.submittedAt.toDate().toLocaleString()
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #00f2fe 0%, #4facfe 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: "20px",
  },
  card: {
    background: "#fff",
    padding: "30px 40px",
    borderRadius: "15px",
    boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
    width: "100%",
    maxWidth: "700px",
  },
  heading: {
    marginBottom: "15px",
    fontSize: "28px",
    color: "#333",
    textAlign: "center",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
    textAlign: "center",
  },
  placeholderBox: {
    background: "#f5f5f5",
    border: "2px dashed #ccc",
    borderRadius: "10px",
    padding: "30px",
    textAlign: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: "14px",
    fontStyle: "italic",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  th: {
    background: "#4facfe",
    color: "#fff",
    padding: "10px",
    textAlign: "left",
  },
  td: {
    borderBottom: "1px solid #ddd",
    padding: "10px",
  },
};
