import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({
    name: "",
    employeeId: "",
    department: "",
    designation: "",
  });

  const quizTitle = "SMED Pre-Test / Post-Test";

  // ✅ QUIZ LIVE / CLOSE
  const QUIZ_OVER = false;

  // ✅ Total Timing 20 Minutes
  const TOTAL_DURATION_MIN = 20;
  const TOTAL_DURATION_SEC = TOTAL_DURATION_MIN * 60;

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SEC);

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isSubmittingRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Questions placeholder - aap questions doge to yaha replace kar denge

const questions = useMemo(
  () => [
    {
      id: 1,
      q_en:
        "Who developed the SMED (Single Minute Exchange of Die) system in the 1950s and 1960s?",
      options: [
        { key: "A", en: "Henry Ford" },
        { key: "B", en: "Taiichi Ohno" },
        { key: "C", en: "Shigeo Shingo" },
        { key: "D", en: "Eiji Toyoda" },
      ],
      answerKey: "C",
    },
    {
      id: 2,
      q_en: 'According to the SMED concept, what does "Single Minute" mean?',
      options: [
        { key: "A", en: "The setup takes exactly 60 seconds" },
        { key: "B", en: "The setup requires only one operator" },
        {
          key: "C",
          en: "All setups should take less than 10 minutes (a single-digit number of minutes)",
        },
        { key: "D", en: "It takes one minute to remove a bolt" },
      ],
      answerKey: "C",
    },
    {
      id: 3,
      q_en: 'What is the definition of an "Internal Setup" element?',
      options: [
        { key: "A", en: "Operations that must be performed by internal company staff" },
        {
          key: "B",
          en: "Operations that must be performed while the machine or process is stopped",
        },
        { key: "C", en: "Operations done inside the machine's control panel" },
        {
          key: "D",
          en: "Operations that can be performed while the machine is running",
        },
      ],
      answerKey: "B",
    },
    {
      id: 4,
      q_en: 'What is the definition of an "External Setup" element?',
      options: [
        { key: "A", en: "Operations that are performed by outside contractors" },
        { key: "B", en: "Operations that are performed outside the factory building" },
        {
          key: "C",
          en: "Operations that can be performed while the machine or process is running",
        },
        {
          key: "D",
          en: "Operations that must be performed while the machine is stopped",
        },
      ],
      answerKey: "C",
    },
    {
      id: 5,
      q_en: "How many formal stages are there in the SMED implementation process?",
      options: [
        { key: "A", en: "Two Stages" },
        { key: "B", en: "Three Stages" },
        { key: "C", en: "Four Stages" },
        { key: "D", en: "Five Stages" },
      ],
      answerKey: "B",
    },
    {
      id: 6,
      q_en: "What is Stage 1 of the SMED implementation process?",
      options: [
        { key: "A", en: "Convert internal setup to external setup" },
        { key: "B", en: "Streamline all aspects of the setup" },
        { key: "C", en: "Separate internal and external setup" },
        { key: "D", en: "Mechanize all setup functions" },
      ],
      answerKey: "C",
    },
    {
      id: 7,
      q_en:
        "Which of the following is a practical technique used in Stage 1 to separate internal and external setups?",
      options: [
        { key: "A", en: "Using Checklists and Function Checks" },
        { key: "B", en: "Using Parallel Operations" },
        { key: "C", en: "Using One-turn functional clamps" },
        { key: "D", en: "Using Mechanization" },
      ],
      answerKey: "A",
    },
    {
      id: 8,
      q_en: 'What is the purpose of performing a "Function Check" during external setup?',
      options: [
        { key: "A", en: "To test if the machine is running at full speed" },
        {
          key: "B",
          en: "To check if parts, dies, and tools are in perfect working order before the machine is stopped",
        },
        { key: "C", en: "To see if the operators understand their job" },
        { key: "D", en: "To test the quality of the final product" },
      ],
      answerKey: "B",
    },
    {
      id: 9,
      q_en: "What is Stage 2 of the SMED implementation process?",
      options: [
        { key: "A", en: "Streamline all setup operations" },
        { key: "B", en: "Separate internal and external setup" },
        { key: "C", en: "Mechanize manual functions" },
        { key: "D", en: "Convert internal setup to external setup" },
      ],
      answerKey: "D",
    },
    {
      id: 10,
      q_en:
        "Which of the following is a technique for converting internal setup to external setup (Stage 2)?",
      options: [
        { key: "A", en: "Moving heavy parts by remote control" },
        {
          key: "B",
          en: "Advance preparation of operating conditions (like pre-heating tools)",
        },
        { key: "C", en: "Eliminating adjustments with fixed stops" },
        { key: "D", en: "Doing a trial run" },
      ],
      answerKey: "B",
    },
    {
      id: 11,
      q_en: 'How do "Intermediary Jigs" help in Stage 2 of SMED?',
      options: [
        { key: "A", en: "They automatically clean the machine" },
        {
          key: "B",
          en: "They allow a new workpiece or die to be centered and attached to a jig plate externally, while the machine is running",
        },
        { key: "C", en: "They replace the need for an operator" },
        { key: "D", en: "They act as a safety barrier" },
      ],
      answerKey: "B",
    },
    {
      id: 12,
      q_en: "What is Stage 3 of the SMED implementation process?",
      options: [
        { key: "A", en: "Separate internal and external setup" },
        {
          key: "B",
          en: "Streamline all aspects of the setup operation (both internal and external)",
        },
        { key: "C", en: "Convert internal setup to external setup" },
        { key: "D", en: "Perform trial runs and adjustments" },
      ],
      answerKey: "B",
    },
    {
      id: 13,
      q_en:
        'When implementing "Parallel Operations" (dividing setup tasks between two people), what is the most important issue to consider?',
      options: [
        { key: "A", en: "Making sure both people get paid the same" },
        {
          key: "B",
          en: "Maintaining reliable and safe operations, often using safety signals",
        },
        { key: "C", en: "Ensuring both people use the exact same tools" },
        { key: "D", en: "Working in complete silence" },
      ],
      answerKey: "B",
    },
    {
      id: 14,
      q_en: 'In traditional setups, why are standard bolts considered "the enemy"?',
      options: [
        { key: "A", en: "They are too expensive to replace" },
        { key: "B", en: "They rust easily" },
        {
          key: "C",
          en: "Only the last turn actually tightens the bolt; the rest of the turns are a waste of time and energy",
        },
        { key: "D", en: "They cannot hold heavy weights" },
      ],
      answerKey: "C",
    },
    {
      id: 15,
      q_en: 'What is a "Functional Clamp" in the SMED system?',
      options: [
        {
          key: "A",
          en: "An attachment device that holds objects in place with minimal effort and can be tightened quickly",
        },
        { key: "B", en: "A traditional nut and bolt with 15 threads" },
        { key: "C", en: "A clamp used exclusively by maintenance teams" },
        { key: "D", en: "A heavy hydraulic press" },
      ],
      answerKey: "A",
    },
    {
      id: 16,
      q_en:
        'Which of the following is an example of a "One-Turn" functional clamping method?',
      options: [
        { key: "A", en: "Using a 3-inch threaded bolt" },
        { key: "B", en: "Welding the part permanently" },
        { key: "C", en: "The Pear-Shaped Hole method or U-Slot method" },
        { key: "D", en: "Using an electric screwdriver on standard nuts" },
      ],
      answerKey: "C",
    },
    {
      id: 17,
      q_en:
        'According to the documents, "Trial runs and adjustments" typically account for what percentage of traditional setup time?',
      options: [
        { key: "A", en: "5%" },
        { key: "B", en: "10%" },
        { key: "C", en: "Up to 50%" },
        { key: "D", en: "100%" },
      ],
      answerKey: "C",
    },
    {
      id: 18,
      q_en: 'How does SMED recommend we handle "Adjustments" during a changeover?',
      options: [
        { key: "A", en: "Assign a dedicated adjustment team" },
        {
          key: "B",
          en: "Eliminate the need for adjustments entirely by using fixed stops, positioning pins, and visual marks",
        },
        { key: "C", en: "Schedule an extra 30 minutes for trial runs" },
        { key: "D", en: "Only adjust the machine while it is running" },
      ],
      answerKey: "B",
    },
    {
      id: 19,
      q_en:
        'When should "Mechanization" (using motors, electric drives, etc.) be considered in the SMED process?',
      options: [
        { key: "A", en: "It should be the very first step" },
        { key: "B", en: "It should be used to replace checklists" },
        {
          key: "C",
          en: "Only for fine-tuning, after every attempt has been made to streamline setups using low-cost/no-cost techniques",
        },
        { key: "D", en: "It should never be used" },
      ],
      answerKey: "C",
    },
    {
      id: 20,
      q_en:
        "To sustain the improvements made through SMED, what must be done after creating the new changeover process?",
      options: [
        { key: "A", en: "Stop measuring setup times" },
        { key: "B", en: "Keep the old tools just in case" },
        {
          key: "C",
          en: "Document the new standard operating procedures (SOP) and maintain detailed checklists",
        },
        { key: "D", en: "Rely on the operators' memory" },
      ],
      answerKey: "C",
    },
  ],
  []
);

  const TOTAL_QUESTIONS_DISPLAY = questions.length;
  const TOTAL_MARKS_DISPLAY = questions.length;

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

  const handleChange = (id, val) => {
    setAnswers((prev) => ({ ...prev, [id]: val }));
  };

  // ✅ Timer
  useEffect(() => {
    if (!quizStarted || submitted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, submitted]);

  // ✅ Auto submit on time end
  useEffect(() => {
    if (!quizStarted || submitted) return;
    if (timeLeft === 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, quizStarted, submitted]);

  const handleStart = async () => {
    if (
      !userData.name.trim() ||
      !userData.employeeId.trim() ||
      !userData.department.trim() ||
      !userData.designation.trim()
    ) {
      alert("Please fill Name, Employee ID, Department, and Designation.");
      return;
    }

    isSubmittingRef.current = false;

    setLoading(true);
    setLoading(false);

    setQuizStarted(true);
    setSubmitted(false);
    setMarks(null);
    setAnswers({});
    setTimeLeft(TOTAL_DURATION_SEC);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (isSubmittingRef.current) return;
    isSubmittingRef.current = true;

    let score = 0;
    questions.forEach((q) => {
      if (answers[q.id] === q.answerKey) score++;
    });

    setMarks(score);
    setSubmitted(true);
    setQuizStarted(false);

    try {
      await addDoc(collection(db, "quizResults"), {
        name: userData.name,
        employeeId: userData.employeeId,
        department: userData.department,
        designation: userData.designation,
        quizTitle,
        answers,
        marks: score,
        totalMarks: TOTAL_MARKS_DISPLAY,
        totalQuestions: TOTAL_QUESTIONS_DISPLAY,
        durationMinutes: TOTAL_DURATION_MIN,
        questions,
        submittedAt: serverTimestamp(),
      });
    } catch (e) {
      console.error("Error saving quiz result:", e);
    }
  };

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
      paddingTop: quizStarted ? (isMobile ? "72px" : "78px") : undefined,
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
    noticeTitle: {
      fontSize: isMobile ? "13px" : "14px",
      fontWeight: 900,
      marginBottom: "6px",
    },
    rules: {
      margin: 0,
      paddingLeft: "18px",
      fontWeight: 600,
      fontSize: isMobile ? "12px" : "13px",
    },
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
      gridTemplateColumns: "1fr",
      gap: "12px",
    },
    input: {
      padding: "13px 12px",
      fontSize: isMobile ? "16px" : "15px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.12)",
      outline: "none",
      width: "100%",
      background: "#fcfcfd",
      boxSizing: "border-box",
    },
    helper: {
      fontSize: "12px",
      color: "#6c7a89",
      marginTop: "-6px",
      marginBottom: "2px",
      lineHeight: 1.4,
    },
    button: {
      padding: isMobile ? "14px 12px" : "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #c0392b, #e74c3c)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(231,76,60,0.25)",
      width: "100%",
      touchAction: "manipulation",
      opacity: loading ? 0.85 : 1,
    },
    timer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "linear-gradient(90deg, #fff0f0, #ffe3e3)",
      color: "#c0392b",
      padding: "10px",
      textAlign: "center",
      fontWeight: 900,
      zIndex: 1000,
      borderBottom: "1px solid rgba(192,57,43,0.18)",
      paddingTop: "calc(10px + env(safe-area-inset-top))",
    },
    timerLine: {
      fontSize: isMobile ? "13px" : "15px",
      lineHeight: 1.25,
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

  if (QUIZ_OVER) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>
            <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
              📝 {quizTitle}
            </h2>
            <h3
              style={{
                color: "#c0392b",
                textAlign: "center",
                margin: "12px 0 0",
                fontWeight: 900,
              }}
            >
              Quiz Closed
            </h3>
            <p
              style={{
                textAlign: "center",
                marginTop: 10,
                color: "#566573",
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              This quiz is currently unavailable. Please contact the administrator.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>

            <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
              📝 {quizTitle}
            </h2>

            <h3
              style={{
                color: "#27ae60",
                textAlign: "center",
                margin: "10px 0 0",
              }}
            >
              Submission Successful
            </h3>

            <div
              style={{
                marginTop: 16,
                padding: isMobile ? "12px" : "16px",
                borderRadius: "14px",
                background: "#ffffff",
                border: "1px solid rgba(0,0,0,0.08)",
                boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
              }}
            >
              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>
                <b>Name:</b> {userData.name}
              </p>
              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>
                <b>Employee ID:</b> {userData.employeeId}
              </p>
              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>
                <b>Department:</b> {userData.department}
              </p>
              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>
                <b>Designation:</b> {userData.designation}
              </p>
            </div>

            <p
              style={{
                textAlign: "center",
                marginTop: 16,
                color: "#2c3e50",
                fontWeight: 900,
                lineHeight: 1.4,
              }}
            >
              Score: <span style={{ fontSize: 24, color: "#27ae60" }}>{marks}</span> /{" "}
              {TOTAL_MARKS_DISPLAY}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>

            <h1 style={styles.header}>📝 {quizTitle}</h1>

            <div style={styles.subHeader}>
              Please enter your employee details accurately — your submission will be recorded.
            </div>

            <div style={styles.badgeRow}>
              <div style={styles.badge}>⏱ Total Duration: {TOTAL_DURATION_MIN} Minutes</div>
              <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
              <div style={styles.badge}>📌 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>Important Instructions</div>
            <ul style={styles.rules}>
              <li>
                Each question has only <b>one</b> correct answer.
              </li>
              <li>The quiz will be automatically submitted when time ends.</li>
              <li>Please do not refresh the page during the assessment.</li>
              <li>Ensure a stable internet connection for saving your submission.</li>
            </ul>
          </div>

          <div style={styles.card}>
            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Name"
                onChange={(e) =>
                  setUserData({ ...userData, name: e.target.value })
                }
                value={userData.name}
                inputMode="text"
              />

              <input
                style={styles.input}
                placeholder="Employee ID"
                onChange={(e) =>
                  setUserData({ ...userData, employeeId: e.target.value })
                }
                value={userData.employeeId}
                inputMode="text"
              />

              <input
                style={styles.input}
                placeholder="Department"
                onChange={(e) =>
                  setUserData({ ...userData, department: e.target.value })
                }
                value={userData.department}
                inputMode="text"
              />

              <input
                style={styles.input}
                placeholder="Designation"
                onChange={(e) =>
                  setUserData({ ...userData, designation: e.target.value })
                }
                value={userData.designation}
                inputMode="text"
              />
            </div>

            <div style={styles.helper}>
              Tip: Please enter correct employee details before starting the assessment.
            </div>

            <button style={styles.button} onClick={handleStart} disabled={loading}>
              {loading ? "Starting..." : "🚀 Start Assessment"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <div style={styles.timer}>
        <div style={styles.timerLine}>
          ⏳ Time Remaining: {formatTime(timeLeft)}
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.titleWrap}>
          <div style={styles.brand}>HERO STEELS LIMITED</div>

          <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
            📝 {quizTitle}
          </h2>

          <div style={styles.subHeader}>
            <b>Name:</b> {userData.name} &nbsp; | &nbsp;
            <b>Employee ID:</b> {userData.employeeId} &nbsp; | &nbsp;
            <b>Department:</b> {userData.department} &nbsp; | &nbsp;
            <b>Designation:</b> {userData.designation}
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.badgeBlue}>📄 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            <div style={styles.badge}>⏱ Total: {TOTAL_DURATION_MIN} Minutes</div>
            <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
          </div>
        </div>

        {questions.map((q) => (
          <div key={q.id} style={styles.question}>
            <p style={styles.qTitle}>
              <b>
                {q.id}. {q.q_en}
              </b>
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
                </span>
              </label>
            ))}
          </div>
        ))}

        <button style={styles.submitBtn} onClick={handleSubmit}>
          ✅ Submit Assessment
        </button>
      </div>
    </div>
  );
}