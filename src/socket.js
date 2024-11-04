import * as io from 'socket.io-client';
 
const socket = io('http://localhost:8082', { transports: ['websocket'] });

export default socket;