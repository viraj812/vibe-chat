import * as io from 'socket.io-client';
 
const socket = io('https://nodejs-production-d118.up.railway.app', { transports: ['websocket', 'polling'] });

// const socket = io('localhost:8080', { transports: ['websocket', 'polling'] });

export default socket;
