import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, DollarSign } from 'lucide-react';

const AddTransaction = () => {
  const navigate = useNavigate();

  // TODO: Implement AddTransaction component logic
  // - Form with type selection (ingreso/gasto)
  // - Amount input with numeric keyboard
  // - Description text area
  // - Category dropdown
  // - Date picker (default to today)
  // - Submit to API and emit socket event
  // - Navigate back to home on success

  const [type, setType] = useState('ingreso');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement form submission
    console.log('Form submitted:', { type, amount, description, category });
  };

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
          <h1 className="text-heading font-bold">Nueva Transacción</h1>
        </div>
      </header>

      {/* Form */}
      <div className="p-6 flex-1 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-large font-semibold mb-3">Tipo</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType('ingreso')}
                className={`btn ${type === 'ingreso' ? 'btn-primary' : 'btn-secondary'}`}
              >
                Ingreso
              </button>
              <button
                type="button"
                onClick={() => setType('gasto')}
                className={`btn ${type === 'gasto' ? 'btn-danger' : 'btn-secondary'}`}
              >
                Gasto
              </button>
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label htmlFor="amount" className="block text-large font-semibold mb-3">
              Cantidad
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                <DollarSign size={24} />
              </span>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                className="input pl-12 text-title font-semibold"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-large font-semibold mb-3">
              Descripción
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detalles de la transacción"
              className="input resize-none"
              rows="3"
            />
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-large font-semibold mb-3">
              Categoría
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input"
            >
              <option value="">Seleccionar categoría</option>
              <option value="gasolina">Gasolina</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="viaje">Viaje</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-primary w-full">
            Guardar Transacción
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddTransaction;
