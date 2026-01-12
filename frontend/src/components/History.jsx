import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, ArrowDownCircle, Pencil, Trash2, X, Check, Filter } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTransactions, updateTransaction, deleteTransaction } from '../services/api';
import { subscribeToTransactions, unsubscribeFromTransactions } from '../services/socket';
import { formatCurrency, formatDate, groupByMonth, formatDateForInput } from '../utils/format';

const History = () => {
  const navigate = useNavigate();
  const { isAdmin } = useApp();

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '', date: '' });

  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const fetchTransactions = async () => {
    try {
      setError('');
      const data = await getTransactions();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Error al cargar el historial');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();

    subscribeToTransactions(() => {
      fetchTransactions();
    });

    return () => {
      unsubscribeFromTransactions();
    };
  }, []);

  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  const groupedTransactions = groupByMonth(filteredTransactions);

  const handleEditClick = (transaction) => {
    setEditingTransaction(transaction);
    setEditForm({
      amount: transaction.amount.toString(),
      description: transaction.description || '',
      date: formatDateForInput(transaction.date)
    });
  };

  const handleEditSave = async () => {
    if (!editingTransaction) return;

    try {
      await updateTransaction(editingTransaction.id, {
        amount: parseFloat(editForm.amount),
        description: editForm.description,
        date: new Date(editForm.date).toISOString()
      });
      setEditingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Error al actualizar');
    }
  };

  const handleDeleteClick = (transaction) => {
    setDeletingTransaction(transaction);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingTransaction) return;

    try {
      await deleteTransaction(deletingTransaction.id);
      setDeletingTransaction(null);
      fetchTransactions();
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Error al eliminar');
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-black safe-top safe-bottom">
      {/* Header */}
      <header className="header-gradient px-6 py-6 rounded-b-3xl">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="touch-target"
            aria-label="Volver"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Historial</h1>
            <p className="text-sm text-white/70">
              {filteredTransactions.length} transacciones
            </p>
          </div>
        </div>

        {/* Filter Pills dentro del header */}
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'Todas' },
            { key: 'gasto', label: 'Viajes' },
            { key: 'ingreso', label: 'Depositos' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilterType(key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                        ${filterType === key
                          ? 'bg-white text-turquesa-600 shadow-lg'
                          : 'bg-white/20 text-white hover:bg-white/30'
                        }`}
            >
              {label}
            </button>
          ))}
        </div>
      </header>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-danger-500/10 border border-danger-500/20 rounded-2xl">
          <p className="text-danger-500 text-center">{error}</p>
        </div>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {filteredTransactions.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-gray-100 dark:bg-dark-elevated rounded-full
                          flex items-center justify-center mb-4">
              <Filter size={32} className="text-gray-400 dark:text-gray-600" />
            </div>
            <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
              Sin movimientos
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-600 mt-1">
              {filterType !== 'all' ? 'Prueba con otro filtro' : 'Agrega tu primera transaccion'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([month, monthTransactions], groupIndex) => (
              <div key={month} className="animate-slide-up" style={{ animationDelay: `${groupIndex * 0.1}s` }}>
                <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 px-1">
                  {month}
                </h2>
                <div className="space-y-3">
                  {monthTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="card p-4 flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div className={transaction.type === 'gasto' ? 'icon-container-danger' : 'icon-container-turquesa'}>
                        {transaction.type === 'gasto' ? (
                          <Car size={24} />
                        ) : (
                          <ArrowDownCircle size={24} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 dark:text-white truncate">
                          {transaction.description || (transaction.type === 'gasto' ? 'Viaje' : 'Deposito')}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className={`text-lg font-bold ${
                          transaction.type === 'gasto' ? 'text-danger-500' : 'text-turquesa-500'
                        }`}>
                          {transaction.type === 'gasto' ? '-' : '+'}{formatCurrency(transaction.amount)}
                        </p>
                      </div>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEditClick(transaction)}
                            className="p-2 rounded-xl text-gray-400 hover:text-turquesa-500
                                     hover:bg-turquesa-50 dark:hover:bg-turquesa-900/20 transition-colors"
                          >
                            <Pencil size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(transaction)}
                            className="p-2 rounded-xl text-gray-400 hover:text-danger-500
                                     hover:bg-danger-500/10 transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {editingTransaction && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Editar</h2>
              <button
                onClick={() => setEditingTransaction(null)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-600
                         hover:bg-gray-100 dark:hover:bg-dark-elevated transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Monto (S/.)
                </label>
                <input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className="input"
                  step="0.01"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Descripcion
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="input resize-none"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={editForm.date}
                  onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                  className="input"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button onClick={() => setEditingTransaction(null)} className="btn-outline flex-1">
                Cancelar
              </button>
              <button onClick={handleEditSave} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Check size={20} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <div className="modal-backdrop">
          <div className="modal-content text-center">
            <div className="w-16 h-16 bg-danger-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={32} className="text-danger-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
              Eliminar transaccion
            </h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Se eliminara {formatCurrency(deletingTransaction.amount)}. Esta accion no se puede deshacer.
            </p>
            <div className="flex gap-4">
              <button onClick={() => setDeletingTransaction(null)} className="btn-outline flex-1">
                Cancelar
              </button>
              <button onClick={handleDeleteConfirm} className="btn-danger flex-1 flex items-center justify-center gap-2">
                <Trash2 size={20} />
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default History;
