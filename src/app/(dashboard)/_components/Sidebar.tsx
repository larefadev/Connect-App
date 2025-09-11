'use client';
import {ForwardRefExoticComponent, RefAttributes, useState, ReactNode} from "react";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import supabase from "@/lib/Supabase";

import {
    ChevronLeft,
    LayoutDashboard,
    LucideProps, Menu,
    MessageSquare,
    Package, Settings,
    Store,
    User,
    LogOut,
    FileText,
    ShoppingCart,
    X
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import { useAuthStore } from '@/stores/authStore';
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";
import { UserAvatar } from './UserAvatar';

interface MenuItemType {
    id: string;
    icon:  ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;
    label: string;
    badge: number | null;
    path: string; 
}

interface SidebarProps {
    activeMenu: string
    setActiveMenu: (menu: string) => void
    children?: ReactNode
}


export const Sidebar = (props: SidebarProps) => {
    const {activeMenu, setActiveMenu, children} = props
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const { storeProfile } = useStoreProfile();




    const menuItems: MenuItemType[] = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel de control', badge: null, path: '/dashboard' },
        { id: 'catalog', icon: Package, label: 'Catálogo de productos', badge: null, path: '/catalog' },
        { id: 'cart', icon: ShoppingCart, label: 'Mi carrito', badge: null, path: '/cart' },
        { id: 'orders', icon: FileText, label: 'Pedidos', badge: null, path: '/orders' },
        //{ id: 'wallet', icon: Wallet, label: 'Wallet', badge: null, path: '/wallet' },
        //{ id: 'invoice', icon: FileText, label: 'invoice', badge: null, path: '/invoice' },
        //{ id: 'quotation', icon: MessageSquare, label: 'Cotizaciones', badge: null, path: '/quotation' }
    ];

    const toolsItems: MenuItemType[] = [
        { id: 'store', icon: Store, label: 'Mi tienda', badge: null, path: '/store' },
        //{ id: 'integration', icon: Link, label: 'Integration', badge: null, path: '/integration' },
        { id: 'profile', icon: User, label: 'Perfil', badge: null, path: '/profile' },
        { id: 'quotation', icon: MessageSquare, label: 'Cotizaciones', badge: null, path: '/quotation' }
    ];

    const supportItems: MenuItemType[] = [
        //{ id: 'after-sales', icon: HelpCircle, label: 'After Sales', badge: null, path: '/after-sales' },
        { id: 'settings', icon: Settings, label: 'Ajustes', badge: null, path: '/settings' }
    ];

    const getPageTitle = () => {
        const menuItem = [...menuItems, ...toolsItems, ...supportItems].find(item => item.id === activeMenu);
        return menuItem ? menuItem.label : 'dashboard';
    };

    const handleMenuClick = (item: MenuItemType) => {
        setActiveMenu(item.id);
        router.push(item.path);
        // Cerrar menú móvil después de navegar
        setIsMobileMenuOpen(false);
    };

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        router.push('/');
    };

    const MenuItem = ({ item, isActive, onClick, isCollapsed } : {
        item: MenuItemType,
        isActive: boolean,
        onClick: () => void,
        isCollapsed: boolean
    }) => (
        <button
            onClick={onClick}
            className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-all duration-200 ${
                isActive
                    ? 'bg-red-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
            } ${isCollapsed ? 'justify-center' : ''}`}
            title={isCollapsed ? item.label : ''}
        >
            <div className={`flex items-center transition-all duration-300 ${isCollapsed ? '' : 'space-x-3'}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                <span className={`transition-all duration-300 overflow-hidden ${
                    isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                }`}>
                    {item.label}
                </span>
            </div>
            <div className={`transition-all duration-300 overflow-hidden ${
                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
            }`}>
                {item.badge && (
                    <Badge variant="destructive" className="text-xs">
                        {item.badge}
                    </Badge>
                )}
            </div>
            {isCollapsed && item.badge && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
        </button>
    );



    return (
        <div className="flex h-screen bg-gray-50">
            {/* Mobile Overlay */}
            <div 
                className={`fixed inset-0 bg-black z-40 lg:hidden transition-opacity duration-300 ${
                    isMobileMenuOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Sidebar */}
            <div className={`
                bg-white shadow-sm border-r transition-all duration-300 z-50
                ${isCollapsed ? 'w-16' : 'w-64'}
                ${isMobileMenuOpen 
                    ? 'fixed inset-y-0 left-0 transform translate-x-0' 
                    : 'fixed inset-y-0 left-0 transform -translate-x-full lg:translate-x-0 lg:relative lg:block'
                }
            `}>
                {/* Logo */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center transition-all duration-300 ${isCollapsed ? 'justify-center w-full' : 'space-x-2'}`}>
                            <div className={`transition-all duration-300 overflow-hidden ${
                                isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'
                            }`}>
                                {storeProfile?.logo_image && (
                                    <Image 
                                        src={storeProfile.logo_image} 
                                        alt="logo" 
                                        width={100} 
                                        height={100}
                                        className="max-w-[80px] h-auto"
                                    />
                                )}
                                <p className="text-xs text-gray-500 truncate">{storeProfile?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsCollapsed(!isCollapsed)}
                                className={`p-1 hover:bg-gray-100 ${isCollapsed ? 'hidden' : 'hidden lg:block'}`}
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="p-1 hover:bg-gray-100 lg:hidden"
                            >
                                <X className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Menu */}
                <div className="p-4 overflow-y-auto h-[calc(100vh-80px)]">
                    <div className="mb-4">
                        <h3 className={`text-xs font-semibold text-gray-500 uppercase mb-2 transition-all duration-300 ${
                            isCollapsed ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-auto mb-2'
                        }`}>
                            Principal
                        </h3>
                        <nav className="space-y-1">
                            {menuItems.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    isActive={pathname === item.path}
                                    onClick={() => handleMenuClick(item)}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </nav>
                    </div>

                    <div className="mb-4">
                        <h3 className={`text-xs font-semibold text-gray-500 uppercase mb-2 transition-all duration-300 ${
                            isCollapsed ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-auto mb-2'
                        }`}>
                            Herramientas
                        </h3>
                        <nav className="space-y-1">
                            {toolsItems.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    isActive={pathname === item.path}
                                    onClick={() => handleMenuClick(item)}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </nav>
                    </div>

                    <div>
                        <h3 className={`text-xs font-semibold text-gray-500 uppercase mb-2 transition-all duration-300 ${
                            isCollapsed ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100 h-auto mb-2'
                        }`}>
                            Soporte
                        </h3>
                        <nav className="space-y-1">
                            {supportItems.map((item) => (
                                <MenuItem
                                    key={item.id}
                                    item={item}
                                    isActive={pathname === item.path}
                                    onClick={() => handleMenuClick(item)}
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                {/* Header */}
                <header className="bg-white border-b px-4 lg:px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setIsMobileMenuOpen(true)}
                                className="p-2 hover:bg-gray-100 lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            {isCollapsed && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsCollapsed(false)}
                                    className="p-2 hover:bg-gray-100 hidden lg:block"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>
                            )}
                            <h1 className="text-lg lg:text-2xl font-bold text-gray-900 truncate">
                                {getPageTitle()}
                            </h1>
                        </div>
                        <div className="flex items-center space-x-2 lg:space-x-4">
                            <div className="flex items-center space-x-2">
                                <UserAvatar email={user?.email || ''} size={32} />
                                <span className="text-sm font-medium hidden sm:block truncate max-w-[150px]">
                                    {user?.email}
                                </span>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="p-1 hover:bg-gray-100"
                                    title="Cerrar sesión"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                <main className="p-4 lg:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}