import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import AddTransaction from './components/AddTransaction';
import History from './components/History';
import Settings from './components/Settings';
import PinModal from './components/PinModal';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isAuthenticated, login } = useAuth();

  // Show PIN modal if not authenticated
  if (!isAuthenticated) {
    return <PinModal onSuccess={login} />;
  }

  return (
    <BrowserRouter>
      <div className="h-full flex flex-col">
        {/* Main content area */}
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

export default App;
