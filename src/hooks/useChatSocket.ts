import { useEffect } from 'react';
import io from 'socket.io-client';
import { useAppDispatch } from '../redux/hooks';
import { supportChatsApi } from '../features/supportChats/supportChatsApi';
import { baseURL } from '../utils/BaseURL';
import { getToken } from '../utils/storage';

export const useChatSocket = (chatId: string | null | undefined) => {
    const dispatch = useAppDispatch();

    const rawToken = (typeof window !== 'undefined'
        ? (getToken() || localStorage.getItem('douxsii-admin-token') || localStorage.getItem('accessToken') || localStorage.getItem('token'))
        : null) || '';

    const cleanToken = rawToken ? rawToken.replace(/^Bearer\s+/i, '') : '';
    const bearerToken = cleanToken ? `Bearer ${cleanToken}` : '';

    useEffect(() => {
        if (!chatId) return;

        const socketURL = baseURL.replace(/\/$/, '');
        const eventName = `new-message::${chatId}`;

        console.log(`[Socket.io] Initializing chat socket for event: [${eventName}]`);

        const socketOptions: any = {
            transports: ['websocket', 'polling'],
            auth: {
                token: cleanToken,
                accessToken: cleanToken,
                authorization: bearerToken || cleanToken,
                Authorization: bearerToken || cleanToken,
            },
            query: {
                token: cleanToken,
                authorization: bearerToken || cleanToken,
            },
            extraHeaders: cleanToken ? {
                authorization: bearerToken,
                Authorization: bearerToken,
                token: cleanToken,
            } : {},
            autoConnect: true,
        };

        const socket: any = io(socketURL, socketOptions);

        const handleNewMessage = (data: any) => {
            console.log(`[Socket.io] Realtime message received on [${eventName}]:`, data);

            // Invalidate 'chat' tag in RTK Query to refresh message list & chat list
            dispatch(supportChatsApi.util.invalidateTags(['chat']));

            // Force refetch current chat messages
            dispatch(
                supportChatsApi.endpoints.getMessageByChatId.initiate(
                    { chatId },
                    { subscribe: false, forceRefetch: true }
                )
            );

            // Refetch all chat list to update last message & timestamp in sidebar
            dispatch(
                supportChatsApi.endpoints.supportChats.initiate(
                    undefined,
                    { subscribe: false, forceRefetch: true }
                )
            );
        };

        socket.on('connect', () => {
            console.log(`[Socket.io] Chat socket connected successfully! ID: ${socket.id}. Listening on: ${eventName}`);
        });

        socket.on(eventName, handleNewMessage);
        socket.on('new-message', handleNewMessage);
        socket.on('newMessage', handleNewMessage);

        socket.on('connect_error', (err: any) => {
            console.error('[Socket.io] Chat socket connection error:', err);
        });

        return () => {
            socket.off(eventName, handleNewMessage);
            socket.off('new-message', handleNewMessage);
            socket.off('newMessage', handleNewMessage);
            socket.disconnect();
        };
    }, [chatId, cleanToken, bearerToken, dispatch]);
};
