import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  History,
  Settings as SettingsIcon,
  Wallet,
  AlertCircle,
  Car,
  TrendingUp,
  TrendingDown,
  User,
  RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getBalance, getCurrentMonthStats } from '../services/api';
import { subscribeToTransactions, unsubscribeFromTransactions } from '../services/socket';
import { formatCurrency, formatMonthYear } from '../utils/format';

const Home = () => {
  const { isAdmin, logout } = useApp();
  const [balance, setBalance] = useState(0);
  const [stats, setStats] = useState({
    deposited: 0,
    spent: 0,
    trips: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true);
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
      setIsRefreshing(false);
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
  const isNegative = balance < 0;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-body text-gray-500 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black safe-top safe-bottom">
      {/* Header con gradiente */}
      <header className="header-gradient px-6 pt-6 pb-8 rounded-b-[2rem]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
              <Car size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TAXI MARTHA</h1>
              <p className="text-sm text-white/70">
                {isAdmin ? 'Modo Administrador' : 'Modo Vista'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchData(true)}
              className="touch-target"
              disabled={isRefreshing}
            >
              <RefreshCw size={22} className={isRefreshing ? 'animate-spin' : ''} />
            </button>
            <Link to="/settings" className="touch-target">
              <SettingsIcon size={24} />
            </Link>
          </div>
        </div>

        {/* Balance Card dentro del header */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-6 border border-white/20">
          <p className="text-sm font-medium text-white/80 mb-2">Saldo Actual</p>
          <div className="flex items-center gap-3">
            {isNegative && (
              <div className="p-2 bg-danger-500/20 rounded-xl animate-pulse">
                <AlertCircle size={32} className="text-white" />
              </div>
            )}
            <p className={`text-huge font-extrabold text-white number-animate ${isNegative ? 'text-shadow-lg' : ''}`}>
              {formatCurrency(balance)}
            </p>
          </div>
          {isNegative && (
            <p className="text-sm text-white/70 mt-2">
              Saldo negativo - se requiere deposito
            </p>
          )}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-danger-500 text-white rounded-2xl animate-slide-up">
          <p className="text-body">{error}</p>
        </div>
      )}

      {/* Stats del mes */}
      <div className="px-6 py-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {currentMonth}
          </h2>
          <span className="badge-turquesa">Este mes</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Depositado */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-turquesa-100 dark:bg-turquesa-900/30 rounded-lg">
                <TrendingUp size={16} className="text-turquesa-600 dark:text-turquesa-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Depositado</p>
            <p className="text-lg font-bold text-turquesa-600 dark:text-turquesa-400">
              {formatCurrency(stats.deposited)}
            </p>
          </div>

          {/* Gastado */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-danger-500/10 rounded-lg">
                <TrendingDown size={16} className="text-danger-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Gastado</p>
            <p className="text-lg font-bold text-danger-500">
              {formatCurrency(stats.spent)}
            </p>
          </div>

          {/* Viajes */}
          <div className="stat-card">
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 bg-gray-100 dark:bg-dark-elevated rounded-lg">
                <Car size={16} className="text-gray-600 dark:text-gray-400" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Viajes</p>
            <p className="text-lg font-bold text-gray-800 dark:text-white">
              {stats.trips}
            </p>
          </div>
        </div>
      </div>

      {/* Acciones */}
      <div className="px-6 pb-6 flex-1 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
          Acciones Rapidas
        </h2>

        {isAdmin ? (
          <div className="grid grid-cols-2 gap-4">
            <Link to="/add?type=gasto" className="action-btn-primary">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Plus size={28} />
              </div>
              <span className="text-base font-semibold">Agregar Viaje</span>
            </Link>

            <Link to="/add?type=ingreso" className="action-btn-primary">
              <div className="p-3 bg-white/20 rounded-2xl">
                <Wallet size={28} />
              </div>
              <span className="text-base font-semibold">Depositar</span>
            </Link>

            <Link to="/history" className="action-btn-secondary">
              <div className="icon-container-turquesa">
                <History size={28} />
              </div>
              <span className="text-base font-semibold">Historial</span>
            </Link>

            <Link to="/settings" className="action-btn-secondary">
              <div className="icon-container-turquesa">
                <SettingsIcon size={28} />
              </div>
              <span className="text-base font-semibold">Ajustes</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <Link to="/history" className="btn-primary w-full flex items-center justify-center gap-3">
              <History size={24} />
              <span>Ver Historial Completo</span>
            </Link>

            <Link to="/settings" className="btn-outline w-full flex items-center justify-center gap-3">
              <SettingsIcon size={24} />
              <span>Configuracion</span>
            </Link>
          </div>
        )}
      </div>

      {/* Footer con cambio de usuario */}
      <div className="px-6 pb-6">
        <button
          onClick={logout}
          className="w-full py-3 flex items-center justify-center gap-2 text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          <User size={18} />
          <span className="text-sm">
            Cambiar usuario ({isAdmin ? 'Alonso' : 'Martha'})
          </span>
        </button>
      </div>
    </div>
  );
};

export default Home;
