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
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [loading, setLoading] = useState(false);

  // 🕒 Timer logic
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && quizStarted && !submitted) handleSubmit();
  }, [quizStarted, timeLeft, submitted]);

  const formatTime = (sec) => `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  // ✅ Quiz Data
  const sectionA = [
    { id: 1, q: "Which of the following is the correct order of 5S?", options: [
        "Sort → Shine → Set in order → Standardize → Sustain",
        "Sort → Set in order → Shine → Standardize → Sustain",
        "Shine → Sort → Standardize → Sustain → Set in order",
        "Standardize → Sustain → Set in order → Shine → Sort",
      ]},
    { id: 2, q: "In 5S, the step “Set in order” primarily focuses on:", options: [
        "Cleaning machines and floors",
        "Keeping only necessary items",
        "Organizing items so they are easy to find and use",
        "Writing standard operating procedures",
      ]},
    { id: 3, q: "Kaizen is best described as:", options: [
        "A one-time improvement event",
        "Continuous, small-step improvements involving everyone",
        "A cost-cutting exercise led by management only",
        "A system for replacing employees with machines",
      ]},
    { id: 4, q: "Which of these is NOT a benefit of implementing 5S?", options: [
        "Improved safety", "Increased space utilization", "Higher machine breakdowns", "Better workplace morale",
      ]},
    { id: 5, q: "The Japanese word “Seiri” means:", options: ["Standardize", "Sort", "Shine", "Sustain"] },
  ];
  const sectionB = [
    { id: 6, q: "Kaizen requires only top management involvement.", options: ["True", "False"] },
    { id: 7, q: "In 5S, “Shine” means we must clean the workplace and also inspect during cleaning.", options: ["True", "False"] },
    { id: 8, q: "Kaizen improvements are usually large investments in new machinery.", options: ["True", "False"] },
    { id: 9, q: "5S contributes to waste reduction.", options: ["True", "False"] },
    { id: 10, q: "In Kaizen, employee suggestions are an important part of improvement.", options: ["True", "False"] },
  ];
  const sectionC = [
    { id: 11, q: "The fifth S in 5S stands for __________." },
    { id: 12, q: "Kaizen aims at eliminating __________ (Japanese term: “Muda”)." },
    { id: 13, q: "The visual tool often used in 5S audits to check status is called a __________ chart." },
    { id: 14, q: "Continuous improvement in Kaizen is usually measured by __________ indicators." },
    { id: 15, q: "One famous Kaizen activity focused on reducing machine setup time, known as __________ (hint: SMED)." },
  ];
  const sectionD = [
    { id: 16, q: "You see unused tools, old files, and excess raw material lying in a work area. Which 5S step should be applied first and why?" },
    { id: 17, q: "A team reduced roll change time in a steel mill from 45 minutes to 25 minutes. Which concept does this represent — 5S or Kaizen — and why?" },
    { id: 18, q: "If a company cleans the workplace once but does not follow up regularly, which S is missing?" },
    { id: 19, q: "Suggest one simple Kaizen idea for an office environment." },
    { id: 20, q: "During 5S implementation, workers resist because they feel it increases workload. As a trainer, how would you motivate them?" },
  ];

  const handleChange = (id, val) => setAnswers({ ...answers, [id]: val });

  // ✅ Check existing attempt before starting
  const handleStart = async () => {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0, 0);
    if (now > sixPM) {
      alert("⛔ Quiz is closed after 6 PM. Please contact your trainer.");
      return;
    }
    if (!userData.name || !userData.empId || !userData.department || !userData.designation) {
      alert("⚠️ Please fill all details before starting!");
      return;
    }

    setLoading(true);
    try {
      const q = query(collection(db, "quizResults"), where("employeeId", "==", userData.empId.trim()));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("⚠️ You have already submitted the quiz. Multiple attempts are not allowed.");
        setLoading(false);
        return;
      }

      setQuizStarted(true);
    } catch (err) {
      console.error("Error checking quiz attempt:", err);
      alert("Error verifying your record. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;
    try {
      await addDoc(collection(db, "quizResults"), {
        name: userData.name,
        department: userData.department,
        designation: userData.designation,
        employeeId: userData.empId.trim(),
        answers,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
      setQuizStarted(false);
      alert("✅ Your answers have been submitted successfully!");
    } catch (err) {
      console.error("Error submitting quiz:", err);
    }
  };

  // 🎨 Styles
  const styles = {
    container: { maxWidth: "750px", margin: "auto", padding: "20px", fontFamily: "'Segoe UI', sans-serif" },
    header: { textAlign: "center", color: "#2c3e50" },
    notice: {
      background: "#e8f6e9",
      color: "#2e7d32",
      textAlign: "center",
      padding: "12px",
      borderRadius: "8px",
      border: "1px solid #a5d6a7",
      marginBottom: "20px",
      fontSize: "16px",
      fontWeight: "500",
    },
    timer: {
      position: "fixed", top: 0, left: 0, width: "100%",
      background: "#ffcccc", color: "#e74c3c",
      padding: "10px", fontSize: "18px",
      textAlign: "center", fontWeight: "bold", zIndex: 1000,
    },
    card: {
      background: "#fff", padding: "20px", borderRadius: "12px",
      boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
      display: "flex", flexDirection: "column", gap: "10px",
    },
    input: {
      padding: "12px", fontSize: "16px", borderRadius: "8px",
      border: "1px solid #ccc", outline: "none", width: "100%",
    },
    button: {
      padding: "12px", fontSize: "16px", border: "none",
      borderRadius: "8px", background: "#3498db",
      color: "#fff", cursor: "pointer", fontWeight: "bold",
    },
    sectionTitle: {
      background: "#eaf2ff", color: "#2c3e50",
      padding: "10px", borderRadius: "8px",
      margin: "20px 0 10px 0", fontWeight: "bold", textAlign: "center",
    },
    question: { background: "#f7f9fc", padding: "15px", borderRadius: "8px", marginBottom: "12px", border: "1px solid #ddd" },
    option: { display: "block", marginTop: "6px", cursor: "pointer" },
  };

  // 🧾 Start screen
  if (!quizStarted && !submitted) {
    const now = new Date();
    const sixPM = new Date();
    sixPM.setHours(18, 0, 0, 0);
    const isAfterSix = now > sixPM;

    return (
      <div style={styles.container}>
        <h1 style={styles.header}>🏭 5S & Kaizen Training Program – Quiz</h1>
        <h3 style={{ textAlign: "center", color: "#555" }}>📅 Session Date: 10 September 2025</h3>
        <h3 style={{ textAlign: "center", color: "#555" }}>👨‍🏫 Trainer Name: Mr. Ankur Dhir</h3>

        {isAfterSix ? (
          <h3 style={{ color: "red", textAlign: "center" }}>⛔ Quiz is closed after 6 PM. Please contact your trainer.</h3>
        ) : (
          <>
            <div style={styles.notice}>
              📢 The quiz is <b>live now</b> and will automatically <b>close at 6:00 PM</b> today.  
              Each employee can attempt only <b>once</b>. You’ll have <b>10 minutes</b> to complete it.
            </div>

            <div style={styles.card}>
              <input style={styles.input} type="text" placeholder="Full Name" value={userData.name}
                onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
              <input style={styles.input} type="text" placeholder="Department" value={userData.department}
                onChange={(e) => setUserData({ ...userData, department: e.target.value })} />
              <input style={styles.input} type="text" placeholder="Designation" value={userData.designation}
                onChange={(e) => setUserData({ ...userData, designation: e.target.value })} />
              <input style={styles.input} type="text" placeholder="Employee ID" value={userData.empId}
                onChange={(e) => setUserData({ ...userData, empId: e.target.value })} />

              <button style={styles.button} onClick={handleStart} disabled={loading}>
                {loading ? "Checking..." : "🚀 Start Quiz"}
              </button>
            </div>
          </>
        )}

        <footer style={{ marginTop: "30px", textAlign: "center", fontSize: "14px", color: "#7f8c8d" }}>
          © {new Date().getFullYear()} Hero Steels Limited – IT Department
        </footer>
      </div>
    );
  }

  // ✅ Thank-you screen
  if (submitted)
    return (
      <div style={styles.container}>
        <h2 style={{ color: "#27ae60", textAlign: "center" }}>🎉 Thank you! Your quiz has been submitted.</h2>
      </div>
    );

  // 🧩 Quiz page
  return (
    <div style={styles.container}>
      <div style={styles.timer}>⏳ Time Left: {formatTime(timeLeft)}</div>
      <h3 style={{ textAlign: "center", marginTop: "50px" }}>
        📄 <b>Total Marks:</b> 25 | <b>Minimum Required:</b> 10
      </h3>
      <p style={{ textAlign: "center", color: "#7f8c8d" }}>
        (Sections A to C = 1 mark each | Section D = 2 marks each)
      </p>

      {[{ title: "🅰️ Section A – Multiple Choice", data: sectionA },
        { title: "🅱️ Section B – True/False", data: sectionB },
        { title: "🅲 Section C – Fill in the Blanks", data: sectionC },
        { title: "🅳 Section D – Scenario-Based", data: sectionD }]
        .map(({ title, data }) => (
          <div key={title}>
            <div style={styles.sectionTitle}>{title}</div>
            {data.map((q) => (
              <div key={q.id} style={styles.question}>
                <p><b>{q.id}. {q.q}</b></p>
                {q.options ? (
                  q.options.map((opt) => (
                    <label key={opt} style={styles.option}>
                      <input type="radio" name={q.id} value={opt}
                        onChange={() => handleChange(q.id, opt)} checked={answers[q.id] === opt} /> {opt}
                    </label>
                  ))
                ) : (
                  <textarea
                    style={q.id < 16 ? styles.input : { ...styles.input, minHeight: "80px" }}
                    placeholder="Type your answer here"
                    value={answers[q.id] || ""}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}

      <button style={styles.button} onClick={handleSubmit}>✅ Submit</button>
    </div>
  );
}
