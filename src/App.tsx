import MainLayout from './components/layout/MainLayout';
import { ConfigProvider } from 'antd';
import './App.css';
function App() {
    return (
        <>
            <ConfigProvider
                theme={{
                    token: {
                        colorPrimary: '#286a25',
                    },
                    components: {
                        Input: {
                            borderRadius: 5,
                        },
                    },
                }}
            >
                <MainLayout />
            </ConfigProvider>
        </>
    );
}

export default App;
