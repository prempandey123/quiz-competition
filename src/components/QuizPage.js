import { useState, useEffect } from "react";
import "../styles/quiz.css"; // We'll make a separate CSS file for styling
import { db } from "../firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({ name: "", email: "", empId: "" });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 min in seconds

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

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
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
      name,
      email,
      employeeId,
      answers,
      submittedAt: serverTimestamp(),
    });
    setSubmitted(true);
  } catch (error) {
    console.error("Error saving quiz:", error);
  }
};

  const handleStart = () => {
    if (userData.name && userData.email && userData.empId) {
      setQuizStarted(true);
    } else {
      alert("Please fill all details before starting!");
    }
  };

  if (!quizStarted) {
    return (
      <div className="quiz-container">
        <h1>🪔 Krishna Janmashtami Quiz</h1>
        <div className="card">
          <input
            type="text"
            placeholder="Full Name"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Employee ID"
            value={userData.empId}
            onChange={(e) => setUserData({ ...userData, empId: e.target.value })}
          />
          <button onClick={handleStart}>Start Quiz</button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="quiz-container">
        <h2>🎉 Dhanyavaad! Aapka quiz submit ho gaya!</h2>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <h1>🪔 Krishna Janmashtami Quiz</h1>
      <h3>⏳ Time Left: {formatTime(timeLeft)}</h3>
      {questions.map((q) => (
        <div key={q.id} className="question-card">
          <p><b>{q.id}. {q.q}</b></p>
          {q.options.map((opt) => (
            <label key={opt} className="option">
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() => handleChange(q.id, opt)}
                checked={answers[q.id] === opt}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button className="submit-btn" onClick={handleSubmit}>Submit</button>
    </div>
  );
}
