import React from "react";

interface VentaResumenProps {
    subtotal: number;
    totalIva: number;
    total: number;
    montoPagado?: number;
    vuelto?: number;
    className?: string;
}

const VentaResumen = ({
    subtotal,
    totalIva,
    total,
    montoPagado,
    vuelto,
    className = "",
}: VentaResumenProps) => {
    
    const formatPrice = (amount: number) => 
        `$${amount.toLocaleString("es-CL")}`;

    return (
        <div className={className}>
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Subtotal (sin IVA):</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(subtotal)}
                    </span>
                </div>
                <div className="flex justify-between text-sm mb-3">
                    <span className="text-gray-600 dark:text-gray-400">IVA:</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {formatPrice(totalIva)}
                    </span>
                </div>
            </div>

            <div className="flex justify-between text-lg font-bold border-t border-gray-300 dark:border-gray-600 pt-3 mb-3">
                <span className="text-gray-900 dark:text-white">TOTAL:</span>
                <span className="text-purple-600 dark:text-purple-400">
                    {formatPrice(total)}
                </span>
            </div>

            {montoPagado !== undefined && montoPagado > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-3">
                    <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600 dark:text-gray-400">Pagó con:</span>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {formatPrice(montoPagado)}
                        </span>
                    </div>
                    
                    {vuelto !== undefined && (
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600 dark:text-gray-400">Vuelto:</span>
                            <span className="font-bold text-green-600 dark:text-green-400">
                                {formatPrice(vuelto)}
                            </span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default VentaResumen;