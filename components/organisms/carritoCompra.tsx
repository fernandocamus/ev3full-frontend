import React, { useState, useEffect } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Input from "../atoms/input";
import Label from "../atoms/label";
import CartItem from "../molecules/cartItem";
import VentaResumen from "../molecules/ventaResumen";
import MetodoPagoSelector from "../molecules/metodoPagoSelect";
import EmptyState from "../molecules/emptyState";
import { HiShoppingCart, HiExclamationCircle } from "react-icons/hi";

interface Producto {
    id: number;
    nombre: string;
    precioBase: number;
    iva: number;
    precioConIva: number;
    stockActual: number;
}

interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

interface CarritoCompraProps {
    carrito: ItemCarrito[];
    onChangeQuantity: (productoId: number, cantidad: number) => void;
    onRemove: (productoId: number) => void;
    onConfirm: () => void;
    onCancel: () => void;
    loading?: boolean;
    className?: string;
}

const CarritoCompra = ({
    carrito,
    onChangeQuantity,
    onRemove,
    onConfirm,
    onCancel,
    loading = false,
    className = "",
}: CarritoCompraProps) => {
    const [metodoPago, setMetodoPago] = useState("EFECTIVO");
    const [montoPagadoStr, setMontoPagadoStr] = useState(""); 
    const [error, setError] = useState("");

    const calcularSubtotal = () => {
        return carrito.reduce(
            (total, item) => total + item.producto.precioBase * item.cantidad,
            0
        );
    };

    const calcularIVA = () => {
        return carrito.reduce(
            (total, item) =>
                total + item.producto.precioBase * item.cantidad * (item.producto.iva / 100),
            0
        );
    };

    const calcularTotal = () => {
        return calcularSubtotal() + calcularIVA();
    };

    const calcularVuelto = () => {
        if (metodoPago !== "EFECTIVO") return 0;
        const monto = parseFloat(montoPagadoStr) || 0;
        return monto - calcularTotal();
    };

    useEffect(() => {
        setError("");
    }, [carrito, metodoPago, montoPagadoStr]);

    const handleConfirm = () => {
        if (carrito.length === 0) {
            setError("El carrito está vacío.");
            return;
        }

        const total = calcularTotal();
        const pagado = parseFloat(montoPagadoStr) || 0;

        if (metodoPago === "EFECTIVO" && pagado < total) {
            setError(`Monto insuficiente. Faltan $${(total - pagado).toLocaleString("es-CL")}`);
            return;
        }

        onConfirm();
    };

    return (
        <Card title="🛒 Carrito de Compra" className={className}>
            {carrito.length === 0 ? (
                <EmptyState
                    icon={<HiShoppingCart className="w-16 h-16" />}
                    title="Carrito vacío"
                    description="Agrega productos para comenzar"
                />
            ) : (
                <>
                    <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
                        {carrito.map((item) => (
                            <CartItem
                                key={item.producto.id}
                                producto={item.producto}
                                cantidad={item.cantidad}
                                onChangeQuantity={(cantidad) => onChangeQuantity(item.producto.id, cantidad)}
                                onRemove={() => onRemove(item.producto.id)}
                            />
                        ))}
                    </div>

                    <VentaResumen
                        subtotal={calcularSubtotal()}
                        totalIva={calcularIVA()}
                        total={calcularTotal()}
                        montoPagado={metodoPago === "EFECTIVO" ? (parseFloat(montoPagadoStr) || 0) : undefined}
                        vuelto={metodoPago === "EFECTIVO" ? calcularVuelto() : undefined}
                        className="mb-4"
                    />

                    <MetodoPagoSelector
                        selected={metodoPago}
                        onChange={setMetodoPago}
                        className="mb-4"
                    />

                    {metodoPago === "EFECTIVO" && (
                        <div className="mb-6 animate-fadeIn">
                            <Label>Cliente paga con:</Label>
                            <Input
                                type="number"
                                value={montoPagadoStr}
                                onChange={setMontoPagadoStr}
                                placeholder="Ingrese monto recibido"
                                className={montoPagadoStr && calcularVuelto() < 0 ? "border-red-500 focus:ring-red-500" : ""}
                            />
                        </div>
                    )}

                    {error && (
                        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                            <HiExclamationCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="flex gap-2">
                        <Button variant="secondary" fullWidth onClick={onCancel} disabled={loading}>
                            Cancelar
                        </Button>
                        <Button variant="primary" fullWidth onClick={handleConfirm} loading={loading}>
                            Registrar Venta
                        </Button>
                    </div>
                </>
            )}
        </Card>
    );
};

export default CarritoCompra;