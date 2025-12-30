import { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({
    name: "",
    empId: "",
    department: "",
    designation: "",
  });

  const quizTitle = "CQI-9 Awareness QUIZ";

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 1,
      q: "What is the main purpose of the CQI-9 standard?",
      options: [
        "Improve marketing strategy",
        "Ensure quality and control of heat treatment processes",
        "Increase raw material purchasing",
        "Design product aesthetics",
      ],
      answer: "Ensure quality and control of heat treatment processes",
    },
    {
      id: 2,
      q: "CQI-9 is primarily associated with which industry?",
      options: ["Textile", "Automotive", "Food processing", "Pharmaceutical"],
      answer: "Automotive",
    },
    {
      id: 3,
      q: "Which of the following is not a requirement emphasized by CQI-9?",
      options: [
        "Process monitoring and control",
        "Employee training",
        "Marketing analysis reports",
        "Equipment calibration",
      ],
      answer: "Marketing analysis reports",
    },
    {
      id: 4,
      q: "How often must a CQI-9 Heat Treat System Assessment typically be conducted?",
      options: [
        "Once every five years",
        "Only at project start",
        "At least annually",
        "Only during audits",
      ],
      answer: "At least annually",
    },
    {
      id: 5,
      q: "In CQI-9, what is the role of documentation and traceability?",
      options: [
        "Decorative record keeping",
        "Ensures process traceability and quality control",
        "Improves sales forecasts",
        "Replaces training records",
      ],
      answer: "Ensures process traceability and quality control",
    },
    {
      id: 6,
      q: "Which section of CQI-9 addresses pyrometry requirements?",
      options: ["Job Audit", "Section 1", "Section 2", "Process Tables"],
      answer: "Section 2",
    },
    {
      id: 7,
      q: "What are SAT and TUS related to in CQI-9?",
      options: [
        "Sales and transportation reports",
        "Temperature Uniformity Survey and System Accuracy Test",
        "Supplier arrival timing",
        "Supplier audit tools",
      ],
      answer: "Temperature Uniformity Survey and System Accuracy Test",
    },
    {
      id: 8,
      q: "Which of the following heat treat processes is included in CQI-9 process tables?",
      options: ["Injection molding", "Carburizing", "Painting", "Electroplating"],
      answer: "Carburizing",
    },
    {
      id: 9,
      q: "What is the primary focus of Section 1 of the CQI-9 assessment?",
      options: [
        "Site sanitation",
        "Management responsibility and quality planning",
        "Product packaging",
        "Sales department roles",
      ],
      answer: "Management responsibility and quality planning",
    },
    {
      id: 10,
      q: "What best describes a Job Audit in CQI-9?",
      options: [
        "Test of financial reports",
        "Product and process audit focused on specific production",
        "Website security check",
        "Supplier marketing review",
      ],
      answer: "Product and process audit focused on specific production",
    },
    {
      id: 11,
      q: "Why is equipment calibration important in CQI-9?",
      options: [
        "To decorate machinery",
        "To ensure accurate process control and measurement",
        "For color coding",
        "To reduce energy consumption",
      ],
      answer: "To ensure accurate process control and measurement",
    },
    {
      id: 12,
      q: "CQI-9 encourages continuous improvement through:",
      options: [
        "Employee vacation plans",
        "Regular assessments and corrective actions",
        "Random social events",
        "Monthly newsletters",
      ],
      answer: "Regular assessments and corrective actions",
    },
    {
      id: 13,
      q: "Thermocouples used in CQI-9 for SAT/TUS must be:",
      options: [
        "Chosen freely by staff",
        "Reliable and appropriate for thermal measurement",
        "Only digital type",
        "Ignored after installation",
      ],
      answer: "Reliable and appropriate for thermal measurement",
    },
    {
      id: 14,
      q: "Which of the following is a process control element CQI-9 focuses on?",
      options: [
        "Customer satisfaction surveys",
        "Continuous monitoring of temperature and atmosphere",
        "Office layout design",
        "Payroll processing",
      ],
      answer: "Continuous monitoring of temperature and atmosphere",
    },
    {
      id: 15,
      q: "The CQI-9 assessment helps organizations mainly to:",
      options: [
        "Increase their advertising budget",
        "Ensure consistent quality in heat-treated components",
        "Reduce lunch break times",
        "Lower employee wages",
      ],
      answer: "Ensure consistent quality in heat-treated components",
    },
  ];

  // ---------------- Timer --------------------
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && quizStarted && !submitted) handleSubmit();
  }, [quizStarted, timeLeft, submitted]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(
      2,
      "0"
    )}`;

  const handleChange = (id, val) => setAnswers({ ...answers, [id]: val });

  // ---------------- Start Quiz --------------------
  const handleStart = async () => {
    if (!userData.name || !userData.empId || !userData.department || !userData.designation) {
      alert("⚠️ Please fill in all details!");
      return;
    }

    setLoading(true);

    const q = query(
      collection(db, "quizResults"),
      where("employeeId", "==", userData.empId.trim()),
      where("quizTitle", "==", quizTitle)
    );

    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      alert("⚠️ You have already attempted this quiz!");
      setLoading(false);
      return;
    }

    setLoading(false);
    setQuizStarted(true);
  };

  // ---------------- Submit --------------------
  const handleSubmit = async () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    setMarks(score);
    setSubmitted(true);
    setQuizStarted(false);

    await addDoc(collection(db, "quizResults"), {
      name: userData.name,
      department: userData.department,
      designation: userData.designation,
      employeeId: userData.empId,
      quizTitle,
      answers,
      marks: score,
      submittedAt: serverTimestamp(),
    });
  };

  // ---------------- Styles --------------------
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 10% 10%, rgba(231,76,60,0.10), transparent 35%), radial-gradient(circle at 90% 20%, rgba(52,152,219,0.12), transparent 40%), linear-gradient(180deg, #fbfbfb, #f2f4f7)",
      padding: "28px 14px",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
    },
    container: {
      maxWidth: "820px",
      margin: "0 auto",
      padding: "18px",
    },
    brand: {
      textAlign: "center",
      fontWeight: 900,
      letterSpacing: "1px",
      color: "#c0392b",
      marginBottom: "8px",
      textTransform: "uppercase",
      fontSize: "18px",
    },
    titleWrap: {
      background: "linear-gradient(135deg, #ffffff, #fff7f7)",
      border: "1px solid rgba(192,57,43,0.15)",
      borderRadius: "16px",
      padding: "18px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      marginBottom: "14px",
    },
    header: {
      textAlign: "center",
      color: "#2c3e50",
      margin: 0,
      fontSize: "26px",
      fontWeight: 900,
    },
    subHeader: {
      textAlign: "center",
      marginTop: "6px",
      color: "#566573",
      fontSize: "14px",
    },
    badgeRow: {
      display: "flex",
      gap: "10px",
      justifyContent: "center",
      flexWrap: "wrap",
      marginTop: "12px",
    },
    badge: {
      background: "rgba(231,76,60,0.10)",
      border: "1px solid rgba(231,76,60,0.20)",
      color: "#c0392b",
      padding: "8px 12px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: 700,
    },
    badgeBlue: {
      background: "rgba(52,152,219,0.10)",
      border: "1px solid rgba(52,152,219,0.20)",
      color: "#1f6fb2",
      padding: "8px 12px",
      borderRadius: "999px",
      fontSize: "13px",
      fontWeight: 700,
    },
    notice: {
      background: "linear-gradient(135deg, #e8f6ff, #f7fbff)",
      border: "1px solid rgba(52,152,219,0.25)",
      color: "#1f6fb2",
      textAlign: "left",
      padding: "14px",
      borderRadius: "14px",
      marginBottom: "14px",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    noticeTitle: { fontSize: "14px", fontWeight: 900, marginBottom: "6px" },
    rules: { margin: 0, paddingLeft: "18px", fontWeight: 600, fontSize: "13px" },

    card: {
      background: "#fff",
      padding: "18px",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      border: "1px solid rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },
    row2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" },

    input: {
      padding: "12px 12px",
      fontSize: "15px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.12)",
      outline: "none",
      width: "100%",
      transition: "0.2s",
      background: "#fcfcfd",
    },
    helper: {
      fontSize: "12px",
      color: "#6c7a89",
      marginTop: "-6px",
      marginBottom: "2px",
    },

    button: {
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #c0392b, #e74c3c)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(231,76,60,0.25)",
      transition: "0.2s",
    },

    timer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "linear-gradient(90deg, #fff0f0, #ffe3e3)",
      color: "#c0392b",
      padding: "10px",
      fontSize: "16px",
      textAlign: "center",
      fontWeight: 900,
      zIndex: 1000,
      borderBottom: "1px solid rgba(192,57,43,0.18)",
    },

    question: {
      background: "linear-gradient(135deg, #ffffff, #fbfcff)",
      padding: "14px",
      borderRadius: "14px",
      border: "1px solid rgba(0,0,0,0.08)",
      marginBottom: "12px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
    },
    qTitle: { margin: 0, marginBottom: "10px", color: "#2c3e50" },
    option: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      padding: "10px 10px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.08)",
      marginTop: "8px",
      cursor: "pointer",
      background: "#fff",
    },
    submitBtn: {
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(46,204,113,0.25)",
    },
  };

  // ---------------- Submitted Screen --------------------
  if (submitted)
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>
            <h2 style={{ color: "#27ae60", textAlign: "center", margin: 0 }}>
              🎉 Quiz Submitted Successfully!
            </h2>
            <p
              style={{
                textAlign: "center",
                marginTop: 10,
                color: "#2c3e50",
                fontWeight: 700,
              }}
            >
              Your Score: <span style={{ fontSize: 22 }}>{marks}</span> / {questions.length}
            </p>
          </div>
        </div>
      </div>
    );

  // ---------------- Landing Screen --------------------
  if (!quizStarted)
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>
            <h1 style={styles.header}>📝 {quizTitle}</h1>
            <div style={styles.subHeader}>
              Please enter your details carefully — your submission will be recorded.
            </div>

            <div style={styles.badgeRow}>
              <div style={styles.badge}>⏱ Duration: 2 Minutes</div>
              <div style={styles.badgeBlue}>✅ Questions: {questions.length}</div>
              <div style={styles.badge}>📌 Total Marks: {questions.length}</div>
            </div>
          </div>

          {/* English Instructions */}
          <div style={styles.notice}>
            <div style={styles.noticeTitle}>⚠️ Important Instructions</div>
            <ul style={styles.rules}>
              <li>This quiz is <b>2 minutes</b> long — the timer starts immediately after you click Start.</li>
              <li>Each question has <b>only one correct answer</b>.</li>
              <li>When time runs out, the quiz will be <b>auto-submitted</b>.</li>
              <li>The same Employee ID <b>cannot attempt</b> this quiz again.</li>
            </ul>
          </div>

          <div style={styles.card}>
            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Full Name"
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Employee ID"
                onChange={(e) => setUserData({ ...userData, empId: e.target.value })}
              />
            </div>

            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Department"
                onChange={(e) => setUserData({ ...userData, department: e.target.value })}
              />
              <input
                style={styles.input}
                placeholder="Designation"
                onChange={(e) => setUserData({ ...userData, designation: e.target.value })}
              />
            </div>

            <div style={styles.helper}>
              Tip: Double-check your details before starting — your submission is stored.
            </div>

            <button style={styles.button} onClick={handleStart}>
              {loading ? "Checking..." : "🚀 Start Quiz"}
            </button>
          </div>
        </div>
      </div>
    );

  // ---------------- Quiz Screen --------------------
  return (
    <div style={styles.page}>
      <div style={styles.timer}>⏳ Time Left: {formatTime(timeLeft)}</div>

      <div style={styles.container}>
        <div style={styles.titleWrap}>
          <div style={styles.brand}>HERO STEELS LIMITED</div>
          <h2 style={{ ...styles.header, fontSize: "22px" }}>{quizTitle}</h2>
          <div style={styles.badgeRow}>
            <div style={styles.badgeBlue}>📄 Total Marks: {questions.length}</div>
            <div style={styles.badge}>⏱ Duration: 2 Minutes</div>
          </div>
        </div>

        {questions.map((q) => (
          <div key={q.id} style={styles.question}>
            <p style={styles.qTitle}>
              <b>
                {q.id}. {q.q}
              </b>
            </p>

            {q.options.map((opt) => (
              <label key={opt} style={styles.option}>
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        ))}

        <button style={styles.submitBtn} onClick={handleSubmit}>
          ✅ Submit
        </button>
      </div>
    </div>
  );
}
