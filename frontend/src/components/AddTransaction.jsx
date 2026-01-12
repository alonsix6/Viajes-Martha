import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Car, Wallet } from 'lucide-react';
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

  // Validación del formulario
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
        description: description.trim() || (type === 'ingreso' ? 'Depósito' : ''),
        date: new Date(date).toISOString()
      });

      // Volver al home
      navigate('/');
    } catch (err) {
      console.error('Error creating transaction:', err);
      setError('Error al guardar. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-turquesa-500 text-white p-6 shadow-lg flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="touch-target"
          aria-label="Volver"
        >
          <ArrowLeft size={28} />
        </button>
        <div>
          <h1 className="text-heading font-bold">Nueva Transacción</h1>
        </div>
      </header>

      {/* Form */}
      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-large font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Tipo de Transacción
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('gasto')}
                className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 transition-all ${
                  type === 'gasto'
                    ? 'bg-danger-500 border-danger-500 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Car size={32} />
                <span className="text-body font-semibold">Viaje</span>
              </button>
              <button
                type="button"
                onClick={() => setType('ingreso')}
                className={`flex flex-col items-center justify-center gap-2 p-6 rounded-lg border-2 transition-all ${
                  type === 'ingreso'
                    ? 'bg-turquesa-500 border-turquesa-500 text-white'
                    : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                <Wallet size={32} />
                <span className="text-body font-semibold">Depósito</span>
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-large font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Monto en Soles
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-large font-semibold">
                S/.
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0"
                inputMode="decimal"
                className="input pl-14 text-title font-semibold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-large font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Descripción {type === 'gasto' && <span className="text-danger-500">*</span>}
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'gasto' ? 'Ej: Dentista → Casa' : 'Depósito de Martha'}
              className="input resize-none"
              rows="3"
              required={type === 'gasto'}
            />
            {type === 'gasto' && (
              <p className="text-small text-gray-500 dark:text-gray-400 mt-2">
                Mínimo 3 caracteres para viajes
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-large font-semibold mb-3 text-gray-800 dark:text-gray-200">
              Fecha
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-danger-500 text-white rounded-lg">
              <p className="text-body">{error}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-outline flex-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={isLoading || !isValid()}
            >
              {isLoading ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
