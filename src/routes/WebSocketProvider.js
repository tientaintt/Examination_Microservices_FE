import React, { createContext, useContext, useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getUserInfo } from '../services/ApiService';

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [stompClient, setStompClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isNewNotification,setIsNewNotification]=useState(false);
    const userInfor=JSON.parse(getUserInfo());
    const connectWebSocket = (userId) => {
        const client = Stomp.over(() => new SockJS('http://localhost:8081/notify/ws', null, {
            transports: ['xhr-streaming', 'xhr-polling', 'websocket'],
            withCredentials: true,
        }));

        client.connect({}, () => {
            console.log('Connected to WebSocket');
            setIsConnected(true);
           
            client.subscribe(`/topic/notifications/${userId}`, (message) => {
                setIsNewNotification(true);
                console.log('Received notification:', message);

                let data;

                if (message.binaryBody) {
                   
                    const bodyString = new TextDecoder().decode(message.binaryBody);
                    
                    data = JSON.parse(bodyString);
                } else {
                   
                    data = JSON.parse(message.body);
                }

                console.log("Received notification:", data);
            });
        });

        client.onStompError = (error) => {
            console.error('STOMP connection error:', error);
        };

        setStompClient(client);
    };

    const disconnectWebSocket = () => {
        if (stompClient) {
            stompClient.disconnect(() => {
                console.log('Disconnected from WebSocket');
                setIsConnected(false);
                setIsNewNotification(false);
            });
        }
    };
    useEffect(()=>{
      
        connectWebSocket(userInfor?.userId)
        return (()=>disconnectWebSocket())
    },[])
    return (
        <WebSocketContext.Provider value={{ connectWebSocket, disconnectWebSocket, isConnected,isNewNotification, setIsNewNotification }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useWebSocket = () => {
    return useContext(WebSocketContext);
};
