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

  // ✅ Updated Quiz Title
  const quizTitle = "Maintenance, Optimization and CRM Operations";

  // ✅ Duration: 20 Minutes
  const QUIZ_DURATION_MIN = 5;
  const QUIZ_DURATION_SEC = QUIZ_DURATION_MIN * 60;

  // ✅ Total Questions / Marks: 20
  const TOTAL_QUESTIONS_DISPLAY = 20;
  const TOTAL_MARKS_DISPLAY = 20;

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SEC);
  const [loading, setLoading] = useState(false);

  // ✅ Extra button after submission
  const [showReview, setShowReview] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  // ---------------- Detect Mobile --------------------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ 20 Questions (Hindi + English) using answerKey (A/B/C/D)
  const questions = useMemo(
    () => [
      {
        id: 1,
        q_en: "What is the first stage in the failure development process?",
        q_hi: "विफलता (Failure) के विकास की पहली अवस्था क्या होती है?",
        options: [
          { key: "A", en: "Wear", hi: "घिसावट" },
          { key: "B", en: "Breakdown", hi: "खराबी / ब्रेकडाउन" },
          { key: "C", en: "Overheating", hi: "अधिक गर्म होना" },
          { key: "D", en: "Normal operation", hi: "सामान्य संचालन" },
        ],
        answerKey: "D",
      },
      {
        id: 2,
        q_en: "Pickling surface stains usually occur due to:",
        q_hi: "पिक्लिंग में सतह पर दाग आमतौर पर किस कारण से होते हैं?",
        options: [
          { key: "A", en: "Operator mistake", hi: "ऑपरेटर की गलती" },
          { key: "B", en: "Sensor fault", hi: "सेंसर की खराबी" },
          { key: "C", en: "Improper acid circulation", hi: "एसिड का सही प्रवाह न होना" },
          { key: "D", en: "Motor failure", hi: "मोटर की खराबी" },
        ],
        answerKey: "C",
      },
      {
        id: 3,
        q_en: "Drive trips mostly indicate:",
        q_hi: "ड्राइव ट्रिप होने का सामान्य संकेत क्या होता है?",
        options: [
          { key: "A", en: "Software bug", hi: "सॉफ्टवेयर त्रुटि" },
          { key: "B", en: "Cable problem", hi: "केबल की समस्या" },
          { key: "C", en: "Mechanical overload", hi: "यांत्रिक ओवरलोड" },
          { key: "D", en: "PLC error", hi: "PLC त्रुटि" },
        ],
        answerKey: "C",
      },
      {
        id: 4,
        q_en: "Which maintenance type follows calendar or running hours?",
        q_hi: "कौन-सा मेंटेनेंस कैलेंडर या रनिंग आवर्स के अनुसार किया जाता है?",
        options: [
          { key: "A", en: "Predictive", hi: "प्रिडिक्टिव" },
          { key: "B", en: "Preventive", hi: "प्रिवेंटिव" },
          { key: "C", en: "Proactive", hi: "प्रोएक्टिव" },
          { key: "D", en: "Breakdown", hi: "ब्रेकडाउन" },
        ],
        answerKey: "B",
      },
      {
        id: 5,
        q_en: "Predictive maintenance mainly depends on:",
        q_hi: "प्रिडिक्टिव मेंटेनेंस मुख्य रूप से किस पर आधारित होता है?",
        options: [
          { key: "A", en: "Technician experience", hi: "तकनीशियन का अनुभव" },
          { key: "B", en: "OEM manuals", hi: "OEM मैनुअल" },
          { key: "C", en: "Machine condition data", hi: "मशीन की स्थिति का डेटा" },
          { key: "D", en: "Production plan", hi: "उत्पादन योजना" },
        ],
        answerKey: "C",
      },
      {
        id: 6,
        q_en: "“Machines whisper before they scream” means:",
        q_hi: "“मशीनें खराब होने से पहले संकेत देती हैं” का क्या अर्थ है?",
        options: [
          { key: "A", en: "Noise increases suddenly", hi: "अचानक शोर बढ़ जाता है" },
          { key: "B", en: "Failure happens without warning", hi: "बिना चेतावनी के खराबी होती है" },
          { key: "C", en: "Early symptoms appear before failure", hi: "खराबी से पहले शुरुआती लक्षण दिखाई देते हैं" },
          { key: "D", en: "Only sensors detect problems", hi: "केवल सेंसर ही समस्या पहचानते हैं" },
        ],
        answerKey: "C",
      },
      {
        id: 7,
        q_en: "Which KPI shows equipment reliability?",
        q_hi: "कौन-सा KPI मशीन की विश्वसनीयता दिखाता है?",
        options: [
          { key: "A", en: "MTTR", hi: "MTTR" },
          { key: "B", en: "Scrap rate", hi: "स्क्रैप रेट" },
          { key: "C", en: "OEE", hi: "OEE" },
          { key: "D", en: "MTBF", hi: "MTBF" },
        ],
        answerKey: "D",
      },
      {
        id: 8,
        q_en: "Which maintenance type eliminates root causes?",
        q_hi: "कौन-सा मेंटेनेंस मूल कारणों को खत्म करता है?",
        options: [
          { key: "A", en: "Preventive", hi: "प्रिवेंटिव" },
          { key: "B", en: "Breakdown", hi: "ब्रेकडाउन" },
          { key: "C", en: "Proactive", hi: "प्रोएक्टिव" },
          { key: "D", en: "Predictive", hi: "प्रिडिक्टिव" },
        ],
        answerKey: "C",
      },
      {
        id: 9,
        q_en: "Which maintenance cost is highest?",
        q_hi: "कौन-सा मेंटेनेंस खर्च सबसे ज्यादा होता है?",
        options: [
          { key: "A", en: "Inspection cost", hi: "निरीक्षण खर्च" },
          { key: "B", en: "Planned maintenance cost", hi: "नियोजित मेंटेनेंस खर्च" },
          { key: "C", en: "Emergency breakdown cost", hi: "आपातकालीन ब्रेकडाउन खर्च" },
          { key: "D", en: "Lubrication cost", hi: "लुब्रिकेशन खर्च" },
        ],
        answerKey: "C",
      },
      {
        id: 10,
        q_en: "What happens when early symptoms are ignored?",
        q_hi: "शुरुआती लक्षणों को नजरअंदाज करने पर क्या होता है?",
        options: [
          { key: "A", en: "Machine improves", hi: "मशीन बेहतर हो जाती है" },
          { key: "B", en: "Condition worsens", hi: "स्थिति और खराब हो जाती है" },
          { key: "C", en: "Cost reduces", hi: "खर्च कम हो जाता है" },
          { key: "D", en: "No impact", hi: "कोई प्रभाव नहीं" },
        ],
        answerKey: "B",
      },
      {
        id: 11,
        q_en: "Which KPI shows repair speed?",
        q_hi: "कौन-सा KPI मरम्मत की गति (Repair Speed) दिखाता है?",
        options: [
          { key: "A", en: "MTBF", hi: "MTBF" },
          { key: "B", en: "Scrap", hi: "स्क्रैप" },
          { key: "C", en: "MTTR", hi: "MTTR" },
          { key: "D", en: "OEE", hi: "OEE" },
        ],
        answerKey: "C",
      },
      {
        id: 12,
        q_en: "Digital maintenance reduces:",
        q_hi: "डिजिटल मेंटेनेंस क्या कम करता है?",
        options: [
          { key: "A", en: "Sensors", hi: "सेंसर" },
          { key: "B", en: "Data", hi: "डेटा" },
          { key: "C", en: "Emergency breakdowns", hi: "आपातकालीन ब्रेकडाउन" },
          { key: "D", en: "Training", hi: "प्रशिक्षण" },
        ],
        answerKey: "C",
      },
      {
        id: 13,
        q_en: "Which tool identifies top downtime causes?",
        q_hi: "सबसे ज्यादा डाउनटाइम के कारण पहचानने के लिए कौन-सा टूल उपयोग होता है?",
        options: [
          { key: "A", en: "Control chart", hi: "कंट्रोल चार्ट" },
          { key: "B", en: "Pareto analysis", hi: "पारेतो विश्लेषण" },
          { key: "C", en: "Histogram", hi: "हिस्टोग्राम" },
          { key: "D", en: "Scatter diagram", hi: "स्कैटर डायग्राम" },
        ],
        answerKey: "B",
      },
      {
        id: 14,
        q_en: "Roll misalignment mainly causes:",
        q_hi: "रोल मिसअलाइनमेंट मुख्य रूप से किस समस्या का कारण बनता है?",
        options: [
          { key: "A", en: "Oil leakage", hi: "तेल का रिसाव" },
          { key: "B", en: "Sensor failure", hi: "सेंसर खराबी" },
          { key: "C", en: "Shape deviation", hi: "आकार में विचलन" },
          { key: "D", en: "Motor overheating", hi: "मोटर का अधिक गर्म होना" },
        ],
        answerKey: "C",
      },
      {
        id: 15,
        q_en: "Which symptom indicates bearing deterioration?",
        q_hi: "कौन-सा लक्षण बेयरिंग की खराबी दर्शाता है?",
        options: [
          { key: "A", en: "Smoke", hi: "धुआं" },
          { key: "B", en: "Vibration", hi: "वाइब्रेशन" },
          { key: "C", en: "Light flicker", hi: "लाइट का झपकना" },
          { key: "D", en: "Color change", hi: "रंग बदलना" },
        ],
        answerKey: "B",
      },
      {
        id: 16,
        q_en: "Which method finds root cause?",
        q_hi: "कौन-सी विधि मूल कारण (Root Cause) ढूंढती है?",
        options: [
          { key: "A", en: "Reset alarm", hi: "अलार्म रीसेट करना" },
          { key: "B", en: "Replace part", hi: "पार्ट बदलना" },
          { key: "C", en: "5-Why analysis", hi: "5-व्हाई विश्लेषण" },
          { key: "D", en: "Bypass logic", hi: "लॉजिक बायपास करना" },
        ],
        answerKey: "C",
      },
      {
        id: 17,
        q_en: "Fault isolation means:",
        q_hi: "फॉल्ट आइसोलेशन का अर्थ क्या है?",
        options: [
          { key: "A", en: "Trial and error", hi: "ट्रायल एंड एरर" },
          { key: "B", en: "Random replacement", hi: "बिना सोचे पार्ट बदलना" },
          { key: "C", en: "Logical step-by-step checking", hi: "तर्कसंगत क्रमवार जांच" },
          { key: "D", en: "Guessing", hi: "अनुमान लगाना" },
        ],
        answerKey: "C",
      },
      {
        id: 18,
        q_en: "Critical spare means:",
        q_hi: "क्रिटिकल स्पेयर का क्या अर्थ है?",
        options: [
          { key: "A", en: "Long lead time & high impact spare", hi: "लंबा लीड टाइम और ज्यादा प्रभाव वाला स्पेयर" },
          { key: "B", en: "High usage spare", hi: "ज्यादा उपयोग होने वाला स्पेयर" },
          { key: "C", en: "Cheap spare", hi: "सस्ता स्पेयर" },
          { key: "D", en: "Local spare", hi: "स्थानीय स्पेयर" },
        ],
        answerKey: "A",
      },
      {
        id: 19,
        q_en: "ABC analysis is based on:",
        q_hi: "ABC विश्लेषण किस आधार पर किया जाता है?",
        options: [
          { key: "A", en: "Lead time", hi: "लीड टाइम" },
          { key: "B", en: "Consumption", hi: "खपत" },
          { key: "C", en: "Cost value", hi: "लागत मूल्य" },
          { key: "D", en: "Vendor rating", hi: "वेंडर रेटिंग" },
        ],
        answerKey: "C",
      },
      {
        id: 20,
        q_en: "First step in excellence roadmap:",
        q_hi: "एक्सीलेंस रोडमैप का पहला चरण क्या है?",
        options: [
          { key: "A", en: "Stabilize", hi: "स्थिर करना" },
          { key: "B", en: "Optimize", hi: "अनुकूलन करना" },
          { key: "C", en: "Digitize", hi: "डिजिटल बनाना" },
          { key: "D", en: "Automate", hi: "स्वचालन करना" },
        ],
        answerKey: "A",
      },
    ],
    []
  );

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

    reviewBtn: {
      padding: isMobile ? "14px 12px" : "12px",
      fontSize: "16px",
      border: "none",
      borderRadius: "12px",
      background: "linear-gradient(135deg, #1f6fb2, #3498db)",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 900,
      boxShadow: "0 10px 18px rgba(52,152,219,0.25)",
      width: "100%",
      touchAction: "manipulation",
      marginTop: "10px",
    },
  };

  // helper to get option label
  const getOptionText = (q, key) => {
    const opt = q.options.find((o) => o.key === key);
    if (!opt) return "";
    return `${opt.key}. ${opt.en} / ${opt.hi}`;
  };

  // ---------------- Submitted Screen --------------------
  if (submitted) {
    return (
      <div style={styles.page}>
        <div style={styles.container}>
          <div style={styles.titleWrap}>
            <div style={styles.brand}>HERO STEELS LIMITED</div>

            {/* ✅ Title below HERO STEELS LIMITED */}
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

            

            {showReview && (
              <div style={{ marginTop: 14 }}>
                {questions.map((q) => {
                  const yourKey = answers[q.id];
                  const isCorrect = yourKey === q.answerKey;

                  return (
                    <div key={q.id} style={styles.question}>
                      <p style={styles.qTitle}>
                        <b>
                          {q.id}. {q.q_en}
                        </b>
                        <br />
                        <span style={{ color: "#566573", fontWeight: 700 }}>{q.q_hi}</span>
                      </p>

                      <p style={{ margin: "8px 0 0" }}>
                        <b>Status:</b> {isCorrect ? "✅ Correct" : "❌ Wrong"}
                      </p>

                      <p style={{ margin: "6px 0 0" }}>
                        <b>Your Answer:</b>{" "}
                        {yourKey ? getOptionText(q, yourKey) : "Not Attempted"}
                      </p>

                      <p style={{ margin: "6px 0 0" }}>
                        <b>Correct Answer:</b> {getOptionText(q, q.answerKey)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
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
                This quiz is <b>{QUIZ_DURATION_MIN} minutes</b> long — the timer starts immediately after you click Start.
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

          {/* ✅ Title below HERO STEELS LIMITED */}
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
              <br />
              <span style={{ color: "#566573", fontWeight: 700 }}>{q.q_hi}</span>
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
                  <br />
                  <span style={{ color: "#566573", fontWeight: 700 }}>{opt.hi}</span>
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
