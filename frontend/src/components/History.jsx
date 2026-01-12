import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Filter } from 'lucide-react';

const History = () => {
  const navigate = useNavigate();

  // TODO: Implement History component logic
  // - Fetch all transactions from API
  // - Display in reverse chronological order
  // - Group by date
  // - Search and filter functionality
  // - Real-time updates via Socket.io
  // - Pull-to-refresh on mobile
  // - Infinite scroll or pagination

  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // TODO: Fetch transactions
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-turquesa-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-heading font-bold">Historial</h1>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar transacciones..."
            className="w-full px-4 py-3 pl-12 rounded-lg text-body text-gray-900"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-body font-medium ${
              filterType === 'all' ? 'bg-turquesa-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('ingreso')}
            className={`px-4 py-2 rounded-lg text-body font-medium ${
              filterType === 'ingreso' ? 'bg-turquesa-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Ingresos
          </button>
          <button
            onClick={() => setFilterType('gasto')}
            className={`px-4 py-2 rounded-lg text-body font-medium ${
              filterType === 'gasto' ? 'bg-danger-500 text-white' : 'bg-gray-100 text-gray-700'
            }`}
          >
            Gastos
          </button>
        </div>
      </div>

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto p-6">
        {transactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-large text-gray-500">No hay transacciones</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* TODO: Map and render transactions */}
            <p className="text-body text-gray-500">Las transacciones aparecerán aquí</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
