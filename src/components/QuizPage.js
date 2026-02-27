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
  const quizTitle =
    "PCM + Aptitude Assessment (Physics, Chemistry, Mathematics, DI, LR, QA, Verbal)";

  // ✅ QUIZ LIVE
  const QUIZ_OVER = false;

  // ✅ Total Timing 60 Minutes
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

  // ✅ Questions (PCM + DI/LR/QA/Verbal)
  const questions = useMemo(
    () => [
      // ---------------- PHYSICS (1-10) ----------------
      {
        id: 1,
        q_en:
          "PHYSICS 1) Two identical metallic spheres carry charges +q and +9q. They are connected by a thin wire and then separated again. The ratio of initial to final electrostatic potential energy is:",
        options: [
          { key: "A", en: "25:41" },
          { key: "B", en: "41:25" }, // ✅ Correct
          { key: "C", en: "9:25" },
          { key: "D", en: "5:9" },
        ],
        answerKey: "B",
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
          "PHYSICS 4) An electron enters perpendicular to a uniform magnetic field. If its speed is doubled, the radius of the circular path becomes:",
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
          "PHYSICS 5) In Young’s double slit experiment, if wavelength is halved and slit separation is doubled, the fringe width becomes:",
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
          { key: "A", en: "Current is minimum" },
          { key: "B", en: "Impedance is maximum" },
          { key: "C", en: "Power factor is zero" },
          { key: "D", en: "Voltages across L and C are equal in magnitude" },
        ],
        answerKey: "D",
      },
      {
        id: 7,
        q_en:
          "PHYSICS 7) The stopping potential in the photoelectric effect depends on:",
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
          "PHYSICS 8) Match the following: List I — A. Gauss Law, B. Lenz Law, C. Ampere Law, D. Photoelectric effect. List II — 1. Opposes change, 2. Electric flux relation, 3. Particle nature, 4. Magnetic field due to current. Options:",
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
          "PHYSICS 9) A convex lens forms an image at the same distance as the object but inverted. Magnification is:",
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
          "PHYSICS 10) Match the following: List I — A. Binding energy, B. Half life, C. Zener diode, D. p-n junction. List II — 1. Voltage regulation, 2. Rectification, 3. Mass defect, 4. Radioactive decay. Options:",
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
          "CHEMISTRY 1) Rate law: r = k[A]²[B]. If [A] is doubled and [B] is halved, the rate becomes:",
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
        q_en: "CHEMISTRY 2) For a reaction to be spontaneous at all temperatures:",
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
          "CHEMISTRY 3) In an electrochemical cell, if reaction quotient Q < K, the EMF is:",
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
        q_en: "CHEMISTRY 4) A Van’t Hoff factor greater than 1 indicates:",
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
        q_en: "CHEMISTRY 5) Correct order of boiling points: H2O, NH3, HF",
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
        q_en: "CHEMISTRY 6) In an SN1 reaction, the rate-determining step involves:",
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
        q_en: "CHEMISTRY 7) The pH of 0.001 M HCl is:",
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
        q_en:
          "CHEMISTRY 8) Which electronic configuration has the highest crystal field stabilization (as per given options)?",
        options: [
          { key: "A", en: "d⁰" },
          { key: "B", en: "d³" },
          { key: "C", en: "d⁵ (high spin)" },
          { key: "D", en: "d¹⁰" },
        ],
        answerKey: "B",
      },
      {
        id: 19,
        q_en:
          "CHEMISTRY 9) If concentration decreases, the half-life of a first-order reaction:",
        options: [
          { key: "A", en: "Increases" },
          { key: "B", en: "Decreases" },
          { key: "C", en: "Remains the same" },
          { key: "D", en: "Doubles" },
        ],
        answerKey: "C",
      },
      {
        id: 20,
        q_en:
          "CHEMISTRY 10) Match the following: List I — A. Buffer, B. Catalyst, C. Emulsion, D. Adsorption. List II — 1. Surface effect, 2. Liquid in liquid, 3. Resists pH change, 4. Lowers activation energy. Options:",
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
        q_en: "MATHEMATICS 1) If |A| = 3 for a 2×2 matrix, then |A⁻¹| =",
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
          "MATHEMATICS 2) If f(x) = x³ − 3x² + 2, the number of local maxima is:",
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
        q_en: "MATHEMATICS 4) Slope of the normal to curve y = x² at x = 1 is:",
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
          "MATHEMATICS 5) If the determinant of the coefficient matrix is zero, the system may have:",
        options: [
          { key: "A", en: "Unique solution" },
          { key: "B", en: "No solution" },
          { key: "C", en: "Infinite solutions" },
          { key: "D", en: "B or C" },
        ],
        answerKey: "D",
      },
      {
        id: 26,
        q_en: "MATHEMATICS 6) Unit vector in the direction of 2i − 2j is:",
        options: [
          { key: "A", en: "(i − j)" },
          { key: "B", en: "(i − j)/√2" },
          { key: "C", en: "(2i − 2j)/2" },
          { key: "D", en: "(2i − 2j)/√8" },
        ],
        answerKey: "B",
      },
      {
        id: 27,
        q_en:
          "MATHEMATICS 7) Maximize Z = 3x + 2y subject to x + y ≤ 4, x ≥ 0, y ≥ 0. The maximum value is:",
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
        q_en: "MATHEMATICS 8) ∫ e^x sin x dx is typically solved using:",
        options: [
          { key: "A", en: "Substitution" },
          { key: "B", en: "Integration by parts (twice)" },
          { key: "C", en: "Partial fractions" },
          { key: "D", en: "A direct formula only" },
        ],
        answerKey: "B",
      },
      {
        id: 29,
        q_en: "MATHEMATICS 9) The maximum value of sin x + cos x is:",
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
          "MATHEMATICS 10) Match the following: List I — A. Bayes theorem, B. Lagrange MVT, C. Inverse matrix, D. Linear programming. List II — 1. Conditional probability, 2. Mean slope, 3. Identity relation, 4. Optimization. Options:",
        options: [
          { key: "A", en: "A-1, B-2, C-3, D-4" },
          { key: "B", en: "A-2, B-1, C-4, D-3" },
          { key: "C", en: "A-3, B-4, C-2, D-1" },
          { key: "D", en: "A-4, B-3, C-1, D-2" },
        ],
        answerKey: "A",
      },

      // ---------------- SECTION D: DATA INTERPRETATION (31-35) ----------------
      {
        id: 31,
        q_en:
          "DATA INTERPRETATION 1) Pie Chart (Total Employees = 800): Production – 320, Marketing – 200, HR – 80, IT – 120, Finance – 80. What is the percentage of employees in Production?",
        options: [
          { key: "A", en: "35%" },
          { key: "B", en: "40%" },
          { key: "C", en: "45%" },
          { key: "D", en: "50%" },
        ],
        answerKey: "B",
      },
      {
        id: 32,
        q_en:
          "DATA INTERPRETATION 2) Ratio of Marketing to IT employees is:",
        options: [
          { key: "A", en: "5:3" },
          { key: "B", en: "4:3" },
          { key: "C", en: "3:2" },
          { key: "D", en: "2:1" },
        ],
        answerKey: "A",
      },
      {
        id: 33,
        q_en:
          "DATA INTERPRETATION 3) Combined percentage of HR and Finance employees is:",
        options: [
          { key: "A", en: "20%" },
          { key: "B", en: "25%" },
          { key: "C", en: "30%" },
          { key: "D", en: "35%" },
        ],
        answerKey: "A",
      },
      {
        id: 34,
        q_en:
          "DATA INTERPRETATION 4) If 25% of Production employees are promoted, how many employees are promoted?",
        options: [
          { key: "A", en: "70" },
          { key: "B", en: "75" },
          { key: "C", en: "80" },
          { key: "D", en: "85" },
        ],
        answerKey: "C",
      },
      {
        id: 35,
        q_en:
          "DATA INTERPRETATION 5) Which department has the second-highest number of employees?",
        options: [
          { key: "A", en: "IT" },
          { key: "B", en: "Marketing" },
          { key: "C", en: "Finance" },
          { key: "D", en: "HR" },
        ],
        answerKey: "B",
      },

      // ---------------- SECTION E: LOGICAL REASONING (36-45) ----------------
      {
        id: 36,
        q_en: "LOGICAL REASONING 1) Find the missing term: AZ, BY, CX, ?",
        options: [
          { key: "A", en: "DW" },
          { key: "B", en: "DV" },
          { key: "C", en: "EV" },
          { key: "D", en: "EW" },
        ],
        answerKey: "A",
      },
      {
        id: 37,
        q_en:
          "LOGICAL REASONING 2) Statement: All engineers are graduates. Some graduates are MBA holders. Conclusion:",
        options: [
          { key: "A", en: "All engineers are MBA holders" },
          { key: "B", en: "Some engineers are MBA holders" },
          { key: "C", en: "Engineers are graduates" },
          { key: "D", en: "None of the above" },
        ],
        answerKey: "C",
      },
      {
        id: 38,
        q_en: "LOGICAL REASONING 3) Odd one out: 121, 144, 169, 196, 216",
        options: [
          { key: "A", en: "121" },
          { key: "B", en: "144" },
          { key: "C", en: "169" },
          { key: "D", en: "196" },
          { key: "E", en: "216" },
        ],
        answerKey: "E",
      },
      {
        id: 39,
        q_en:
          "LOGICAL REASONING 4) If CAT = 3120 (C=3, A=1, T=20), then DOG = ?",
        options: [
          { key: "A", en: "4715" },
          { key: "B", en: "4157" },
          { key: "C", en: "4716" },
          { key: "D", en: "4751" },
        ],
        answerKey: "B",
      },
      {
        id: 40,
        q_en:
          "LOGICAL REASONING 5) Five people sit in a row. A is left of B, C is right of B, D is left of A. Who is at the extreme left?",
        options: [
          { key: "A", en: "A" },
          { key: "B", en: "B" },
          { key: "C", en: "C" },
          { key: "D", en: "D" },
        ],
        answerKey: "D",
      },

      // ---------------- SECTION F: QUANTITATIVE APTITUDE (41-45) ----------------
      {
        id: 41,
        q_en:
          "QUANTITATIVE APTITUDE 1) Average of first 20 natural numbers is:",
        options: [
          { key: "A", en: "10" },
          { key: "B", en: "10.5" },
          { key: "C", en: "11" },
          { key: "D", en: "9.5" },
        ],
        answerKey: "B",
      },
      {
        id: 42,
        q_en:
          "QUANTITATIVE APTITUDE 2) A sum doubles in 5 years at simple interest. The rate per annum is:",
        options: [
          { key: "A", en: "10%" },
          { key: "B", en: "15%" },
          { key: "C", en: "20%" },
          { key: "D", en: "25%" },
        ],
        answerKey: "C",
      },
      {
        id: 43,
        q_en:
          "QUANTITATIVE APTITUDE 3) 40% of a number is 240. The number is:",
        options: [
          { key: "A", en: "500" },
          { key: "B", en: "550" },
          { key: "C", en: "600" },
          { key: "D", en: "650" },
        ],
        answerKey: "C",
      },
      {
        id: 44,
        q_en:
          "QUANTITATIVE APTITUDE 4) Time & Work: A alone can do a job in 12 days, B alone in 18 days. Together they will complete it in:",
        options: [
          { key: "A", en: "6 days" },
          { key: "B", en: "7.2 days" },
          { key: "C", en: "8 days" },
          { key: "D", en: "9 days" },
        ],
        answerKey: "B",
      },
      {
        id: 45,
        q_en: "QUANTITATIVE APTITUDE 5) If x² – 9 = 0, then x =",
        options: [
          { key: "A", en: "±3" },
          { key: "B", en: "3" },
          { key: "C", en: "-3" },
          { key: "D", en: "±9" },
        ],
        answerKey: "A",
      },

      // ---------------- SECTION G: VERBAL ABILITY (46-50) ----------------
      {
        id: 46,
        q_en: 'VERBAL ABILITY 1) Synonym of "Meticulous" is:',
        options: [
          { key: "A", en: "Careless" },
          { key: "B", en: "Careful" },
          { key: "C", en: "Rough" },
          { key: "D", en: "Fast" },
        ],
        answerKey: "B",
      },
      {
        id: 47,
        q_en: 'VERBAL ABILITY 2) Antonym of "Scarcity" is:',
        options: [
          { key: "A", en: "Shortage" },
          { key: "B", en: "Plenty" },
          { key: "C", en: "Lack" },
          { key: "D", en: "Need" },
        ],
        answerKey: "B",
      },
      {
        id: 48,
        q_en:
          "VERBAL ABILITY 3) Fill in the blank: He has been living here _____ five years.",
        options: [
          { key: "A", en: "since" },
          { key: "B", en: "for" },
          { key: "C", en: "from" },
          { key: "D", en: "at" },
        ],
        answerKey: "B",
      },
      {
        id: 49,
        q_en: "VERBAL ABILITY 4) Choose the grammatically correct sentence:",
        options: [
          { key: "A", en: "Each of the students have a book." },
          { key: "B", en: "Each of the students has a book." },
          { key: "C", en: "Each students have book." },
          { key: "D", en: "Each student have a book." },
        ],
        answerKey: "B",
      },
      {
        id: 50,
        q_en: 'VERBAL ABILITY 5) Idiom: "Hit the nail on the head" means:',
        options: [
          { key: "A", en: "Miss the point" },
          { key: "B", en: "Exactly right" },
          { key: "C", en: "Angry" },
          { key: "D", en: "Confused" },
        ],
        answerKey: "B",
      },
    ],
    []
  );

  // ✅ Section-wise config (exactly as requested: 15/15/15/15)
  const sections = useMemo(
    () => [
      { key: "PHYSICS", title: "Physics", fromId: 1, toId: 10, durationMin: 15 },
      {
        key: "CHEMISTRY",
        title: "Chemistry",
        fromId: 11,
        toId: 20,
        durationMin: 15,
      },
      {
        key: "MATHEMATICS",
        title: "Mathematics",
        fromId: 21,
        toId: 30,
        durationMin: 15,
      },
      {
        key: "APTITUDE",
        title:
          "Aptitude (DI + Logical Reasoning + Quantitative Aptitude + Verbal Ability)",
        fromId: 31,
        toId: 50,
        durationMin: 15,
      },
    ],
    []
  );

  const TOTAL_QUESTIONS_DISPLAY = questions.length;
  const TOTAL_MARKS_DISPLAY = questions.length;

  const currentSection = sections[currentSectionIndex];
  const sectionQuestions = useMemo(() => {
    if (!currentSection) return [];
    return questions.filter(
      (q) => q.id >= currentSection.fromId && q.id <= currentSection.toId
    );
  }, [questions, currentSection]);

  const formatTime = (sec) =>
    `${String(Math.floor(sec / 60)).padStart(2, "0")}:${String(
      sec % 60
    ).padStart(2, "0")}`;

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
    if (overallTimeLeft === 0) handleSubmit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [overallTimeLeft, quizStarted, submitted]);

  // ✅ Auto move to next section on section time end
  useEffect(() => {
    if (!quizStarted || submitted) return;

    if (sectionTimeLeft === 0 && overallTimeLeft > 0) {
      if (currentSectionIndex < sections.length - 1) {
        const nextIndex = currentSectionIndex + 1;
        setCurrentSectionIndex(nextIndex);
        setSectionTimeLeft(sections[nextIndex].durationMin * 60);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        handleSubmit();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sectionTimeLeft, quizStarted, submitted, currentSectionIndex, overallTimeLeft]);

  // ---------------- Start Quiz --------------------
  const handleStart = async () => {
    if (!userData.name || !userData.college || !userData.branch) {
      alert("Please fill in Name, College Name, and Branch to start the quiz.");
      return;
    }

    isSubmittingRef.current = false;

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

  // ---------------- Submit (SCORING/FIRESTORE LOGIC UNCHANGED) --------------------
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
        college: userData.college,
        branch: userData.branch,
        quizTitle,
        answers,
        marks: score,
        questions, // snapshot
        submittedAt: serverTimestamp(),
      });
    } catch (e) {
      // If Firestore fails, still keep UI submitted; optionally log
      console.error("Error saving quiz result:", e);
    }
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
            <h3 style={{ color: "#c0392b", textAlign: "center", margin: "12px 0 0", fontWeight: 900 }}>
              Quiz Closed
            </h3>
            <p style={{ textAlign: "center", marginTop: 10, color: "#566573", fontWeight: 700, lineHeight: 1.4 }}>
              This quiz is currently unavailable. Please contact the administrator.
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
              Submission Successful
            </h3>

            <p style={{ textAlign: "center", marginTop: 10, color: "#2c3e50", fontWeight: 700, lineHeight: 1.4 }}>
              <b>Student:</b> {userData.name} &nbsp; | &nbsp; <b>College:</b> {userData.college} &nbsp; | &nbsp;{" "}
              <b>Branch:</b> {userData.branch}
            </p>

            <p style={{ textAlign: "center", marginTop: 10, color: "#2c3e50", fontWeight: 700, lineHeight: 1.4 }}>
              Score: <span style={{ fontSize: 22 }}>{marks}</span> / {TOTAL_MARKS_DISPLAY}
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
              Please enter your details accurately — your submission will be recorded.
            </div>

            <div style={styles.badgeRow}>
              <div style={styles.badge}>⏱ Total Duration: {TOTAL_DURATION_MIN} Minutes</div>
              <div style={styles.badgeBlue}>✅ Questions: {TOTAL_QUESTIONS_DISPLAY}</div>
              <div style={styles.badge}>📌 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            </div>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>Section & Timing Details</div>
            <ul style={styles.rules}>
              {sections.map((s) => (
                <li key={s.key}>
                  <b>{s.title}</b> — {s.durationMin} minutes (Q{s.fromId} to Q{s.toId})
                </li>
              ))}
              <li>The quiz will be automatically submitted when the overall time limit ends.</li>
              <li>When a section timer ends, the next section will start automatically.</li>
            </ul>
          </div>

          <div style={styles.notice}>
            <div style={styles.noticeTitle}>Important Instructions</div>
            <ul style={styles.rules}>
              <li>
                Each question has only <b>one</b> correct answer.
              </li>
              <li>Please do not refresh the page during the assessment.</li>
              <li>Ensure a stable internet connection for saving your submission.</li>
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
                placeholder="Branch (e.g., CSE / ME / ECE)"
                onChange={(e) => setUserData({ ...userData, branch: e.target.value })}
                value={userData.branch}
                inputMode="text"
              />
            </div>

            <div style={styles.helper}>Tip: Please enter your full name and official college details.</div>

            <button style={styles.button} onClick={handleStart} disabled={loading}>
              {loading ? "Starting..." : "🚀 Start Assessment"}
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
        <div style={styles.timerLine}>⏳ Overall Time Remaining: {formatTime(overallTimeLeft)}</div>
        <div style={styles.timerLine}>
          📘 Section Time Remaining ({currentSection?.title}): {formatTime(sectionTimeLeft)}
        </div>
      </div>

      <div style={styles.container}>
        <div style={styles.titleWrap}>
          <div style={styles.brand}>HERO STEELS LIMITED</div>

          <h2 style={{ ...styles.header, fontSize: isMobile ? "18px" : "22px" }}>📝 {quizTitle}</h2>

          <div style={styles.subHeader}>
            <b>Student:</b> {userData.name} &nbsp; | &nbsp; <b>College:</b> {userData.college} &nbsp; | &nbsp;{" "}
            <b>Branch:</b> {userData.branch}
          </div>

          <div style={styles.badgeRow}>
            <div style={styles.badgeBlue}>📄 Total Marks: {TOTAL_MARKS_DISPLAY}</div>
            <div style={styles.badge}>⏱ Total: {TOTAL_DURATION_MIN} Minutes</div>
            <div style={styles.badgeBlue}>
              ✅ Current Section: {currentSection?.title} (Q{currentSection?.fromId}–Q{currentSection?.toId})
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
            ➡️ Proceed to Next Section
          </button>
        ) : null}

        <button style={styles.submitBtn} onClick={handleSubmit}>
          ✅ Submit Assessment
        </button>
      </div>
    </div>
  );
}