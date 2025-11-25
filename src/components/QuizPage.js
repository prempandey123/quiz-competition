import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, getDocs, query, where, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({
    name: "",
    empId: "",
    department: "",
    designation: "",
  });

  const quizTitle = "PPAP & APQP QUIZ";

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [loading, setLoading] = useState(false);

  const questions = [
    { id: 1, q: "APQP is a guideline created by which organization?", options: ["ISO", "AIAG", "ASTM", "IATF"], answer: "AIAG" },
    { id: 2, q: "APQP consists of how many phases?", options: ["3", "4", "5", "6"], answer: "5" },
    { id: 3, q: "The main purpose of APQP is to:", options: [ "Approve supplier invoices", "Ensure product and process meet customer requirements", "Increase production speed", "Verify packaging design" ], answer: "Ensure product and process meet customer requirements" },
    { id: 4, q: "PPAP stands for:", options: [ "Product Process Approval Plan", "Production Part Approval Process", "Production Plan Audit Process", "Product Part Analysis Process" ], answer: "Production Part Approval Process" },
    { id: 5, q: "PPAP is required before which phase?", options: ["Prototype development", "Mass production", "Packaging development", "Warranty analysis"], answer: "Mass production" },
    { id: 6, q: "How many PPAP elements are there (maximum)?", options: ["10", "12", "18", "20"], answer: "18" },
    { id: 7, q: "Which of the following is NOT an APQP phase?", options: [ "Plan and Define", "Product Design & Development", "Process Design & Development", "Customer Complaint Handling" ], answer: "Customer Complaint Handling" },
    { id: 8, q: "FMEA used in APQP stands for:", options: [ "Failure Mode and Effect Analysis", "Field Maintenance Evaluation Analysis", "Fault Monitoring Effectiveness Audit", "Failure Management Engineering Assessment" ], answer: "Failure Mode and Effect Analysis" },
    { id: 9, q: "Which document defines the sequence of the manufacturing process?", options: ["DFMEA", "Control Plan", "Process Flow Diagram (PFD)", "MSA Report"], answer: "Process Flow Diagram (PFD)" },
    { id: 10, q: "Which PPAP level requires only a PSW submission?", options: ["Level 1", "Level 2", "Level 3", "Level 4"], answer: "Level 1" },
    { id: 11, q: "Which PPAP document provides evidence of process capability?", options: [ "DFMEA", "Capability Studies (Cp, Cpk)", "Control Plan", "Layout Inspection Report" ], answer: "Capability Studies (Cp, Cpk)" },
    { id: 12, q: "Part Submission Warrant (PSW) is used to:", options: [ "Approve packaging design", "Request customer approval", "Approve operator training", "Conduct MSA" ], answer: "Request customer approval" },
    { id: 13, q: "DFMEA is prepared during which APQP phase?", options: [ "Process Design", "Product Design", "Validation Phase", "Feedback & Corrective Action" ], answer: "Product Design" },
    { id: 14, q: "The Control Plan is mainly used to:", options: [ "Approve tool design", "Define how each characteristic will be controlled during production", "Train operators", "Approve packaging" ], answer: "Define how each characteristic will be controlled during production" },
    { id: 15, q: "MSA is conducted to evaluate:", options: ["Machine breakdowns", "Operator skills", "Measurement system variation", "Process flow"], answer: "Measurement system variation" },
    { id: 16, q: "Which element of PPAP contains all testing results?", options: ["PFD", "DFMEA", "Control Plan", "Performance Test Results"], answer: "Performance Test Results" },
    { id: 17, q: "Dimensional Inspection Report validates:", options: ["Packaging", "Production rate", "Drawing dimensional compliance", "Operator ability"], answer: "Drawing dimensional compliance" },
    { id: 18, q: "The last phase of APQP is:", options: [ "Product & Process Validation", "Feedback, Assessment & Corrective Action", "Plan & Define", "Launch & Ramp-up" ], answer: "Feedback, Assessment & Corrective Action" },
    { id: 19, q: "PPAP Level 3 requires:", options: [ "PSW only", "PSW + Full Documentation", "PSW + Appearance Approval Report", "PSW + Packaging" ], answer: "PSW + Full Documentation" },
    { id: 20, q: "APQP is implemented mainly by:", options: ["Customer only", "Supplier only", "Cross-functional team", "Operators only"], answer: "Cross-functional team" },
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
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const handleChange = (id, val) => setAnswers({ ...answers, [id]: val });

  // ---------------- Start Quiz --------------------
  const handleStart = async () => {
    if (!userData.name || !userData.empId || !userData.department || !userData.designation) {
      alert("⚠️ Please fill all details!");
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
      alert("⚠️ You have already given this quiz!");
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
    container: {
      maxWidth: "750px",
      margin: "auto",
      padding: "20px",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: { textAlign: "center", color: "#2c3e50" },
    notice: {
      background: "#e8f6e9",
      color: "#2e7d32",
      textAlign: "center",
      padding: "12px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "500"
    },
    timer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "#ffcccc",
      color: "#e74c3c",
      padding: "10px",
      fontSize: "18px",
      textAlign: "center",
      fontWeight: "bold",
      zIndex: 1000
    },
    card: {
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "10px"
    },
    input: {
      padding: "12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      outline: "none",
      width: "100%"
    },
    button: {
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      background: "#3498db",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold"
    },
    question: {
      background: "#f7f9fc",
      padding: "15px",
      borderRadius: "8px",
      border: "1px solid #ddd",
      marginBottom: "12px"
    },
    option: { display: "block", marginTop: "6px", cursor: "pointer" }
  };

  // ---------------- Submitted Screen --------------------
  if (submitted)
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#27ae60", textAlign: "center" }}>🎉 Quiz Submitted Successfully!</h2>
        <h3 style={{ textAlign: "center" }}>
          Your Score: <b>{marks} / 20</b>
        </h3>
      </div>
    );

  // ---------------- Landing Screen --------------------
  if (!quizStarted)
    return (
      <div style={styles.container}>
        <h2 style={{ textAlign: "center", color: "red", marginBottom: "10px" }}>
          HERO STEELS LIMITED
        </h2>

        <h1 style={styles.header}>📝 {quizTitle}</h1>

        <div style={styles.notice}>Fill your details and start test</div>

        <div style={styles.card}>
          <input
            style={styles.input}
            placeholder="Full Name"
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />

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

          <input
            style={styles.input}
            placeholder="Employee ID"
            onChange={(e) => setUserData({ ...userData, empId: e.target.value })}
          />

          <button style={styles.button} onClick={handleStart}>
            {loading ? "Checking..." : "🚀 Start Quiz"}
          </button>
        </div>
      </div>
    );

  // ---------------- Quiz Screen --------------------
  return (
    <div style={styles.container}>
      <div style={styles.timer}>⏳ Time Left: {formatTime(timeLeft)}</div>

      <h3 style={{ textAlign: "center", marginTop: "50px" }}>
        📄 <b>Total Marks:</b> 20
      </h3>

      {questions.map((q) => (
        <div key={q.id} style={styles.question}>
          <p>
            <b>{q.id}. {q.q}</b>
          </p>

          {q.options.map((opt) => (
            <label key={opt} style={styles.option}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleChange(q.id, opt)}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button style={styles.button} onClick={handleSubmit}>
        ✅ Submit
      </button>
    </div>
  );
}
