import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Moon, Sun, Lock, LogOut, Download, Info, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { updatePin, getTransactions } from '../services/api';
import { formatDate } from '../utils/format';

const Settings = () => {
  const navigate = useNavigate();
  const { isAdmin, isDark, toggleTheme, logout } = useApp();

  // Estado para cambio de PIN
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinForm, setPinForm] = useState({ oldPin: '', newPin: '', confirmPin: '' });
  const [pinError, setPinError] = useState('');
  const [pinSuccess, setPinSuccess] = useState(false);
  const [isChangingPin, setIsChangingPin] = useState(false);

  // Estado para exportar
  const [isExporting, setIsExporting] = useState(false);
  const [lastExport, setLastExport] = useState(
    localStorage.getItem('taxi_martha_last_export') || null
  );

  // Cambiar PIN
  const handlePinChange = async () => {
    setPinError('');
    setPinSuccess(false);

    if (pinForm.newPin.length !== 6 || !/^\d+$/.test(pinForm.newPin)) {
      setPinError('El nuevo PIN debe tener 6 dígitos');
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

  // Exportar a Excel/CSV
  const handleExport = async () => {
    setIsExporting(true);

    try {
      const transactions = await getTransactions();

      // Crear CSV
      const headers = ['Fecha', 'Tipo', 'Monto', 'Descripción'];
      const rows = transactions.map(t => [
        formatDate(t.date, 'dd/MM/yyyy'),
        t.type === 'gasto' ? 'Viaje' : 'Depósito',
        t.amount.toFixed(2),
        t.description || ''
      ]);

      const csvContent = [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `taxi-martha-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      // Guardar fecha de última exportación
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

  // Cerrar sesión admin
  const handleLogout = () => {
    logout();
    navigate('/');
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
          <h1 className="text-heading font-bold">Configuración</h1>
        </div>
      </header>

      {/* Settings List */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Apariencia */}
        <section>
          <h2 className="text-body font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Apariencia
          </h2>
          <div className="card">
            <button
              onClick={toggleTheme}
              className="w-full p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {isDark ? (
                  <Moon size={24} className="text-turquesa-500" />
                ) : (
                  <Sun size={24} className="text-turquesa-500" />
                )}
                <div className="text-left">
                  <h3 className="text-large font-semibold text-gray-800 dark:text-gray-200">
                    Modo Oscuro
                  </h3>
                  <p className="text-small text-gray-600 dark:text-gray-400">
                    {isDark ? 'Activado' : 'Desactivado'}
                  </p>
                </div>
              </div>
              <div
                className={`w-14 h-8 rounded-full p-1 transition-colors ${
                  isDark ? 'bg-turquesa-500' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-white shadow transition-transform ${
                    isDark ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </button>
          </div>
        </section>

        {/* Seguridad (solo admin) */}
        {isAdmin && (
          <section>
            <h2 className="text-body font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
              Seguridad
            </h2>
            <div className="card divide-y divide-gray-200 dark:divide-gray-700">
              <button
                onClick={() => setShowPinModal(true)}
                className="w-full p-4 flex items-center gap-4"
              >
                <Lock size={24} className="text-turquesa-500" />
                <div className="text-left">
                  <h3 className="text-large font-semibold text-gray-800 dark:text-gray-200">
                    Cambiar PIN
                  </h3>
                  <p className="text-small text-gray-600 dark:text-gray-400">
                    Actualizar código de acceso
                  </p>
                </div>
              </button>

              <button
                onClick={handleLogout}
                className="w-full p-4 flex items-center gap-4"
              >
                <LogOut size={24} className="text-danger-500" />
                <div className="text-left">
                  <h3 className="text-large font-semibold text-danger-500">
                    Cerrar Sesión Admin
                  </h3>
                  <p className="text-small text-gray-600 dark:text-gray-400">
                    Volver al modo de solo lectura
                  </p>
                </div>
              </button>
            </div>
          </section>
        )}

        {/* Datos */}
        <section>
          <h2 className="text-body font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Datos
          </h2>
          <div className="card">
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="w-full p-4 flex items-center gap-4"
            >
              <Download size={24} className="text-turquesa-500" />
              <div className="text-left flex-1">
                <h3 className="text-large font-semibold text-gray-800 dark:text-gray-200">
                  Exportar a CSV
                </h3>
                <p className="text-small text-gray-600 dark:text-gray-400">
                  {lastExport
                    ? `Última: ${formatDate(lastExport, 'dd MMM yyyy')}`
                    : 'Nunca exportado'}
                </p>
              </div>
              {isExporting && <div className="spinner w-6 h-6"></div>}
            </button>
          </div>
        </section>

        {/* Info */}
        <section>
          <h2 className="text-body font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
            Información
          </h2>
          <div className="card p-4">
            <div className="flex items-center gap-4">
              <Info size={24} className="text-turquesa-500" />
              <div>
                <h3 className="text-large font-semibold text-gray-800 dark:text-gray-200">
                  Taxi Martha
                </h3>
                <p className="text-small text-gray-600 dark:text-gray-400">
                  Versión 1.0.0
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* PIN Change Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title font-bold text-gray-900 dark:text-white">
                Cambiar PIN
              </h2>
              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPinForm({ oldPin: '', newPin: '', confirmPin: '' });
                  setPinError('');
                  setPinSuccess(false);
                }}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            {pinSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-turquesa-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-turquesa-500" />
                </div>
                <p className="text-large font-semibold text-turquesa-500">
                  PIN actualizado correctamente
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  <div>
                    <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
                      className="input text-center text-title tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
                      className="input text-center text-title tracking-widest"
                    />
                  </div>

                  <div>
                    <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
                      Confirmar Nuevo PIN
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
                      className="input text-center text-title tracking-widest"
                    />
                  </div>
                </div>

                {pinError && (
                  <p className="text-danger-500 text-body text-center mt-4">{pinError}</p>
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
