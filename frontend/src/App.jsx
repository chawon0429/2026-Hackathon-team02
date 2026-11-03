import { Routes, Route, Navigate } from 'react-router-dom'
import MySubmissionsPage from './pages/MySubmissionsPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/mypage" replace />} />
      <Route path="/mypage" element={<MySubmissionsPage />} />
      <Route path="/discover" element={<div style={{ padding: 20 }}>발견 (준비중)</div>} />
    </Routes>
  )
}

export default App