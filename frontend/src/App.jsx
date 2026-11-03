import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MySubmissionsPage from "./pages/MySubmissionsPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mypage" element={<MySubmissionsPage />} />
      <Route
        path="/discover"
        element={<div style={{ padding: 20 }}>발견 (준비중)</div>}
      />
    </Routes>
  );
}

export default App;
