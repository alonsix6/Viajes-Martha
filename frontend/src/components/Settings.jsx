import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Info } from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();

  // TODO: Implement Settings component logic
  // - Display app version
  // - Change PIN functionality
  // - Clear data option (with confirmation)
  // - Export data option
  // - About section

  const [showPinChange, setShowPinChange] = useState(false);

  return (
    <div className="h-full flex flex-col bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-turquesa-500 text-white p-6 shadow-lg flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="touch-target"
        >
          <ArrowLeft size={28} />
        </button>
        <div>
          <h1 className="text-heading font-bold">Configuración</h1>
        </div>
      </header>

      {/* Settings List */}
      <div className="p-6 space-y-4">
        {/* PIN Section */}
        <div className="card">
          <button
            onClick={() => setShowPinChange(!showPinChange)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <Lock size={24} className="text-turquesa-500" />
              <div className="text-left">
                <h3 className="text-large font-semibold">Cambiar PIN</h3>
                <p className="text-small text-gray-600">Actualizar código de acceso</p>
              </div>
            </div>
          </button>
        </div>

        {/* App Info */}
        <div className="card">
          <div className="flex items-center gap-4">
            <Info size={24} className="text-turquesa-500" />
            <div>
              <h3 className="text-large font-semibold">Acerca de</h3>
              <p className="text-small text-gray-600">Versión 1.0.0</p>
            </div>
          </div>
        </div>

        {/* TODO: Add more settings options */}
      </div>
    </div>
  );
};

export default Settings;
