module.exports = {

"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}}),
"[externals]/firebase/app [external] (firebase/app, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase/app");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase/auth [external] (firebase/auth, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase/auth");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/firebase/firestore [external] (firebase/firestore, esm_import)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
const mod = await __turbopack_context__.y("firebase/firestore");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/firebase.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "app": (()=>app),
    "auth": (()=>auth),
    "db": (()=>db)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase/app [external] (firebase/app, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$auth__$5b$external$5d$__$28$firebase$2f$auth$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase/auth [external] (firebase/auth, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase/firestore [external] (firebase/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$auth__$5b$external$5d$__$28$firebase$2f$auth$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$auth__$5b$external$5d$__$28$firebase$2f$auth$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
const firebaseConfig = {
    apiKey: "AIzaSyBw8R0I1JS-aiKFkXJ41_x7M367Cct1Tf8",
    authDomain: "herosteels-quiz.firebaseapp.com",
    projectId: "herosteels-quiz",
    storageBucket: "herosteels-quiz.firebasestorage.app",
    messagingSenderId: "787656898836",
    appId: "1:787656898836:web:ea9846107a045a02122a01",
    measurementId: "G-N182PJLLDZ"
};
const app = !(0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__["getApps"])().length ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__["initializeApp"])(firebaseConfig) : (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$app__$5b$external$5d$__$28$firebase$2f$app$2c$__esm_import$29$__["getApp"])();
const auth = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$auth__$5b$external$5d$__$28$firebase$2f$auth$2c$__esm_import$29$__["getAuth"])(app);
const db = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__["getFirestore"])(app);
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/components/QuizPage.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>QuizPage)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/firebase.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/firebase/firestore [external] (firebase/firestore, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
function QuizPage() {
    const [userData, setUserData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "",
        empId: "",
        department: ""
    });
    const [quizStarted, setQuizStarted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [submitted, setSubmitted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [timeLeft, setTimeLeft] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(300); // 30 min timer
    // Quiz live time range (11:00 AM - 11:30 AM on 15 Aug 2025)
    const quizStartTime = new Date("2025-08-15T12:00:01");
    const quizEndTime = new Date("2025-08-19T14:00:00");
    const questions = [
        {
            id: 1,
            q: "Who was the Prime Minister of India when the country got independence in 1947?",
            options: [
                "Sardar Vallabhbhai Patel",
                "Jawaharlal Nehru",
                "Subhas Chandra Bose",
                "Mahatma Gandhi"
            ]
        },
        {
            id: 2,
            q: "Lord Krishna was born in which prison?",
            options: [
                "Mathura",
                "Dwarka",
                "Vrindavan",
                "Kurukshetra"
            ]
        },
        {
            id: 3,
            q: "What is the name of the demon king who tried to kill baby Krishna?",
            options: [
                "Kans",
                "Ravan",
                "Hiranyakashipu",
                "Duryodhan"
            ]
        },
        {
            id: 4,
            q: "How many years of independence did India celebrate in 2025?",
            options: [
                "74",
                "75",
                "78",
                "79"
            ]
        },
        {
            id: 5,
            q: "What was Lord Krishna’s role in the Mahabharata?",
            options: [
                "Warrior",
                "Sage",
                "Charioteer and guide",
                "King of Hastinapur"
            ]
        },
        {
            id: 6,
            q: "Who wrote the Indian National Anthem?",
            options: [
                "Bankim Chandra Chatterjee",
                "Subhas Chandra Bose",
                "Rabindranath Tagore",
                "Sarojini Naidu"
            ]
        },
        {
            id: 7,
            q: "According to the Bhagavata Purana, at what exact time was Lord Krishna born?",
            options: [
                "Midnight on Ashtami of Krishna Paksha in Shravana month",
                "Noon on Navami of Krishna Paksha in Ashadha month",
                "Midnight on Navami of Shukla Paksha in Bhadrapada month",
                "Sunrise on Ashtami of Shukla Paksha in Shravan month"
            ]
        },
        {
            id: 8,
            q: "Who was the Governor-General of India at the time of Indian independence in 1947?",
            options: [
                "Lord Wavell",
                "Lord Linlithgow",
                "Lord Mountbatten",
                "Lord Curzon"
            ]
        },
        {
            id: 9,
            q: "In which Upanishad is Krishna mentioned as the Supreme Personality of Godhead?",
            options: [
                "Chandogya Upanishad",
                "Katha Upanishad",
                "Gopala-tapani Upanishad",
                "Mandukya Upanishad"
            ]
        },
        {
            id: 10,
            q: "The famous slogan 'Aaram haram hai' was given by which Indian freedom fighter after independence?",
            options: [
                "Lal Bahadur Shastri",
                "Mahatma Gandhi",
                "Jawaharlal Nehru",
                "Sardar Patel"
            ]
        },
        {
            id: 11,
            q: "Who was the British Prime Minister when India became independent in 1947?",
            options: [
                "Winston Churchill",
                "Neville Chamberlain",
                "Clement Attlee",
                "Harold Macmillan"
            ]
        },
        {
            id: 12,
            q: "What was the real name of Krishna’s foster mother in Gokul?",
            options: [
                "Radha",
                "Yashoda",
                "Devaki",
                "Rohini"
            ]
        },
        {
            id: 13,
            q: "What philosophical doctrine did Krishna reveal to Arjuna in the Bhagavad Gita?",
            options: [
                "Advaita Vedanta",
                "Karma Yoga and Bhakti Yoga",
                "Buddhism",
                "Jainism"
            ]
        },
        {
            id: 14,
            q: "The Indian National Flag was adopted in its present form on which date?",
            options: [
                "15 August 1947",
                "26 January 1950",
                "22 July 1947",
                "10 August 1947"
            ]
        },
        {
            id: 15,
            q: "If Lord Krishna were to advise Mahatma Gandhi during the Quit India Movement, which principle from the Bhagavad Gita would most align with Gandhi’s philosophy?",
            options: [
                "Nishkama Karma (Selfless action)",
                "Ahimsa (Non-violence)",
                "Moksha (Liberation from the cycle of birth and death)",
                "Bhakti (Devotion to God)"
            ]
        },
        {
            id: 16,
            q: "If the Dahi Handi tradition symbolizes unity and team effort, which Indian freedom movement tactic does it most closely resemble?",
            options: [
                "Salt March",
                "Swadeshi Movement",
                "Quit India Movement",
                "Non-Cooperation Movement"
            ]
        },
        {
            id: 17,
            q: "Imagine Janmashtami and Independence Day fall on the same day. A school decides to host a combined event. Which of the following themes would best represent both occasions?",
            options: [
                "Patriotism through mythological storytelling",
                "Political debates on colonialism",
                "Folk dances of different states",
                "Essay writing on modern politics"
            ]
        },
        {
            id: 18,
            q: "Krishna is often seen breaking societal norms in the Mahabharata. Which Indian freedom fighter’s methods best mirror this kind of 'divine rebellion'?",
            options: [
                "Subhas Chandra Bose",
                "Jawaharlal Nehru",
                "B. R. Ambedkar",
                "Bal Gangadhar Tilak"
            ]
        },
        {
            id: 19,
            q: "If Lord Krishna’s role in the Mahabharata symbolizes strategic guidance in chaos, what role does the Indian Constitution play post-independence in a similar context?",
            options: [
                "As a weapon of justice",
                "As a spiritual text",
                "As a guiding charioteer",
                "As a religious law"
            ]
        },
        {
            id: 20,
            q: "If the Makhan (butter) Krishna stole symbolized wealth or resources, what could be the parallel action in the Indian freedom struggle?",
            options: [
                "Boycott of British goods",
                "Adoption of Khadi",
                "Salt-making in Dandi",
                "Seizing of British institutions"
            ]
        },
        {
            id: 21,
            q: "Suppose Krishna was born in colonial India in 1947. Which social issue would he most likely challenge first, based on his historical actions?",
            options: [
                "Partition",
                "Caste discrimination",
                "Economic exploitation",
                "Religious conversion"
            ]
        },
        {
            id: 22,
            q: "Which principle from Krishna’s life could best serve as a moral compass for drafting the Indian Constitution?",
            options: [
                "Tactical diplomacy with Kauravas",
                "Participation in warfare",
                "Preaching Bhakti",
                "Emphasis on Dharma over personal ties"
            ]
        }
    ];
    // Timer
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (quizStarted && timeLeft > 0 && !submitted) {
            const timer = setInterval(()=>setTimeLeft((prev)=>prev - 1), 1000);
            return ()=>clearInterval(timer);
        }
        if (timeLeft === 0 && !submitted) handleSubmit();
    }, [
        quizStarted,
        timeLeft,
        submitted
    ]);
    const formatTime = (seconds)=>{
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };
    const handleChange = (id, option)=>{
        setAnswers({
            ...answers,
            [id]: option
        });
    };
    const handleSubmit = async ()=>{
        await (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__["addDoc"])((0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__["collection"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$firebase$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["db"], "quizResults"), {
            name: userData.name,
            department: userData.department,
            employeeId: userData.empId,
            answers,
            submittedAt: (0, __TURBOPACK__imported__module__$5b$externals$5d2f$firebase$2f$firestore__$5b$external$5d$__$28$firebase$2f$firestore$2c$__esm_import$29$__["serverTimestamp"])()
        });
        setSubmitted(true);
        setQuizStarted(false);
    };
    const handleStart = ()=>{
        const now = new Date();
        if (!userData.name || !userData.empId || !userData.department) {
            alert("Please fill all details before starting!");
            return;
        }
        if (now < quizStartTime || now > quizEndTime) {
            alert("Please wait for next quiz!!!!");
            return;
        }
        setQuizStarted(true);
    };
    const styles = {
        container: {
            maxWidth: "700px",
            margin: "auto",
            padding: "20px",
            fontFamily: "'Segoe UI', sans-serif"
        },
        header: {
            textAlign: "center",
            color: "#2c3e50"
        },
        info: {
            textAlign: "center",
            color: "#8e44ad",
            fontSize: "18px",
            marginBottom: "20px"
        },
        card: {
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: "10px"
        },
        input: {
            padding: "12px",
            fontSize: "16px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            outline: "none",
            transition: "0.3s"
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
            transition: "0.3s"
        },
        buttonHover: {
            background: "#2980b9"
        },
        question: {
            background: "#f7f9fc",
            padding: "15px",
            borderRadius: "8px",
            marginBottom: "12px",
            border: "1px solid #ddd"
        },
        option: {
            display: "block",
            marginTop: "6px",
            cursor: "pointer"
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
            fontWeight: "bold"
        }
    };
    const now = new Date();
    if (!quizStarted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: styles.container,
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                    style: styles.header,
                    children: "📚 Quiz Time"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizPage.js",
                    lineNumber: 167,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                    style: styles.info,
                    children: "📢 This quiz is over, Kindly wait for next quiz!!!!!!!!"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizPage.js",
                    lineNumber: 168,
                    columnNumber: 7
                }, this),
                now < quizStartTime || now > quizEndTime ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    style: {
                        color: "red",
                        textAlign: "center"
                    },
                    children: "⛔ Quiz is not live right now!"
                }, void 0, false, {
                    fileName: "[project]/src/components/QuizPage.js",
                    lineNumber: 172,
                    columnNumber: 9
                }, this) : null,
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    style: styles.card,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            style: styles.input,
                            type: "text",
                            placeholder: "Full Name",
                            value: userData.name,
                            onChange: (e)=>setUserData({
                                    ...userData,
                                    name: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizPage.js",
                            lineNumber: 177,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            style: styles.input,
                            type: "text",
                            placeholder: "Department",
                            value: userData.department,
                            onChange: (e)=>setUserData({
                                    ...userData,
                                    department: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizPage.js",
                            lineNumber: 184,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                            style: styles.input,
                            type: "text",
                            placeholder: "Employee ID",
                            value: userData.empId,
                            onChange: (e)=>setUserData({
                                    ...userData,
                                    empId: e.target.value
                                })
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizPage.js",
                            lineNumber: 191,
                            columnNumber: 9
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            style: styles.button,
                            onMouseOver: (e)=>e.target.style.background = styles.buttonHover.background,
                            onMouseOut: (e)=>e.target.style.background = styles.button.background,
                            onClick: handleStart,
                            children: "🚀 Start Quiz"
                        }, void 0, false, {
                            fileName: "[project]/src/components/QuizPage.js",
                            lineNumber: 198,
                            columnNumber: 9
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/QuizPage.js",
                    lineNumber: 176,
                    columnNumber: 7
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                    style: {
                        marginTop: "30px",
                        padding: "10px",
                        textAlign: "center",
                        fontSize: "14px",
                        color: "#7f8c8d",
                        borderTop: "1px solid #ddd"
                    },
                    children: [
                        "© ",
                        new Date().getFullYear(),
                        " Hero Steels Limited, IT Department — All Rights Reserved"
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/QuizPage.js",
                    lineNumber: 213,
                    columnNumber: 7
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/components/QuizPage.js",
            lineNumber: 166,
            columnNumber: 5
        }, this);
    }
    if (submitted) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            style: styles.container,
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                style: {
                    color: "#27ae60",
                    textAlign: "center"
                },
                children: "🎉 Dhanyavaad! Aapka quiz submit ho gaya!"
            }, void 0, false, {
                fileName: "[project]/src/components/QuizPage.js",
                lineNumber: 233,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/src/components/QuizPage.js",
            lineNumber: 232,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        style: styles.container,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: styles.timer,
                children: [
                    "⏳ Time Left: ",
                    formatTime(timeLeft)
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/QuizPage.js",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    marginTop: "60px"
                },
                children: questions.map((q)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        style: styles.question,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("b", {
                                    children: [
                                        q.id,
                                        ". ",
                                        q.q
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/QuizPage.js",
                                    lineNumber: 247,
                                    columnNumber: 16
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/components/QuizPage.js",
                                lineNumber: 247,
                                columnNumber: 13
                            }, this),
                            q.options.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    style: styles.option,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "radio",
                                            name: q.id,
                                            value: opt,
                                            onChange: ()=>handleChange(q.id, opt),
                                            checked: answers[q.id] === opt
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/QuizPage.js",
                                            lineNumber: 250,
                                            columnNumber: 17
                                        }, this),
                                        " ",
                                        opt
                                    ]
                                }, opt, true, {
                                    fileName: "[project]/src/components/QuizPage.js",
                                    lineNumber: 249,
                                    columnNumber: 15
                                }, this))
                        ]
                    }, q.id, true, {
                        fileName: "[project]/src/components/QuizPage.js",
                        lineNumber: 246,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/QuizPage.js",
                lineNumber: 244,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                style: styles.button,
                onMouseOver: (e)=>e.target.style.background = styles.buttonHover.background,
                onMouseOut: (e)=>e.target.style.background = styles.button.background,
                onClick: handleSubmit,
                children: "✅ Submit"
            }, void 0, false, {
                fileName: "[project]/src/components/QuizPage.js",
                lineNumber: 257,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/QuizPage.js",
        lineNumber: 239,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/index.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "default": (()=>Home)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizPage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/QuizPage.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizPage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizPage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
function Home() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$QuizPage$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
        fileName: "[project]/src/pages/index.js",
        lineNumber: 4,
        columnNumber: 10
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/node_modules/next/dist/esm/server/route-modules/pages/module.compiled.js [ssr] (ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
if ("TURBOPACK compile-time falsy", 0) {
    "TURBOPACK unreachable";
} else {
    if ("TURBOPACK compile-time truthy", 1) {
        if ("TURBOPACK compile-time truthy", 1) {
            module.exports = __turbopack_context__.r("[externals]/next/dist/compiled/next-server/pages-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/pages-turbo.runtime.dev.js, cjs)");
        } else {
            "TURBOPACK unreachable";
        }
    } else {
        "TURBOPACK unreachable";
    }
} //# sourceMappingURL=module.compiled.js.map
}}),
"[project]/node_modules/next/dist/esm/server/route-kind.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "RouteKind": (()=>RouteKind)
});
var RouteKind = /*#__PURE__*/ function(RouteKind) {
    /**
   * `PAGES` represents all the React pages that are under `pages/`.
   */ RouteKind["PAGES"] = "PAGES";
    /**
   * `PAGES_API` represents all the API routes under `pages/api/`.
   */ RouteKind["PAGES_API"] = "PAGES_API";
    /**
   * `APP_PAGE` represents all the React pages that are under `app/` with the
   * filename of `page.{j,t}s{,x}`.
   */ RouteKind["APP_PAGE"] = "APP_PAGE";
    /**
   * `APP_ROUTE` represents all the API routes and metadata routes that are under `app/` with the
   * filename of `route.{j,t}s{,x}`.
   */ RouteKind["APP_ROUTE"] = "APP_ROUTE";
    /**
   * `IMAGE` represents all the images that are generated by `next/image`.
   */ RouteKind["IMAGE"] = "IMAGE";
    return RouteKind;
}({}); //# sourceMappingURL=route-kind.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/helpers.js [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
/**
 * Hoists a name from a module or promised module.
 *
 * @param module the module to hoist the name from
 * @param name the name to hoist
 * @returns the value on the module (or promised module)
 */ __turbopack_context__.s({
    "hoist": (()=>hoist)
});
function hoist(module, name) {
    // If the name is available in the module, return it.
    if (name in module) {
        return module[name];
    }
    // If a property called `then` exists, assume it's a promise and
    // return a promise that resolves to the name.
    if ('then' in module && typeof module.then === 'function') {
        return module.then((mod)=>hoist(mod, name));
    }
    // If we're trying to hoise the default export, and the module is a function,
    // return the module itself.
    if (typeof module === 'function' && name === 'default') {
        return module;
    }
    // Otherwise, return undefined.
    return undefined;
} //# sourceMappingURL=helpers.js.map
}}),
"[project]/node_modules/next/dist/esm/build/templates/pages.js { INNER_PAGE => \"[project]/src/pages/index.js [ssr] (ecmascript)\", INNER_DOCUMENT => \"[project]/node_modules/next/document.js [ssr] (ecmascript)\", INNER_APP => \"[project]/node_modules/next/app.js [ssr] (ecmascript)\" } [ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname, a: __turbopack_async_module__ } = __turbopack_context__;
__turbopack_async_module__(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {
__turbopack_context__.s({
    "config": (()=>config),
    "default": (()=>__TURBOPACK__default__export__),
    "getServerSideProps": (()=>getServerSideProps),
    "getStaticPaths": (()=>getStaticPaths),
    "getStaticProps": (()=>getStaticProps),
    "reportWebVitals": (()=>reportWebVitals),
    "routeModule": (()=>routeModule),
    "unstable_getServerProps": (()=>unstable_getServerProps),
    "unstable_getServerSideProps": (()=>unstable_getServerSideProps),
    "unstable_getStaticParams": (()=>unstable_getStaticParams),
    "unstable_getStaticPaths": (()=>unstable_getStaticPaths),
    "unstable_getStaticProps": (()=>unstable_getStaticProps)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2f$module$2e$compiled$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-modules/pages/module.compiled.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/route-kind.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/build/templates/helpers.js [ssr] (ecmascript)");
// Import the app and document modules.
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/document.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/app.js [ssr] (ecmascript)");
// Import the userland code.
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/pages/index.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
([__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__);
;
;
;
;
;
;
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'default');
const getStaticProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'getStaticProps');
const getStaticPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'getStaticPaths');
const getServerSideProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'getServerSideProps');
const config = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'config');
const reportWebVitals = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'reportWebVitals');
const unstable_getStaticProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticProps');
const unstable_getStaticPaths = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticPaths');
const unstable_getStaticParams = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getStaticParams');
const unstable_getServerProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getServerProps');
const unstable_getServerSideProps = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$build$2f$templates$2f$helpers$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["hoist"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, 'unstable_getServerSideProps');
const routeModule = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$modules$2f$pages$2f$module$2e$compiled$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["PagesRouteModule"]({
    definition: {
        kind: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$route$2d$kind$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["RouteKind"].PAGES,
        page: "/index",
        pathname: "/",
        // The following aren't used in production.
        bundlePath: '',
        filename: ''
    },
    components: {
        // default export might not exist when optimized for data only
        App: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$app$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"],
        Document: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$document$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"]
    },
    userland: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$pages$2f$index$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
}); //# sourceMappingURL=pages.js.map
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__309beb1d._.js.map