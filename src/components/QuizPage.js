import { useState, useEffect, useMemo } from "react";
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

  // ✅ Quiz Title
  const quizTitle = "Road Safety Awareness Quiz";

  // ✅ Timing 5 Minutes (as you asked)
  const QUIZ_DURATION_MIN = 5;
  const QUIZ_DURATION_SEC = QUIZ_DURATION_MIN * 60;

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SEC);
  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // ---------------- Detect Mobile --------------------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Questions from your Excel (Road Safety.xlsx)
  const questions = useMemo(
    () => [
      {
        id: 1,
        q_en: "What is the correct stopping distance at 60 mph on a dry road?",
        q_hi: "",
        options: [
          { key: "A", en: "60 feet", hi: "" },
          { key: "B", en: "75 feet", hi: "" },
          { key: "C", en: "120 feet", hi: "" },
          { key: "D", en: "240 feet", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 2,
        q_en:
          "What should a driver do when approaching a pedestrian cross...affic lights where pedestrians are already waiting to cross?**",
        q_hi: "",
        options: [
          { key: "A", en: "Honk the horn to alert pedestrians", hi: "" },
          { key: "B", en: "Slow down and prepare to stop if necessary", hi: "" },
          { key: "C", en: "Keep driving at the same speed and ignore pedestrians", hi: "" },
          { key: "D", en: "Speed up to avoid blocking the crossing", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 3,
        q_en: "When driving in foggy conditions, which lights should you use?",
        q_hi: "",
        options: [
          { key: "A", en: "High beam headlights", hi: "" },
          { key: "B", en: "Low beam headlights or fog lights", hi: "" },
          { key: "C", en: "Parking lights", hi: "" },
          { key: "D", en: "Hazard lights", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 4,
        q_en: "What is the “Two-Second Rule” in driving?",
        q_hi: "",
        options: [
          { key: "A", en: "The minimum distance you should stay behind another vehicle", hi: "" },
          { key: "B", en: "The time it takes to check for blind spots before changing lanes", hi: "" },
          { key: "C", en: "The length of time you should signal before turning", hi: "" },
          { key: "D", en: "The minimum time a pedestrian has to wait before crossing the road", hi: "" },
        ],
        answerKey: "A",
      },
      {
        id: 5,
        q_en:
          "What is the effect of alcohol on your driving abilities, even if you’re under the legal limit?",
        q_hi: "",
        options: [
          { key: "A", en: "It has no effect on driving ability", hi: "" },
          { key: "B", en: "It improves reaction times", hi: "" },
          { key: "C", en: "It slows your reaction times and impairs judgment", hi: "" },
          { key: "D", en: "It only affects your ability to judge distance", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 6,
        q_en: "What should you do if your vehicle starts skidding on a wet road?",
        q_hi: "",
        options: [
          { key: "A", en: "Brake hard and steer sharply", hi: "" },
          { key: "B", en: "Steer in the direction you want to go and ease off the accelerator", hi: "" },
          { key: "C", en: "Accelerate quickly to regain control", hi: "" },
          { key: "D", en: "Turn off the engine immediately", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 7,
        q_en: "What is the main purpose of road signs?",
        q_hi: "",
        options: [
          { key: "A", en: "To decorate the road", hi: "" },
          { key: "B", en: "To provide information and regulate traffic", hi: "" },
          { key: "C", en: "To confuse drivers", hi: "" },
          { key: "D", en: "To indicate the location of buildings", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 8,
        q_en: "Which of the following is the safest way to use a mobile phone while driving?",
        q_hi: "",
        options: [
          { key: "A", en: "Texting with one hand", hi: "" },
          { key: "B", en: "Using a hands-free device", hi: "" },
          { key: "C", en: "Holding the phone and talking", hi: "" },
          { key: "D", en: "Checking notifications quickly", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 9,
        q_en: "What should you do at a yellow traffic light?",
        q_hi: "",
        options: [
          { key: "A", en: "Speed up to cross quickly", hi: "" },
          { key: "B", en: "Stop if it is safe to do so", hi: "" },
          { key: "C", en: "Ignore it and proceed", hi: "" },
          { key: "D", en: "Honk and move forward", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 10,
        q_en: "What is the most common cause of road accidents?",
        q_hi: "",
        options: [
          { key: "A", en: "Road conditions", hi: "" },
          { key: "B", en: "Vehicle defects", hi: "" },
          { key: "C", en: "Human error", hi: "" },
          { key: "D", en: "Weather conditions", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 11,
        q_en: "Why is wearing a seat belt important?",
        q_hi: "",
        options: [
          { key: "A", en: "It helps you drive faster", hi: "" },
          { key: "B", en: "It reduces the risk of injury during an accident", hi: "" },
          { key: "C", en: "It makes driving comfortable", hi: "" },
          { key: "D", en: "It is only required on highways", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 12,
        q_en: "What should you do when you see an ambulance with siren on behind you?",
        q_hi: "",
        options: [
          { key: "A", en: "Speed up", hi: "" },
          { key: "B", en: "Stop immediately in the middle of the road", hi: "" },
          { key: "C", en: "Move to the side and give way", hi: "" },
          { key: "D", en: "Ignore and continue driving", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 13,
        q_en: "What is defensive driving?",
        q_hi: "",
        options: [
          { key: "A", en: "Driving aggressively to protect your position", hi: "" },
          { key: "B", en: "Driving while anticipating potential hazards and avoiding accidents", hi: "" },
          { key: "C", en: "Driving only at night", hi: "" },
          { key: "D", en: "Driving only in slow lanes", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 14,
        q_en: "What does a red traffic light mean?",
        q_hi: "",
        options: [
          { key: "A", en: "Go", hi: "" },
          { key: "B", en: "Stop", hi: "" },
          { key: "C", en: "Proceed with caution", hi: "" },
          { key: "D", en: "Speed up", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 15,
        q_en: "What should you do before changing lanes?",
        q_hi: "",
        options: [
          { key: "A", en: "Honk continuously", hi: "" },
          { key: "B", en: "Check mirrors and blind spots, and use indicators", hi: "" },
          { key: "C", en: "Accelerate immediately", hi: "" },
          { key: "D", en: "Brake suddenly", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 16,
        q_en: "What is the safest speed while driving near schools?",
        q_hi: "",
        options: [
          { key: "A", en: "High speed", hi: "" },
          { key: "B", en: "Moderate speed", hi: "" },
          { key: "C", en: "Low speed and as per signboards", hi: "" },
          { key: "D", en: "Any speed is fine", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 17,
        q_en: "What should you do if you feel sleepy while driving?",
        q_hi: "",
        options: [
          { key: "A", en: "Open window and continue", hi: "" },
          { key: "B", en: "Drink coffee and drive faster", hi: "" },
          { key: "C", en: "Stop at a safe place and take rest", hi: "" },
          { key: "D", en: "Turn on loud music", hi: "" },
        ],
        answerKey: "C",
      },
      {
        id: 18,
        q_en: "Which is a safe following distance on highways?",
        q_hi: "",
        options: [
          { key: "A", en: "One-second gap", hi: "" },
          { key: "B", en: "Two-second gap (minimum)", hi: "" },
          { key: "C", en: "Half-second gap", hi: "" },
          { key: "D", en: "No gap needed", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 19,
        q_en: "What is the first thing you should do in case of an accident?",
        q_hi: "",
        options: [
          { key: "A", en: "Run away", hi: "" },
          { key: "B", en: "Ensure safety, call emergency services, and provide help if possible", hi: "" },
          { key: "C", en: "Argue with other driver", hi: "" },
          { key: "D", en: "Continue driving", hi: "" },
        ],
        answerKey: "B",
      },
      {
        id: 20,
        q_en: "What is the correct way to overtake another vehicle?",
        q_hi: "",
        options: [
          { key: "A", en: "Overtake from the left without signal", hi: "" },
          { key: "B", en: "Overtake from the right when safe and use indicator", hi: "" },
          { key: "C", en: "Overtake at blind turns", hi: "" },
          { key: "D", en: "Overtake near zebra crossings", hi: "" },
        ],
        answerKey: "B",
      },
    ],
    []
  );

  // ✅ Auto display counts
  const TOTAL_QUESTIONS_DISPLAY = questions.length;
  const TOTAL_MARKS_DISPLAY = questions.length;

  // ---------------- Timer --------------------
  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !submitted) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
    if (timeLeft === 0 && quizStarted && !submitted) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setTimeLeft(QUIZ_DURATION_SEC);
  };

  // ---------------- Submit --------------------
  const handleSubmit = async () => {
    let score = 0;

    questions.forEach((q) => {
      if (answers[q.id] === q.answerKey) score++;
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
      questions, // ✅ store questions snapshot
      submittedAt: serverTimestamp(),
    });
  };

  // ---------------- Styles --------------------
  const styles = {
    page: {
      minHeight: "100vh",
      background:
        "radial-gradient(circle at 10% 10%, rgba(231,76,60,0.10), transparent 35%), radial-gradient(circle at 90% 20%, rgba(52,152,219,0.12), transparent 40%), linear-gradient(180deg, #fbfbfb, #f2f4f7)",
      padding: isMobile ? "18px 12px" : "28px 14px",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      WebkitTextSizeAdjust: "100%",
    },

    container: {
      maxWidth: "820px",
      margin: "0 auto",
      padding: isMobile ? "10px" : "18px",
      paddingTop: quizStarted ? (isMobile ? "68px" : "74px") : undefined,
    },

    brand: {
      textAlign: "center",
      fontWeight: 900,
      letterSpacing: "1px",
      color: "#c0392b",
      marginBottom: "8px",
      textTransform: "uppercase",
      fontSize: isMobile ? "14px" : "18px",
    },

    titleWrap: {
      background: "linear-gradient(135deg, #ffffff, #fff7f7)",
      border: "1px solid rgba(192,57,43,0.15)",
      borderRadius: "16px",
      padding: isMobile ? "14px" : "18px",
      boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
      marginBottom: "14px",
    },

    header: {
      textAlign: "center",
      color: "#2c3e50",
      margin: 0,
      fontSize: isMobile ? "20px" : "26px",
      fontWeight: 900,
      lineHeight: 1.2,
    },

    subHeader: {
      textAlign: "center",
      marginTop: "6px",
      color: "#566573",
      fontSize: isMobile ? "12px" : "14px",
      lineHeight: 1.4,
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
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 700,
    },

    badgeBlue: {
      background: "rgba(52,152,219,0.10)",
      border: "1px solid rgba(52,152,219,0.20)",
      color: "#1f6fb2",
      padding: "8px 12px",
      borderRadius: "999px",
      fontSize: isMobile ? "12px" : "13px",
      fontWeight: 700,
    },

    notice: {
      background: "linear-gradient(135deg, #e8f6ff, #f7fbff)",
      border: "1px solid rgba(52,152,219,0.25)",
      color: "#1f6fb2",
      textAlign: "left",
      padding: isMobile ? "12px" : "14px",
      borderRadius: "14px",
      marginBottom: "14px",
      fontWeight: 600,
      lineHeight: 1.45,
    },

    noticeTitle: { fontSize: isMobile ? "13px" : "14px", fontWeight: 900, marginBottom: "6px" },
    rules: { margin: 0, paddingLeft: "18px", fontWeight: 600, fontSize: isMobile ? "12px" : "13px" },

    card: {
      background: "#fff",
      padding: isMobile ? "14px" : "18px",
      borderRadius: "16px",
      boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
      border: "1px solid rgba(0,0,0,0.06)",
      display: "flex",
      flexDirection: "column",
      gap: "12px",
    },

    row2: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
      gap: "12px",
    },

    input: {
      padding: "13px 12px",
      fontSize: isMobile ? "16px" : "15px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.12)",
      outline: "none",
      width: "100%",
      transition: "0.2s",
      background: "#fcfcfd",
      boxSizing: "border-box",
    },

    helper: {
      fontSize: isMobile ? "12px" : "12px",
      color: "#6c7a89",
      marginTop: "-6px",
      marginBottom: "2px",
      lineHeight: 1.4,
    },

    button: {
      padding: isMobile ? "14px 12px" : "12px",
      fontSize: isMobile ? "16px" : "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #c0392b, #e74c3c)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(231,76,60,0.25)",
      transition: "0.2s",
      width: "100%",
      touchAction: "manipulation",
    },

    timer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "linear-gradient(90deg, #fff0f0, #ffe3e3)",
      color: "#c0392b",
      padding: "12px 10px",
      fontSize: isMobile ? "14px" : "16px",
      textAlign: "center",
      fontWeight: 900,
      zIndex: 1000,
      borderBottom: "1px solid rgba(192,57,43,0.18)",
      paddingTop: "calc(10px + env(safe-area-inset-top))",
    },

    question: {
      background: "linear-gradient(135deg, #ffffff, #fbfcff)",
      padding: isMobile ? "12px" : "14px",
      borderRadius: "14px",
      border: "1px solid rgba(0,0,0,0.08)",
      marginBottom: "12px",
      boxShadow: "0 6px 16px rgba(0,0,0,0.05)",
    },

    qTitle: {
      margin: 0,
      marginBottom: "10px",
      color: "#2c3e50",
      fontSize: isMobile ? "14px" : "15px",
      lineHeight: 1.35,
    },

    option: {
      display: "flex",
      alignItems: "flex-start",
      gap: "10px",
      padding: isMobile ? "12px 10px" : "10px 10px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.08)",
      marginTop: "8px",
      cursor: "pointer",
      background: "#fff",
      lineHeight: 1.3,
      touchAction: "manipulation",
    },

    radio: {
      marginTop: "2px",
      transform: isMobile ? "scale(1.1)" : "scale(1)",
    },

    submitBtn: {
      padding: isMobile ? "14px 12px" : "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #27ae60, #2ecc71)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(46,204,113,0.25)",
      width: "100%",
      touchAction: "manipulation",
    },
  };

  // ---------------- Submitted Screen --------------------
  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>

            <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
              📝 {quizTitle}
            </h2>

            <h3 style={{ color: "#27ae60", textAlign: "center", margin: "10px 0 0" }}>
              🎉 Quiz Submitted Successfully!
            </h3>

            <p
              style={{
                textAlign: "center",
                marginTop: 10,
                color: "#2c3e50",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              Your Score: <span style={{ fontSize: 22 }}>{marks}</span> / {TOTAL_MARKS_DISPLAY}
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <div style={styles.badge}>⏱ Duration: {QUIZ_DURATION_MIN} Minutes</div>
              <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
              <div style={styles.badge}>📌 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>⚠️ Important Instructions</div>
            <ul style={styles.rules}>
              <li>
                This quiz is <b>{QUIZ_DURATION_MIN} minutes</b> long — the timer starts immediately
                after you click Start.
              </li>
              <li>
                Each question has <b>only one correct answer</b>.
              </li>
              <li>
                When time runs out, the quiz will be <b>auto-submitted</b>.
              </li>
              <li>
                The same Employee ID <b>cannot attempt</b> this quiz again.
              </li>
            </ul>
          </div>

          <div style={styles.card}>
            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Full Name"
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                value={userData.name}
                inputMode="text"
              />
              <input
                style={styles.input}
                placeholder="Employee ID"
                onChange={(e) => setUserData({ ...userData, empId: e.target.value })}
                value={userData.empId}
                inputMode="text"
              />
            </div>

            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Department"
                onChange={(e) => setUserData({ ...userData, department: e.target.value })}
                value={userData.department}
                inputMode="text"
              />
              <input
                style={styles.input}
                placeholder="Designation"
                onChange={(e) => setUserData({ ...userData, designation: e.target.value })}
                value={userData.designation}
                inputMode="text"
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

          <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
            📝 {quizTitle}
          </h2>

          <div style={styles.badgeRow}>
            <div style={styles.badgeBlue}>📄 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            <div style={styles.badge}>⏱ Duration: {QUIZ_DURATION_MIN} Minutes</div>
            <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
          </div>
        </div>

        {questions.map((q) => (
          <div key={q.id} style={styles.question}>
            <p style={styles.qTitle}>
              <b>
                {q.id}. {q.q_en}
              </b>
              {q.q_hi ? (
                <>
                  <br />
                  <span style={{ color: "#566573", fontWeight: 700 }}>{q.q_hi}</span>
                </>
              ) : null}
            </p>

            {q.options.map((opt) => (
              <label key={opt.key} style={styles.option}>
                <input
                  type="radio"
                  name={String(q.id)}
                  value={opt.key}
                  checked={answers[q.id] === opt.key}
                  onChange={() => handleChange(q.id, opt.key)}
                  style={styles.radio}
                />
                <span style={{ fontSize: isMobile ? "14px" : "15px" }}>
                  <b>{opt.key}.</b> {opt.en}
                  {opt.hi ? (
                    <>
                      <br />
                      <span style={{ color: "#566573", fontWeight: 700 }}>{opt.hi}</span>
                    </>
                  ) : null}
                </span>
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
