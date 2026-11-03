import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import DiscoverPage from "./pages/DiscoverPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mypage" element={<MySubmissionsPage />} />
      <Route path="/discover" element={<DiscoverPage />} />
    </Routes>
  );
}

export default App;
