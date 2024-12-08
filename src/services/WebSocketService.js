import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

class WebSocketService {
    constructor() {
        // Use a factory function to initialize SockJS, which is required for Stomp auto-reconnect to work
        this.stompClient = Stomp.over(() => new SockJS('http://localhost:8081/notify/ws', null, {
            transports: ['xhr-streaming', 'xhr-polling', 'websocket'],
            withCredentials: true // Enable sending cookies with WebSocket connection
        }));

        this.stompClient.debug = (str) => {
            console.log('STOMP DEBUG:', str);
        };
    }

    connect(userId, onMessageReceived) {
        console.log(userId);

        console.log("STOMP client status before connect:", this.stompClient);
        
        // Set up a successful connection callback
        this.stompClient.onConnect = () => {
            console.log('STOMP client connected successfully.');
        };

        // Connection error handler
        this.stompClient.onStompError = (error) => {
            console.error('STOMP connection error:', error);
        };

        // Connect and log success or failure
        this.stompClient.connect(
            {},
            () => {
                console.log('Connected to WebSocket');
                if (onMessageReceived) {
                    this.stompClient.subscribe(`/topic/notifications/${userId}`, onMessageReceived);
                }
            },
            (error) => {
                console.error('Connection failed: ', error);
            }
        );
    }

    disconnect() {
        if (this.stompClient) {
            this.stompClient.disconnect(() => {
                console.log('Disconnected from WebSocket');
            });
        }
    }

    errorCallback(error) {
        console.log("WebSocket connection error: ", error);
        setTimeout(() => {
            this.connect();
        }, 5000);
    }

    sendNotification(destination, payload) {
        this.stompClient.send(destination, {}, JSON.stringify(payload));
    }
}

export default new WebSocketService();
