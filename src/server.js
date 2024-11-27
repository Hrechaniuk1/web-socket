// general imports
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { WebSocketServer } from 'ws';
import http from 'http'

// custom imports
import { env } from './helpers/env.js';
import errorHandler from './middleware/errorHandler.js'
import notFoundHandler from './middleware/notFoundHandler.js'
import router from './routes/index.js';

// support code
const PORT = Number(env('PORT'));
// const PORTWS = Number(env('PORTWS'))

// server code

export const setupServer = async () => {

    // express

    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(cookieParser());

    app.use(router);

    app.use('*', notFoundHandler);

    app.use(errorHandler);

    // main server
    const server = http.createServer(app);

    // wss
    const wss = new WebSocketServer({server})

    wss.on('connection', (ws) => {
        console.log('New WebSocket client connected');

        // Обработка полученных сообщений
        ws.on('message', (message) => {
            console.log('Received:', message);

            // Рассылаем сообщение всем клиентам
            wss.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(message);
                }
            });
        });

        // Обработка отключений
        ws.on('close', () => {
            console.log('WebSocket client disconnected');
        });
    });

    // start server

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
});
    server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
};
