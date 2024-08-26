import * as io from 'socket.io-client';
// 
const socket = io('https://chat-server-08.netlify.app', { transports: ['polling'] });

export default socket;