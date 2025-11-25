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

  // ---------------- STYLES --------------------
  const styles = {
    mainBG: {
      minHeight: "100vh",
      padding: "40px 20px",
      background: "linear-gradient(135deg, #0a2a43, #00111a)",
      display: "flex",
      justifyContent: "center",
      alignItems: "flex-start",
      color: "#fff",
      fontFamily: "'Poppins', sans-serif",
    },

    landingCard: {
      background: "rgba(255,255,255,0.10)",
      backdropFilter: "blur(10px)",
      borderRadius: "15px",
      padding: "30px",
      width: "100%",
      maxWidth: "600px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
      textAlign: "center",
    },

    heroTitle: {
      fontSize: "28px",
      fontWeight: "700",
      marginBottom: "10px",
      letterSpacing: "1px",
      color: "red",
      textTransform: "uppercase",
    },

    quizTitle: {
      fontSize: "22px",
      fontWeight: "600",
      marginBottom: "15px",
      color: "#ffffff",
    },

    notice: {
      background: "rgba(0,255,180,0.15)",
      color: "#00f7b2",
      textAlign: "center",
      padding: "10px",
      borderRadius: "8px",
      marginBottom: "20px",
      fontWeight: "500"
    },

    input: {
      padding: "12px",
      borderRadius: "8px",
      border: "none",
      outline: "none",
      width: "100%",
      marginBottom: "12px",
      fontSize: "16px",
    },

    button: {
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      background: "#00b4ff",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      width: "100%",
    }
  };

  // ---------------- Submitted Screen --------------------
  if (submitted)
    return (
      <div style={styles.mainBG}>
        <div style={styles.landingCard}>
          <h2 style={{ color: "#00ffae" }}>🎉 Quiz Submitted Successfully!</h2>
          <h3>Your Score: <b>{marks} / 20</b></h3>
        </div>
      </div>
    );

  // ---------------- Landing Screen --------------------
  if (!quizStarted)
    return (
      <div style={styles.mainBG}>
        <div style={styles.landingCard}>

          <h1 style={styles.heroTitle}>HERO STEELS LIMITED</h1>
          <h2 style={styles.quizTitle}>{quizTitle}</h2>

          <div style={styles.notice}>Fill your details to start quiz</div>

          <input style={styles.input} placeholder="Full Name"
            onChange={(e) => setUserData({ ...userData, name: e.target.value })} />

          <input style={styles.input} placeholder="Department"
            onChange={(e) => setUserData({ ...userData, department: e.target.value })} />

          <input style={styles.input} placeholder="Designation"
            onChange={(e) => setUserData({ ...userData, designation: e.target.value })} />

          <input style={styles.input} placeholder="Employee ID"
            onChange={(e) => setUserData({ ...userData, empId: e.target.value })} />

          <button style={styles.button} onClick={handleStart}>
            {loading ? "Checking..." : "🚀 Start Quiz"}
          </button>

        </div>
      </div>
    );

  // ---------------- Quiz Screen --------------------
  return (
    <div style={styles.mainBG}>
      <div style={{ width: "100%", maxWidth: "750px" }}>

        <div style={{ 
          position: "fixed",
          top: 0, left: 0,
          width: "100%",
          background: "#ff5252",
          color: "#fff",
          padding: "10px",
          fontSize: "20px",
          fontWeight: "bold",
          textAlign: "center",
          zIndex: 10
        }}>
          ⏳ Time Left: {formatTime(timeLeft)}
        </div>

        <h2 style={{ textAlign: "center", marginTop: "60px", marginBottom: "20px" }}>
          <b>Total Marks:</b> 20
        </h2>

        {questions.map((q) => (
          <div key={q.id} style={{
            background: "rgba(255,255,255,0.15)",
            padding: "15px",
            borderRadius: "10px",
            marginBottom: "12px",
          }}>
            <p><b>{q.id}. {q.q}</b></p>

            {q.options.map((opt) => (
              <label key={opt} style={{ display: "block", marginTop: "6px" }}>
                <input type="radio" name={q.id} value={opt}
                  checked={answers[q.id] === opt}
                  onChange={() => handleChange(q.id, opt)} />{" "}
                {opt}
              </label>
            ))}
          </div>
        ))}

        <button style={{
          padding: "15px",
          width: "100%",
          background: "#00c9ff",
          border: "none",
          color: "#fff",
          fontSize: "18px",
          borderRadius: "8px",
          marginTop: "20px"
        }}
          onClick={handleSubmit}
        >
          ✅ Submit
        </button>

      </div>
    </div>
  );
}
