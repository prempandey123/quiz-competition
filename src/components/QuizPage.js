import { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({ name: "", empId: "", department: "" });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // 🅰️ Section A – Multiple Choice
  const sectionA = [
    {
      id: 1,
      q: "Which of the following is the correct order of 5S?",
      options: [
        "Sort → Shine → Set in order → Standardize → Sustain",
        "Sort → Set in order → Shine → Standardize → Sustain",
        "Shine → Sort → Standardize → Sustain → Set in order",
        "Standardize → Sustain → Set in order → Shine → Sort",
      ],
    },
    {
      id: 2,
      q: "In 5S, the step “Set in order” primarily focuses on:",
      options: [
        "Cleaning machines and floors",
        "Keeping only necessary items",
        "Organizing items so they are easy to find and use",
        "Writing standard operating procedures",
      ],
    },
    {
      id: 3,
      q: "Kaizen is best described as:",
      options: [
        "A one-time improvement event",
        "Continuous, small-step improvements involving everyone",
        "A cost-cutting exercise led by management only",
        "A system for replacing employees with machines",
      ],
    },
    {
      id: 4,
      q: "Which of these is NOT a benefit of implementing 5S?",
      options: [
        "Improved safety",
        "Increased space utilization",
        "Higher machine breakdowns",
        "Better workplace morale",
      ],
    },
    {
      id: 5,
      q: "The Japanese word “Seiri” means:",
      options: ["Standardize", "Sort", "Shine", "Sustain"],
    },
  ];

  // 🅱️ Section B – True or False
  const sectionB = [
    { id: 6, q: "Kaizen requires only top management involvement.", options: ["True", "False"] },
    { id: 7, q: "In 5S, “Shine” means we must clean the workplace and also inspect during cleaning.", options: ["True", "False"] },
    { id: 8, q: "Kaizen improvements are usually large investments in new machinery.", options: ["True", "False"] },
    { id: 9, q: "5S contributes to waste reduction.", options: ["True", "False"] },
    { id: 10, q: "In Kaizen, employee suggestions are an important part of improvement.", options: ["True", "False"] },
  ];

  // 🅲 Section C – Fill in the Blanks
  const sectionC = [
    { id: 11, q: "The fifth S in 5S stands for __________." },
    { id: 12, q: "Kaizen aims at eliminating __________ (Japanese term: “Muda”)." },
    { id: 13, q: "The visual tool often used in 5S audits to check status is called a __________ chart." },
    { id: 14, q: "Continuous improvement in Kaizen is usually measured by __________ indicators." },
    { id: 15, q: "One famous Kaizen activity focused on reducing machine setup time, known as __________ (hint: SMED)." },
  ];

  // 🅳 Section D – Scenario-Based / Short Answer
  const sectionD = [
    {
      id: 16,
      q: "You see unused tools, old files, and excess raw material lying in a work area. Which 5S step should be applied first and why?",
    },
    {
      id: 17,
      q: "A team reduced roll change time in a steel mill from 45 minutes to 25 minutes. Which concept does this represent — 5S or Kaizen — and why?",
    },
    {
      id: 18,
      q: "If a company cleans the workplace once but does not follow up regularly, which S is missing?",
    },
    {
      id: 19,
      q: "Suggest one simple Kaizen idea for an office environment.",
    },
    {
      id: 20,
      q: "During 5S implementation, workers resist because they feel it increases workload. As a trainer, how would you motivate them?",
    },
  ];

  const handleChange = (id, value) => {
    setAnswers({ ...answers, [id]: value });
  };

  const handleSubmit = async () => {
    await addDoc(collection(db, "quizResults"), {
      name: userData.name,
      department: userData.department,
      employeeId: userData.empId,
      answers,
      submittedAt: serverTimestamp(),
    });
    setSubmitted(true);
    setQuizStarted(false);
  };

  const handleStart = () => {
    if (!userData.name || !userData.empId || !userData.department) {
      alert("Please fill all details before starting!");
      return;
    }
    setQuizStarted(true);
  };

  const styles = {
    container: { maxWidth: "700px", margin: "auto", padding: "20px", fontFamily: "'Segoe UI', sans-serif" },
    header: { textAlign: "center", color: "#2c3e50" },
    info: { textAlign: "center", color: "#8e44ad", fontSize: "18px", marginBottom: "20px" },
    card: {
      background: "#ffffff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "10px",
    },
    input: {
      padding: "12px",
      fontSize: "16px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      outline: "none",
      transition: "0.3s",
      width: "100%",
    },
    textarea: {
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      border: "1px solid #ccc",
      fontSize: "15px",
      minHeight: "80px",
      resize: "vertical",
    },
    button: {
      padding: "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "8px",
      background: "#3498db",
      color: "#fff",
      cursor: "pointer",
      fontWeight: "bold",
      transition: "0.3s",
    },
    buttonHover: { background: "#2980b9" },
    question: {
      background: "#f7f9fc",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid #ddd",
    },
    option: { display: "block", marginTop: "6px", cursor: "pointer" },
    sectionTitle: {
      background: "#eaf2ff",
      color: "#2c3e50",
      padding: "10px",
      borderRadius: "8px",
      margin: "20px 0 10px 0",
      fontWeight: "bold",
      fontSize: "18px",
      textAlign: "center",
    },
  };

  if (!quizStarted) {
    return (
      <div style={styles.container}>
        <h1 style={styles.header}>📚 Quiz Time</h1>
        <h3 style={styles.info}>🧠 Welcome! You can start the quiz anytime.</h3>

        <div style={styles.card}>
          <input
            style={styles.input}
            type="text"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Department"
            value={userData.department}
            onChange={(e) => setUserData({ ...userData, department: e.target.value })}
          />
          <input
            style={styles.input}
            type="text"
            placeholder="Employee ID"
            value={userData.empId}
            onChange={(e) => setUserData({ ...userData, empId: e.target.value })}
          />
          <button
            style={styles.button}
            onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
            onMouseOut={(e) => (e.target.style.background = styles.button.background)}
            onClick={handleStart}
          >
            🚀 Start Quiz
          </button>
        </div>

        <footer
          style={{
            marginTop: "30px",
            padding: "10px",
            textAlign: "center",
            fontSize: "14px",
            color: "#7f8c8d",
            borderTop: "1px solid #ddd",
          }}
        >
          © {new Date().getFullYear()} Hero Steels Limited, IT Department — All Rights Reserved
        </footer>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#27ae60", textAlign: "center" }}>
          🎉 Dhanyavaad! Aapka quiz submit ho gaya!
        </h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* 🅰️ Section A */}
      <div style={styles.sectionTitle}>🅰️ Section A: Multiple Choice Questions</div>
      {sectionA.map((q) => (
        <div key={q.id} style={styles.question}>
          <p><b>{q.id}. {q.q}</b></p>
          {q.options.map((opt) => (
            <label key={opt} style={styles.option}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() => handleChange(q.id, opt)}
                checked={answers[q.id] === opt}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      {/* 🅱️ Section B */}
      <div style={styles.sectionTitle}>🅱️ Section B: True or False</div>
      {sectionB.map((q) => (
        <div key={q.id} style={styles.question}>
          <p><b>{q.id}. {q.q}</b></p>
          {q.options.map((opt) => (
            <label key={opt} style={styles.option}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() => handleChange(q.id, opt)}
                checked={answers[q.id] === opt}
              />{" "}
              {opt}
            </label>
          ))}
        </div>
      ))}

      {/* 🅲 Section C */}
      <div style={styles.sectionTitle}>🅲 Section C: Fill in the Blanks</div>
      {sectionC.map((q) => (
        <div key={q.id} style={styles.question}>
          <p><b>{q.id}. {q.q}</b></p>
          <input
            type="text"
            style={styles.input}
            placeholder="Type your answer here"
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        </div>
      ))}

      {/* 🅳 Section D */}
      <div style={styles.sectionTitle}>🅳 Section D: Scenario-Based / Short Answer</div>
      {sectionD.map((q) => (
        <div key={q.id} style={styles.question}>
          <p><b>{q.id}. {q.q}</b></p>
          <textarea
            style={styles.textarea}
            placeholder="Type your answer here"
            value={answers[q.id] || ""}
            onChange={(e) => handleChange(q.id, e.target.value)}
          />
        </div>
      ))}

      <button
        style={styles.button}
        onMouseOver={(e) => (e.target.style.background = styles.buttonHover.background)}
        onMouseOut={(e) => (e.target.style.background = styles.button.background)}
        onClick={handleSubmit}
      >
        ✅ Submit
      </button>
    </div>
  );
}
