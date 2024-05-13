import * as io from 'socket.io-client';

const socket = io('https://chat-server-rho-dun.vercel.app/', { transports: ['polling'] });

export default socket;