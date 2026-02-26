import { Routes, Route } from "react-router-dom";
import QuizPage from "./pages/admin";
import AdminLogin from "./pages";
import Results from "./pages/results";
import ResultsPCM_Aptitude from "./pages/pcm";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/results" element={<Results />} />
      <Route path="/results2" element={<ResultsPCM_Aptitude />} />
    </Routes>
  );
}

export default App;
