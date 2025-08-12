import { useState } from "react";

export default function QuizPage() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const questions = [
    { id: 1, q: "React ka creator kaun hai?", options: ["Facebook", "Google", "Microsoft"] },
    { id: 2, q: "JavaScript ka file extension kya hota hai?", options: [".js", ".java", ".py"] },
  ];

  const handleChange = (id, option) => {
    setAnswers({ ...answers, [id]: option });
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", answers);
    setSubmitted(true);
  };

  if (submitted) {
    return <h2>Shukriya! Aapka quiz submit ho gaya 🎉</h2>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>📝 Quiz Competition</h1>
      {questions.map((q) => (
        <div key={q.id} style={{ marginBottom: "20px" }}>
          <p>{q.q}</p>
          {q.options.map((opt) => (
            <label key={opt} style={{ display: "block" }}>
              <input
                type="radio"
                name={q.id}
                value={opt}
                onChange={() => handleChange(q.id, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
