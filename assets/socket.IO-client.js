// ================= SOCKET.IO.CLIENT =========================
import { io } from 'socket.io-client';
const SOCKET_SERVER_URL = 'https://api-tn-46ff13fab352.herokuapp.com';

export default socket = io(SOCKET_SERVER_URL,{
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5, // Nombre de tentatives avant échec
  reconnectionDelay: 3000,
});