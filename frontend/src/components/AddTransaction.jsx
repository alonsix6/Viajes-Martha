import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Car, Wallet, Calendar, FileText, Check } from 'lucide-react';
import { createTransaction } from '../services/api';
import { formatDateForInput } from '../utils/format';

const AddTransaction = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const initialType = searchParams.get('type') === 'ingreso' ? 'ingreso' : 'gasto';

  const [type, setType] = useState(initialType);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(formatDateForInput(new Date()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isValid = () => {
    if (!amount || parseFloat(amount) <= 0) return false;
    if (type === 'gasto' && (!description || description.trim().length < 3)) return false;
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isValid()) {
      setError('Por favor completa todos los campos requeridos');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await createTransaction({
        type,
        amount: parseFloat(amount),
        description: description.trim() || (type === 'ingreso' ? 'Deposito' : ''),
        date: new Date(date).toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black p-6">
        <div className="text-center animate-scale-in">
          <div className="w-24 h-24 bg-turquesa-100 dark:bg-turquesa-900/30 rounded-full
                        flex items-center justify-center mx-auto mb-6">
            <Check size={48} className="text-turquesa-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
            Guardado
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            {type === 'gasto' ? 'Viaje registrado' : 'Deposito registrado'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black safe-top safe-bottom">
      {/* Header */}
      <header className="header-gradient px-6 py-6 rounded-b-3xl">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-white">
              {type === 'gasto' ? 'Nuevo Viaje' : 'Nuevo Deposito'}
            </h1>
            <p className="text-sm text-white/70">Registra la transaccion</p>
          </div>
        </div>
      </header>

      {/* Form */}
      <div className="flex-1 overflow-y-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div className="animate-slide-up">
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Tipo de Transaccion
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('gasto')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3
                          transition-all duration-300 active:scale-[0.98]
                          ${type === 'gasto'
                            ? 'bg-gradient-danger border-transparent text-white shadow-lg'
                            : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                          }`}
              >
                <Car size={32} />
                <span className="font-semibold">Viaje</span>
              </button>
              <button
                type="button"
                onClick={() => setType('ingreso')}
                className={`p-5 rounded-2xl border-2 flex flex-col items-center gap-3
                          transition-all duration-300 active:scale-[0.98]
                          ${type === 'ingreso'
                            ? 'bg-gradient-turquesa border-transparent text-white shadow-lg'
                            : 'bg-white dark:bg-dark-card border-gray-200 dark:border-dark-border text-gray-700 dark:text-gray-300'
                          }`}
              >
                <Wallet size={32} />
                <span className="font-semibold">Deposito</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              Monto en Soles
            </label>
            <div className="relative">
              <span className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl font-bold text-gray-400 dark:text-gray-500">
                S/.
              </span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                inputMode="decimal"
                className="input pl-16 text-3xl font-bold h-20"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <span className="flex items-center gap-2">
                <FileText size={16} />
                Descripcion {type === 'gasto' && <span className="text-danger-500">*</span>}
              </span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'gasto' ? 'Ej: Dentista a Casa' : 'Ej: Deposito semanal'}
              className="input resize-none"
              rows="3"
              required={type === 'gasto'}
            />
            {type === 'gasto' && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                Minimo 3 caracteres para viajes
              </p>
            )}
          </div>

          {/* Date */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                Fecha
              </span>
            </label>
            <div className="relative overflow-hidden rounded-2xl">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="input w-full box-border"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-2xl animate-scale-in">
              <p className="text-danger-500 text-center font-medium">{error}</p>
            </div>
          )}
        </form>
      </div>

      {/* Bottom Buttons - Fixed */}
      <div className="p-6 bg-white dark:bg-dark-card border-t border-gray-100 dark:border-dark-border">
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn-outline flex-1"
            disabled={isLoading}
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className={`flex-1 ${type === 'gasto' ? 'btn-danger' : 'btn-primary'}`}
            disabled={isLoading || !isValid()}
          >
            {isLoading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransaction;
