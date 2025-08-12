import { Routes, Route } from "react-router-dom";
import QuizPage from "./pages/admin";
import AdminLogin from "./pages";
import Results from "./pages/results";

function App() {
  return (
    <Routes>
      <Route path="/" element={<QuizPage />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route path="/results" element={<Results />} />
    </Routes>
  );
}

export default App;
