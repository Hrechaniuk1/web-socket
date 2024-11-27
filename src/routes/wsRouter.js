// custom imports
import { wsController } from "../controllers/wsController";

// server code

export const wsRoute = (wss) => {
    wss.on('connection', (ws, req) => {
        wsController(ws, wss, req);
    });
};
