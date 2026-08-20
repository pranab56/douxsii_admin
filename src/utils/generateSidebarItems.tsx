import { ReactNode } from 'react';

// Sidebar Item Type
export type TSidebarItem = {
    key: string;
    label: ReactNode;
    path?: string;
    icon?: ReactNode;
    children?: TSidebarItem[];
};


