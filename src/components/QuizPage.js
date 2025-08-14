import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({ name: "", empId: "", department: "" });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  // Quiz live time range
  const quizStartTime = new Date("2025-08-14T11:00:00");
  const quizEndTime = new Date("2025-08-14T14:59:59"); // 12:00 AM next day

  const questions = [
    { id: 1, q: "Krishna Janmashtami kis devta ke janm din ke roop me manai jati hai?", options: ["Shiva", "Vishnu ke avatar Krishna", "Brahma"] },
    { id: 2, q: "Krishna ka janm kis nagar me hua tha?", options: ["Mathura", "Dwarka", "Vrindavan"] },
    { id: 3, q: "Krishna ke pita kaun the?", options: ["Vasudeva", "Nanda", "Dasharatha"] },
    { id: 4, q: "Krishna ki maa kaun thi?", options: ["Devaki", "Yashoda", "Kaikeyi"] },
    { id: 5, q: "Krishna ko kis raja ne kaid me rakha tha?", options: ["Kansa", "Ravana", "Hiranyakashipu"] },
    { id: 6, q: "Krishna ka rang kaunsa tha?", options: ["Shyam (dark blue)", "Gora", "Peela"] },
    { id: 7, q: "Krishna ka vishesh vadya kaunsa tha?", options: ["Bansuri", "Veena", "Sitar"] },
    { id: 8, q: "Krishna ka priy bhojan kya tha?", options: ["Makhan", "Kheer", "Puri"] },
    { id: 9, q: "Krishna ke bade bhai kaun the?", options: ["Balarama", "Shatrughna", "Lakshmana"] },
    { id: 10, q: "Krishna ne kis nag ko daman kiya tha?", options: ["Kaliya Naag", "Vasuki", "Takshaka"] },
    { id: 11, q: "Janmashtami kis tithi ko manai jati hai?", options: ["Ashtami", "Purnima", "Chaturthi"] },
    { id: 12, q: "Krishna ka bachpan kis gaon me bita?", options: ["Vrindavan", "Ayodhya", "Hastinapur"] },
    { id: 13, q: "Krishna ke pradhan mitra kaun the?", options: ["Sudama", "Karna", "Arjun"] },
    { id: 14, q: "Krishna kis yudh me saarathi bane?", options: ["Mahabharat", "Ram-Ravan Yudh", "Kurukshetra ke bahar"] },
    { id: 15, q: "Krishna ka priy geet kaunsa tha?", options: ["Bhagavad Gita", "Rigveda", "Samveda"] },
    { id: 16, q: "Krishna ne kis rani se vivah kiya?", options: ["Rukmini", "Sita", "Draupadi"] },
    { id: 17, q: "Krishna ke kitne pramukh patra the Mahabharat me?", options: ["Bahut", "Ek", "Teen"] },
    { id: 18, q: "Krishna ka janm raat ko hua tha ya din me?", options: ["Raat", "Din", "Subah"] },
    { id: 19, q: "Krishna ko kis naam se bhi jana jata hai?", options: ["Govind", "Vishnu", "Indra"] },
    { id: 20, q: "Janmashtami ke din log kya karte hain?", options: ["Upvaas", "Yudh", "Shikar"] },
  ];

  // Quiz timer countdown
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && !submitted) {
      handleSubmit();
    }
  }, [timeLeft, quizStarted, submitted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleChange = (id, option) => {
    setAnswers({ ...answers, [id]: option });
  };

  const handleSubmit = async () => {
    try {
      await addDoc(collection(db, "quizResults"), {
        name: userData.name,
        department: userData.department,
        employeeId: userData.empId,
        answers,
        submittedAt: serverTimestamp(),
      });
      setSubmitted(true);
      setQuizStarted(false);
    } catch (error) {
      console.error("Error saving quiz:", error);
      setSubmitted(true);
    }
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
    container: { maxWidth: "600px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" },
    card: { display: "flex", flexDirection: "column", gap: "10px", background: "#f9f9f9", padding: "20px", borderRadius: "8px" },
    input: { padding: "10px", fontSize: "16px", borderRadius: "5px", border: "1px solid #ccc" },
    button: { padding: "10px", fontSize: "16px", border: "none", borderRadius: "5px", background: "#4CAF50", color: "#fff", cursor: "pointer" },
    question: { background: "#fff", padding: "15px", borderRadius: "8px", marginBottom: "10px", border: "1px solid #ddd" },
    option: { display: "block", marginTop: "5px" },
    timerFixed: { 
      position: "fixed", 
      top: "0", 
      left: "0", 
      width: "100%", 
      background: "white", 
      color: "red", 
      padding: "10px", 
      fontSize: "18px", 
      textAlign: "center", 
      zIndex: 1000,
      borderBottom: "2px solid #ccc"
    }
  };

  const now = new Date();

  if (!quizStarted) {
    return (
      <div style={styles.container}>
        <h1>Quiz Time</h1>
        <h3>📢 Quiz will be live between 11:00 AM to 11:30 AM on 15 Aug 2025</h3>
        {now < quizStartTime || now > quizEndTime ? (
          <p style={{ color: "red" }}>⛔ Quiz is not live right now!</p>
        ) : null}
        <div style={styles.card}>
          <input style={styles.input} type="text" placeholder="Full Name" value={userData.name} onChange={(e) => setUserData({ ...userData, name: e.target.value })} />
          <input style={styles.input} type="text" placeholder="Department" value={userData.department} onChange={(e) => setUserData({ ...userData, department: e.target.value })} />
          <input style={styles.input} type="text" placeholder="Employee ID" value={userData.empId} onChange={(e) => setUserData({ ...userData, empId: e.target.value })} />
          <button style={styles.button} onClick={handleStart}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.container}>
        <h2>🎉 Dhanyavaad! Aapka quiz submit ho gaya!</h2>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.timerFixed}>
        ⏳ Time Left: {formatTime(timeLeft)}
      </div>

      <div style={{ marginTop: "50px" }}>
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

      <button style={styles.button} onClick={handleSubmit}>Submit</button>
    </div>
  );
}
