import * as io from 'socket.io-client';
// 
const socket = io('http://localhost:4001', { transports: ['polling'] });

export default socket;