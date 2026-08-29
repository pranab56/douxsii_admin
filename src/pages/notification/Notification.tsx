import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoArrowBackOutline } from 'react-icons/io5';
import { FiBell, FiCheckCircle } from 'react-icons/fi';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Pagination from '../../components/ui/Pagination';
import EmptyData from '../../components/ui/EmptyData';
import toast from 'react-hot-toast';

import {
    useGetAllNotificationQuery,
    useSingleReadNotificationMutation,
    useReadAllNotificationMutation,
    NotificationItem
} from '../../features/notification/notificationApi';

const Notification = () => {
    const navigate = useNavigate();

    const [page, setPage] = useState(1);

    const { data: notificationResponse, isLoading, isFetching } = useGetAllNotificationQuery({ page });

    const [singleReadNotification] = useSingleReadNotificationMutation();

    const [readAllNotification, { isLoading: isReadingAll }] = useReadAllNotificationMutation();

    const notificationsList: NotificationItem[] = notificationResponse?.data || [];

    const meta = notificationResponse?.meta;

    const pageSize = meta?.limit || 10;

    const totalItems = meta?.total || notificationsList.length;

    const hasUnread = notificationsList.some(n => !n.isRead);

    const handleSingleRead = async (item: NotificationItem) => {
        if (item.isRead) return;
        try {
            const res = await singleReadNotification(item._id).unwrap();
            toast.success(res?.message || 'Notification marked as read');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to mark as read');
        }
    };

    const handleReadAll = async () => {
        try {
            const res = await readAllNotification().unwrap();
            toast.success(res?.message || 'All notifications marked as read');
        } catch (err: any) {
            toast.error(err?.data?.message || 'Failed to mark all as read');
        }
    };

    return (
        <div className="space-y-6 pb-6 relative">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="text-white hover:text-white/80 transition-colors p-1 mt-0.5 cursor-pointer bg-transparent border-0 outline-none"
                    >
                        <IoArrowBackOutline size={26} />
                    </button>
                    <div>
                        <h1
                            className="text-white font-bold m-0 font-sans"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '30px',
                                lineHeight: '36px',
                                letterSpacing: '0px'
                            }}
                        >
                            Notifications
                        </h1>
                        <p
                            className="text-white/60 m-0 mt-1.5 font-sans"
                            style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '16px',
                                lineHeight: '24px',
                                letterSpacing: '0px'
                            }}
                        >
                            See all system notifications
                        </p>
                    </div>
                </div>

                {hasUnread && (
                    <button
                        type="button"
                        disabled={isReadingAll}
                        onClick={handleReadAll}
                        className="flex items-center gap-2 h-10 px-4 rounded-xl text-white font-medium text-xs sm:text-sm transition-all hover:opacity-90 active:scale-95 cursor-pointer border-0 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ background: '#7a0015' }}
                    >
                        {isReadingAll ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" />
                                <span>Marking as Read...</span>
                            </>
                        ) : (
                            <>
                                <FiCheckCircle size={16} />
                                <span>Mark All as Read</span>
                            </>
                        )}
                    </button>
                )}
            </div>

            {/* Notifications List Container */}
            <div className="flex flex-col gap-4">
                {isLoading ? (
                    <div className="py-12">
                        <LoadingSpinner text="Loading notifications..." />
                    </div>
                ) : notificationsList.length === 0 ? (
                    <EmptyData message="No notifications found" />
                ) : (
                    notificationsList.map((item) => {
                        const dateFormatted = item.createdAt
                            ? new Date(item.createdAt).toLocaleString([], {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })
                            : 'N/A';

                        return (
                            <div
                                key={item._id}
                                onClick={() => handleSingleRead(item)}
                                className={`p-5 rounded-2xl flex items-start justify-between gap-4 transition-all duration-300 cursor-pointer ${!item.isRead
                                    ? 'bg-white/[0.07] hover:bg-white/[0.09] border-[#ff4b72]/30 shadow-[0_0_15px_rgba(255,75,114,0.05)]'
                                    : 'bg-white/[0.03] hover:bg-white/[0.05] border-white/10'
                                    }`}
                                style={{
                                    borderWidth: '1px',
                                    borderStyle: 'solid',
                                }}
                            >
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <div className="flex items-center gap-2.5">
                                        {!item.isRead && (
                                            <span className="w-2.5 h-2.5 rounded-full bg-[#ff4b72] shrink-0 animate-pulse" title="Unread" />
                                        )}
                                        <h3 className="text-white text-base font-semibold m-0">{item.title}</h3>
                                        {item.type && (
                                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white/80 border border-white/10">
                                                {item.type}
                                            </span>
                                        )}
                                    </div>

                                    <p className="text-white/70 text-sm m-0 leading-relaxed max-w-3xl">{item.message}</p>

                                    <div className="text-white/40 text-xs mt-1.5 flex items-center gap-2">
                                        <span>{dateFormatted}</span>
                                        {item.status && (
                                            <>
                                                <span>•</span>
                                                <span className="capitalize text-white/50">{item.status}</span>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="shrink-0 mt-1">
                                    <FiBell className={!item.isRead ? "text-[#ff4b72]" : "text-white/30"} size={22} />
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Pagination */}
            {totalItems > pageSize && (
                <div className="mt-4 flex justify-end">
                    <Pagination
                        current={page}
                        pageSize={pageSize}
                        total={totalItems}
                        onChange={(p) => setPage(p)}
                    />
                </div>
            )}
        </div>
    );
};

export default Notification;
