import * as io from 'socket.io-client';
 
const socket = io('https://vibe-chat-server-2jl6.onrender.com', { transports: ['websocket', 'polling'] });

export default socket;