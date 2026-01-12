import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, History, Settings as SettingsIcon, Wallet, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBalance, getCurrentMonthStats } from '../services/api';
import { subscribeToTransactions, unsubscribeFromTransactions } from '../services/socket';
import { formatCurrency, formatMonthYear } from '../utils/format';

const Home = () => {
  const { isAdmin } = useApp();
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    deposited: 0,
    spent: 0,
    trips: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setError('');
      const [balanceData, statsData] = await Promise.all([
        getBalance(),
        getCurrentMonthStats()
      ]);

      setBalance(balanceData.balance);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    subscribeToTransactions(() => {
      fetchData();
    });

    return () => {
      unsubscribeFromTransactions();
    };
  }, []);

  const currentMonth = formatMonthYear(new Date());

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 safe-top safe-bottom">
      <header className="bg-turquesa-500 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-heading font-bold">TAXI MARTHA</h1>
          <Link to="/settings" className="touch-target">
            <SettingsIcon size={28} />
          </Link>
        </div>
        <p className="text-body opacity-90">Panel Principal</p>
      </header>

      {error && (
        <div className="mx-6 mt-4 p-4 bg-danger-500 text-white rounded-lg">
          <p className="text-body">{error}</p>
        </div>
      )}

      <div className="p-6">
        <div className="card p-8">
          <h2 className="text-title text-gray-700 dark:text-gray-300 mb-4">
            SALDO ACTUAL
          </h2>
          <div className="flex items-center justify-center gap-3">
            {balance < 0 && <AlertCircle size={48} className="text-danger-500" />}
            <p className={`text-huge font-bold ${balance < 0 ? 'text-danger-500' : 'text-turquesa-500'}`}>
              {formatCurrency(balance)}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6">
        <div className="card p-6">
          <h3 className="text-large font-semibold mb-4 text-gray-800 dark:text-gray-200">
            {currentMonth}
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-body text-gray-600 dark:text-gray-400">
                Depositado:
              </span>
              <span className="text-large font-semibold text-turquesa-500">
                {formatCurrency(stats.deposited)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-body text-gray-600 dark:text-gray-400">
                Gastado:
              </span>
              <span className="text-large font-semibold text-danger-500">
                {formatCurrency(stats.spent)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
              <span className="text-body text-gray-600 dark:text-gray-400">
                Viajes:
              </span>
              <span className="text-large font-semibold text-gray-900 dark:text-white">
                {stats.trips} taxis
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 pb-6 flex-1">
        <h3 className="text-large font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Acciones Rápidas
        </h3>

        {isAdmin ? (
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/add?type=gasto"
              className="btn-primary flex flex-col items-center justify-center gap-2 py-6"
            >
              <Plus size={32} />
              <span className="text-sm">Agregar Viaje</span>
            </Link>

            <Link
              to="/add?type=ingreso"
              className="btn-primary flex flex-col items-center justify-center gap-2 py-6"
            >
              <Wallet size={32} />
              <span className="text-sm">Registrar Depósito</span>
            </Link>

            <Link
              to="/history"
              className="btn-outline flex flex-col items-center justify-center gap-2 py-6"
            >
              <History size={32} />
              <span className="text-sm">Ver Historial</span>
            </Link>

            <Link
              to="/settings"
              className="btn-outline flex flex-col items-center justify-center gap-2 py-6"
            >
              <SettingsIcon size={32} />
              <span className="text-sm">Configuración</span>
            </Link>
          </div>
        ) : (
          <Link to="/history" className="btn-primary w-full flex items-center justify-center gap-3">
            <History size={24} />
            <span>Ver Historial</span>
          </Link>
        )}
      </div>
    </div>
  );
};

export default Home;
