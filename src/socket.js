import * as io from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
// const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:4001/';

const socket = io('http://localhost:4001/', { transports: ['polling'] });

export default socket;