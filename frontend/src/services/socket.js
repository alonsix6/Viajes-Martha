import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

let socket = null;

export const initializeSocket = () => {
  if (socket) {
    return socket;
  }

  socket = io(SOCKET_URL, {
    autoConnect: true,
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('✓ Socket connected:', socket.id);
  });

  socket.on('disconnect', (reason) => {
    console.log('✗ Socket disconnected:', reason);
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    return initializeSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const subscribeToTransactions = (callback) => {
  const socket = getSocket();

  socket.on('transaction:created', (data) => {
    console.log('Transaction created:', data);
    callback({ type: 'created', data });
  });

  socket.on('transaction:updated', (data) => {
    console.log('Transaction updated:', data);
    callback({ type: 'updated', data });
  });

  socket.on('transaction:deleted', (data) => {
    console.log('Transaction deleted:', data);
    callback({ type: 'deleted', data });
  });
};

export const unsubscribeFromTransactions = () => {
  const socket = getSocket();
  socket.off('transaction:created');
  socket.off('transaction:updated');
  socket.off('transaction:deleted');
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  subscribeToTransactions,
  unsubscribeFromTransactions,
};
