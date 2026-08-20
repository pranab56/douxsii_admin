import { ConfigProvider, Table as AntTable, TableProps as AntTableProps } from 'antd';

interface TableProps<T> extends AntTableProps<T> {
  className?: string;
  light?: boolean;
}

export function Table<T extends object>({ className, pagination = false, light = false, ...props }: TableProps<T>) {
  return (
    <ConfigProvider
      theme={{
        components: {
          Table: {
            headerBg: 'transparent',
            headerColor: light ? '#56000c' : 'rgba(255, 255, 255, 0.4)',
            headerSplitColor: 'transparent',
            colorBgContainer: 'transparent',
            colorText: light ? '#333333' : '#ffffff',
            borderColor: light ? 'rgba(86, 0, 12, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            rowHoverBg: light ? 'rgba(86, 0, 12, 0.03)' : 'rgba(255, 255, 255, 0.02)',
          },
        },
      }}
    >
      <AntTable
        pagination={pagination}
        className={`${className || ''}`}
        {...props}
      />
    </ConfigProvider>
  );
}
export default Table;
