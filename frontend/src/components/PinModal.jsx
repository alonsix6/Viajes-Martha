import React, { useState } from 'react';
import { Lock } from 'lucide-react';

const PinModal = ({ onSuccess }) => {
  // TODO: Implement PIN modal logic
  // - PIN input with 6 digits
  // - Numeric keypad for easy input on mobile
  // - Verify PIN against backend
  // - Show error message on incorrect PIN
  // - Call onSuccess callback on correct PIN

  const [pin, setPin] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Verify PIN with API
    // For now, accept any 6-digit PIN
    if (pin.length === 6) {
      onSuccess();
    } else {
      setError('PIN debe tener 6 dígitos');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-turquesa-500 p-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          {/* Logo/Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-turquesa-100 p-6 rounded-full">
              <Lock size={48} className="text-turquesa-500" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-title font-bold text-center mb-2">Taxi Martha</h1>
          <p className="text-body text-gray-600 text-center mb-8">
            Ingresa tu PIN para continuar
          </p>

          {/* PIN Form */}
          <form onSubmit={handleSubmit}>
            <input
              type="password"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength="6"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError('');
              }}
              placeholder="••••••"
              className="input text-center text-title tracking-widest mb-4"
              autoFocus
            />

            {error && (
              <p className="text-danger-500 text-body text-center mb-4">{error}</p>
            )}

            <button type="submit" className="btn-primary w-full">
              Ingresar
            </button>
          </form>

          {/* TODO: Add "Forgot PIN?" option */}
        </div>
      </div>
    </div>
  );
};

export default PinModal;
