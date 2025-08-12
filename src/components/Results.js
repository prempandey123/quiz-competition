export default function Results() {
  // Future me yaha Firebase se data fetch hoga
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>📊 Quiz Results</h1>
        <p style={styles.text}>Results yaha dikhenge...</p>
        <div style={styles.placeholderBox}>
          <span style={styles.placeholderText}>No results yet</span>
        </div>
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
    maxWidth: "500px",
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
};
