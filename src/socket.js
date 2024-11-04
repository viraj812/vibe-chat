import * as io from 'socket.io-client';
 
const socket = io('https://vibe-chat-server-2jl6.onrender.com:8080', { transports: ['polling'] });

// const socket = io('localhost:8080', { transports: ['websocket', 'polling'] });

export default socket;