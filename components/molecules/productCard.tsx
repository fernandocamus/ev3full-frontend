import React from "react";
import { HiPhotograph } from "react-icons/hi";
import Badge from "../atoms/badge";
import Button from "../atoms/button";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precioBase: number;
    iva: number;
    precioConIva: number;
    stockActual: number;
    rutaImagen?: string;
    categoria: {
        id: number;
        nombre: string;
    };
}

interface ProductCardProps {
    producto: Producto;
    onAdd: (producto: Producto) => void;
    disabled?: boolean;
    className?: string;
}

const ProductCard = ({ producto, onAdd, disabled = false, className = "" }: ProductCardProps) => {
    const sinStock = producto.stockActual <= 0;
    
    const valorIva = producto.precioBase * (producto.iva / 100);

    return (
        <div className={`border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-lg transition-shadow bg-white dark:bg-gray-800 flex flex-col ${className}`}>
            <div className="aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg mb-3 flex items-center justify-center overflow-hidden text-gray-400">
                {producto.rutaImagen ? (
                    <img
                        src={producto.rutaImagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <HiPhotograph className="w-12 h-12 opacity-50" />
                )}
            </div>

            <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2 truncate" title={producto.nombre}>
                    {producto.nombre}
                </h3>

                <div className="space-y-1 mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Neto: ${producto.precioBase.toLocaleString("es-CL")}
                    </p>

                    <p className="text-xs text-gray-500 dark:text-gray-500">
                        + IVA ({producto.iva}%): ${valorIva.toLocaleString("es-CL")}
                    </p>

                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 pt-1">
                        Total: ${producto.precioConIva.toLocaleString("es-CL")}
                    </p>
                </div>
            </div>

            <div className="flex items-center justify-between gap-2 mt-auto">
                <Badge variant={sinStock ? "gray" : "green"}>
                    {sinStock ? "Agotado" : `Stock: ${producto.stockActual}`}
                </Badge>
                
                <Button
                    variant="primary"
                    onClick={() => onAdd(producto)}
                    disabled={disabled || sinStock}
                    className="py-1.5 px-3 text-sm"
                >
                    Agregar
                </Button>
            </div>
        </div>
    );
};

export default ProductCard;