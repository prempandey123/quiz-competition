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

  // ⭐ Auto quiz title (NO input required)
  const quizTitle = "Simple Quiz"; 

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(300);
  const [loading, setLoading] = useState(false);

  // 🔥 Simple 10 MCQ Questions
  const questions = [
    { id: 1, q: "Capital of India?", options: ["Delhi", "Mumbai", "Kolkata", "Chennai"], answer: "Delhi" },
    { id: 2, q: "5 + 5 = ?", options: ["8", "9", "10", "11"], answer: "10" },
    { id: 3, q: "Sun rises in the:", options: ["North", "South", "East", "West"], answer: "East" },
    { id: 4, q: "Largest ocean?", options: ["Indian", "Pacific", "Atlantic", "Arctic"], answer: "Pacific" },
    { id: 5, q: "Which is a fruit?", options: ["Tomato", "Carrot", "Potato", "Spinach"], answer: "Tomato" },
    { id: 6, q: "HTML stands for:", options: ["HyperText Markup Language", "Hot Mail", "How to Make Layout", "None"], answer: "HyperText Markup Language" },
    { id: 7, q: "Which one is an input device?", options: ["Mouse", "Monitor", "Speaker", "Printer"], answer: "Mouse" },
    { id: 8, q: "Which is a programming language?", options: ["Python", "Excel", "Word", "Paint"], answer: "Python" },
    { id: 9, q: "Fastest transport?", options: ["Train", "Car", "Aeroplane", "Ship"], answer: "Aeroplane" },
    { id: 10, q: "2 × 3 = ?", options: ["5", "6", "7", "8"], answer: "6" },
  ];

  // Timer Logic
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

  // ⭐ Prevent multiple attempts per quiz
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

  // Submit
  const handleSubmit = async () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answer) score++;
    });

    setMarks(score);
    setSubmitted(true);
    setQuizStarted(false);

    await addDoc(collection(db, "quizResults"), {
      ...userData,
      quizTitle,  // ⭐ Auto-added title stored here
      answers,
      marks: score,
      submittedAt: serverTimestamp(),
    });
  };

  // DESIGN (same as previous)
  const styles = {
    container: { maxWidth: "750px", margin: "auto", padding: "20px", fontFamily: "'Segoe UI', sans-serif" },
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
      position: "fixed", top: 0, left: 0, width: "100%",
      background: "#ffcccc", color: "#e74c3c",
      padding: "10px", fontSize: "18px", textAlign: "center", fontWeight: "bold", zIndex: 1000
    },
    card: {
      background: "#fff", padding: "20px", borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)", display: "flex",
      flexDirection: "column", gap: "10px"
    },
    input: {
      padding: "12px", fontSize: "16px", borderRadius: "8px",
      border: "1px solid #ccc", outline: "none", width: "100%"
    },
    button: {
      padding: "12px", fontSize: "16px", border: "none",
      borderRadius: "8px", background: "#3498db",
      color: "#fff", cursor: "pointer", fontWeight: "bold"
    },
    question: {
      background: "#f7f9fc", padding: "15px",
      borderRadius: "8px", border: "1px solid #ddd", marginBottom: "12px"
    },
    option: { display: "block", marginTop: "6px", cursor: "pointer" }
  };

  if (submitted)
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#27ae60", textAlign: "center" }}>🎉 Quiz Submitted Successfully!</h2>
        <h3 style={{ textAlign: "center" }}>Your Score: <b>{marks} / 10</b></h3>
      </div>
    );

  // Start Screen
  if (!quizStarted)
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>📝 {quizTitle}</h1>

        <div style={styles.notice}>Fill your details and start test</div>

        <div style={styles.card}>
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

  // Quiz Screen
  return (
    <div style={styles.container}>
      <div style={styles.timer}>⏳ Time Left: {formatTime(timeLeft)}</div>

      <h3 style={{ textAlign: "center", marginTop: "50px" }}>
        📄 <b>Total Marks:</b> 10
      </h3>

      {questions.map((q) => (
        <div key={q.id} style={styles.question}>
          <p><b>{q.id}. {q.q}</b></p>

          {q.options.map((opt) => (
            <label key={opt} style={styles.option}>
              <input type="radio" name={q.id} value={opt}
                checked={answers[q.id] === opt}
                onChange={() => handleChange(q.id, opt)} />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      <button style={styles.button} onClick={handleSubmit}>✅ Submit</button>
    </div>
  );
}
