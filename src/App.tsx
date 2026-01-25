import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import UsersPage from './pages/Users';
import LogsPage from './pages/Logs';
import QuestionsPage from './pages/Questions';
import NotificationsPage from './pages/Notifications';
import SettingsPage from './pages/Settings';



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
        <Route path="/settings" element={<Layout><SettingsPage /></Layout>} />

        {/* Redirect any unknown route to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
