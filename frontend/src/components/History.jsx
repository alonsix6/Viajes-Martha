import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, ArrowDownCircle, Pencil, Trash2, X, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getTransactions, updateTransaction, deleteTransaction } from '../services/api';
import { subscribeToTransactions, unsubscribeFromTransactions } from '../services/socket';
import { formatCurrency, formatDate, formatMonthYear, groupByMonth, formatDateForInput } from '../utils/format';

const History = () => {
  const navigate = useNavigate();
  const { isAdmin } = useApp();

  const [transactions, setTransactions] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Modal de edición
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [editForm, setEditForm] = useState({ amount: '', description: '', date: '' });

  // Modal de confirmación de eliminación
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

  // Filtrar transacciones
  const filteredTransactions = transactions.filter(t => {
    if (filterType === 'all') return true;
    return t.type === filterType;
  });

  // Agrupar por mes
  const groupedTransactions = groupByMonth(filteredTransactions);

  // Handlers de edición
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

  // Handlers de eliminación
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
      <div className="h-full flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900 safe-top safe-bottom">
      {/* Header */}
      <header className="bg-turquesa-500 text-white p-6 shadow-lg">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="touch-target"
            aria-label="Volver"
          >
            <ArrowLeft size={28} />
          </button>
          <h1 className="text-heading font-bold">Historial</h1>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-lg text-body font-medium transition-colors ${
              filterType === 'all'
                ? 'bg-turquesa-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Todas
          </button>
          <button
            onClick={() => setFilterType('gasto')}
            className={`px-4 py-2 rounded-lg text-body font-medium transition-colors ${
              filterType === 'gasto'
                ? 'bg-danger-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Viajes
          </button>
          <button
            onClick={() => setFilterType('ingreso')}
            className={`px-4 py-2 rounded-lg text-body font-medium transition-colors ${
              filterType === 'ingreso'
                ? 'bg-turquesa-500 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            Depósitos
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-6 mt-4 p-4 bg-danger-500 text-white rounded-lg">
          <p className="text-body">{error}</p>
        </div>
      )}

      {/* Transaction List */}
      <div className="flex-1 overflow-y-auto p-6">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-large text-gray-500 dark:text-gray-400">No hay movimientos</p>
            <p className="text-body text-gray-400 dark:text-gray-500 mt-2">
              {filterType !== 'all' ? 'Prueba con otro filtro' : 'Agrega tu primera transacción'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedTransactions).map(([month, monthTransactions]) => (
              <div key={month}>
                <h2 className="text-large font-semibold text-gray-800 dark:text-gray-200 mb-3">
                  {month}
                </h2>
                <div className="space-y-3">
                  {monthTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="card p-4 flex items-center gap-4"
                    >
                      {/* Icon */}
                      <div
                        className={`p-3 rounded-full ${
                          transaction.type === 'gasto'
                            ? 'bg-danger-500/10 text-danger-500'
                            : 'bg-turquesa-500/10 text-turquesa-500'
                        }`}
                      >
                        {transaction.type === 'gasto' ? (
                          <Car size={24} />
                        ) : (
                          <ArrowDownCircle size={24} />
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-body font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {transaction.description || (transaction.type === 'gasto' ? 'Viaje' : 'Depósito')}
                        </p>
                        <p className="text-small text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </p>
                      </div>

                      {/* Amount */}
                      <p
                        className={`text-large font-bold whitespace-nowrap ${
                          transaction.type === 'gasto' ? 'text-danger-500' : 'text-turquesa-500'
                        }`}
                      >
                        {transaction.type === 'gasto' ? '-' : '+'}{formatCurrency(transaction.amount)}
                      </p>

                      {/* Admin Actions */}
                      {isAdmin && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditClick(transaction)}
                            className="p-2 text-gray-500 hover:text-turquesa-500 transition-colors"
                            aria-label="Editar"
                          >
                            <Pencil size={20} />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(transaction)}
                            className="p-2 text-gray-500 hover:text-danger-500 transition-colors"
                            aria-label="Eliminar"
                          >
                            <Trash2 size={20} />
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-title font-bold text-gray-900 dark:text-white">Editar</h2>
              <button
                onClick={() => setEditingTransaction(null)}
                className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
                <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
                  Descripción
                </label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="input resize-none"
                  rows="2"
                />
              </div>

              <div>
                <label className="block text-body font-semibold mb-2 text-gray-700 dark:text-gray-300">
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
              <button
                onClick={() => setEditingTransaction(null)}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleEditSave}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md">
            <h2 className="text-title font-bold text-gray-900 dark:text-white mb-4">
              Confirmar Eliminación
            </h2>
            <p className="text-body text-gray-600 dark:text-gray-400 mb-6">
              ¿Estás seguro de eliminar esta transacción de {formatCurrency(deletingTransaction.amount)}?
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => setDeletingTransaction(null)}
                className="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="btn-danger flex-1 flex items-center justify-center gap-2"
              >
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
