import React from "react";
import { HiTrash, HiMinus, HiPlus } from "react-icons/hi";

interface Producto {
    id: number;
    nombre: string;
    precioConIva: number;
    stockActual: number;
}

interface CartItemProps {
    producto: Producto;
    cantidad: number;
    onChangeQuantity: (cantidad: number) => void;
    onRemove: () => void;
    className?: string;
}

const CartItem = ({
    producto,
    cantidad,
    onChangeQuantity,
    onRemove,
    className = "",
}: CartItemProps) => {
    
    const handleIncrement = () => {
        if (cantidad < producto.stockActual) onChangeQuantity(cantidad + 1);
    };

    const handleDecrement = () => {
        if (cantidad > 1) {
            onChangeQuantity(cantidad - 1);
        } else {
            onRemove();
        }
    };

    const btnStyle = "p-1 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 transition-colors text-gray-700 dark:text-gray-200";

    return (
        <div className={`p-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600 rounded-lg ${className}`}>
            
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                        {producto.nombre}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        ${producto.precioConIva.toLocaleString("es-CL")} c/u
                    </p>
                </div>

                <button
                    onClick={onRemove}
                    aria-label="Eliminar producto"
                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                >
                    <HiTrash className="w-5 h-5" />
                </button>

            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">

                    <button
                        onClick={handleDecrement}
                        className={btnStyle}
                    >
                        <HiMinus className="w-4 h-4" />
                    </button>

                    <span className="w-6 text-center font-bold text-gray-900 dark:text-white text-sm">
                        {cantidad}
                    </span>

                    <button
                        onClick={handleIncrement}
                        disabled={cantidad >= producto.stockActual}
                        className={`${btnStyle} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        <HiPlus className="w-4 h-4" />
                    </button>
                    
                </div>

                <p className="font-bold text-gray-900 dark:text-white">
                    ${(producto.precioConIva * cantidad).toLocaleString("es-CL")}
                </p>
            </div>
        </div>
    );
};

export default CartItem;