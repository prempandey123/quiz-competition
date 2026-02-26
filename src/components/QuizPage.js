import { useState, useEffect, useMemo, useRef } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {
  const [userData, setUserData] = useState({
    name: "",
    college: "",
    branch: "",
  });

  // ✅ Quiz Title
  const quizTitle = "PCM Quiz (Physics + Chemistry + Mathematics)";

  // ✅ QUIZ LIVE
  const QUIZ_OVER = false;

  // ✅ Total Timing 1 Hour
  const TOTAL_DURATION_MIN = 60;
  const TOTAL_DURATION_SEC = TOTAL_DURATION_MIN * 60;

  const [quizStarted, setQuizStarted] = useState(false);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [marks, setMarks] = useState(null);

  // ✅ Overall + Section timers
  const [overallTimeLeft, setOverallTimeLeft] = useState(TOTAL_DURATION_SEC);
  const [sectionTimeLeft, setSectionTimeLeft] = useState(0);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);

  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const isSubmittingRef = useRef(false);

  // ---------------- Detect Mobile --------------------
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // ✅ Questions
  const questions = useMemo(
    () => [
      // ---------------- PHYSICS (1-10) ----------------
      {
        id: 1,
        q_en:
          "PHYSICS 1) Two identical metallic spheres carry charges +q and +9q. They are connected by a thin wire and then separated again. The ratio of initial to final electrostatic potential energy is:",
        options: [
          { key: "A", en: "1:1" },
          { key: "B", en: "5:9" },
          { key: "C", en: "9:5" },
          { key: "D", en: "9:25" },
        ],
        answerKey: "D",
      },
      {
        id: 2,
        q_en:
          "PHYSICS 2) A capacitor is connected to a battery and fully charged. The battery is removed and a dielectric slab completely fills the space. Which quantity remains constant?",
        options: [
          { key: "A", en: "Potential difference" },
          { key: "B", en: "Capacitance" },
          { key: "C", en: "Electric field" },
          { key: "D", en: "Charge" },
        ],
        answerKey: "D",
      },
      {
        id: 3,
        q_en:
          "PHYSICS 3) A long straight wire carries current I. Magnetic field at distance r is B. If current becomes 3I and distance becomes 3r, new magnetic field is:",
        options: [
          { key: "A", en: "B" },
          { key: "B", en: "3B" },
          { key: "C", en: "B/3" },
          { key: "D", en: "9B" },
        ],
        answerKey: "A",
      },
      {
        id: 4,
        q_en:
          "PHYSICS 4) An electron enters perpendicular to a uniform magnetic field. If its speed is doubled, radius of circular path becomes:",
        options: [
          { key: "A", en: "Same" },
          { key: "B", en: "Half" },
          { key: "C", en: "Double" },
          { key: "D", en: "Four times" },
        ],
        answerKey: "C",
      },
      {
        id: 5,
        q_en:
          "PHYSICS 5) In Young’s double slit experiment, if wavelength is halved and slit separation doubled, fringe width becomes:",
        options: [
          { key: "A", en: "Same" },
          { key: "B", en: "Half" },
          { key: "C", en: "One-fourth" },
          { key: "D", en: "Double" },
        ],
        answerKey: "C",
      },
      {
        id: 6,
        q_en:
          "PHYSICS 6) In a series LCR circuit at resonance, which statement is correct?",
        options: [
          { key: "A", en: "Current minimum" },
          { key: "B", en: "Impedance maximum" },
          { key: "C", en: "Power factor zero" },
          { key: "D", en: "Voltage across L and C equal in magnitude" },
        ],
        answerKey: "D",
      },
      {
        id: 7,
        q_en:
          "PHYSICS 7) The stopping potential in photoelectric effect depends on:",
        options: [
          { key: "A", en: "Intensity" },
          { key: "B", en: "Frequency" },
          { key: "C", en: "Work function only" },
          { key: "D", en: "Number of electrons" },
        ],
        answerKey: "B",
      },
      {
        id: 8,
        q_en:
          "PHYSICS 8) Match the Following: List I List II A. Gauss Law 1.opposes change B. Lenz Law 2. Electric flux relation C. Ampere Law 3. Particle nature D. Photoelectric effect 4. Magnetic field due to current Options:",
        options: [
          { key: "A", en: "A-1, B-2, C-3, D-4" },
          { key: "B", en: "A-2, B-1, C-4, D-3" },
          { key: "C", en: "A-3, B-4, C-1, D-2" },
          { key: "D", en: "A-4, B-3, C-2, D-1" },
        ],
        answerKey: "B",
      },
      {
        id: 9,
        q_en:
          "PHYSICS 9) A convex lens forms image at same distance as object but inverted. Magnification is:",
        options: [
          { key: "A", en: "+1" },
          { key: "B", en: "−1" },
          { key: "C", en: "+2" },
          { key: "D", en: "−2" },
        ],
        answerKey: "B",
      },
      {
        id: 10,
        q_en:
          "PHYSICS 10) Match the Following: List I List II A. Binding energy 1. Voltage regulation B. Half life 2. Rectification C. Zener diode 3. Mass defect D. p-n junction 4. Radioactive decay Options:",
        options: [
          { key: "A", en: "A-1, B-2, C-3, D-4" },
          { key: "B", en: "A-2, B-1, C-4, D-3" },
          { key: "C", en: "A-3, B-4, C-1, D-2" },
          { key: "D", en: "A-4, B-3, C-2, D-1" },
        ],
        answerKey: "C",
      },

      // ---------------- CHEMISTRY (11-20) ----------------
      {
        id: 11,
        q_en:
          "CHEMISTRY 1) Rate law: r = k[A]²[B]. If [A] doubled and [B] halved, rate becomes:",
        options: [
          { key: "A", en: "Same" },
          { key: "B", en: "Double" },
          { key: "C", en: "Half" },
          { key: "D", en: "Four times" },
        ],
        answerKey: "B",
      },
      {
        id: 12,
        q_en: "CHEMISTRY 2) For a spontaneous reaction at all temperatures:",
        options: [
          { key: "A", en: "ΔH < 0 and ΔS > 0" },
          { key: "B", en: "ΔH > 0 and ΔS > 0" },
          { key: "C", en: "ΔH < 0 and ΔS < 0" },
          { key: "D", en: "ΔH > 0 and ΔS < 0" },
        ],
        answerKey: "A",
      },
      {
        id: 13,
        q_en:
          "CHEMISTRY 3) In electrochemical cell, if reaction quotient Q < K, EMF is:",
        options: [
          { key: "A", en: "Zero" },
          { key: "B", en: "Negative" },
          { key: "C", en: "Positive" },
          { key: "D", en: "Infinite" },
        ],
        answerKey: "C",
      },
      {
        id: 14,
        q_en: "CHEMISTRY 4) Van’t Hoff factor greater than 1 indicates:",
        options: [
          { key: "A", en: "Association" },
          { key: "B", en: "Dissociation" },
          { key: "C", en: "Non-electrolyte" },
          { key: "D", en: "Weak acid" },
        ],
        answerKey: "B",
      },
      {
        id: 15,
        q_en: "CHEMISTRY 5) Order of boiling point: H2O, NH3, HF",
        options: [
          { key: "A", en: "HF > H2O > NH3" },
          { key: "B", en: "H2O > HF > NH3" },
          { key: "C", en: "NH3 > HF > H2O" },
          { key: "D", en: "HF > NH3 > H2O" },
        ],
        answerKey: "B",
      },
      {
        id: 16,
        q_en: "CHEMISTRY 6) In SN1 reaction, rate determining step involves:",
        options: [
          { key: "A", en: "Nucleophile attack" },
          { key: "B", en: "Carbocation formation" },
          { key: "C", en: "Bond rotation" },
          { key: "D", en: "Proton transfer" },
        ],
        answerKey: "B",
      },
      {
        id: 17,
        q_en: "CHEMISTRY 7) pH of 0.001 M HCl:",
        options: [
          { key: "A", en: "1" },
          { key: "B", en: "2" },
          { key: "C", en: "3" },
          { key: "D", en: "4" },
        ],
        answerKey: "C",
      },
      {
        id: 18,
        q_en: "CHEMISTRY 8) Which has highest crystal field splitting?",
        options: [
          { key: "A", en: "d⁰" },
          { key: "B", en: "d³" },
          { key: "C", en: "d⁵ high spin" },
          { key: "D", en: "d¹⁰" },
        ],
        answerKey: "B",
      },
      {
        id: 19,
        q_en:
          "CHEMISTRY 9) If concentration decreases, half life of first order reaction:",
        options: [
          { key: "A", en: "Increases" },
          { key: "B", en: "Decreases" },
          { key: "C", en: "Same" },
          { key: "D", en: "Doubles" },
        ],
        answerKey: "C",
      },
      {
        id: 20,
        q_en:
          "CHEMISTRY 10) Match the Following: List I List II A. Buffer 1. Surface effect B. Catalyst 2. Liquid in liquid C. Emulsion 3. Resists pH D. Adsorption 4. Lowers Ea Options:",
        options: [
          { key: "A", en: "A-1, B-2, C-3, D-4" },
          { key: "B", en: "A-2, B-1, C-4, D-3" },
          { key: "C", en: "A-3, B-4, C-2, D-1" },
          { key: "D", en: "A-4, B-3, C-1, D-2" },
        ],
        answerKey: "C",
      },

      // ---------------- MATHEMATICS (21-30) ----------------
      {
        id: 21,
        q_en: "MATHEMATICS 1) If |A| = 3 for 2×2 matrix, then |A⁻¹| =",
        options: [
          { key: "A", en: "3" },
          { key: "B", en: "1/3" },
          { key: "C", en: "−3" },
          { key: "D", en: "0" },
        ],
        answerKey: "B",
      },
      {
        id: 22,
        q_en:
          "MATHEMATICS 2) If f(x) = x³ − 3x² + 2, number of local maxima:",
        options: [
          { key: "A", en: "0" },
          { key: "B", en: "1" },
          { key: "C", en: "2" },
          { key: "D", en: "3" },
        ],
        answerKey: "B",
      },
      {
        id: 23,
        q_en:
          "MATHEMATICS 3) If two events are independent and P(A)=0.5, P(B)=0.4, then P(A∩B)=",
        options: [
          { key: "A", en: "0.9" },
          { key: "B", en: "0.2" },
          { key: "C", en: "0.1" },
          { key: "D", en: "0.5" },
        ],
        answerKey: "B",
      },
      {
        id: 24,
        q_en: "MATHEMATICS 4) Slope of normal to curve y = x² at x = 1:",
        options: [
          { key: "A", en: "−1/2" },
          { key: "B", en: "−1" },
          { key: "C", en: "−2" },
          { key: "D", en: "−4" },
        ],
        answerKey: "A",
      },
      {
        id: 25,
        q_en:
          "MATHEMATICS 5) If determinant of coefficient matrix is zero, system may have:",
        options: [
          { key: "A", en: "Unique solution" },
          { key: "B", en: "No solution" },
          { key: "C", en: "Infinite solution" },
          { key: "D", en: "B or C" },
        ],
        answerKey: "D",
      },
      {
        id: 26,
        q_en: "MATHEMATICS 6) Unit vector in direction of 2i − 2j:",
        options: [
          { key: "A", en: "(i − j)" },
          { key: "B", en: "(i − j)/√2" },
          { key: "C", en: "(2i −2j)/2" },
          { key: "D", en: "(2i −2j)/√8" },
        ],
        answerKey: "B",
      },
      {
        id: 27,
        q_en:
          "MATHEMATICS 7) Maximize Z = 3x + 2y subject to x + y ≤ 4, x ≥ 0, y ≥ 0. Maximum value is:",
        options: [
          { key: "A", en: "8" },
          { key: "B", en: "10" },
          { key: "C", en: "12" },
          { key: "D", en: "6" },
        ],
        answerKey: "C",
      },
      {
        id: 28,
        q_en: "MATHEMATICS 8) ∫ e^x sin x dx involves:",
        options: [
          { key: "A", en: "Substitution" },
          { key: "B", en: "By parts twice" },
          { key: "C", en: "Partial fraction" },
          { key: "D", en: "Direct formula" },
        ],
        answerKey: "B",
      },
      {
        id: 29,
        q_en: "MATHEMATICS 9) Maximum value of sin x + cos x:",
        options: [
          { key: "A", en: "1" },
          { key: "B", en: "√2" },
          { key: "C", en: "2" },
          { key: "D", en: "0" },
        ],
        answerKey: "B",
      },
      {
        id: 30,
        q_en:
          "MATHEMATICS 10) Match the Following: List I List II A. Bayes theorem 1. Conditional probability B. Lagrange MVT 2. Mean slope C. Inverse matrix 3. Identity relation D. Linear programming 4. Optimization Options:",
        options: [
          { key: "A", en: "A-1, B-2, C-3, D-4" },
          { key: "B", en: "A-2, B-1, C-4, D-3" },
          { key: "C", en: "A-3, B-4, C-2, D-1" },
          { key: "D", en: "A-4, B-3, C-1, D-2" },
        ],
        answerKey: "A",
      },
    ],
    []
  );

  // ✅ Section-wise config (1 hour total)
  const sections = useMemo(
    () => [
      { key: "PHYSICS", title: "Physics", fromId: 1, toId: 10, durationMin: 20 },
      { key: "CHEMISTRY", title: "Chemistry", fromId: 11, toId: 20, durationMin: 20 },
      { key: "MATHS", title: "Mathematics", fromId: 21, toId: 30, durationMin: 20 },
    ],
    []
  );

  const TOTAL_QUESTIONS_DISPLAY = questions.length;
  const TOTAL_MARKS_DISPLAY = questions.length;

  const currentSection = sections[currentSectionIndex];
  const sectionQuestions = useMemo(() => {
    if (!currentSection) return [];
    return questions.filter((q) => q.id >= currentSection.fromId && q.id <= currentSection.toId);
  }, [questions, currentSection]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(sec % 60).padStart(2, "0")}`;

  const handleChange = (id, val) => setAnswers({ ...answers, [id]: val });

  // ---------------- Timers --------------------
  useEffect(() => {
    if (!quizStarted || submitted) return;

    const timer = setInterval(() => {
      setOverallTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setSectionTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [quizStarted, submitted]);

  // ✅ Auto submit on overall time end
  useEffect(() => {
    if (!quizStarted || submitted) return;
    if (overallTimeLeft === 0) {
      handleSubmit();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallTimeLeft, quizStarted, submitted]);

  // ✅ Auto move to next section on section time end
  useEffect(() => {
    if (!quizStarted || submitted) return;
    if (sectionTimeLeft === 0 && overallTimeLeft > 0) {
      // move next section, if available
      if (currentSectionIndex < sections.length - 1) {
        const nextIndex = currentSectionIndex + 1;
        setCurrentSectionIndex(nextIndex);
        setSectionTimeLeft(sections[nextIndex].durationMin * 60);
        // scroll to top
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        // last section ended -> submit
        handleSubmit();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTimeLeft, quizStarted, submitted, currentSectionIndex, overallTimeLeft]);

  // ---------------- Start Quiz --------------------
  const handleStart = async () => {
    if (!userData.name || !userData.college || !userData.branch) {
      alert("⚠️ Please fill Name, College Name, and Branch!");
      return;
    }

    setLoading(true);
    setLoading(false);

    setQuizStarted(true);
    setSubmitted(false);
    setMarks(null);
    setAnswers({});

    setOverallTimeLeft(TOTAL_DURATION_SEC);
    setCurrentSectionIndex(0);
    setSectionTimeLeft(sections[0].durationMin * 60);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ---------------- Submit (LOGIC UNCHANGED) --------------------
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

    await addDoc(collection(db, "quizResults"), {
      name: userData.name,
      college: userData.college,
      branch: userData.branch,
      quizTitle,
      answers,
      marks: score,
      questions, // same as your original (snapshot)
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
      paddingTop: quizStarted ? (isMobile ? "94px" : "104px") : undefined,
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
      opacity: loading ? 0.85 : 1,
    },
    timer: {
      position: "fixed",
      top: 0,
      left: 0,
      width: "100%",
      background: "linear-gradient(90deg, #fff0f0, #ffe3e3)",
      color: "#c0392b",
      padding: "10px 10px",
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
    nextBtn: {
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
    answerBox: {
      marginTop: "10px",
      padding: "10px 12px",
      borderRadius: "12px",
      border: "1px solid rgba(0,0,0,0.08)",
      background: "linear-gradient(135deg, #f7fbff, #ffffff)",
      color: "#2c3e50",
      fontWeight: 700,
      fontSize: isMobile ? "12px" : "13px",
      lineHeight: 1.45,
    },
  };

  // ✅ QUIZ OVER SCREEN
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
              ✅ Quiz is Over
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
              This quiz is currently closed. Please contact HR/Admin.
            </p>
          </div>
        </div>
      </div>
    );
  }

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
              <b>Student:</b> {userData.name} &nbsp; | &nbsp; <b>College:</b>{" "}
              {userData.college} &nbsp; | &nbsp; <b>Branch:</b> {userData.branch}
            </p>

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

          {/* ✅ Answers (section-wise) */}
          {sections.map((sec) => (
            <div key={sec.key} style={styles.titleWrap}>
              <h3 style={{ margin: 0, color: "#2c3e50" }}>
                ✅ Answer Key — {sec.title}
              </h3>

              {questions
                .filter((q) => q.id >= sec.fromId && q.id <= sec.toId)
                .map((q) => {
                  const correctOpt = q.options.find((o) => o.key === q.answerKey);
                  const userOpt = q.options.find((o) => o.key === answers[q.id]);
                  const isCorrect = answers[q.id] === q.answerKey;

                  return (
                    <div key={q.id} style={styles.question}>
                      <p style={styles.qTitle}>
                        <b>
                          {q.id}. {q.q_en}
                        </b>
                      </p>

                      <div style={styles.answerBox}>
                        <div>
                          <b>Correct:</b> {q.answerKey}
                          {correctOpt ? ` — ${correctOpt.en}` : ""}
                        </div>
                        <div style={{ marginTop: 4 }}>
                          <b>Your Answer:</b> {answers[q.id] ? answers[q.id] : "Not Attempted"}
                          {userOpt ? ` — ${userOpt.en}` : ""}
                        </div>
                        <div style={{ marginTop: 6, color: isCorrect ? "#27ae60" : "#c0392b" }}>
                          {isCorrect ? "✔ Correct" : "✘ Wrong"}
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ))}
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
              Quiz start karne se pehle details fill karna mandatory hai — submission record hogi.
            </div>

            <div style={styles.badgeRow}>
              <div style={styles.badge}>⏱ Total Duration: {TOTAL_DURATION_MIN} Minutes</div>
              <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
              <div style={styles.badge}>📌 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>📚 Section & Timing Details</div>
            <ul style={styles.rules}>
              {sections.map((s) => (
                <li key={s.key}>
                  <b>{s.title}</b> — {s.durationMin} minutes ({s.fromId} to {s.toId})
                </li>
              ))}
              <li>
                Overall timer <b>{TOTAL_DURATION_MIN} minutes</b> ka hoga (auto submit at end).
              </li>
              <li>
                Section timer khatam hote hi next section start ho jayega (auto move).
              </li>
            </ul>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>⚠️ Important Instructions</div>
            <ul style={styles.rules}>
              <li>
                Total quiz <b>{TOTAL_DURATION_MIN} minutes</b> long hai — Start click karte hi timer start.
              </li>
              <li>Each question ka <b>only one correct answer</b>.</li>
              <li>Overall time end par quiz <b>auto-submitted</b>.</li>
            </ul>
          </div>

          <div style={styles.card}>
            <div style={styles.row2}>
              <input
                style={styles.input}
                placeholder="Student Name"
                onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                value={userData.name}
                inputMode="text"
              />
              <input
                style={styles.input}
                placeholder="College Name"
                onChange={(e) => setUserData({ ...userData, college: e.target.value })}
                value={userData.college}
                inputMode="text"
              />
              <input
                style={styles.input}
                placeholder="Branch (e.g. CSE / ME / ECE)"
                onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                value={userData.branch}
                inputMode="text"
              />
            </div>

            <div style={styles.helper}>
              Tip: Full details sahi fill karo — ye Firestore me save hogi.
            </div>

            <button style={styles.button} onClick={handleStart} disabled={loading}>
              {loading ? "Starting..." : "🚀 Start Quiz"}
            </button>
          </div>
        </div>
      </div>
    );

  // ---------------- Quiz Screen --------------------
  const goNextSection = () => {
    if (currentSectionIndex < sections.length - 1) {
      const nextIndex = currentSectionIndex + 1;
      setCurrentSectionIndex(nextIndex);
      setSectionTimeLeft(sections[nextIndex].durationMin * 60);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const isLastSection = currentSectionIndex === sections.length - 1;

  return (
    <div style={styles.page}>
      <div style={styles.timer}>
        <div style={styles.timerLine}>
          ⏳ Overall Time Left: {formatTime(overallTimeLeft)}
        </div>
        <div style={styles.timerLine}>
          📘 Section ({currentSection?.title}) Time Left: {formatTime(sectionTimeLeft)}
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.titleWrap}>
          <div style={styles.brand}>HERO STEELS LIMITED</div>

          <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>
            📝 {quizTitle}
          </h2>

          <div style={styles.subHeader}>
            <b>Student:</b> {userData.name} &nbsp; | &nbsp; <b>College:</b> {userData.college} &nbsp; | &nbsp;{" "}
            <b>Branch:</b> {userData.branch}
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.badgeBlue}>📄 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            <div style={styles.badge}>⏱ Total: {TOTAL_DURATION_MIN} Minutes</div>
            <div style={styles.badgeBlue}>
              ✅ Section: {currentSection?.title} ({currentSection?.fromId}–{currentSection?.toId})
            </div>
          </div>
        </div>

        {sectionQuestions.map((q) => (
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

        {!isLastSection ? (
          <button style={styles.nextBtn} onClick={goNextSection}>
            ➡️ Next Section
          </button>
        ) : null}

        <button style={styles.submitBtn} onClick={handleSubmit}>
          ✅ Submit
        </button>
      </div>
    </div>
  );
}