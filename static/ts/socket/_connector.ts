import { io, Socket } from 'socket.io-client';
import { getCookie } from '../_cookie_manager';
import chalk from "chalk";
import { CookieResponse } from '../interfaces';

async function main() {
    const st = await getCookie('_sho-session');
    const v = 1; // Replace with the actual version you're using
    const _gateway = 'https://gateway.shoshin.moe';

    if (st) {
        const socket: Socket = io(_gateway, {
            transports: ['websocket', 'polling'],
            query: { t: st.raw.token, v: v }
        });

        // Listen for the connection_info event
        socket.on('connection_info', (data: { version: string, session_token: string }) => {
            console.log(
                chalk.magenta('[Websocket] ') + 
                _gateway + `?t=${data.session_token}&v=${data.version},   ` + 
                chalk.bold.gray(`v${data.version},   `) + 
                chalk.green('Connected')
            );
        });

        // Send a ping every 10 seconds
        setInterval(() => {
            socket.emit('ping_event', 'ping');
            console.log(chalk.cyan('Ping sent'));
        }, 10000);

        socket.on('message', (message: string) => {
            console.log(chalk.green('Message received from server:'), chalk.magenta(message));
        });

        socket.on('pong', () => {
            console.log(chalk.green('Pong received'));
        });

        socket.on('disconnect', (reason: string) => {
            console.log(chalk.red('WebSocket connection closed, reason:'), chalk.yellow(reason));
        });

        socket.on('connect_error', (error: Error) => {
            console.error(chalk.red('WebSocket connection error:'), chalk.magenta(error.message));
        });
    } else {
        console.error(chalk.red('Session token is missing.'));
    }
}

main();