"use client";
import { usePathname } from 'next/navigation';
import { Sidebar } from './_components/Sidebar';
import { useEffect, useState } from "react";
import { RouteGuard } from '@/components/providers/RouteGuard';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [activeMenu, setActiveMenu] = useState('dashboard');
    const pathname = usePathname();

    useEffect(() => {
        const currentPath = pathname.split('/').pop() || 'dashboard';
        setActiveMenu(currentPath);
    }, [pathname]);

    return (
        <RouteGuard>
            <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
                {children}
            </Sidebar>
        </RouteGuard>
    );
}
