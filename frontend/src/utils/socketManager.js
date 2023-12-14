import { io } from 'socket.io-client';

let sSocket = null;
let gettingNew = false;
export const socketPromise = async () => { 
    console.log("SSicjet", sSocket);
    if (!sSocket && !gettingNew) {
        gettingNew = true;
        sSocket = await fetch('/api/urlEndpoint')
            .then((response) => response.json())
            .then(async (data) => {
                const socketUrl = data.socketUrl + ':3001';
                

                return await io(socketUrl, { transports: ['websocket'] });
            });
            console.log("Creating another", sSocket);
    }
    return sSocket;
}
