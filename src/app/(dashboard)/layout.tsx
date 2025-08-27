"use client";
import { usePathname } from 'next/navigation';
import { Sidebar } from './_components/Sidebar';
import { useEffect, useState } from "react";
import { RouteGuard } from '@/components/providers/RouteGuard';
import { AccountStatusGuard } from '@/components/providers/AccountStatusGuard';

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
            <AccountStatusGuard>
                <Sidebar activeMenu={activeMenu} setActiveMenu={setActiveMenu}>
                    {children}
                </Sidebar>
            </AccountStatusGuard>
        </RouteGuard>
    );
}
