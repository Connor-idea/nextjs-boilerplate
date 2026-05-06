import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://127.0.0.1:4000';

let crmSocket;

export function getCrmSocket() {
  if (!crmSocket) {
    crmSocket = io(SOCKET_URL, {
      transports: ['websocket'],
      autoConnect: true,
    });
  }

  return crmSocket;
}

export function closeCrmSocket() {
  if (crmSocket) {
    crmSocket.close();
    crmSocket = null;
  }
}