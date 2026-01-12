import React from 'react';
import { Link } from 'react-router-dom';
import { Plus, History, Settings } from 'lucide-react';

const Home = () => {
  // TODO: Implement Home component logic
  // - Display current balance (total ingresos - total gastos)
  // - Show today's transactions summary
  // - Quick action buttons for adding transactions
  // - Real-time updates via Socket.io

  return (
    <div className="h-full flex flex-col bg-gray-50 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-turquesa-500 text-white p-6 shadow-lg">
        <h1 className="text-heading font-bold">Taxi Martha</h1>
        <p className="text-body mt-1">Panel Principal</p>
      </header>

      {/* Balance Card */}
      <div className="p-6">
        <div className="card">
          <h2 className="text-title text-gray-700 mb-4">Balance Total</h2>
          <p className="text-display text-turquesa-500 font-bold">
            $0
          </p>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex justify-between text-body mb-2">
              <span className="text-gray-600">Ingresos:</span>
              <span className="text-turquesa-500 font-semibold">$0</span>
            </div>
            <div className="flex justify-between text-body">
              <span className="text-gray-600">Gastos:</span>
              <span className="text-danger-500 font-semibold">$0</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-6 pb-6 flex-1">
        <h3 className="text-large font-semibold mb-4">Acciones Rápidas</h3>

        <Link to="/add" className="btn-primary w-full mb-4 flex items-center justify-center gap-3">
          <Plus size={24} />
          <span>Agregar Transacción</span>
        </Link>

        <Link to="/history" className="btn-secondary w-full mb-4 flex items-center justify-center gap-3">
          <History size={24} />
          <span>Ver Historial</span>
        </Link>

        <Link to="/settings" className="btn-secondary w-full flex items-center justify-center gap-3">
          <Settings size={24} />
          <span>Configuración</span>
        </Link>
      </div>

      {/* TODO: Add today's transactions list */}
    </div>
  );
};

export default Home;
