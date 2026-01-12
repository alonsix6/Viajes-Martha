import React, { useState } from 'react';
import { Lock, Eye, Car, ArrowRight, ArrowLeft } from 'lucide-react';
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
      setError('El PIN debe tener 6 digitos');
      return;
    }

    if (attempts >= 3) {
      setError('Demasiados intentos. Recarga la pagina.');
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
        setError('Error de conexion. Intenta de nuevo.');
      }
      setPin('');
    } finally {
      setIsLoading(false);
    }
  };

  // PIN input digits display
  const pinDigits = Array(6).fill(null).map((_, i) => pin[i] || null);

  return (
    <div className="h-full flex flex-col bg-gradient-turquesa safe-top safe-bottom">
      {/* Top decorative area */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        {/* Logo animation */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-white/20 rounded-full blur-2xl scale-150 animate-pulse-slow"></div>
          <div className="relative w-28 h-28 bg-white rounded-3xl shadow-2xl flex items-center justify-center animate-bounce-subtle">
            <Car size={56} className="text-turquesa-500" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2 text-shadow">
          TAXI MARTHA
        </h1>
        <p className="text-white/80 text-lg">
          Control de gastos
        </p>
      </div>

      {/* Bottom card */}
      <div className="bg-white dark:bg-dark-card rounded-t-[2.5rem] shadow-2xl p-8 animate-slide-up">
        {!showPinInput ? (
          <>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center mb-2">
              Bienvenido
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-center mb-8">
              Selecciona como deseas ingresar
            </p>

            <div className="space-y-4">
              {/* Martha button - más prominente */}
              <button
                onClick={handleViewerMode}
                className="w-full p-5 rounded-2xl bg-gradient-turquesa text-white
                         flex items-center gap-4 shadow-lg hover:shadow-glow
                         transition-all duration-300 active:scale-[0.98]"
              >
                <div className="p-3 bg-white/20 rounded-xl">
                  <Eye size={28} />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg">Soy Martha</p>
                  <p className="text-white/70 text-sm">Ver saldo e historial</p>
                </div>
                <ArrowRight size={24} className="text-white/70" />
              </button>

              {/* Alonso button */}
              <button
                onClick={handleShowPinInput}
                className="w-full p-5 rounded-2xl border-2 border-gray-200 dark:border-dark-border
                         bg-white dark:bg-dark-elevated text-gray-800 dark:text-white
                         flex items-center gap-4
                         hover:border-turquesa-300 dark:hover:border-turquesa-500
                         transition-all duration-300 active:scale-[0.98]"
              >
                <div className="p-3 bg-gray-100 dark:bg-dark-card rounded-xl">
                  <Lock size={28} className="text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-semibold text-lg">Soy Alonso</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Administrar gastos</p>
                </div>
                <ArrowRight size={24} className="text-gray-400" />
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* Back button */}
            <button
              type="button"
              onClick={() => {
                setShowPinInput(false);
                setPin('');
                setError('');
                setAttempts(0);
              }}
              className="mb-6 flex items-center gap-2 text-gray-500 dark:text-gray-400
                       hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Volver</span>
            </button>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-turquesa-100 dark:bg-turquesa-900/30 rounded-2xl
                            flex items-center justify-center mx-auto mb-4">
                <Lock size={32} className="text-turquesa-600 dark:text-turquesa-400" />
              </div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                Ingresa tu PIN
              </h2>
              <p className="text-gray-500 dark:text-gray-400">
                Codigo de 6 digitos
              </p>
            </div>

            {/* PIN dots display */}
            <div className="flex justify-center gap-3 mb-6">
              {pinDigits.map((digit, i) => (
                <div
                  key={i}
                  className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center
                            transition-all duration-200
                            ${digit !== null
                              ? 'border-turquesa-400 bg-turquesa-50 dark:bg-turquesa-900/20'
                              : 'border-gray-200 dark:border-dark-border bg-gray-50 dark:bg-dark-elevated'
                            }`}
                >
                  {digit !== null && (
                    <div className="w-3 h-3 bg-turquesa-500 rounded-full animate-scale-in"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Hidden input for actual PIN entry */}
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
              className="sr-only"
              autoFocus
              disabled={isLoading || attempts >= 3}
            />

            {/* Visible keyboard-friendly input */}
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
              placeholder="Toca para ingresar PIN"
              className="input text-center text-2xl tracking-[0.5em] mb-4"
              autoFocus
              disabled={isLoading || attempts >= 3}
            />

            {/* Error message */}
            {error && (
              <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl mb-4 animate-scale-in">
                <p className="text-danger-500 text-center font-medium">{error}</p>
              </div>
            )}

            {/* Submit button */}
            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
              disabled={isLoading || attempts >= 3 || pin.length !== 6}
            >
              {isLoading ? (
                <>
                  <div className="spinner w-5 h-5 border-2"></div>
                  <span>Verificando...</span>
                </>
              ) : (
                <>
                  <span>Ingresar</span>
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            <p className="text-xs text-gray-400 dark:text-gray-600 text-center mt-6">
              PIN por defecto: 123456
            </p>
          </form>
        )}
      </div>
    </div>
  );
};

export default PinModal;
