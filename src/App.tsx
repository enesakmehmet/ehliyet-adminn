import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import LogsPage from './pages/Logs';
import QuestionsPage from './pages/Questions';
import NotificationsPage from './pages/Notifications';

// Placeholder Pages
const ComingSoon = ({ title }: { title: string }) => (
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '60vh',
    textAlign: 'center'
  }}>
    <div style={{ fontSize: '64px', marginBottom: '16px' }}>🚧</div>
    <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1F2937' }}>{title}</h2>
    <p style={{ color: '#6B7280', marginTop: '8px' }}>Bu özellik yapım aşamasındadır.</p>
  </div>
);

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* All routes are now public - no login required */}
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/users" element={<Layout><UsersPage /></Layout>} />
        <Route path="/questions" element={<Layout><QuestionsPage /></Layout>} />
        <Route path="/logs" element={<Layout><LogsPage /></Layout>} />
        <Route path="/notifications" element={<Layout><NotificationsPage /></Layout>} />
        <Route path="/settings" element={<Layout><ComingSoon title="Ayarlar" /></Layout>} />

        {/* Redirect any unknown route to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
