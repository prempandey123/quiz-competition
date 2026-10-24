import { useState, useEffect, useMemo, useRef } from "react";

import { db } from "../firebase";

import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function QuizPage() {

  const [userData, setUserData] = useState({

    name: "",

    rollNumber: "",

    college: "",

    branch: "",

  });

  const quizTitle = "Hero Steels Campus Recruitment Assessment - 100 Questions";

  // ✅ QUIZ LIVE / CLOSE

  const QUIZ_OVER = false;

  // Total duration: 120 minutes

  const TOTAL_DURATION_MIN = 60;

  const TOTAL_DURATION_SEC = TOTAL_DURATION_MIN * 60;

  const [quizStarted, setQuizStarted] = useState(false);

  const [answers, setAnswers] = useState({});

  const [submitted, setSubmitted] = useState(false);

  const [marks, setMarks] = useState(null);

  const [timeLeft, setTimeLeft] = useState(TOTAL_DURATION_SEC);

  const [loading, setLoading] = useState(false);

  const [isMobile, setIsMobile] = useState(false);

  const isSubmittingRef = useRef(false);

  const [submissionReason, setSubmissionReason] = useState("manual");
  const latestSubmitRef = useRef(null);
  const fullscreenEnforcedRef = useRef(false);
  const [fullscreenNotice, setFullscreenNotice] = useState("");
  const pendingViolationNoticeRef = useRef(false);

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
        "id": 1,
        "q_en": "Find the next number in the series: 3, 8, 18, 38, 78, ___.",
        "options": [
            {
                "key": "A",
                "en": "148"
            },
            {
                "key": "B",
                "en": "156"
            },
            {
                "key": "C",
                "en": "158"
            },
            {
                "key": "D",
                "en": "162"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 2,
        "q_en": "Shift each letter of STEEL one position forward, then reverse the resulting string. What is the code?",
        "options": [
            {
                "key": "A",
                "en": "MFFUT"
            },
            {
                "key": "B",
                "en": "TUFFM"
            },
            {
                "key": "C",
                "en": "MFEUT"
            },
            {
                "key": "D",
                "en": "NFFUT"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 3,
        "q_en": "Five machines P, Q, R, S and T are in a row. P is left of Q, R is right of Q, S is left of P, and T is right of R. Which machine is in the middle?",
        "options": [
            {
                "key": "A",
                "en": "P"
            },
            {
                "key": "B",
                "en": "Q"
            },
            {
                "key": "C",
                "en": "R"
            },
            {
                "key": "D",
                "en": "S"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 4,
        "q_en": "All metallurgists are engineers. Some engineers are researchers. Which conclusion necessarily follows?",
        "options": [
            {
                "key": "A",
                "en": "All researchers are metallurgists."
            },
            {
                "key": "B",
                "en": "Some metallurgists are researchers."
            },
            {
                "key": "C",
                "en": "All metallurgists are engineers."
            },
            {
                "key": "D",
                "en": "No engineer is a researcher."
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 5,
        "q_en": "A technician walks 8 m east, 6 m north, 8 m west and 10 m south. How far and in which direction is the technician from the start?",
        "options": [
            {
                "key": "A",
                "en": "4 m north"
            },
            {
                "key": "B",
                "en": "4 m south"
            },
            {
                "key": "C",
                "en": "10 m south"
            },
            {
                "key": "D",
                "en": "2 m west"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 6,
        "q_en": "Find the missing term: AZ, BY, CX, DW, __.",
        "options": [
            {
                "key": "A",
                "en": "EU"
            },
            {
                "key": "B",
                "en": "EV"
            },
            {
                "key": "C",
                "en": "FU"
            },
            {
                "key": "D",
                "en": "EX"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 7,
        "q_en": "In a group of 80 candidates, 45 know Excel, 35 know CAD, and 20 know both. How many know neither?",
        "options": [
            {
                "key": "A",
                "en": "10"
            },
            {
                "key": "B",
                "en": "15"
            },
            {
                "key": "C",
                "en": "20"
            },
            {
                "key": "D",
                "en": "25"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 8,
        "q_en": "If 4 workers complete 4 identical jobs in 4 hours at a constant rate, how long will 8 workers take to complete 16 identical jobs?",
        "options": [
            {
                "key": "A",
                "en": "4 hours"
            },
            {
                "key": "B",
                "en": "6 hours"
            },
            {
                "key": "C",
                "en": "8 hours"
            },
            {
                "key": "D",
                "en": "16 hours"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 9,
        "q_en": "Find the next number: 2, 6, 15, 31, 56, ___.",
        "options": [
            {
                "key": "A",
                "en": "82"
            },
            {
                "key": "B",
                "en": "88"
            },
            {
                "key": "C",
                "en": "92"
            },
            {
                "key": "D",
                "en": "96"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 10,
        "q_en": "\"All rejected coils have failed at least one quality check.\" Which statement is logically equivalent?",
        "options": [
            {
                "key": "A",
                "en": "Every coil that fails a check is rejected."
            },
            {
                "key": "B",
                "en": "A coil that passed every check cannot be rejected."
            },
            {
                "key": "C",
                "en": "All accepted coils have failed a check."
            },
            {
                "key": "D",
                "en": "Some rejected coils pass every check. PART Il — APTITUDE & MATHEMATICS"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 11,
        "q_en": "A steel plant produces 1,200 tonnes in 24 hours. Production rises by 15%, with operating hours unchanged. What is the new average hourly production?",
        "options": [
            {
                "key": "A",
                "en": "50 tonnes/hour"
            },
            {
                "key": "B",
                "en": "52.5 tonnes/hour"
            },
            {
                "key": "C",
                "en": "57.5 tonnes/hour"
            },
            {
                "key": "D",
                "en": "60 tonnes/hour"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 12,
        "q_en": "A coil weighs 8 tonnes. Processing scrap is 2.5%. If the remaining material sells at ₹62,000 per tonne, what is the sales value?",
        "options": [
            {
                "key": "A",
                "en": "₹4,65,000"
            },
            {
                "key": "B",
                "en": "₹4,72,400"
            },
            {
                "key": "C",
                "en": "₹4,83,600"
            },
            {
                "key": "D",
                "en": "₹4,96,000"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 13,
        "q_en": "Two machines produce in the ratio 5:7. The first produces 250 components in 5 hours. How many will the second produce in 8 hours at the same relative rates?",
        "options": [
            {
                "key": "A",
                "en": "480"
            },
            {
                "key": "B",
                "en": "520"
            },
            {
                "key": "C",
                "en": "560"
            },
            {
                "key": "D",
                "en": "600"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 14,
        "q_en": "A process has a defect rate of 4%. Out of 2,500 components, how many are expected to be non-defective?",
        "options": [
            {
                "key": "A",
                "en": "2,300"
            },
            {
                "key": "B",
                "en": "2,350"
            },
            {
                "key": "C",
                "en": "2,400"
            },
            {
                "key": "D",
                "en": "2,450"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 15,
        "q_en": "A train travelling at 72 km/h crosses a station 180 m long in 20 seconds. What is the train length?",
        "options": [
            {
                "key": "A",
                "en": "180 m"
            },
            {
                "key": "B",
                "en": "200 m"
            },
            {
                "key": "C",
                "en": "220 m"
            },
            {
                "key": "D",
                "en": "240 m"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 16,
        "q_en": "The average of 12 measurements is 25. If 31 is replaced by 19, what is the new average?",
        "options": [
            {
                "key": "A",
                "en": "23"
            },
            {
                "key": "B",
                "en": "24"
            },
            {
                "key": "C",
                "en": "25"
            },
            {
                "key": "D",
                "en": "26"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 17,
        "q_en": "A completes a job in 12 days and B in 18 days. How long do they take together at constant rates?",
        "options": [
            {
                "key": "A",
                "en": "6 days"
            },
            {
                "key": "B",
                "en": "7.2 days"
            },
            {
                "key": "C",
                "en": "8 days"
            },
            {
                "key": "D",
                "en": "9 days"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 18,
        "q_en": "Steel cost rises by 20%, then falls by 10%. What is the net change from the original cost?",
        "options": [
            {
                "key": "A",
                "en": "8% increase"
            },
            {
                "key": "B",
                "en": "10% increase"
            },
            {
                "key": "C",
                "en": "8% decrease"
            },
            {
                "key": "D",
                "en": "2% increase"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 19,
        "q_en": "A batch contains 5 defective and 15 good components. Two are selected without replacement. What is the probability both are defective?",
        "options": [
            {
                "key": "A",
                "en": "1/19"
            },
            {
                "key": "B",
                "en": "1/20"
            },
            {
                "key": "C",
                "en": "1/38"
            },
            {
                "key": "D",
                "en": "1/10"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 20,
        "q_en": "A rolling mill has 85% availability during an 8-hour shift and produces 20 tonnes/hour when operating. What is its production?",
        "options": [
            {
                "key": "A",
                "en": "120 tonnes"
            },
            {
                "key": "B",
                "en": "128 tonnes"
            },
            {
                "key": "C",
                "en": "136 tonnes"
            },
            {
                "key": "D",
                "en": "160 tonnes"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 21,
        "q_en": "Evaluate the derivative of y = x²eˣ at x = 1.",
        "options": [
            {
                "key": "A",
                "en": "e"
            },
            {
                "key": "B",
                "en": "2e"
            },
            {
                "key": "C",
                "en": "3e"
            },
            {
                "key": "D",
                "en": "4e"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 22,
        "q_en": "Evaluate ∫₀² (3x² + 2x) dx.",
        "options": [
            {
                "key": "A",
                "en": "8"
            },
            {
                "key": "B",
                "en": "10"
            },
            {
                "key": "C",
                "en": "12"
            },
            {
                "key": "D",
                "en": "14"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 23,
        "q_en": "The roots of x² − 7x + 12 = 0 are:",
        "options": [
            {
                "key": "A",
                "en": "2 and 6"
            },
            {
                "key": "B",
                "en": "3 and 4"
            },
            {
                "key": "C",
                "en": "-3 and —4"
            },
            {
                "key": "D",
                "en": "1 and 12"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 24,
        "q_en": "Find the determinant of [[3, 2], [5, 4]].",
        "options": [
            {
                "key": "A",
                "en": "2"
            },
            {
                "key": "B",
                "en": "4"
            },
            {
                "key": "C",
                "en": "10"
            },
            {
                "key": "D",
                "en": "22"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 25,
        "q_en": "If y = e²ˣ, what is d²y/dx²?",
        "options": [
            {
                "key": "A",
                "en": "2e²ˣ"
            },
            {
                "key": "B",
                "en": "4e²ˣ"
            },
            {
                "key": "C",
                "en": "e⁴ˣ"
            },
            {
                "key": "D",
                "en": "4e⁴ˣ"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 26,
        "q_en": "A normal variable has mean 100 and standard deviation 15. What is the z-score for an observation of 130?",
        "options": [
            {
                "key": "A",
                "en": "1"
            },
            {
                "key": "B",
                "en": "1.5"
            },
            {
                "key": "C",
                "en": "2"
            },
            {
                "key": "D",
                "en": "3"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 27,
        "q_en": "Solve 2x + y = 11 and x − y = 1.",
        "options": [
            {
                "key": "A",
                "en": "x=3, y=5"
            },
            {
                "key": "B",
                "en": "x=4, y=3"
            },
            {
                "key": "C",
                "en": "x=5, y=1"
            },
            {
                "key": "D",
                "en": "x=6, y=−1"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 28,
        "q_en": "If sin θ = 3/5 and θ is acute, what is cos θ?",
        "options": [
            {
                "key": "A",
                "en": "2/5"
            },
            {
                "key": "B",
                "en": "3/4"
            },
            {
                "key": "C",
                "en": "4/5"
            },
            {
                "key": "D",
                "en": "5/4"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 29,
        "q_en": "Solve dy/dx = 3x² with y(0)=4.",
        "options": [
            {
                "key": "A",
                "en": "y=x³+4"
            },
            {
                "key": "B",
                "en": "y=3x+4"
            },
            {
                "key": "C",
                "en": "y=x²+4"
            },
            {
                "key": "D",
                "en": "y=3x³+4"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 30,
        "q_en": "Independent measurement errors have standard deviations 3 µm and 4 µm. What is their combined standard uncertainty?",
        "options": [
            {
                "key": "A",
                "en": "1 µm"
            },
            {
                "key": "B",
                "en": "5 µm"
            },
            {
                "key": "C",
                "en": "7 µm"
            },
            {
                "key": "D",
                "en": "12 µm"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 31,
        "q_en": "A 20 Ω resistor is in series with a 30 Ω resistor across 100 V DC. What is the current?",
        "options": [
            {
                "key": "A",
                "en": "1A"
            },
            {
                "key": "B",
                "en": "2A"
            },
            {
                "key": "C",
                "en": "3.33 A"
            },
            {
                "key": "D",
                "en": "5A"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 32,
        "q_en": "Two resistors of 6 Ω and 3 Ω are in parallel. Their equivalent resistance is:",
        "options": [
            {
                "key": "A",
                "en": "2 Ω"
            },
            {
                "key": "B",
                "en": "3 Ω"
            },
            {
                "key": "C",
                "en": "4.5 Ω"
            },
            {
                "key": "D",
                "en": "9 Ω"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 33,
        "q_en": "A balanced three-phase load operates at 415 V line voltage, 10 A line current and 0.8 power factor. Approximate active power?",
        "options": [
            {
                "key": "A",
                "en": "3.32 kW"
            },
            {
                "key": "B",
                "en": "4.15 kW"
            },
            {
                "key": "C",
                "en": "5.75 kW"
            },
            {
                "key": "D",
                "en": "8.30 kW"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 34,
        "q_en": "A motor delivers 10 kW mechanical output at 90% efficiency. What is its electrical input power?",
        "options": [
            {
                "key": "A",
                "en": "9 kW"
            },
            {
                "key": "B",
                "en": "10 kW"
            },
            {
                "key": "C",
                "en": "11.11 kW"
            },
            {
                "key": "D",
                "en": "12 kW"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 35,
        "q_en": "In a purely inductive AC circuit, current:",
        "options": [
            {
                "key": "A",
                "en": "Leads voltage by 90°"
            },
            {
                "key": "B",
                "en": "Lags voltage by 90°"
            },
            {
                "key": "C",
                "en": "Is in phase with voltage"
            },
            {
                "key": "D",
                "en": "Is always zero"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 36,
        "q_en": "A transformer has 1,000 primary turns and 200 secondary turns. If primary voltage is 230 V, ideal secondary voltage is:",
        "options": [
            {
                "key": "A",
                "en": "23 V"
            },
            {
                "key": "B",
                "en": "46 V"
            },
            {
                "key": "C",
                "en": "115 V"
            },
            {
                "key": "D",
                "en": "1,150 V"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 37,
        "q_en": "Which method efficiently controls a three-phase induction motor over a broad speed range?",
        "options": [
            {
                "key": "A",
                "en": "Vary supply frequency using a VFD"
            },
            {
                "key": "B",
                "en": "Increase bearing friction"
            },
            {
                "key": "C",
                "en": "Use a higher-rated fuse"
            },
            {
                "key": "D",
                "en": "Disconnect protective earth"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 38,
        "q_en": "A 2 kW heater operates for 3 hours. Energy consumed is:",
        "options": [
            {
                "key": "A",
                "en": "2 kWh"
            },
            {
                "key": "B",
                "en": "3 kWh"
            },
            {
                "key": "C",
                "en": "5 kWh"
            },
            {
                "key": "D",
                "en": "6 kWh"
            }
        ],
        "answerKey": "D"
    },
    {
        "id": 39,
        "q_en": "Which instrµment measures insulation resistance of a motor winding to earth?",
        "options": [
            {
                "key": "A",
                "en": "Tachometer"
            },
            {
                "key": "B",
                "en": "Megohmmeter (megger)"
            },
            {
                "key": "C",
                "en": "Vernier caliper"
            },
            {
                "key": "D",
                "en": "Thermocouple"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 40,
        "q_en": "A balanced three-phase load has power factor 0.6. Its reactive power in relation to apparent power S is:",
        "options": [
            {
                "key": "A",
                "en": "0.4S"
            },
            {
                "key": "B",
                "en": "0.6S"
            },
            {
                "key": "C",
                "en": "0.8S"
            },
            {
                "key": "D",
                "en": "1.0S"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 41,
        "q_en": "In a blast furnace, the principal gaseous reducing agent is:",
        "options": [
            {
                "key": "A",
                "en": "Nitrogen"
            },
            {
                "key": "B",
                "en": "Carbon monoxide"
            },
            {
                "key": "C",
                "en": "Oxygen"
            },
            {
                "key": "D",
                "en": "Argon"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 42,
        "q_en": "Which reaction represents reduction of hematite by carbon monoxide?",
        "options": [
            {
                "key": "A",
                "en": "Fe₂O₃ + 3CO → 2Fe + 3CO₂"
            },
            {
                "key": "B",
                "en": "Fe + CO₂ → Fe₂O₃"
            },
            {
                "key": "C",
                "en": "Fe₂O₃ + O₂ → Fe"
            },
            {
                "key": "D",
                "en": "FeO + CO₂ → Fe₂O₃"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 43,
        "q_en": "The main purpose of a basic oxygen furnace (BOF) is to:",
        "options": [
            {
                "key": "A",
                "en": "Maximize carbon content"
            },
            {
                "key": "B",
                "en": "Reduce carbon and oxidize impurities in hot metal"
            },
            {
                "key": "C",
                "en": "Roll billets into sheets"
            },
            {
                "key": "D",
                "en": "Anneal finished coils"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 44,
        "q_en": "Which equipment removes dissolved hydrogen and other gases from liquid steel under reduced pressure?",
        "options": [
            {
                "key": "A",
                "en": "Vacuum degassing unit"
            },
            {
                "key": "B",
                "en": "Cooling bed"
            },
            {
                "key": "C",
                "en": "Descaling header"
            },
            {
                "key": "D",
                "en": "Slitting line"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 45,
        "q_en": "The primary purpose of continuous casting is to:",
        "options": [
            {
                "key": "A",
                "en": "Solidify liquid steel into slabs, blooms or billets"
            },
            {
                "key": "B",
                "en": "Remelt finished slabs"
            },
            {
                "key": "C",
                "en": "Measure carbon content"
            },
            {
                "key": "D",
                "en": "Paint finished coils"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 46,
        "q_en": "Why is secondary metallurgy carried out after primary steelmaking?",
        "options": [
            {
                "key": "A",
                "en": "Refine composition, adjust temperature and control inclusions"
            },
            {
                "key": "B",
                "en": "Increase slag volume without control"
            },
            {
                "key": "C",
                "en": "Eliminate casting"
            },
            {
                "key": "D",
                "en": "Convert all steel into cast iron"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 47,
        "q_en": "In hot rolling, the material is generally deformed:",
        "options": [
            {
                "key": "A",
                "en": "Below absolute zero"
            },
            {
                "key": "B",
                "en": "Above its recrystallization temperature range"
            },
            {
                "key": "C",
                "en": "Only at room temperature"
            },
            {
                "key": "D",
                "en": "Only after melting"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 48,
        "q_en": "The primary purpose of pickling hot-rolled steel strip before cold rolling is to:",
        "options": [
            {
                "key": "A",
                "en": "Remove oxide scale"
            },
            {
                "key": "B",
                "en": "Increase carbon content"
            },
            {
                "key": "C",
                "en": "Increase thickness"
            },
            {
                "key": "D",
                "en": "Form martensite"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 49,
        "q_en": "During cold rolling, steel typically experiences:",
        "options": [
            {
                "key": "A",
                "en": "Work hardening and reduced ductility"
            },
            {
                "key": "B",
                "en": "Complete elimination of dislocations"
            },
            {
                "key": "C",
                "en": "Melting and solidification"
            },
            {
                "key": "D",
                "en": "No property change"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 50,
        "q_en": "A continuous annealing line for suitable cold-rolled steel grades primarily aims to:",
        "options": [
            {
                "key": "A",
                "en": "Restore ductility and obtain required properties"
            },
            {
                "key": "B",
                "en": "Deliberately increase scale thickness"
            },
            {
                "key": "C",
                "en": "Melt the steel"
            },
            {
                "key": "D",
                "en": "Measure coil mass only"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 51,
        "q_en": "A slab thickness decreases from 40 mm to 30 mm in rolling. Percentage reduction is:",
        "options": [
            {
                "key": "A",
                "en": "10%"
            },
            {
                "key": "B",
                "en": "20%"
            },
            {
                "key": "C",
                "en": "25%"
            },
            {
                "key": "D",
                "en": "30%"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 52,
        "q_en": "In continuous casting, a breakout is:",
        "options": [
            {
                "key": "A",
                "en": "Molten steel escaping through failure of the solidifying strand shell"
            },
            {
                "key": "B",
                "en": "Normal pickling"
            },
            {
                "key": "C",
                "en": "Cutting slabs to length"
            },
            {
                "key": "D",
                "en": "A hardness test"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 53,
        "q_en": "Periodic surface impressions caused by unsuitable roll conditions or rolling parameters are most associated with:",
        "options": [
            {
                "key": "A",
                "en": "Roll marks"
            },
            {
                "key": "B",
                "en": "Decarburization exclusively"
            },
            {
                "key": "C",
                "en": "Grain refinement"
            },
            {
                "key": "D",
                "en": "Recrystallization"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 54,
        "q_en": "The principal purpose of a tundish in continuous casting is to:",
        "options": [
            {
                "key": "A",
                "en": "Buffer and distribute liquid steel from ladle to moulds"
            },
            {
                "key": "B",
                "en": "Perform final cold rolling"
            },
            {
                "key": "C",
                "en": "Measure coil width"
            },
            {
                "key": "D",
                "en": "Remove rust"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 55,
        "q_en": "Which measure directly improves material yield in a rolling mill?",
        "options": [
            {
                "key": "A",
                "en": "Reduce avoidable crop losses and process scrap"
            },
            {
                "key": "B",
                "en": "Increase unplanned downtime"
            },
            {
                "key": "C",
                "en": "Increase rejected coils"
            },
            {
                "key": "D",
                "en": "Ignore dimensional deviations"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 56,
        "q_en": "In the metastable Fe–Fe₃C diagram, the eutectoid transformation occurs at approximately:",
        "options": [
            {
                "key": "A",
                "en": "0.02 wt% C and 912°C"
            },
            {
                "key": "B",
                "en": "0.76 wt% C and 727°C"
            },
            {
                "key": "C",
                "en": "2.11 wt% C and 1,147°C"
            },
            {
                "key": "D",
                "en": "4.3 wt% C and 1,538°C"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 57,
        "q_en": "The eutectoid reaction is best represented by:",
        "options": [
            {
                "key": "A",
                "en": "Liquid → Austenite + Cementite"
            },
            {
                "key": "B",
                "en": "Austenite → Ferrite + Cementite"
            },
            {
                "key": "C",
                "en": "Ferrite → Austenite + Liquid"
            },
            {
                "key": "D",
                "en": "Cementite → Liquid + Ferrite"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 58,
        "q_en": "Austenite has which crystal structure?",
        "options": [
            {
                "key": "A",
                "en": "BCC"
            },
            {
                "key": "B",
                "en": "FCC"
            },
            {
                "key": "C",
                "en": "HCP"
            },
            {
                "key": "D",
                "en": "Simple cubic"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 59,
        "q_en": "Maximum carbon solubility in austenite in the metastable Fe–Fe₃C diagram is approximately:",
        "options": [
            {
                "key": "A",
                "en": "0.02 wt%"
            },
            {
                "key": "B",
                "en": "0.76 wt%"
            },
            {
                "key": "C",
                "en": "2.11 wt%"
            },
            {
                "key": "D",
                "en": "6.67 wt%"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 60,
        "q_en": "Cementite has the chemical formula:",
        "options": [
            {
                "key": "A",
                "en": "FeO"
            },
            {
                "key": "B",
                "en": "Fe₂O₃"
            },
            {
                "key": "C",
                "en": "Fe₃C"
            },
            {
                "key": "D",
                "en": "FeCO₃"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 61,
        "q_en": "A 0.40 wt% carbon steel is slowly cooled from fully austenitic conditions to just below the eutectoid temperature. The expected microstructure is primarily:",
        "options": [
            {
                "key": "A",
                "en": "Proeutectoid ferrite and pearlite"
            },
            {
                "key": "B",
                "en": "Proeutectoid cementite and pearlite"
            },
            {
                "key": "C",
                "en": "100% martensite"
            },
            {
                "key": "D",
                "en": "100% liquid"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 62,
        "q_en": "A 1.0 wt% carbon steel is slowly cooled to just below the eutectoid temperature. Its expected microstructure is primarily:",
        "options": [
            {
                "key": "A",
                "en": "Proeutectoid ferrite and pearlite"
            },
            {
                "key": "B",
                "en": "Proeutectoid cementite and pearlite"
            },
            {
                "key": "C",
                "en": "100% ferrite"
            },
            {
                "key": "D",
                "en": "100% austenite"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 63,
        "q_en": "Which is generally the hardest among these conventional steel microstructures?",
        "options": [
            {
                "key": "A",
                "en": "Ferrite"
            },
            {
                "key": "B",
                "en": "Coarse pearlite"
            },
            {
                "key": "C",
                "en": "Martensite"
            },
            {
                "key": "D",
                "en": "Spheroidized cementite in a ferritic matrix ee ee ee ee, ee ee en en” ae? ae” ee” oer ee"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 64,
        "q_en": "The primary purpose of quenching suitable steel from the austenitic region is to:",
        "options": [
            {
                "key": "A",
                "en": "Promote martensite formation through rapid cooling"
            },
            {
                "key": "B",
                "en": "Guarantee equilibrium pearlite"
            },
            {
                "key": "C",
                "en": "Remove all carbon"
            },
            {
                "key": "D",
                "en": "Melt the steel"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 65,
        "q_en": "Tempering quenched martensitic steel generally aims to:",
        "options": [
            {
                "key": "A",
                "en": "Reduce brittleness and adjust hardness and toughness"
            },
            {
                "key": "B",
                "en": "Increase residual stress without property change"
            },
            {
                "key": "C",
                "en": "Convert all iron into cementite"
            },
            {
                "key": "D",
                "en": "Guarantee zero distortion"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 66,
        "q_en": "Which statement about ferrite is correct?",
        "options": [
            {
                "key": "A",
                "en": "Iron-rich BCC solid solution with low carbon solubility"
            },
            {
                "key": "B",
                "en": "Liquid at room temperature"
            },
            {
                "key": "C",
                "en": "Homogeneous solid solution with 6.67 wt% carbon"
            },
            {
                "key": "D",
                "en": "Identical to austenite in structure"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 67,
        "q_en": "The eutectic reaction in the metastable Fe–Fe₃C diagram occurs at approximately:",
        "options": [
            {
                "key": "A",
                "en": "727°C and 0.76 wt% C"
            },
            {
                "key": "B",
                "en": "912°C and 0.02 wt% C"
            },
            {
                "key": "C",
                "en": "1,147°C and 4.3 wt% C"
            },
            {
                "key": "D",
                "en": "1,538°C and 2.11 wt% C"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 68,
        "q_en": "Which statement distinguishes steel from cast iron in conventional Fe—C classification?",
        "options": [
            {
                "key": "A",
                "en": "Steel always has more than 4.3 wt% C"
            },
            {
                "key": "B",
                "en": "Cast iron generally has carbon above the conventional steel range, commonly about 2.1 wt% and higher"
            },
            {
                "key": "C",
                "en": "Steel contains no carbon"
            },
            {
                "key": "D",
                "en": "Cast iron contains no silicon"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 69,
        "q_en": "Hardenability describes a steel’s:",
        "options": [
            {
                "key": "A",
                "en": "Surface indentation resistance only"
            },
            {
                "key": "B",
                "en": "Ability to develop hardness to a given depth during hardening"
            },
            {
                "key": "C",
                "en": "Electrical resistance"
            },
            {
                "key": "D",
                "en": "Oxidation resistance exclusively"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 70,
        "q_en": "Which test assesses hardenability by measuring hardness along a quenched test specimen?",
        "options": [
            {
                "key": "A",
                "en": "Jominy end-quench test"
            },
            {
                "key": "B",
                "en": "Charpy impact test"
            },
            {
                "key": "C",
                "en": "Single-point Brinell test only"
            },
            {
                "key": "D",
                "en": "Salt spray test"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 71,
        "q_en": "A vernier caliper has least count 0.02 mm, main scale reading 24 mm, and the 7th vernier division coincides. With no zero error, the reading is:",
        "options": [
            {
                "key": "A",
                "en": "24.07 mm"
            },
            {
                "key": "B",
                "en": "24.14 mm"
            },
            {
                "key": "C",
                "en": "24.20 mm"
            },
            {
                "key": "D",
                "en": "24.70 mm"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 72,
        "q_en": "A micrometer has pitch 0.5 mm and 50 circular-scale divisions. Its least count is:",
        "options": [
            {
                "key": "A",
                "en": "0.1 mm"
            },
            {
                "key": "B",
                "en": "0.05 mm"
            },
            {
                "key": "C",
                "en": "0.01 mm"
            },
            {
                "key": "D",
                "en": "0.001 mm"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 73,
        "q_en": "A micrometer indicates 12.36 mm and has a positive zero error of 0.04 mm. Corrected measurement:",
        "options": [
            {
                "key": "A",
                "en": "12.32 mm"
            },
            {
                "key": "B",
                "en": "12.36 mm"
            },
            {
                "key": "C",
                "en": "12.40 mm"
            },
            {
                "key": "D",
                "en": "12.44 mm"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 74,
        "q_en": "A vernier caliper has positive zero error 0.06 mm and displays 15.42 mm. Corrected measurement:",
        "options": [
            {
                "key": "A",
                "en": "15.36 mm"
            },
            {
                "key": "B",
                "en": "15.42 mm"
            },
            {
                "key": "C",
                "en": "15.48 mm"
            },
            {
                "key": "D",
                "en": "15.60 mm"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 75,
        "q_en": "Which is most suitable for accurate measurement of a small bore diameter?",
        "options": [
            {
                "key": "A",
                "en": "Outside micrometer"
            },
            {
                "key": "B",
                "en": "Bore gauge used with a suitable setting reference"
            },
            {
                "key": "C",
                "en": "Steel rule"
            },
            {
                "key": "D",
                "en": "Surface plate alone"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 76,
        "q_en": "A dial indicator records maximum +0.03 mm and minimum −0.02 mm during one revolution. Total indicated runout is:",
        "options": [
            {
                "key": "A",
                "en": "0.01 mm"
            },
            {
                "key": "B",
                "en": "0.02 mm"
            },
            {
                "key": "C",
                "en": "0.03 mm"
            },
            {
                "key": "D",
                "en": "0.05 mm"
            }
        ],
        "answerKey": "D"
    },
    {
        "id": 77,
        "q_en": "Which instrµment measures surface profile and Ra of a machined steel strip?",
        "options": [
            {
                "key": "A",
                "en": "Contact profilometer / surface roughness tester"
            },
            {
                "key": "B",
                "en": "Vernier caliper"
            },
            {
                "key": "C",
                "en": "Ammeter"
            },
            {
                "key": "D",
                "en": "Tachometer"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 78,
        "q_en": "A measuring instrµment has high repeatability but a consistent bias relative to a traceable reference. It is:",
        "options": [
            {
                "key": "A",
                "en": "Precise but may be inaccurate"
            },
            {
                "key": "B",
                "en": "Necessarily accurate and precise"
            },
            {
                "key": "C",
                "en": "Free of measurement error"
            },
            {
                "key": "D",
                "en": "Unaffected by calibration"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 79,
        "q_en": "Which instrument can measure molten steel temperature without direct contact?",
        "options": [
            {
                "key": "A",
                "en": "Suitable optical/radiation pyrometer"
            },
            {
                "key": "B",
                "en": "Clinical thermometer"
            },
            {
                "key": "C",
                "en": "Bourdon pressure gauge"
            },
            {
                "key": "D",
                "en": "Hydrometer"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 80,
        "q_en": "A thickness gauge reads 1.98 mm while a calibrated reference reads 2.00 mm. Error = indication − reference:",
        "options": [
            {
                "key": "A",
                "en": "+0.02 mm"
            },
            {
                "key": "B",
                "en": "−0.02 mm"
            },
            {
                "key": "C",
                "en": "+0.20 mm"
            },
            {
                "key": "D",
                "en": "−0.20 mm"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 81,
        "q_en": "Convert 2.75 m into millimetres.",
        "options": [
            {
                "key": "A",
                "en": "275 mm"
            },
            {
                "key": "B",
                "en": "2,750 mm"
            },
            {
                "key": "C",
                "en": "27,500 mm"
            },
            {
                "key": "D",
                "en": "275,000 mm"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 82,
        "q_en": "Convert 250 MPa into N/mm².",
        "options": [
            {
                "key": "A",
                "en": "25 N/mm²"
            },
            {
                "key": "B",
                "en": "250 N/mm²"
            },
            {
                "key": "C",
                "en": "2,500 N/mm²"
            },
            {
                "key": "D",
                "en": "0.25 N/mm²"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 83,
        "q_en": "Convert 7,850 kg/m³ into g/cm³.",
        "options": [
            {
                "key": "A",
                "en": "0.785 g/cm³"
            },
            {
                "key": "B",
                "en": "7.85 g/cm³"
            },
            {
                "key": "C",
                "en": "78.5 g/cm³"
            },
            {
                "key": "D",
                "en": "785 g/cm³"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 84,
        "q_en": "Convert 90 km/h into m/s.",
        "options": [
            {
                "key": "A",
                "en": "20 m/s"
            },
            {
                "key": "B",
                "en": "25 m/s"
            },
            {
                "key": "C",
                "en": "30 m/s"
            },
            {
                "key": "D",
                "en": "32.4 m/s"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 85,
        "q_en": "Convert 350°C into kelvin.",
        "options": [
            {
                "key": "A",
                "en": "273.15 K"
            },
            {
                "key": "B",
                "en": "350 K"
            },
            {
                "key": "C",
                "en": "623.15 K"
            },
            {
                "key": "D",
                "en": "973.15 K"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 86,
        "q_en": "A steel plate is 2 m × 1.5 m × 8 mm. At density 7,850 kg/m³, approximate mass?",
        "options": [
            {
                "key": "A",
                "en": "94.2 kg"
            },
            {
                "key": "B",
                "en": "157 kg"
            },
            {
                "key": "C",
                "en": "188.4 kg"
            },
            {
                "key": "D",
                "en": "251.2 kg"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 87,
        "q_en": "Convert 1.5 kWh into megajoules.",
        "options": [
            {
                "key": "A",
                "en": "1.5 MJ"
            },
            {
                "key": "B",
                "en": "3.6 MJ"
            },
            {
                "key": "C",
                "en": "5.4 MJ"
            },
            {
                "key": "D",
                "en": "15 MJ"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 88,
        "q_en": "A hydraulic system pressure is 5 MPa. What force acts on a 20 cm² piston, neglecting losses?",
        "options": [
            {
                "key": "A",
                "en": "1,000 N"
            },
            {
                "key": "B",
                "en": "5,000 N"
            },
            {
                "key": "C",
                "en": "10,000 N"
            },
            {
                "key": "D",
                "en": "100,000 N"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 89,
        "q_en": "A steel strip is 1,250 mm wide and 2 mm thick. Cross-sectional area is:",
        "options": [
            {
                "key": "A",
                "en": "25 mm²"
            },
            {
                "key": "B",
                "en": "250 mm²"
            },
            {
                "key": "C",
                "en": "2,500 mm²"
            },
            {
                "key": "D",
                "en": "25,000 mm²"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 90,
        "q_en": "A coil has mass 12 tonnes and length 1,500 m. Its mass per unit length is:",
        "options": [
            {
                "key": "A",
                "en": "0.8 kg/m"
            },
            {
                "key": "B",
                "en": "8 kg/m"
            },
            {
                "key": "C",
                "en": "80 kg/m"
            },
            {
                "key": "D",
                "en": "800 kg/m"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 91,
        "q_en": "A steel bar of area 200 mm² carries a 40 kN axial tensile load. Nominal tensile stress is:",
        "options": [
            {
                "key": "A",
                "en": "20 MPa"
            },
            {
                "key": "B",
                "en": "100 MPa"
            },
            {
                "key": "C",
                "en": "200 MPa"
            },
            {
                "key": "D",
                "en": "400 MPa"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 92,
        "q_en": "A 2 m steel rod elongates by 1 mm under load. Nominal longitudinal strain is:",
        "options": [
            {
                "key": "A",
                "en": "0.00005"
            },
            {
                "key": "B",
                "en": "0.0005"
            },
            {
                "key": "C",
                "en": "0.005"
            },
            {
                "key": "D",
                "en": "0.05"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 93,
        "q_en": "A simply supported beam carries a central 10 kN point load over a 4 m span. Maximum bending moment is:",
        "options": [
            {
                "key": "A",
                "en": "5 kN·m"
            },
            {
                "key": "B",
                "en": "10 kN·m"
            },
            {
                "key": "C",
                "en": "20 kN·m"
            },
            {
                "key": "D",
                "en": "40 kN·m"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 94,
        "q_en": "A shaft transmits 20 kW at 1,500 rpm. Using T = 9550P/N, torque is approximately:",
        "options": [
            {
                "key": "A",
                "en": "12.7 N·m"
            },
            {
                "key": "B",
                "en": "63.7 N·m"
            },
            {
                "key": "C",
                "en": "127.3 N·m"
            },
            {
                "key": "D",
                "en": "191 N·m"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 95,
        "q_en": "Which NDT method detects surface and near-surface cracks in ferromagnetic steel?",
        "options": [
            {
                "key": "A",
                "en": "Magnetic particle testing"
            },
            {
                "key": "B",
                "en": "Tensile testing"
            },
            {
                "key": "C",
                "en": "Compression testing"
            },
            {
                "key": "D",
                "en": "Chemical titration"
            }
        ],
        "answerKey": "A"
    },
    {
        "id": 96,
        "q_en": "Which NDT method uses high-frequency sound waves to detect internal discontinuities?",
        "options": [
            {
                "key": "A",
                "en": "Dye penetrant testing"
            },
            {
                "key": "B",
                "en": "Ultrasonic testing"
            },
            {
                "key": "C",
                "en": "Visual inspection only"
            },
            {
                "key": "D",
                "en": "Hardness testing"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 97,
        "q_en": "In statistical process control, a process is considered statistically out of control when:",
        "options": [
            {
                "key": "A",
                "en": "Every part is within specification"
            },
            {
                "key": "B",
                "en": "A control chart signals special-cause variation"
            },
            {
                "key": "C",
                "en": "The process mean equals target"
            },
            {
                "key": "D",
                "en": "Sample size is greater than one"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 98,
        "q_en": "Specification limits are 19.90 and 20.10 mm. Process mean is 20.00 mm and standard deviation is 0.025 mm. What is Cp?",
        "options": [
            {
                "key": "A",
                "en": "0.67"
            },
            {
                "key": "B",
                "en": "1.00"
            },
            {
                "key": "C",
                "en": "1.33"
            },
            {
                "key": "D",
                "en": "2.00"
            }
        ],
        "answerKey": "C"
    },
    {
        "id": 99,
        "q_en": "Which maintenance strategy uses vibration, temperature or oil analysis to identify developing faults?",
        "options": [
            {
                "key": "A",
                "en": "Run-to-failure only"
            },
            {
                "key": "B",
                "en": "Predictive maintenance"
            },
            {
                "key": "C",
                "en": "Unplanned maintenance only"
            },
            {
                "key": "D",
                "en": "Fixed-hour maintenance regardless of condition"
            }
        ],
        "answerKey": "B"
    },
    {
        "id": 100,
        "q_en": "A rolling mill has repeated bearing failures. What is the strongest first step in a structured root-cause investigation?",
        "options": [
            {
                "key": "A",
                "en": "Change bearing type without evidence"
            },
            {
                "key": "B",
                "en": "Increase speed to see if failures disappear"
            },
            {
                "key": "C",
                "en": "Collect failure history and operating data, inspect failed parts, and test plausible causes systematically"
            },
            {
                "key": "D",
                "en": "Close the investigation after replacement"
            }
        ],
        "answerKey": "C"
    }
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

  const isAnswerCorrect = (question, value) => {

    if (question.type === "numeric") {

      const numericValue = Number.parseFloat(

        String(value ?? "").replace(/,/g, "").trim()

      );

      return Number.isFinite(numericValue) && numericValue === question.answerValue;

    }

    return value === question.answerKey;

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

      !userData.rollNumber.trim() ||

      !userData.college.trim() ||

      !userData.branch.trim()

    ) {

      alert("Please fill Student Name, Roll Number, College / University, and Branch / Stream.");

      return;

    }

    isSubmittingRef.current = false;
    pendingViolationNoticeRef.current = false;

    // Fullscreen requires a direct user gesture; request it from Start Assessment.
    // iOS Safari and some in-app browsers do not support element fullscreen.
    setLoading(true);
    fullscreenEnforcedRef.current = false;
    setFullscreenNotice("");
    const requestFullscreen = document.documentElement.requestFullscreen ||
      document.documentElement.webkitRequestFullscreen;
    if (requestFullscreen) {
      try {
        // Call before any awaited work, preserving the browser's user activation.
        await requestFullscreen.call(document.documentElement);
        fullscreenEnforcedRef.current = Boolean(document.fullscreenElement || document.webkitFullscreenElement);
      } catch (error) {
        console.warn("Fullscreen entry was declined:", error);
        setFullscreenNotice("Fullscreen was not enabled by this browser. Switching tabs or minimizing will still auto-submit the assessment.");
      }
    } else {
      setFullscreenNotice("This mobile browser does not support automatic fullscreen. Leaving the quiz or switching apps will still auto-submit when detected.");
    }
    setLoading(false);
    setQuizStarted(true);

    setSubmitted(false);

    setMarks(null);

    setSubmissionReason("manual");

    setAnswers({});

    setTimeLeft(TOTAL_DURATION_SEC);

    window.scrollTo({ top: 0, behavior: "smooth" });

  };

  const handleSubmit = async (reason = "manual") => {

    // React click events may be passed to this handler; only accept a string reason.
    const finalReason = typeof reason === "string" ? reason : "manual";

    if (isSubmittingRef.current) return;

    isSubmittingRef.current = true;
    // Closing the assessment immediately is important: do not wait for the
    // result write before removing questions from the student's screen.
    if (finalReason === "screen_switch" || finalReason === "fullscreen_exit") {
      pendingViolationNoticeRef.current = true;
    }

    setSubmissionReason(finalReason);

    let score = 0;

    questions.forEach((q) => {

      if (isAnswerCorrect(q, answers[q.id])) score++;

    });

    setMarks(score);

    setSubmitted(true);

    setQuizStarted(false);

    // The test is finished: leave fullscreen so the results page is usable.
    if (document.fullscreenElement || document.webkitFullscreenElement) {
      const exitFullscreen = document.exitFullscreen || document.webkitExitFullscreen;
      if (exitFullscreen) {
        try { Promise.resolve(exitFullscreen.call(document)).catch(() => {}); } catch (_) { /* ignore */ }
      }
    }
    fullscreenEnforcedRef.current = false;

    try {

      await addDoc(collection(db, "quizResults"), {

        name: userData.name,

        rollNumber: userData.rollNumber,

        college: userData.college,

        branch: userData.branch,

        quizTitle,

        answers,

        marks: score,

        totalMarks: TOTAL_MARKS_DISPLAY,

        totalQuestions: TOTAL_QUESTIONS_DISPLAY,

        durationMinutes: TOTAL_DURATION_MIN,

        questions,

        submissionReason: finalReason,

        submittedAt: serverTimestamp(),

      });

    } catch (e) {

      console.error("Error saving quiz result:", e);

    }

  };

  // When Windows shows the desktop (Win+D), our page is not visible, so an
  // in-page warning can only be shown when the student returns to the browser.
  useEffect(() => {
    const notifyOnReturn = () => {
      if (!pendingViolationNoticeRef.current) return;
      pendingViolationNoticeRef.current = false;
      window.alert("Assessment terminated: screen switching, minimizing, or exiting fullscreen is not allowed. Your answers have been automatically submitted. The quiz is now closed.");
    };
    window.addEventListener("focus", notifyOnReturn);
    const onVisible = () => {
      if (document.visibilityState === "visible" && document.hasFocus()) notifyOnReturn();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      window.removeEventListener("focus", notifyOnReturn);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, []);

  // Keep the event handler current without reinstalling monitoring on every answer change.
  latestSubmitRef.current = handleSubmit;

  useEffect(() => {
    if (!quizStarted || submitted) return;

    const autoSubmit = () => {
      if (!isSubmittingRef.current) latestSubmitRef.current("screen_switch");
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "hidden") autoSubmit();
    };
    // Windows Win+D / app switching normally blurs the browser. Browsers cannot
    // block OS shortcuts; terminate the attempt as soon as blur is observed.
    const onWindowBlur = () => autoSubmit();
    const onFullscreenChange = () => {
      // Only enforce exit when this browser successfully entered fullscreen at Start.
      if (fullscreenEnforcedRef.current &&
          !document.fullscreenElement && !document.webkitFullscreenElement &&
          !isSubmittingRef.current) {
        latestSubmitRef.current("fullscreen_exit");
      }
    };

    // Stop copying/selecting assessment content. Answer fields remain editable.
    const blockCopy = (event) => event.preventDefault();
    const blockContextMenu = (event) => event.preventDefault();
    const blockSelection = (event) => {
      if (!event.target.closest("input, textarea")) event.preventDefault();
    };
    const blockShortcuts = (event) => {
      if ((event.ctrlKey || event.metaKey) && ["c", "x", "a", "p", "s", "u"].includes(event.key.toLowerCase())) {
        // Keep input editing shortcuts available except copying assessment content.
        if (event.key.toLowerCase() === "c" || !event.target.closest("input, textarea")) event.preventDefault();
      }
      if (event.key === "PrintScreen") event.preventDefault();
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("blur", onWindowBlur);
    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("copy", blockCopy);
    document.addEventListener("cut", blockCopy);
    document.addEventListener("contextmenu", blockContextMenu);
    document.addEventListener("selectstart", blockSelection);
    document.addEventListener("keydown", blockShortcuts);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("blur", onWindowBlur);
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("copy", blockCopy);
      document.removeEventListener("cut", blockCopy);
      document.removeEventListener("contextmenu", blockContextMenu);
      document.removeEventListener("selectstart", blockSelection);
      document.removeEventListener("keydown", blockShortcuts);
    };
  }, [quizStarted, submitted]);

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

    numericAnswer: {

      padding: "12px",

      fontSize: isMobile ? "16px" : "15px",

      borderRadius: "10px",

      border: "1px solid rgba(0,0,0,0.18)",

      outline: "none",

      width: isMobile ? "100%" : "320px",

      maxWidth: "100%",

      background: "#ffffff",

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

                color: submissionReason === "manual" ? "#27ae60" : "#c62828",

                textAlign: "center",

                margin: "10px 0 0",

              }}

            >

              {submissionReason === "screen_switch" ? "Assessment Terminated – Screen Switch / Minimize Detected" : submissionReason === "fullscreen_exit" ? "Assessment Terminated – Fullscreen Exited" : "Submission Successful"}

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

                <b>Roll Number:</b> {userData.rollNumber}

              </p>

              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>

                <b>College / University:</b> {userData.college}

              </p>

              <p style={{ margin: "8px 0", color: "#2c3e50", fontWeight: 700 }}>

                <b>Branch / Stream:</b> {userData.branch}

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

              Please enter your student details accurately — your submission will be recorded.

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

              <li>On supported browsers, Start Assessment opens fullscreen. Exiting fullscreen, switching tabs, minimizing, or moving to another window will automatically submit the assessment.</li>
              <li>Browsers and operating systems do not permit websites to disable Home, minimize, or app switching. Some mobile browsers cannot enter true fullscreen.</li>

              <li>Copying or selecting assessment questions is disabled.</li>

              <li>Please do not refresh the page during the assessment.</li>

              <li>Ensure a stable internet connection for saving your submission.</li>

            </ul>

          </div>

          <div style={styles.card}>

            <div style={styles.row2}>

              <input

                style={styles.input}

                placeholder="Student Name"

                onChange={(e) =>

                  setUserData({ ...userData, name: e.target.value })

                }

                value={userData.name}

                inputMode="text"

              />

              <input

                style={styles.input}

                placeholder="Roll Number"

                onChange={(e) =>

                  setUserData({ ...userData, rollNumber: e.target.value })

                }

                value={userData.rollNumber}

                inputMode="text"

              />

              <input

                style={styles.input}

                placeholder="College / University"

                onChange={(e) =>

                  setUserData({ ...userData, college: e.target.value })

                }

                value={userData.college}

                inputMode="text"

              />

              <input

                style={styles.input}

                placeholder="Branch / Stream"

                onChange={(e) =>

                  setUserData({ ...userData, branch: e.target.value })

                }

                value={userData.branch}

                inputMode="text"

              />

            </div>

            <div style={styles.helper}>

              Tip: Please enter correct student details before starting the assessment.

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

    <div style={{ ...styles.page, userSelect: "none", WebkitUserSelect: "none" }}>

      {fullscreenNotice && (
        <div role="alert" style={{ margin: "12px auto", padding: 12, maxWidth: 900, background: "#fff5df", color: "#704800", borderRadius: 8 }}>
          {fullscreenNotice}
        </div>
      )}

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

            <b>Roll Number:</b> {userData.rollNumber} &nbsp; | &nbsp;

            <b>College / University:</b> {userData.college} &nbsp; | &nbsp;

            <b>Branch / Stream:</b> {userData.branch}

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

            {q.type === "numeric" ? (

              <input

                type="text"

                inputMode="decimal"

                placeholder="Enter your answer"

                value={answers[q.id] || ""}

                onChange={(e) => handleChange(q.id, e.target.value)}

                style={styles.numericAnswer}

              />

            ) : (

              q.options.map((opt) => (

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

              ))

            )}

          </div>

        ))}

        <button style={styles.submitBtn} onClick={handleSubmit}>

          ✅ Submit Assessment

        </button>

      </div>

    </div>

  );

}