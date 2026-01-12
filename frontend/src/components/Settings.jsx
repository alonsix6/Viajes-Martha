import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Lock, LogOut, Download, Info, Check, X, ChevronRight, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updatePin, getTransactions } from '../services/api';
import { formatDate } from '../utils/format';

const Settings = () => {
  const navigate = useNavigate();
  const { isAdmin, isDark, toggleTheme, logout } = useApp();

  const [showPinModal, setShowPinModal] = useState(false);
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState(
    localStorage.getItem('taxi_martha_last_export') || null
  );

  const handlePinChange = async () => {
    setPinError('');
    setPinSuccess(false);

    if (pinForm.newPin.length !== 6 || !/^\d+$/.test(pinForm.newPin)) {
      setPinError('El nuevo PIN debe tener 6 digitos');
      return;
    }

    if (pinForm.newPin !== pinForm.confirmPin) {
      setPinError('Los PINs no coinciden');
      return;
    }

    setIsChangingPin(true);

    try {
      await updatePin(pinForm.oldPin, pinForm.newPin);
      setPinSuccess(true);
      setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
      setTimeout(() => {
        setShowPinModal(false);
        setPinSuccess(false);
      }, 2000);
    } catch (err) {
      console.error('Error changing PIN:', err);
      if (err.response?.status === 401) {
        setPinError('PIN actual incorrecto');
      } else {
        setPinError('Error al cambiar PIN');
      }
    } finally {
      setIsChangingPin(false);
    }
  };

  const handleExport = async () => {
    setIsExporting(true);

    try {
      const transactions = await getTransactions();

      const headers = ['Fecha', 'Tipo', 'Monto', 'Descripcion'];
      const rows = transactions.map(t => [
        formatDate(t.date, 'dd/MM/yyyy'),
        t.type === 'gasto' ? 'Viaje' : 'Deposito',
        t.amount.toFixed(2),
        t.description || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taxi-martha-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      const now = new Date().toISOString();
      localStorage.setItem('taxi_martha_last_export', now);
      setLastExport(now);
    } catch (err) {
      console.error('Error exporting data:', err);
      alert('Error al exportar datos');
    } finally {
      setIsExporting(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const SettingItem = ({ icon: Icon, iconBg, title, subtitle, onClick, trailing, danger }) => (
    <button
      onClick={onClick}
      className="w-full p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-dark-elevated
               transition-colors rounded-2xl"
    >
      <div className={`p-3 rounded-2xl ${iconBg}`}>
        <Icon size={24} className={danger ? 'text-danger-500' : ''} />
      </div>
      <div className="flex-1 text-left">
        <p className={`font-semibold ${danger ? 'text-danger-500' : 'text-gray-800 dark:text-white'}`}>
          {title}
        </p>
        {subtitle && (
          <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        )}
      </div>
      {trailing || <ChevronRight size={20} className="text-gray-400" />}
    </button>
  );

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
            <h1 className="text-xl font-bold text-white">Configuracion</h1>
            <p className="text-sm text-white/70">
              {isAdmin ? 'Administrador' : 'Modo Vista'}
            </p>
          </div>
        </div>
      </header>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Apariencia */}
        <section className="animate-slide-up">
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
            Apariencia
          </h2>
          <div className="card overflow-hidden">
            <SettingItem
              icon={isDark ? Moon : Sun}
              iconBg="bg-turquesa-100 dark:bg-turquesa-900/30 text-turquesa-600 dark:text-turquesa-400"
              title="Modo Oscuro"
              subtitle={isDark ? 'Activado - OLED' : 'Desactivado'}
              onClick={toggleTheme}
              trailing={
                <div className={`w-14 h-8 rounded-full p-1 transition-colors ${
                  isDark ? 'bg-turquesa-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}>
                  <div className={`w-6 h-6 rounded-full bg-white shadow-lg transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`} />
                </div>
              }
            />
          </div>
        </section>

        {/* Usuario */}
        <section className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
            Usuario
          </h2>
          <div className="card overflow-hidden">
            <SettingItem
              icon={User}
              iconBg="bg-gray-100 dark:bg-dark-elevated text-gray-600 dark:text-gray-400"
              title="Cambiar Usuario"
              subtitle={`Sesion como ${isAdmin ? 'Alonso' : 'Martha'}`}
              onClick={handleLogout}
            />
          </div>
        </section>

        {/* Seguridad (solo admin) */}
        {isAdmin && (
          <section className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
              Seguridad
            </h2>
            <div className="card overflow-hidden divide-y divide-gray-100 dark:divide-dark-border">
              <SettingItem
                icon={Lock}
                iconBg="bg-turquesa-100 dark:bg-turquesa-900/30 text-turquesa-600 dark:text-turquesa-400"
                title="Cambiar PIN"
                subtitle="Actualizar codigo de acceso"
                onClick={() => setShowPinModal(true)}
              />
              <SettingItem
                icon={LogOut}
                iconBg="bg-danger-500/10 text-danger-500"
                title="Cerrar Sesion Admin"
                subtitle="Volver al modo vista"
                onClick={handleLogout}
                danger
              />
            </div>
          </section>
        )}

        {/* Datos */}
        <section className="animate-slide-up" style={{ animationDelay: '0.15s' }}>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
            Datos
          </h2>
          <div className="card overflow-hidden">
            <SettingItem
              icon={Download}
              iconBg="bg-turquesa-100 dark:bg-turquesa-900/30 text-turquesa-600 dark:text-turquesa-400"
              title="Exportar a CSV"
              subtitle={lastExport ? `Ultima: ${formatDate(lastExport, 'dd MMM yyyy')}` : 'Nunca exportado'}
              onClick={handleExport}
              trailing={isExporting ? <div className="spinner w-6 h-6"></div> : null}
            />
          </div>
        </section>

        {/* Info */}
        <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
            Informacion
          </h2>
          <div className="card p-5">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-turquesa rounded-2xl text-white">
                <Info size={24} />
              </div>
              <div>
                <p className="font-semibold text-gray-800 dark:text-white">Taxi Martha</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Version 1.0.0</p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PIN Change Modal */}
      {showPinModal && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                Cambiar PIN
              </h2>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
                  setPinError('');
                  setPinSuccess(false);
                }}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {pinSuccess ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-turquesa-100 dark:bg-turquesa-900/30 rounded-full
                              flex items-center justify-center mx-auto mb-4 animate-scale-in">
                  <Check size={40} className="text-turquesa-500" />
                </div>
                <p className="text-xl font-semibold text-turquesa-500">
                  PIN actualizado
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      PIN Actual
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength="6"
                      value={pinForm.oldPin}
                      onChange={(e) =>
                        setPinForm({ ...pinForm, oldPin: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="------"
                      className="input text-center text-2xl tracking-[0.5em]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Nuevo PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength="6"
                      value={pinForm.newPin}
                      onChange={(e) =>
                        setPinForm({ ...pinForm, newPin: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="------"
                      className="input text-center text-2xl tracking-[0.5em]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                      Confirmar PIN
                    </label>
                    <input
                      type="password"
                      inputMode="numeric"
                      maxLength="6"
                      value={pinForm.confirmPin}
                      onChange={(e) =>
                        setPinForm({ ...pinForm, confirmPin: e.target.value.replace(/\D/g, '') })
                      }
                      placeholder="------"
                      className="input text-center text-2xl tracking-[0.5em]"
                    />
                  </div>
                </div>

                {pinError && (
                  <div className="p-4 bg-danger-500/10 border border-danger-500/20 rounded-xl mt-4 animate-scale-in">
                    <p className="text-danger-500 text-center font-medium">{pinError}</p>
                  </div>
                )}

                <div className="flex gap-4 mt-6">
                  <button
                    onClick={() => {
                      setShowPinModal(false);
                      setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
                      setPinError('');
                    }}
                    className="btn-outline flex-1"
                    disabled={isChangingPin}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handlePinChange}
                    className="btn-primary flex-1"
                    disabled={isChangingPin || !pinForm.oldPin || !pinForm.newPin || !pinForm.confirmPin}
                  >
                    {isChangingPin ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
