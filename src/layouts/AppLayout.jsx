import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarNavigation from '../components/SidebarNavigation';
import RiskFormModal from '../components/RiskFormModal';
import LoginModal from '../components/LoginModal';

export default function AppLayout() {
  const [showRiskModal, setShowRiskModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [apiToken, setApiToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem("notionToken");
    if (storedToken) {
      setApiToken(storedToken);
    }
  }, []);

  return (
    <div className="flex min-h-screen">
      <SidebarNavigation
        onAddRisk={() => setShowRiskModal(true)}
        onLogin={() => setShowLoginModal(true)}
        onLogout={() => {
          localStorage.removeItem("notionToken");
          setApiToken("");
        }}
        isAuthenticated={!!apiToken}
      />

      <main className="flex-1 p-6">
        <Outlet />
      </main>

      <RiskFormModal isOpen={showRiskModal} onClose={() => setShowRiskModal(false)} />
      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
        onLogin={(token) => setApiToken(token)} 
      />
    </div>
  );
}