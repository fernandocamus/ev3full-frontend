import React from "react";
import Card from "../atoms/card";
import Badge from "../atoms/badge";
import Button from "../atoms/button";
import { HiPrinter, HiDownload, HiX, HiShoppingBag } from "react-icons/hi"; 

interface DetalleVenta {
    id: number;
    producto: {
        nombre: string;
    };
    cantidad: number;
    precioUnitarioBase: number;
    iva: number;
    precioUnitarioConIva: number;
    subtotalConIva: number;
}

interface Venta {
    id: number;
    fechaHora: string;
    vendedor: {
        nombre: string;
    };
    subtotal: number;
    totalIva: number;
    total: number;
    metodoPago: string;
    detalles: DetalleVenta[];
}

interface BoletaViewProps {
    venta: Venta;
    montoPagado?: number;
    vuelto?: number;
    showActions?: boolean;
    onImprimir?: () => void;
    onDescargar?: () => void;
    onClose?: () => void;
    className?: string;
}

const BoletaView = ({
    venta,
    montoPagado,
    vuelto,
    showActions = true,
    onImprimir,
    onDescargar,
    onClose,
    className = "",
}: BoletaViewProps) => {
    
    const formatPrice = (val: number) => `$${val.toLocaleString("es-CL")}`;
    const fechaObj = new Date(venta.fechaHora);
    
    return (
        <div className={className}>
            <Card>
                <div className="text-center mb-6 pb-6 border-b-2 border-gray-300 dark:border-gray-600">
                    <div className="flex justify-center mb-2">
                        <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                            <HiShoppingBag className="w-8 h-8" />
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">SISTEMA POS</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Minimarket La Esquina</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Av. Principal 123</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Tel: +56 9 1234 5678</p>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Boleta N°</p>
                            <p className="font-bold text-gray-900 dark:text-white">#{venta.id.toString().padStart(6, "0")}</p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Fecha</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {fechaObj.toLocaleDateString("es-CL")}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Hora</p>
                            <p className="font-semibold text-gray-900 dark:text-white">
                                {fechaObj.toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                        </div>
                        <div>
                            <p className="text-gray-600 dark:text-gray-400">Vendedor</p>
                            <p className="font-semibold text-gray-900 dark:text-white">{venta.vendedor.nombre}</p>
                        </div>
                    </div>
                </div>

                <div className="mb-6">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-xs tracking-wider">DETALLE DE PRODUCTOS</h3>
                    <div className="space-y-4">
                        {venta.detalles.map((detalle) => (
                            <div key={detalle.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1 pr-2">
                                        <p className="font-semibold text-gray-900 dark:text-white line-clamp-2">
                                            {detalle.producto.nombre}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {detalle.cantidad} x {formatPrice(detalle.precioUnitarioConIva)}
                                        </p>
                                    </div>
                                    <p className="font-bold text-gray-900 dark:text-white">
                                        {formatPrice(detalle.subtotalConIva)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6 pb-6 border-t-2 border-gray-300 dark:border-gray-600 pt-4">
                    <div className="space-y-2 text-sm mb-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">Subtotal (Neto):</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(venta.subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600 dark:text-gray-400">IVA (19%):</span>
                            <span className="font-medium text-gray-900 dark:text-white">{formatPrice(venta.totalIva)}</span>
                        </div>
                    </div>
                    <div className="flex justify-between text-xl font-bold border-t border-gray-300 dark:border-gray-600 pt-3">
                        <span className="text-gray-900 dark:text-white">TOTAL</span>
                        <span className="text-purple-600 dark:text-purple-400">{formatPrice(venta.total)}</span>
                    </div>
                </div>

                <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-sm text-gray-600 dark:text-gray-400">Método de pago:</span>
                        <Badge variant="blue">{venta.metodoPago}</Badge>
                    </div>
                    
                    {montoPagado !== undefined && (
                        <div className="space-y-2 text-sm bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            <div className="flex justify-between">
                                <span className="text-gray-600 dark:text-gray-400">Pagó con:</span>
                                <span className="font-semibold text-gray-900 dark:text-white">{formatPrice(montoPagado)}</span>
                            </div>
                            {vuelto !== undefined && (
                                <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-600">
                                    <span className="text-gray-600 dark:text-gray-400">Vuelto:</span>
                                    <span className="font-bold text-green-600 dark:text-green-400">{formatPrice(vuelto)}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                <div className="text-center text-xs text-gray-500 dark:text-gray-400">
                    <p className="font-medium mb-1">Gracias por su compra</p>
                    <p>¡Vuelva pronto!</p>
                </div>
            </Card>

            {showActions && (
                <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    {onImprimir && (
                        <Button variant="primary" onClick={onImprimir} fullWidth className="flex justify-center gap-2">
                            <HiPrinter className="w-5 h-5" /> Imprimir
                        </Button>
                    )}
                    {onDescargar && (
                        <Button variant="secondary" onClick={onDescargar} fullWidth className="flex justify-center gap-2">
                            <HiDownload className="w-5 h-5" /> PDF
                        </Button>
                    )}
                    {onClose && (
                        <Button variant="secondary" onClick={onClose} fullWidth className="flex justify-center gap-2">
                            <HiX className="w-5 h-5" /> Cerrar
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
};

export default BoletaView;