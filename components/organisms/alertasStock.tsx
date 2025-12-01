import React from "react";
import Card from "../atoms/card";
import Badge from "../atoms/badge";
import Button from "../atoms/button";
import EmptyState from "../molecules/emptyState";
import { HiExclamation, HiCheckCircle } from "react-icons/hi";

interface AlertaStock {
    id: number;
    nombre: string;
    stock: number;
    stock_minimo?: number;
}

interface AlertasStockProps {
    alertas: AlertaStock[];
    onViewProducto?: (productoId: number) => void;
    className?: string;
}

const AlertasStock = ({ alertas, onViewProducto, className = "" }: AlertasStockProps) => {
    return (
        <Card title="⚠️ Alertas de Stock" className={className}>
            {alertas.length === 0 ? (
                <EmptyState
                    icon={<HiCheckCircle className="w-12 h-12 text-purple-500" />}
                    title="Todo en orden"
                    description="No hay alertas de stock en este momento"
                />
            ) : (
                <div className="space-y-3">
                    {alertas.map((alerta) => {
                        const isCritical = alerta.stock === 0;
                        
                        const styles = isCritical 
                            ? "bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800"
                            : "bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800";
                        
                        const iconStyles = isCritical
                            ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                            : "bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400";

                        return (
                            <div
                                key={alerta.id}
                                className={`flex items-center justify-between p-3 rounded-lg border ${styles}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`flex items-center justify-center w-10 h-10 rounded-full shrink-0 ${iconStyles}`}>
                                        <HiExclamation className="w-6 h-6" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                                            {alerta.nombre}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {isCritical ? "Sin stock" : "Stock bajo"}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                    <Badge variant={isCritical ? "gray" : "yellow"}>
                                        {alerta.stock} uds
                                    </Badge>
                                    
                                    {onViewProducto && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => onViewProducto(alerta.id)}
                                            className="px-3 py-1.5 h-auto text-sm"
                                        >
                                            Ver
                                        </Button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );
};

export default AlertasStock;