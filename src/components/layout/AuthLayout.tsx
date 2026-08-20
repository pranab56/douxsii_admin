import React from 'react';
import { ConfigProvider } from 'antd';

interface AuthLayoutProps {
    children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '#b02636',
                    colorBgContainer: '#560e18',
                    colorText: '#ffffff',
                    colorTextPlaceholder: '#b7868b',
                    colorBorder: 'transparent',
                    borderRadius: 10,
                },
                components: {
                    Input: {
                        activeBorderColor: '#b02636',
                        hoverBorderColor: '#7a101b',
                        colorBgContainer: '#560e18',
                        colorText: '#ffffff',
                        colorTextPlaceholder: '#b7868b',
                    },
                    Checkbox: {
                        colorText: '#ffffff',
                        colorPrimary: '#b02636',
                        colorPrimaryBorder: '#b02636',
                    },
                    Button: {
                        colorPrimary: '#56000c',
                        colorPrimaryHover: '#700010',
                        colorText: '#ffffff',
                        colorPrimaryActive: '#400008',
                        borderRadius: 8,
                        controlHeight: 46,
                    }
                }
            }}
        >
            <div className="flex h-screen w-screen overflow-hidden bg-[#FAF8F5]">
                {/* Left Side: Illustration / Flowers (auth.png) */}
                <div
                    className="hidden lg:block lg:w-[48%] xl:w-[52%] h-full bg-no-repeat bg-cover bg-center"
                    style={{ backgroundImage: `url('/auth.png')` }}
                />

                {/* Right Side: Auth Card Container */}
                <div className="flex-1 h-full flex items-center justify-center p-6 md:p-12">
                    <div
                        className="w-full max-w-[540px] bg-[#46000B] rounded-[28px] p-8 md:p-12 shadow-2xl text-white flex flex-col justify-center animate-fade-in"
                        style={{ minHeight: '520px' }}
                    >
                        {children}
                    </div>
                </div>
            </div>
        </ConfigProvider>
    );
};

export default AuthLayout;
export { AuthLayout };
