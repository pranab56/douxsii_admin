import { useEffect } from 'react';
import io from 'socket.io-client';
import { useAppDispatch } from '../redux/hooks';
import { notificationApi } from '../features/notification/notificationApi';
import { useGetMyProfileQuery } from '../features/profile/profileApi';
import { baseURL } from '../utils/BaseURL';
import { getToken } from '../utils/storage';
import toast from 'react-hot-toast';

export const useNotificationSocket = () => {
    const dispatch = useAppDispatch();
    const { data: profileResponse } = useGetMyProfileQuery();

    const profile = profileResponse?.data?.result || (profileResponse?.data as any);
    const storedUserData = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('userData') || '{}') : {};
    
    // Resolve userId accurately from profile response or stored userData
    const userId = profile?._id || profile?.id || storedUserData?._id || storedUserData?.id || storedUserData?.user?._id || storedUserData?.user?.id;

    // Retrieve token from storage utility and localStorage keys
    const rawToken = (typeof window !== 'undefined' 
        ? (getToken() || localStorage.getItem('douxsii-admin-token') || localStorage.getItem('accessToken') || localStorage.getItem('token'))
        : null) || '';
        
    const cleanToken = rawToken ? rawToken.replace(/^Bearer\s+/i, '') : '';
    const bearerToken = cleanToken ? `Bearer ${cleanToken}` : '';

    useEffect(() => {
        if (!userId) {
            console.log('[Socket.io] Waiting for userId before establishing socket connection...');
            return;
        }

        const socketURL = baseURL.replace(/\/$/, '');
        const userEventName = `notification::${userId}`;

        console.log(`[Socket.io] Connecting to ${socketURL} for user ${userId} on event [${userEventName}]`);

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

        const handleIncomingNotification = (data: any) => {
            console.log(`[Socket.io] Realtime notification received on event [${userEventName}]:`, data);
            
            const title = data?.title || data?.data?.title || 'New Notification';
            const message = data?.message || data?.data?.message || 'You have received a new notification.';
            
            toast.custom(
                (t) => (
                    <div
                        className={`max-w-md w-full bg-[#46000B] border border-[#ff4b72]/40 shadow-2xl rounded-2xl pointer-events-auto flex p-4 text-white gap-3 items-start transition-all duration-300 ${
                            t.visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                        }`}
                        style={{
                            boxShadow: '0 20px 30px -10px rgba(255, 75, 114, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.5)'
                        }}
                    >
                        <div className="w-9 h-9 rounded-xl bg-[#ff4b72]/20 border border-[#ff4b72]/30 flex items-center justify-center text-[#ff4b72] shrink-0 font-bold text-base">
                            🔔
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-white m-0">{title}</p>
                            <p className="text-xs text-white/70 mt-1 m-0 leading-relaxed">{message}</p>
                        </div>
                    </div>
                ),
                { duration: 6000 }
            );

            // Invalidate tags & force RTK query network refetch
            dispatch(notificationApi.util.invalidateTags(['notification']));
            dispatch(notificationApi.endpoints.getAllNotification.initiate(undefined, { subscribe: false, forceRefetch: true }));
        };

        socket.on('connect', () => {
            console.log(`[Socket.io] Connected successfully! Socket ID: ${socket.id}. Event: ${userEventName}`);
        });

        socket.on(userEventName, handleIncomingNotification);
        socket.on('notification', handleIncomingNotification);
        socket.on('getNotification', handleIncomingNotification);

        socket.on('connect_error', (err: any) => {
            console.error('[Socket.io] Connection error:', err);
        });

        return () => {
            socket.off(userEventName, handleIncomingNotification);
            socket.off('notification', handleIncomingNotification);
            socket.off('getNotification', handleIncomingNotification);
            socket.disconnect();
        };
    }, [userId, cleanToken, bearerToken, dispatch]);
};
