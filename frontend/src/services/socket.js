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

// TODO: Implement socket event listeners
// These will be implemented in the next phase
export const subscribeToTransactions = (callback) => {
  // Listen for transaction:created, transaction:updated, transaction:deleted
  // Call callback with updated data
};

export const unsubscribeFromTransactions = () => {
  // Remove transaction event listeners
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket,
  subscribeToTransactions,
  unsubscribeFromTransactions,
};
