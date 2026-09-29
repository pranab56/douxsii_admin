import { useState, useEffect } from 'react';
import { ConfigProvider, Layout, Menu, MenuProps } from 'antd';
import { TSidebarItem } from '../../utils/generateSidebarItems';
import sidebarItems from '../../utils/sidebarItems';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { removeFromLocalStorage } from '../../utils/localStorage';
import { TbLogout } from 'react-icons/tb';
import ConfirmModal from '../ui/ConfirmModal';
import { useAppDispatch } from '../../redux/hooks';
import { logout } from '../../features/auth/authSlice';

import { useGetMyProfileQuery } from '../../features/profile/profileApi';
import { FiShoppingCart, FiBox, FiPieChart, FiSettings } from 'react-icons/fi';

const { Sider } = Layout;

const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const [openKeys, setOpenKeys] = useState<string[]>([]);

    const { data: profileResponse } = useGetMyProfileQuery();
    const myShop = profileResponse?.data?.result?.shopId;
    const hasShop = Boolean(myShop && (myShop._id || myShop.name));

    useEffect(() => {
        const path = location.pathname;
        // Vendors auto-open: only /vendors/* and standalone /orders, /products
        const isVendorChildRoute = ['/vendors'].some(
            (p) => path === p || path.startsWith(p + '/')
        ) || path === '/orders' || path === '/products';
        if (isVendorChildRoute) {
            setOpenKeys((prev) => (prev.includes('vendors') ? prev : [...prev, 'vendors']));
        }
        // My Shop auto-open: /my-shop/* and /shop/*
        const isMyShopRoute = path === '/my-shop' || path.startsWith('/my-shop/') || path.startsWith('/shop/');
        if (hasShop && isMyShopRoute) {
            setOpenKeys((prev) => (prev.includes('my-shop') ? prev : [...prev, 'my-shop']));
        }
    }, [location.pathname, hasShop]);

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

    const processedItems: TSidebarItem[] = sidebarItems.map((item) => {
        if (item.key === 'my-shop') {
            if (hasShop) {
                return {
                    ...item,
                    children: [
                        {
                            key: 'my-shop-overview',
                            label: 'Overview',
                            path: 'shop/overview',
                            icon: <FiPieChart size={18} />,
                        },
                        {
                            key: 'my-shop-products',
                            label: 'Product',
                            path: 'shop/products',
                            icon: <FiBox size={18} />,
                        },
                         {
                            key: 'my-shop-orders',
                            label: 'Order',
                            path: 'shop/orders',
                            icon: <FiShoppingCart size={18} />,
                        },
                        {
                            key: 'my-shop-profile',
                            label: 'Settings',
                            path: 'my-shop',
                            icon: <FiSettings size={18} />,
                        },
                       
                        
                    ],
                };
            }
            return {
                ...item,
                children: undefined,
            };
        }
        return item;
    });

    const sidebarItemsGenerator = (items: TSidebarItem[]): MenuProps['items'] => {
        return items.map((item) => {
            if (item.children && item.children.length > 0) {
                // Parent with children — make parent label a Link if it has a path
                const parentLabel = item.path !== undefined
                    ? <Link to={item.path === '' ? '/' : `/${item.path}`}>{item.label}</Link>
                    : item.label;
                return {
                    key: item.key,
                    icon: item.icon,
                    label: parentLabel,
                    children: item.children.map((child) => {
                        const childPath = child.path === '' ? '/' : `/${child.path}`;
                        return {
                            key: childPath,
                            icon: child.icon,
                            label: <Link to={childPath}>{child.label}</Link>,
                        };
                    }),
                };
            }
            const itemPath = item.path === '' ? '/' : `/${item.path}`;
            return {
                key: itemPath,
                icon: item.icon,
                label: <Link to={itemPath}>{item.label}</Link>,
            };
        });
    };

    let selectedKey = location.pathname;
    // Remap /shop (bare) and /vendors/overview to /shop/overview
    if (selectedKey === '/shop' || selectedKey === '/vendors/overview') selectedKey = '/shop/overview';
    if (selectedKey === '/vendors/orders') selectedKey = '/orders';
    if (selectedKey === '/vendors/products') selectedKey = '/products';
    if (selectedKey === '/shop/order') selectedKey = '/shop/orders';
    if (selectedKey === '/shop/product') selectedKey = '/shop/products';

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
                        subMenuItemBg: 'transparent',
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
                            selectedKeys={[selectedKey]}
                            openKeys={openKeys}
                            onOpenChange={(keys) => setOpenKeys(keys)}
                            items={sidebarItemsGenerator(processedItems)}
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
