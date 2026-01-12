import React, { useState } from 'react';
import { Lock, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { verifyPin } from '../services/api';

const PinModal = () => {
  const { login } = useApp();
  const [showPinInput, setShowPinInput] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewerMode = () => {
    login('viewer');
  };

  const handleShowPinInput = () => {
    setShowPinInput(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (pin.length !== 6) {
      setError('El PIN debe tener 6 dígitos');
      return;
    }

    if (attempts >= 3) {
      setError('Demasiados intentos fallidos. Recarga la página.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await verifyPin(pin);

      if (response.valid) {
        login('admin');
      } else {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`PIN incorrecto. ${3 - newAttempts} intentos restantes.`);
        setPin('');
      }
    } catch (err) {
      console.error('Error verifying PIN:', err);
      if (err.response?.status === 401) {
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        setError(`PIN incorrecto. ${3 - newAttempts} intentos restantes.`);
      } else {
        setError('Error al verificar PIN. Intenta de nuevo.');
      }
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gradient-to-br from-turquesa-500 to-turquesa-600 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-turquesa-100 dark:bg-turquesa-900 p-6 rounded-full">
              <Lock size={48} className="text-turquesa-600 dark:text-turquesa-400" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-title font-bold text-center mb-2 text-gray-900 dark:text-white">
            TAXI MARTHA
          </h1>
          <p className="text-body text-gray-600 dark:text-gray-400 text-center mb-8">
            Selecciona el modo de acceso
          </p>

          {!showPinInput ? (
            <div className="space-y-4">
              {/* Viewer Mode Button */}
              <button
                onClick={handleViewerMode}
                className="w-full btn-primary flex items-center justify-center gap-3"
              >
                <Eye size={24} />
                <span>Ver como Martha</span>
              </button>

              {/* Admin Mode Button */}
              <button
                onClick={handleShowPinInput}
                className="w-full btn-outline flex items-center justify-center gap-3"
              >
                <Lock size={24} />
                <span>Soy Alonso</span>
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <p className="text-body text-gray-700 dark:text-gray-300 text-center mb-4">
                Ingresa tu PIN de 6 dígitos
              </p>

              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength="6"
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value.replace(/\D/g, ''));
                  setError('');
                }}
                placeholder="••••••"
                className="input text-center text-title tracking-widest mb-4"
                autoFocus
                disabled={isLoading || attempts >= 3}
              />

              {error && (
                <p className="text-danger-500 text-body text-center mb-4">{error}</p>
              )}

              <div className="space-y-3">
                <button
                  type="submit"
                  className="btn-primary w-full"
                  disabled={isLoading || attempts >= 3 || pin.length !== 6}
                >
                  {isLoading ? 'Verificando...' : 'Ingresar'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPinInput(false);
                    setPin('');
                    setError('');
                    setAttempts(0);
                  }}
                  className="btn-outline w-full"
                  disabled={isLoading}
                >
                  Volver
                </button>
              </div>
            </form>
          )}

          <p className="text-small text-gray-500 dark:text-gray-500 text-center mt-6">
            PIN por defecto: 123456
          </p>
        </div>
      </div>
    </div>
  );
};

export default PinModal;
