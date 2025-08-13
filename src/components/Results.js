import { useEffect, useState } from "react";
import { db } from "../firebase"; // your firebase config
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        console.log("Fetching quiz results from Firestore...");
        const q = query(
          collection(db, "quizResults"),
          orderBy("submittedAt", "desc")
        );

        const querySnapshot = await getDocs(q);
        console.log("Query snapshot received:", querySnapshot);

        if (querySnapshot.empty) {
          console.log("No documents found in quizResults collection.");
          setResults([]);
        } else {
          const fetchedResults = querySnapshot.docs.map((doc) => {
            const data = doc.data();
            console.log("Document data:", data);

            return {
              id: doc.id,
              name: data.name || "N/A",
              email: data.email || "N/A",
              employeeId: data.employeeId || "N/A",
              submittedAt: data.submittedAt || null,
            };
          });
          setResults(fetchedResults);
          console.log("Fetched results:", fetchedResults);
        }
      } catch (err) {
        console.error("Error fetching results:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading results...</h2>;
  }

  if (error) {
    return (
      <h2 style={{ textAlign: "center", color: "red" }}>
        Failed to fetch results: {error}
      </h2>
    );
  }

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
                <th style={styles.th}>Employee ID</th>
                <th style={styles.th}>Submitted At</th>
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
    textAlign: "center",
    width: "100%",
    maxWidth: "800px",
    overflowX: "auto",
  },
  heading: {
    marginBottom: "15px",
    fontSize: "28px",
    color: "#333",
  },
  text: {
    fontSize: "16px",
    color: "#555",
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "8px",
    background: "#f2f2f2",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
  },
};
