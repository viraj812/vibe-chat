import * as io from 'socket.io-client';

const socket = io('http://ec2-13-235-95-222.ap-south-1.compute.amazonaws.com/', { transports: ['polling'] });

export default socket;