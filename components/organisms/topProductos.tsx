import React from "react";
import Card from "../atoms/card";
import EmptyState from "../molecules/emptyState";
import Spinner from "../atoms/spinner";
import { HiTrendingUp } from "react-icons/hi";
import { HiTrophy } from "react-icons/hi2";

interface TopProducto {
    id: number;
    nombre: string;
    cantidad: number;
    total: number;
}

interface TopProductosProps {
    productos: TopProducto[];
    maxItems?: number;
    loading?: boolean;
    className?: string;
}

const TopProductos = ({ productos, maxItems = 5, loading = false, className = "" }: TopProductosProps) => {
    
    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;

    const topProductos = productos.slice(0, maxItems);

    if (loading) {
        return (
            <Card className={className}>
                <div className="flex justify-center py-8">
                    <Spinner />
                </div>
            </Card>
        );
    }

    return (
        <Card className={className}>
            <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg text-yellow-600 dark:text-yellow-400">
                    <HiTrophy className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Productos Más Vendidos
                </h2>
            </div>

            {topProductos.length === 0 ? (
                <EmptyState
                    icon={<HiTrendingUp className="w-12 h-12 text-gray-400" />}
                    title="No hay datos"
                    description="Aún no hay productos vendidos"
                />
            ) : (
                <div className="space-y-3">
                    {topProductos.map((producto, index) => (
                        <div
                            key={producto.id}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 
                                border border-gray-100 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-bold shadow-sm">
                                    {index + 1}
                                </div>
                                
                                <div>
                                    <p className="font-semibold text-gray-900 dark:text-white line-clamp-1">
                                        {producto.nombre}
                                    </p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        {producto.cantidad} unidades vendidas
                                    </p>
                                </div>
                            </div>
                            
                            <div className="text-right">
                                <p className="font-bold text-purple-600 dark:text-purple-400">
                                    {formatMoney(producto.total)}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </Card>
    );
};

export default TopProductos;