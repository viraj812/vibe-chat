import * as io from 'socket.io-client';
 
const socket = io('https://vibe-chat-server-2jl6.onrender.com', { transports: ['websocket'] });

// const socket = io('localhost:8080', { transports: ['websocket', 'polling'] });

export default socket;