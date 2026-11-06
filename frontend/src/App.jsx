import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import MySubmissionsPage from "./pages/MySubmissionsPage";
import DiscoverPage from "./pages/DiscoverPage";
import PlaceDetailPage from "./pages/PlaceDetailPage";
import SubmissionPage from "./pages/SubmissionPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/mypage" element={<MySubmissionsPage />} />
      <Route path="/discover" element={<DiscoverPage />} />
      <Route path="/places/:placeId" element={<PlaceDetailPage />} />
      <Route path="/submission" element={<SubmissionPage />} />
    </Routes>
  );
}

export default App;
