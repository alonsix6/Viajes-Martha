import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import History from './components/History';
import Settings from './components/Settings';
import PinModal from './components/PinModal';
import { initializeSocket } from './services/socket';

function AppContent() {
  const { isAuthenticated } = useApp();

  // Initialize socket connection
  useEffect(() => {
    if (isAuthenticated) {
      initializeSocket();
    }
  }, [isAuthenticated]);

  // Show PIN modal if not authenticated
  if (!isAuthenticated) {
    return <PinModal />;
  }

  return (
    <BrowserRouter>
      <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add" element={<AddTransaction />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
