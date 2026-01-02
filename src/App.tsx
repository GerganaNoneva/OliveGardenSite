import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import StudiosPage from './pages/StudiosPage';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/studios" element={<StudiosPage />} />
      </Routes>
    </Router>
  );
}
