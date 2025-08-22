'use client';
import {ForwardRefExoticComponent, RefAttributes, useState, ReactNode} from "react";
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import supabase from "@/lib/Supabase";

import {
    Bell,
    ChevronDown,
    ChevronLeft,
    FileText,
    HelpCircle,
    LayoutDashboard,
    Link, LucideProps, Menu,
    MessageSquare,
    Package, Settings,
    ShoppingCart,
    Store,
    User,
    Wallet,
    LogOut
} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import { useAuthStore } from '@/stores/authStore';
import { useStoreProfile } from "@/hooks/StoreProfile/useStoreProfile";

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
    const router = useRouter();
    const pathname = usePathname();
    const logout = useAuthStore(state => state.logout);
    const user = useAuthStore(state => state.user);
    const { storeProfile } = useStoreProfile();


    const cartItems = [
        { id: 1, name: "Vehicle Charger", price: 15.00, quantity: 2, image: "/api/placeholder/50/50" },
        { id: 2, name: "Brake Pads", price: 45.00, quantity: 1, image: "/api/placeholder/50/50" },
        { id: 3, name: "Brake Pads", price: 50.00, quantity: 1, image: "/api/placeholder/50/50" }
    ];

    const menuItems: MenuItemType[] = [
        { id: 'dashboard', icon: LayoutDashboard, label: 'Panel de control', badge: null, path: '/dashboard' },
        { id: 'catalog', icon: Package, label: 'Catálogo de productos', badge: null, path: '/catalog' },
        //{ id: 'cart', icon: ShoppingCart, label: 'My cart', badge: cartItems.length, path: '/cart' },
        //{ id: 'orders', icon: FileText, label: 'Order List', badge: null, path: '/orders' },
        //{ id: 'wallet', icon: Wallet, label: 'Wallet', badge: null, path: '/wallet' },
        //{ id: 'invoice', icon: FileText, label: 'invoice', badge: null, path: '/invoice' },
        { id: 'quotation', icon: MessageSquare, label: 'Cotizaciones', badge: null, path: '/quotation' }
    ];

    const toolsItems: MenuItemType[] = [
        { id: 'store', icon: Store, label: 'Mi tienda', badge: null, path: '/store' },
        //{ id: 'integration', icon: Link, label: 'Integration', badge: null, path: '/integration' },
        { id: 'profile', icon: User, label: 'Perfil', badge: null, path: '/profile' }
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
            <div className={`flex items-center ${isCollapsed ? '' : 'space-x-3'}`}>
                <item.icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
            </div>
            {!isCollapsed && item.badge && (
                <Badge variant="destructive" className="text-xs">
                    {item.badge}
                </Badge>
            )}
            {isCollapsed && item.badge && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            )}
        </button>
    );



    return (
        <div className="flex h-screen bg-gray-50">
            <div className={`bg-white shadow-sm border-r transition-all duration-300 ${
                isCollapsed ? 'w-16' : 'w-64'
            }`}>
                {/* Logo */}
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <div className={`flex items-center ${isCollapsed ? 'justify-center w-full' : 'space-x-2'}`}>
                            {/* Logo placeholder - muestra iniciales "LR" en un círculo rojo */}
                          { /**<div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center flex-shrink-0">
                                <span className="text-white font-bold text-sm">LR</span>
                            </div> */ }
                            {!isCollapsed && (
                                <div>
                                    {storeProfile?.logo_image && (
                                        <Image src={storeProfile.logo_image} alt="logo" width={100} height={100} />
                                    )}
                                    <p className="text-xs text-gray-500">{storeProfile?.name}</p>
                                </div>
                            )}
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className={`p-1 hover:bg-gray-100 ${isCollapsed ? 'hidden' : ''}`}
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                    </div>
                </div>

                {/* Menu */}
                <div className="p-4">
                    <div className="mb-4">
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Principal</h3>
                        )}
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
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Herramientas</h3>
                        )}
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
                        {!isCollapsed && (
                            <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">Soporte</h3>
                        )}
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
                <header className="bg-white border-b px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            {isCollapsed && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setIsCollapsed(false)}
                                    className="p-2 hover:bg-gray-100"
                                >
                                    <Menu className="w-5 h-5" />
                                </Button>
                            )}
                            <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                          { /** <div className="flex items-center space-x-2 bg-gray-100 rounded-md px-3 py-1">
                                <span className="text-sm text-gray-600">May 2- Jun 2</span>
                                <ChevronDown className="w-4 h-4" />
                            </div>
                            <Bell className="w-5 h-5 text-gray-600" />*/}
                                                    <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gray-300 rounded-full">
                                <img src={"https://api.dicebear.com/9.x/avataaars-neutral/svg?seed=Aidan"}
                                     className="w-8 h-8 rounded-full"
                                     alt="Avatar"
                                />
                            </div>
                            <span className="text-sm font-medium">{user?.email}</span>
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

                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}