import { Layout, Badge, Dropdown } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { IoNotificationsOutline } from 'react-icons/io5';
import { AiOutlineLogout, AiOutlineUser } from 'react-icons/ai';
import { removeFromLocalStorage } from '../../utils/localStorage';
import ConfirmModal from '../ui/ConfirmModal';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../features/auth/authSlice';
import { useGetMyProfileQuery } from '../../features/profile/profileApi';
import { useGetAllNotificationQuery } from '../../features/notification/notificationApi';
import { baseURL } from '../../utils/BaseURL';

const { Header } = Layout;

const HeaderDashboard = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    // Fetch real profile data from profileApi
    const { data: profileResponse } = useGetMyProfileQuery();
    const profile = profileResponse?.data?.result;

    // Fetch real notifications count
    const { data: notificationResponse } = useGetAllNotificationQuery();
    const unreadCount = notificationResponse?.data?.filter(n => !n.isRead).length ?? 0;

    const rawProfileImage = profile?.profile;
    const avatarUrl = rawProfileImage
        ? (rawProfileImage.startsWith('http') ? rawProfileImage : `${baseURL}/${rawProfileImage.replace(/\\/g, '/')}`)
        : '/user.svg';

    const fullName = profile?.fullName || 'Admin';
    const roleTitle = profile?.role ? profile.role.replace(/_/g, ' ') : 'super_admin';

    const handleOpenLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const handleConfirmLogout = () => {
        dispatch(logout());
        removeFromLocalStorage('accessToken');
        removeFromLocalStorage('userData');
        removeFromLocalStorage('forgetToken');
        setIsLogoutModalOpen(false);
        navigate('/login');
        window.location.href = '/login';
    };

    const handleCancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    const profileMenuItems = [
        {
            key: 'profile',
            label: <Link to="/profile">My Profile</Link>,
            icon: <AiOutlineUser size={16} />,
        },
        {
            key: 'logout',
            label: <span className="text-red-500 font-medium">Log Out</span>,
            icon: <AiOutlineLogout size={16} className="text-red-500" />,
            onClick: handleOpenLogoutModal,
        },
    ];

    return (
        <Header
            style={{
                height: 80,
                background: 'linear-gradient(to right, #46000B, #6B000F)',
                width: '100%',
                padding: '0 24px',
                borderBottom: '1.5px solid rgba(255, 255, 255, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
            }}
        >
            <div className="flex items-center gap-5">
                {/* Notifications */}
                <Link to="/notification" className="flex items-center justify-center">
                    <div className="flex items-center justify-center cursor-pointer relative transition-opacity hover:opacity-85">
                        <Badge count={unreadCount} size="small" offset={[2, -2]} color="#ff4d4f">
                            <IoNotificationsOutline size={24} className="text-[#ff4b72]" />
                        </Badge>
                    </div>
                </Link>

                {/* Vertical Divider */}
                <div className="w-[1.5px] h-6 bg-white/20 self-center" />

                {/* Profile Dropdown */}
                <Dropdown menu={{ items: profileMenuItems }} placement="bottomRight" trigger={['click']}>
                    <div className="flex items-center gap-3 cursor-pointer select-none py-1 px-2 rounded-lg hover:bg-white/5 transition-colors">
                        <img
                            src={avatarUrl}
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '1.5px solid rgba(255, 255, 255, 0.8)',
                                objectFit: 'cover',
                            }}
                            alt={fullName}
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = '/user.svg';
                            }}
                        />
                        <div className="hidden sm:block text-left">
                            <h2 className="text-white text-sm font-semibold leading-tight">
                                {fullName}
                            </h2>
                            <p className="text-xs text-white/60 capitalize leading-none mt-0.5">
                                {roleTitle}
                            </p>
                        </div>
                    </div>
                </Dropdown>
            </div>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                open={isLogoutModalOpen}
                title="Logout"
                description="Are you sure you want to log out from your admin dashboard?"
                type="danger"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </Header>
    );
};

export default HeaderDashboard;
