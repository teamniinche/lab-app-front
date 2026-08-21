import { io } from 'socket.io-client';
import { dbBaseRoot } from './constantes';

// Correction de la logique d'URL
const SOCKET_SERVER_URL = dbBaseRoot.split('/tn-api')[0];
const socket = io(SOCKET_SERVER_URL, { // Toujours utiliser l'URL du serveur API
  transports: ["websocket"],           // Doit matcher le serveur
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: Infinity,
  timeout: 10000,                      // 10s suffisent pour un timeout
});

export default socket;

