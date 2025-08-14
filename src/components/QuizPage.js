import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({ name: "", empId: "", department: "" });
  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 30 min timer

  // Quiz live time range (11:00 AM - 11:30 AM on 15 Aug 2025)
  const quizStartTime = new Date("2025-08-15T12:00:01");
  const quizEndTime = new Date("2025-08-15T14:00:00");

  const questions = [
  { id: 1, q: "Who was the Prime Minister of India when the country got independence in 1947?", options: ["Sardar Vallabhbhai Patel", "Jawaharlal Nehru", "Subhas Chandra Bose", "Mahatma Gandhi"] },
  { id: 2, q: "Lord Krishna was born in which prison?", options: ["Mathura", "Dwarka", "Vrindavan", "Kurukshetra"] },
  { id: 3, q: "What is the name of the demon king who tried to kill baby Krishna?", options: ["Kans", "Ravan", "Hiranyakashipu", "Duryodhan"] },
  { id: 4, q: "How many years of independence did India celebrate in 2025?", options: ["74", "75", "78", "79"] },
  { id: 5, q: "What was Lord Krishna’s role in the Mahabharata?", options: ["Warrior", "Sage", "Charioteer and guide", "King of Hastinapur"] },
  { id: 6, q: "Who wrote the Indian National Anthem?", options: ["Bankim Chandra Chatterjee", "Subhas Chandra Bose", "Rabindranath Tagore", "Sarojini Naidu"] },
  { id: 7, q: "According to the Bhagavata Purana, at what exact time was Lord Krishna born?", options: ["Midnight on Ashtami of Krishna Paksha in Shravana month", "Noon on Navami of Krishna Paksha in Ashadha month", "Midnight on Navami of Shukla Paksha in Bhadrapada month", "Sunrise on Ashtami of Shukla Paksha in Shravan month"] },
  { id: 8, q: "Who was the Governor-General of India at the time of Indian independence in 1947?", options: ["Lord Wavell", "Lord Linlithgow", "Lord Mountbatten", "Lord Curzon"] },
  { id: 9, q: "In which Upanishad is Krishna mentioned as the Supreme Personality of Godhead?", options: ["Chandogya Upanishad", "Katha Upanishad", "Gopala-tapani Upanishad", "Mandukya Upanishad"] },
  { id: 10, q: "The famous slogan 'Aaram haram hai' was given by which Indian freedom fighter after independence?", options: ["Lal Bahadur Shastri", "Mahatma Gandhi", "Jawaharlal Nehru", "Sardar Patel"] },
  { id: 11, q: "Who was the British Prime Minister when India became independent in 1947?", options: ["Winston Churchill", "Neville Chamberlain", "Clement Attlee", "Harold Macmillan"] },
  { id: 12, q: "What was the real name of Krishna’s foster mother in Gokul?", options: ["Radha", "Yashoda", "Devaki", "Rohini"] },
  { id: 13, q: "What philosophical doctrine did Krishna reveal to Arjuna in the Bhagavad Gita?", options: ["Advaita Vedanta", "Karma Yoga and Bhakti Yoga", "Buddhism", "Jainism"] },
  { id: 14, q: "The Indian National Flag was adopted in its present form on which date?", options: ["15 August 1947", "26 January 1950", "22 July 1947", "10 August 1947"] },
  { id: 15, q: "If Lord Krishna were to advise Mahatma Gandhi during the Quit India Movement, which principle from the Bhagavad Gita would most align with Gandhi’s philosophy?", options: ["Nishkama Karma (Selfless action)", "Ahimsa (Non-violence)", "Moksha (Liberation from the cycle of birth and death)", "Bhakti (Devotion to God)"] },
  { id: 16, q: "If the Dahi Handi tradition symbolizes unity and team effort, which Indian freedom movement tactic does it most closely resemble?", options: ["Salt March", "Swadeshi Movement", "Quit India Movement", "Non-Cooperation Movement"] },
  { id: 17, q: "Imagine Janmashtami and Independence Day fall on the same day. A school decides to host a combined event. Which of the following themes would best represent both occasions?", options: ["Patriotism through mythological storytelling", "Political debates on colonialism", "Folk dances of different states", "Essay writing on modern politics"] },
  { id: 18, q: "Krishna is often seen breaking societal norms in the Mahabharata. Which Indian freedom fighter’s methods best mirror this kind of 'divine rebellion'?", options: ["Subhas Chandra Bose", "Jawaharlal Nehru", "B. R. Ambedkar", "Bal Gangadhar Tilak"] },
  { id: 19, q: "If Lord Krishna’s role in the Mahabharata symbolizes strategic guidance in chaos, what role does the Indian Constitution play post-independence in a similar context?", options: ["As a weapon of justice", "As a spiritual text", "As a guiding charioteer", "As a religious law"] },
  { id: 20, q: "If the Makhan (butter) Krishna stole symbolized wealth or resources, what could be the parallel action in the Indian freedom struggle?", options: ["Boycott of British goods", "Adoption of Khadi", "Salt-making in Dandi", "Seizing of British institutions"] },
  { id: 21, q: "Suppose Krishna was born in colonial India in 1947. Which social issue would he most likely challenge first, based on his historical actions?", options: ["Partition", "Caste discrimination", "Economic exploitation", "Religious conversion"] },
  { id: 22, q: "Which principle from Krishna’s life could best serve as a moral compass for drafting the Indian Constitution?", options: ["Tactical diplomacy with Kauravas", "Participation in warfare", "Preaching Bhakti", "Emphasis on Dharma over personal ties"] },
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
        📢 Quiz will be live between 12:00 PM to 02:00 PM on 15 Aug 2025
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
