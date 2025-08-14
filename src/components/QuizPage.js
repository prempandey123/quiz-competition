import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({ name: "", empId: "", department: "" });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 min timer

  // Quiz live time range (11:00 AM - 11:30 AM on 15 Aug 2025)
  const quizStartTime = new Date("2025-08-14T11:00:00");
  const quizEndTime = new Date("2025-08-15T18:30:00");

    const questions = [
  { id: 1, q: "Krishna Janmashtami kis devta ke janm din ke roop me manai jati hai?", options: ["Shiva", "Vishnu ke avatar Krishna", "Brahma", "Indra"] },
  { id: 2, q: "Krishna ka janm kis nagar me hua tha?", options: ["Mathura", "Dwarka", "Vrindavan", "Gokul"] },
  { id: 3, q: "Krishna ke pita kaun the?", options: ["Vasudeva", "Nanda", "Dasharatha", "Parikshit"] },
  { id: 4, q: "Krishna ki maa kaun thi?", options: ["Devaki", "Yashoda", "Kaikeyi", "Kunti"] },
  { id: 5, q: "Krishna ko kis raja ne kaid me rakha tha?", options: ["Kansa", "Ravana", "Hiranyakashipu", "Duryodhana"] },
  { id: 6, q: "Krishna ka rang kaunsa tha?", options: ["Shyam (dark blue)", "Gora", "Peela", "Sawla"] },
  { id: 7, q: "Krishna ka vishesh vadya kaunsa tha?", options: ["Bansuri", "Veena", "Sitar", "Mridang"] },
  { id: 8, q: "Krishna ka priy bhojan kya tha?", options: ["Makhan", "Kheer", "Puri", "Laddu"] },
  { id: 9, q: "Krishna ke bade bhai kaun the?", options: ["Balarama", "Shatrughna", "Lakshmana", "Bharata"] },
  { id: 10, q: "Krishna ne kis nag ko daman kiya tha?", options: ["Kaliya Naag", "Vasuki", "Takshaka", "Sheshnaag"] },
  { id: 11, q: "Janmashtami kis tithi ko manai jati hai?", options: ["Ashtami", "Purnima", "Chaturthi", "Amavasya"] },
  { id: 12, q: "Krishna ka bachpan kis gaon me bita?", options: ["Vrindavan", "Ayodhya", "Hastinapur", "Mathura"] },
  { id: 13, q: "Krishna ke pradhan mitra kaun the?", options: ["Sudama", "Karna", "Arjun", "Uddhav"] },
  { id: 14, q: "Krishna kis yudh me saarathi bane?", options: ["Mahabharat", "Ram-Ravan Yudh", "Kurukshetra ke bahar", "Dasharatha ka Yudh"] },
  { id: 15, q: "Krishna ka priy geet kaunsa tha?", options: ["Bhagavad Gita", "Rigveda", "Samveda", "Atharvaveda"] },
  { id: 16, q: "Krishna ne kis rani se vivah kiya?", options: ["Rukmini", "Sita", "Draupadi", "Jambavati"] },
  { id: 17, q: "Krishna ke kitne pramukh patra the Mahabharat me?", options: ["Bahut", "Ek", "Teen", "Paanch"] },
  { id: 18, q: "Krishna ka janm raat ko hua tha ya din me?", options: ["Raat", "Din", "Subah", "Shaam"] },
  { id: 19, q: "Krishna ko kis naam se bhi jana jata hai?", options: ["Govind", "Vishnu", "Indra", "Murlidhar"] },
  { id: 20, q: "Janmashtami ke din log kya karte hain?", options: ["Upvaas", "Yudh", "Shikar", "Dahi Handi"] },
];


  // Timer
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !submitted) handleSubmit();
  }, [quizStarted, timeLeft, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (id, option) => {
    setAnswers({ ...answers, [id]: option });
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
    const now = new Date();
    if (!userData.name || !userData.empId || !userData.department) {
      alert("Please fill all details before starting!");
      return;
    }
    if (now < quizStartTime || now > quizEndTime) {
      alert("Quiz is not live right now!");
      return;
    }
    setQuizStarted(true);
  };

  const styles = {
    container: {
      maxWidth: "700px",
      margin: "auto",
      padding: "20px",
      fontFamily: "'Segoe UI', sans-serif",
    },
    header: {
      textAlign: "center",
      color: "#2c3e50",
    },
    info: {
      textAlign: "center",
      color: "#8e44ad",
      fontSize: "18px",
      marginBottom: "20px",
    },
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
    buttonHover: {
      background: "#2980b9",
    },
    question: {
      background: "#f7f9fc",
      padding: "15px",
      borderRadius: "8px",
      marginBottom: "12px",
      border: "1px solid #ddd",
    },
    option: {
      display: "block",
      marginTop: "6px",
      cursor: "pointer",
    },
    timer: {
      position: "fixed",
      top: "0",
      left: "0",
      width: "100%",
      background: "#ffcccc",
      color: "#e74c3c",
      padding: "10px",
      fontSize: "18px",
      textAlign: "center",
      zIndex: 1000,
      borderBottom: "2px solid #ccc",
      fontWeight: "bold",
    },
  };

  const now = new Date();

  if (!quizStarted) {
  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📚 Quiz Time</h1>
      <h3 style={styles.info}>
        📢 Quiz will be live between 11:00 AM to 11:30 AM on 15 Aug 2025
      </h3>
      {now < quizStartTime || now > quizEndTime ? (
        <p style={{ color: "red", textAlign: "center" }}>
          ⛔ Quiz is not live right now!
        </p>
      ) : null}
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
          onMouseOver={(e) =>
            (e.target.style.background = styles.buttonHover.background)
          }
          onMouseOut={(e) =>
            (e.target.style.background = styles.button.background)
          }
          onClick={handleStart}
        >
          🚀 Start Quiz
        </button>
      </div>

      {/* Footer */}
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
        <h2 style={{ color: "#27ae60", textAlign: "center" }}>🎉 Dhanyavaad! Aapka quiz submit ho gaya!</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.timer}>
        ⏳ Time Left: {formatTime(timeLeft)}
      </div>

      <div style={{ marginTop: "60px" }}>
        {questions.map((q) => (
          <div key={q.id} style={styles.question}>
            <p><b>{q.id}. {q.q}</b></p>
            {q.options.map((opt) => (
              <label key={opt} style={styles.option}>
                <input type="radio" name={q.id} value={opt} onChange={() => handleChange(q.id, opt)} checked={answers[q.id] === opt} /> {opt}
              </label>
            ))}
          </div>
        ))}
      </div>

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
