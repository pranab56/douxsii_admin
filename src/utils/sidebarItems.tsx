import { RxDashboard } from 'react-icons/rx';
import {
    FiUsers,
    FiMessageSquare,
    FiInfo,
    FiShoppingCart,
    FiBox,
    FiCreditCard,
    FiGift,
    FiHeadphones,
    FiPieChart,
} from 'react-icons/fi';
import { PiStorefront, PiUsersThree } from 'react-icons/pi';
import { MdOutlineCampaign } from 'react-icons/md';
import { BiCategory } from 'react-icons/bi';
import { TSidebarItem } from './generateSidebarItems';
import { SiHoppscotch } from 'react-icons/si';

const sidebarItems: TSidebarItem[] = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '',
        icon: <RxDashboard size={20} />,
    },
    {
        key: 'users',
        label: 'Users',
        path: 'users',
        icon: <FiUsers size={20} />,
    },
    {
        key: 'shop',
        label: 'Shop',
        icon: <SiHoppscotch size={20} />,
        children: [
            {
                key: 'shop-overview',
                label: 'Overview',
                path: 'shop/overview',
                icon: <FiPieChart size={18} />,
            },
            {
                key: 'orders',
                label: 'Order',
                path: 'orders',
                icon: <FiShoppingCart size={18} />,
            },
            {
                key: 'products',
                label: 'Product',
                path: 'products',
                icon: <FiBox size={18} />,
            },
        ],
    },
    {
        key: 'vendors',
        label: 'Vendors',
        path: 'vendors',
        icon: <PiStorefront size={20} />,
    },
    {
        key: 'category',
        label: 'Category',
        path: 'category',
        icon: <BiCategory size={20} />,
    },
    {
        key: 'payments',
        label: 'Wallet & Payments',
        path: 'payments',
        icon: <FiCreditCard size={20} />,
    },
    {
        key: 'gifts',
        label: 'Gift System',
        path: 'gifts',
        icon: <FiGift size={20} />,
    },
    {
        key: 'community',
        label: 'Community',
        path: 'community',
        icon: <PiUsersThree size={20} />,
    },
    {
        key: 'support-team',
        label: 'Support Team',
        path: 'support-team',
        icon: <FiHeadphones size={20} />,
    },
    {
        key: 'advertisement',
        label: 'Advertisement',
        path: 'advertisement',
        icon: <MdOutlineCampaign size={20} />,
    },
    {
        key: 'chats',
        label: 'Support Chats',
        path: 'chats',
        icon: <FiMessageSquare size={20} />,
    },
    {
        key: 'faqs',
        label: "FAQ's",
        path: 'faqs',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'privacy',
        label: 'Privacy Policy',
        path: 'privacy',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'terms',
        label: 'Terms & Condition',
        path: 'terms',
        icon: <FiInfo size={20} />,
    },
    {
        key: 'about',
        label: 'About Us',
        path: 'about',
        icon: <FiInfo size={20} />,
    },
];

export default sidebarItems;
