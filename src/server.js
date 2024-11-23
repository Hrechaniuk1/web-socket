// general imports
import express from 'express';
import cors from 'cors';

// custom imports
import { env } from './helpers/env.js';
import errorHandler from './middleware/errorHandler.js'
import notFoundHandler from './middleware/notFoundHandler.js'
import router from './routes/index.js';

// support code
const PORT = Number(env('PORT'));

// server code

export const setupServer = async () => {
    const app = express();

    app.use(cors());
    app.use(express.json());
    app.use(router);
    app.use('*', notFoundHandler);

    app.use(errorHandler);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
});
};
