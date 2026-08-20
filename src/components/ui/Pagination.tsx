import { ConfigProvider, Pagination as AntPagination } from 'antd';

interface PaginationProps {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    className?: string;
    light?: boolean;
}

export function Pagination({ current, pageSize, total, onChange, className, light = false }: PaginationProps) {
    const start = total === 0 ? 0 : (current - 1) * pageSize + 1;
    const end = Math.min(current * pageSize, total);

    return (
        <div className={`flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-white/5 ${className || ''}`}>
            <span className="text-white/40 text-xs">
                Showing {start} - {end} of {total} events
            </span>
            <ConfigProvider
                theme={{
                    components: {
                        Pagination: {
                            itemBg: 'transparent',
                            itemActiveBg: light ? '#56000c' : '#46000B',
                            itemSize: 32,
                            itemActiveBgDisabled: 'transparent',
                            colorPrimary: '#ffffff',
                            colorPrimaryHover: '#ffffff',
                            colorText: light ? '#333333' : 'rgba(255, 255, 255, 0.6)',
                            colorTextDisabled: 'rgba(255, 255, 255, 0.25)',
                            itemLinkBg: 'transparent',
                        },
                    },
                }}
            >
                <AntPagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={onChange}
                    showSizeChanger={false}
                    className="custom-antd-pagination"
                />
            </ConfigProvider>
        </div>
    );
}

export default Pagination;
