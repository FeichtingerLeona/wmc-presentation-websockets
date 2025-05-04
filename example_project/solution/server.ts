import { WebSocketServer } from 'ws';
import * as http from 'http';
import * as fs from 'fs';
import * as path from 'path';

const server = http.createServer((req, res) => {
    let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
    const ext = path.extname(filePath);

    let contentType = 'text/html';
    if (ext === '.js') contentType = 'text/javascript';

    fs.readFile(filePath, (err, content) => {
        if (err) {
            res.writeHead(404);
            res.end('Not Found');
            return;
        }
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content);
    });
});

const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
    console.log('Neuer Client verbunden');

    ws.on('message', (data) => {
        const message = JSON.parse(data.toString());
        const fullMessage = `[${message.name}]: ${message.text}`;

        console.log('📨', fullMessage);

        // Nachricht an alle Clients weiterleiten
        wss.clients.forEach(client => {
            if (client.readyState === ws.OPEN) {
                client.send(fullMessage);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client getrennt');
    });
});

server.listen(3000, () => {
    console.log('Server läuft unter http://localhost:3000');
});
