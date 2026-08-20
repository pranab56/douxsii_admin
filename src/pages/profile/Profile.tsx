import React from 'react';
import { ConfigProvider, Tabs } from 'antd';
import type { TabsProps } from 'antd';
import EditProfile from './EditProfile';
import ChangePassword from './ChangePassword';

const items: TabsProps['items'] = [
    {
        key: '1',
        label: 'Edit Profile',
        children: <EditProfile />,
    },
    {
        key: '2',
        label: 'Change Password',
        children: <ChangePassword />,
    },
];

const Profile: React.FC = () => (
    <div
        className="p-8 rounded-2xl"
        style={{
            background: 'rgba(255, 255, 255, 0.04)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
        }}
    >
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#ff4b72',
                    colorText: 'rgba(255, 255, 255, 0.85)',
                    colorTextHeading: '#ffffff',
                    colorBgContainer: '#560e18',
                    colorBorder: 'rgba(255, 255, 255, 0.1)',
                    colorIcon: '#ffffff',
                    colorIconHover: '#ff4b72',
                },
                components: {
                    Input: {
                        colorBgContainer: '#560e18',
                        colorText: '#ffffff',
                        colorTextPlaceholder: '#b7868b',
                        activeBorderColor: '#ff4b72',
                        hoverBorderColor: '#ff4b72',
                        colorIcon: '#ffffff',
                        colorIconHover: '#ff4b72',
                    },
                    Tabs: {
                        itemColor: 'rgba(255, 255, 255, 0.5)',
                        itemSelectedColor: '#ff4b72',
                        itemHoverColor: '#ff4b72',
                        inkBarColor: '#ff4b72',
                    }
                }
            }}
        >
            <Tabs defaultActiveKey="1" items={items} size="large" />
        </ConfigProvider>
    </div>
);

export default Profile;
