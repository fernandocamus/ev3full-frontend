import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../atoms/button";
import Badge from "../atoms/badge";
import { HiMenu, HiX, HiShoppingBag, HiLogout } from "react-icons/hi";

interface NavbarProps {
    usuario: {
        nombre: string;
        rol: "ADMIN" | "VENDEDOR";
    };
    onLogout: () => void;
    className?: string;
}

const Navbar = ({ usuario, onLogout, className = "" }: NavbarProps) => {
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const isAdmin = usuario.rol === "ADMIN";

    let navigationItems = [];

    if (isAdmin) {
        navigationItems = [
            { label: "Dashboard", path: "/dashboard" },
            { label: "Productos", path: "/productos" },
            { label: "Ventas", path: "/ventas" },
            { label: "Días", path: "/dias" },
        ];
    } else {
        navigationItems = [
            { label: "Productos", path: "/productos" },
            { label: "Carrito", path: "/carrito" },
            { label: "Mis Ventas", path: "/misVentas" },
        ];
    }

    const today = new Date().toLocaleDateString("es-CL", {
        weekday: "short", day: "numeric", month: "short"
    });

    return (
        <header className={`bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 ${className}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <HiShoppingBag className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold text-gray-900 dark:text-white leading-tight">
                                Sistema POS
                            </h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                                {today}
                            </p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center gap-1 bg-gray-50 dark:bg-gray-700/50 p-1 rounded-lg">
                        {navigationItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className="px-4 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 
                                         hover:bg-white dark:hover:bg-gray-600 hover:text-purple-600 dark:hover:text-white 
                                         hover:shadow-sm rounded-md transition-all"
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    <div className="hidden md:flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                {usuario.nombre}
                            </p>
                            <div className="flex justify-end">
                                <Badge variant={isAdmin ? "blue" : "green"} className="text-[10px] px-1.5 py-0">
                                    {usuario.rol}
                                </Badge>
                            </div>
                        </div>
                        
                        <div className="h-8 w-px bg-gray-200 dark:bg-gray-700 mx-1"></div>
                        
                        <Button 
                            variant="secondary" 
                            onClick={onLogout} 
                            className="text-sm py-1.5 px-3 h-auto"
                        >
                            Cerrar Sesión
                        </Button>
                    </div>

                    <button
                        className="md:hidden p-2 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
                    </button>
                </div>

                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-2 border-t border-gray-100 dark:border-gray-700 animate-fadeIn">
                        {navigationItems.map((item) => (
                            <button
                                key={item.path}
                                onClick={() => {
                                    navigate(item.path);
                                    setMobileMenuOpen(false);
                                }}
                                className="block w-full text-left px-4 py-3 text-base font-medium text-gray-600 
                                         dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 
                                         hover:text-purple-600 dark:hover:text-white rounded-lg transition-colors"
                            >
                                {item.label}
                            </button>
                        ))}
                        <div className="border-t border-gray-100 dark:border-gray-700 pt-4 mt-2 px-2">
                            <div className="flex items-center justify-between px-2 mb-4">
                                <span className="font-semibold text-gray-900 dark:text-white">{usuario.nombre}</span>
                                <Badge variant={isAdmin ? "blue" : "green"}>{usuario.rol}</Badge>
                            </div>
                            <Button variant="secondary" onClick={onLogout} fullWidth className="justify-center">
                                <HiLogout className="w-5 h-5 mr-2" />
                                Cerrar Sesión
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Navbar;