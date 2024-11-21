import { io } from 'socket.io-client';

const isProduction = process.env.NODE_ENV === 'production';
const socketUrl = isProduction ?
    process.env.REACT_APP_BASE_API_URL_PROD :
    process.env.REACT_APP_BASE_API_URL_DEV;
const socketPath = isProduction ? '/websocket/socket.io' : '';

export const socket = io(socketUrl, {
    path: socketPath,
    transports: ['websocket'],
    secure: isProduction,
    rejectUnauthorized: false,
});
