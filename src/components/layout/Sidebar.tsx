import { useState } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import { TSidebarItem } from '../../utils/generateSidebarItems';
import sidebarItems from '../../utils/sidebarItems';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeFromLocalStorage } from '../../utils/localStorage';
import { TbLogout } from 'react-icons/tb';
import ConfirmModal from '../ui/ConfirmModal';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../features/auth/authSlice';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

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

    const sidebarItemsGenerator = (items: TSidebarItem[]): MenuProps['items'] => {
        return items.map((item) => ({
            key: item.path === '' ? '/' : `/${item.path}`,
            icon: item.icon,
            label: <Link to={item.path === '' ? '/' : `/${item.path}`}>{item.label}</Link>,
        }));
    };

    return (
        <ConfigProvider
            theme={{
                token: {
                    fontFamily: 'Montserrat, sans-serif',
                },
                components: {
                    Menu: {
                        itemBg: 'transparent',
                        itemColor: 'rgba(255, 255, 255, 0.7)',
                        itemHoverColor: '#ffffff',
                        itemHoverBg: 'rgba(255, 255, 255, 0.08)',
                        itemSelectedColor: '#ffffff',
                        itemSelectedBg: 'rgba(255, 255, 255, 0.15)',
                        itemActiveBg: 'rgba(255, 255, 255, 0.15)',
                        itemBorderRadius: 8,
                        itemHeight: 40,
                        itemMarginBlock: 4,
                        itemMarginInline: 0,
                    },
                },
            }}
        >
            <Sider
                width={260}
                breakpoint="lg"
                collapsedWidth="0"
                style={{
                    background: 'linear-gradient(to bottom, #46000B, #6B000F)',
                    borderRight: '1.5px solid rgba(255, 255, 255, 0.3)',
                    height: '100vh',
                    position: 'sticky',
                    top: 0,
                    left: 0,
                    zIndex: 10,
                }}
            >
                <div className="flex flex-col h-full">
                    {/* Header/Logo Section */}
                    <Link to="/">
                        <div className="flex flex-col items-center justify-center pt-8 pb-6  transition-all hover:opacity-90">
                            <img
                                src="/logo.png"
                                alt="Logo"
                                className="w-16 h-16 object-contain rounded-full shadow-sm"
                                onError={(e) => {
                                    (e.target as HTMLImageElement).src = "/vite.svg";
                                }}
                            />
                            <h1 className="text-lg font-bold text-white mt-3 tracking-wide">Admin Dashboard</h1>
                            <p className="text-xs text-white/60 mt-0.5">Receipt Observatory</p>
                        </div>
                    </Link>

                    <div className="mx-6 border-b border-white/20 mb-6" />

                    {/* Scrollable Menu Items */}
                    <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
                        <Menu
                            theme="light"
                            mode="inline"
                            selectedKeys={[location.pathname]}
                            items={sidebarItemsGenerator(sidebarItems)}
                            style={{ borderRight: 0, background: 'transparent' }}
                        />
                    </div>

                    {/* Footer / Logout Button Section */}
                    <div className="p-6 mt-auto">
                        <button
                            onClick={handleOpenLogoutModal}
                            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg text-white font-medium transition-all hover:bg-white/10 active:scale-95 cursor-pointer"
                            style={{
                                border: '1.5px solid rgba(255, 255, 255, 0.3)',
                                background: 'transparent',
                            }}
                        >
                            <TbLogout size={20} />
                            <span>Logout</span>
                        </button>
                        <div className="text-center text-white/50 text-[11px] mt-3 tracking-wide">
                            Copyright@app
                        </div>
                    </div>
                </div>
            </Sider>

            {/* Logout Confirmation Modal */}
            <ConfirmModal
                open={isLogoutModalOpen}
                title="Logout"
                description="Are you sure you want to log out from your admin dashboard?"
                type="danger"
                onConfirm={handleConfirmLogout}
                onCancel={handleCancelLogout}
            />
        </ConfigProvider>
    );
};

export default Sidebar;
