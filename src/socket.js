import * as io from 'socket.io-client';

const socket = io('https://ec2-13-235-95-222.ap-south-1.compute.amazonaws.com:4001', { transports: ['polling'] });

export default socket;