// custom imports
import { setupServer } from "./server.js";
import { innitMongoDBConnection } from "./db/initMDBConnection.js";


// server code
async function bootstrap() {
    await innitMongoDBConnection();
    await setupServer();
}

bootstrap()
