// custom imports
import { getChatHistory, saveMessage } from "../services/wsService";
import { getUserById, validateAccessToken } from "../services/session";


// server code

export const wsController = async (ws, wss, req) => {

    const accessToken = req.headers['sec-websocket-protocol'];
    if (!accessToken) {
        ws.close(1008, 'Unauthorized');
        return;
    }

    try {

        const userId = await validateAccessToken(accessToken);
        const user = await getUserById(userId);
        console.log(`User connected: ${user.username}`);

    // chat history
    const messages = await getChatHistory();
    ws.send(JSON.stringify({ event: 'chatHistory', data: messages }));

    // new messages
    ws.on('message', async (data) => {

        try {
            const { text } = JSON.parse(data);

            if (!text || text.trim().length === 0) {
                ws.send(JSON.stringify({ error: 'Message cannot be empty' }));
                return;
            }

            if (text.trim().length > 500) {
                ws.send(JSON.stringify({ error: 'Message is too long' }));
                return;
            }

            // save the message
            const savedMessage = await saveMessage(user.username, text.trim());

            // send the message to all participants
            wss.clients.forEach((client) => {
                if (client.readyState === ws.OPEN) {
                    client.send(JSON.stringify({
                        username: savedMessage.username,
                        text: savedMessage.text,
                        timestamp: savedMessage.timestamp,
                    }));
                }
            });
        } catch (error) {
            console.error('Error:', error);
            ws.send(JSON.stringify({ error: 'Oops, try again' }));
        }
    });

    // client gone
    ws.on('close', () => {
        console.log(`User ${user.username} has gone`);
    });
} catch (error) {
    console.error('User unauthorized:', error);
        ws.close(1008, 'Unauthorized');
}
};
