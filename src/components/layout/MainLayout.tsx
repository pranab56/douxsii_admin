import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import HeaderDashboard from './HeaderDashboard';
import Sidebar from './Sidebar';
import { useNotificationSocket } from '../../hooks/useNotificationSocket';

const { Content } = Layout;

const MainLayout: React.FC = () => {
    // Initialize realtime socket connection for notifications
    useNotificationSocket();

    return (
        <Layout style={{ minHeight: '100vh', background: '#46000B' }}>
            {/* Sidebar */}
            <Sidebar />

            <Layout style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#23090a' }}>
                {/* Header */}
                <HeaderDashboard />

                {/* Main Content Area */}
                <Content
                    className="overflow-y-auto p-6"
                    style={{
                        flex: 1,
                        background: '#23090a',
                    }}
                >
                    <div
                        className="mx-auto w-full animate-fade-in"
                        style={{
                            minHeight: '100%',
                            borderRadius: '12px',
                            background: 'transparent',
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
