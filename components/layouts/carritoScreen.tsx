import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../organisms/navBar";
import Button from "../atoms/button";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import { HiArrowLeft, HiShoppingCart, HiTrash, HiPlus, HiMinus, HiCash, HiCreditCard, HiDeviceMobile } from "react-icons/hi";

interface Producto {
    id: number;
    nombre: string;
    precioBase: number;
    iva: number;
    precioConIva: number;
    stockActual: number;
    rutaImagen?: string;
    categoria: { nombre: string };
}

interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

const CarritoScreen = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [usuario, setUsuario] = useState<any>(null);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [metodoPago, setMetodoPago] = useState("efectivo");
    const [montoPagadoStr, setMontoPagadoStr] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUsuario(JSON.parse(userStr));
        } else {
            navigate("/login");
            return;
        }

        if (location.state && location.state.productToAdd) {
            const prod = location.state.productToAdd;
            const producto: Producto = {
                id: prod.id,
                nombre: prod.nombre,
                precioBase: prod.precio_base || prod.precioBase,
                iva: prod.iva,
                precioConIva: prod.precio_con_iva || prod.precioConIva,
                stockActual: prod.stock_actual || prod.stockActual,
                rutaImagen: prod.ruta_imagen || prod.rutaImagen,
                categoria: prod.categoria
            };
            setCarrito([{ producto, cantidad: 1 }]);
            window.history.replaceState({}, document.title);
        }
    }, [navigate, location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;
    
    const updateQuantity = (productoId: number, nuevaCantidad: number, stockMax: number) => {
        if (nuevaCantidad <= 0) {
            setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
            return;
        }
        if (nuevaCantidad > stockMax) return;

        setCarrito((prev) =>
            prev.map((item) =>
                item.producto.id === productoId ? { ...item, cantidad: nuevaCantidad } : item
            )
        );
    };

    const removeFromCart = (productoId: number) => {
        setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
    };

    const totalVenta = carrito.reduce((sum, item) => sum + (item.producto.precioConIva * item.cantidad), 0);
    const montoPagado = parseFloat(montoPagadoStr) || 0;
    const vuelto = montoPagado - totalVenta;
    const esEfectivo = metodoPago === "efectivo";
    const pagoInsuficiente = esEfectivo && montoPagado < totalVenta && carrito.length > 0;

    const handleConfirmVenta = async () => {        
        setLoading(true);
        setError("");
        setSuccess("");
        
        try {
            // ✅ PAYLOAD EXACTO según tu CreateVentaDto
            const payload = {
                metodo_pago: metodoPago.toLowerCase(),
                productos: carrito.map(item => ({
                    productoId: Number(item.producto.id),
                    cantidad: Number(item.cantidad)
                }))
            };

            console.log("📤 Enviando payload:", JSON.stringify(payload, null, 2));
            console.log("🔍 Verificación de tipos:");
            console.log("  - metodo_pago:", typeof payload.metodo_pago, "=", payload.metodo_pago);
            console.log("  - productos[0].productoId:", typeof payload.productos[0]?.productoId, "=", payload.productos[0]?.productoId);
            console.log("  - productos[0].cantidad:", typeof payload.productos[0]?.cantidad, "=", payload.productos[0]?.cantidad);

            const response = await fetch("http://localhost:8080/api/ventas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json().catch(() => null);
            console.log("📥 Respuesta del servidor:", responseData);

            if (!response.ok) {
                const errorMsg = responseData?.message || responseData?.error || `Error ${response.status}`;
                throw new Error(errorMsg);
            }

            setSuccess("¡Venta realizada con éxito!");
            setCarrito([]);
            setMetodoPago("efectivo");
            setMontoPagadoStr("");
            
            setTimeout(() => {
                setSuccess("");
                navigate("/misVentas");
            }, 2000);
        } catch (err: any) {
            console.error("❌ Error completo:", err);
            setError(err.message || "No se pudo registrar la venta. Intente nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    if (!usuario) return <div className="h-screen flex items-center justify-center"><Spinner size="lg" /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                {success && <Alert type="success" title="Venta Exitosa" className="mb-6">{success}</Alert>}
                {error && <Alert type="error" title="Error" className="mb-6">{error}</Alert>}

                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                            <HiShoppingCart className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Carrito de Compra
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Revisa los productos antes de confirmar la venta
                            </p>
                        </div>
                    </div>
                    <Button variant="secondary" onClick={() => navigate("/productos")} className="flex items-center gap-2">
                        <HiArrowLeft className="w-5 h-5" />
                        Volver al Catálogo
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-8">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Producto</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Precio Unit.</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Cantidad</th>
                                    <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Subtotal</th>
                                    <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acción</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                                {carrito.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                                            El carrito está vacío. Agrega productos desde el catálogo.
                                        </td>
                                    </tr>
                                ) : (
                                    carrito.map((item) => (
                                        <tr key={item.producto.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                                                        {item.producto.rutaImagen && item.producto.rutaImagen !== "sin-imagen.jpg" ? (
                                                            <img className="h-10 w-10 object-cover" src={item.producto.rutaImagen} alt="" />
                                                        ) : (
                                                            <HiShoppingCart className="h-5 w-5 text-gray-400" />
                                                        )}
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900 dark:text-white">{item.producto.nombre}</div>
                                                        <div className="text-xs text-gray-500 dark:text-gray-400">{item.producto.categoria.nombre}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                                                {formatMoney(item.producto.precioConIva)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center space-x-2">
                                                    <button 
                                                        onClick={() => updateQuantity(item.producto.id, item.cantidad - 1, item.producto.stockActual)}
                                                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 text-gray-600 dark:text-white"
                                                    >
                                                        <HiMinus className="w-3 h-3" />
                                                    </button>
                                                    <span className="text-sm font-bold w-8 text-center text-gray-900 dark:text-white">{item.cantidad}</span>
                                                    <button 
                                                        onClick={() => updateQuantity(item.producto.id, item.cantidad + 1, item.producto.stockActual)}
                                                        disabled={item.cantidad >= item.producto.stockActual}
                                                        className="p-1 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 disabled:opacity-50 text-gray-600 dark:text-white"
                                                    >
                                                        <HiPlus className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                                                {formatMoney(item.producto.precioConIva * item.cantidad)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button 
                                                    onClick={() => removeFromCart(item.producto.id)}
                                                    className="text-red-600 hover:text-red-900 dark:hover:text-red-400 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
                                                >
                                                    <HiTrash className="w-5 h-5" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {carrito.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                        <div className="flex flex-col lg:flex-row justify-between gap-8">
                            
                            <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Método de Pago</h3>
                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    {[
                                        { id: "efectivo", label: "Efectivo", icon: <HiCash className="w-6 h-6" /> },
                                        { id: "transbank", label: "Tarjeta", icon: <HiCreditCard className="w-6 h-6" /> },
                                        { id: "transferencia", label: "Transf.", icon: <HiDeviceMobile className="w-6 h-6" /> },
                                    ].map((m) => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMetodoPago(m.id)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-lg border transition-all ${
                                                metodoPago === m.id 
                                                ? "border-purple-600 bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 ring-1 ring-purple-600" 
                                                : "border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700"
                                            }`}
                                        >
                                            {m.icon}
                                            <span className="text-xs font-semibold mt-1">{m.label}</span>
                                        </button>
                                    ))}
                                </div>

                                {metodoPago === "efectivo" && (
                                    <div className="mt-4">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Dinero recibido
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <span className="text-gray-500 sm:text-sm">$</span>
                                            </div>
                                            <input
                                                type="number"
                                                value={montoPagadoStr}
                                                onChange={(e) => setMontoPagadoStr(e.target.value)}
                                                className={`pl-7 block w-full rounded-md shadow-sm sm:text-sm p-2.5 border ${
                                                    pagoInsuficiente ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 dark:bg-gray-700"
                                                }`}
                                                placeholder="0"
                                            />
                                        </div>
                                        {pagoInsuficiente && <p className="mt-1 text-xs text-red-600">Monto insuficiente</p>}
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 lg:max-w-sm bg-gray-50 dark:bg-gray-700/50 p-6 rounded-xl">
                                <div className="space-y-3">
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>Subtotal Neto</span>
                                        <span>{formatMoney(Math.round(totalVenta / 1.19))}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600 dark:text-gray-400">
                                        <span>IVA (19%)</span>
                                        <span>{formatMoney(totalVenta - Math.round(totalVenta / 1.19))}</span>
                                    </div>
                                    
                                    <div className="border-t border-gray-200 dark:border-gray-600 pt-3 mt-3">
                                        <div className="flex justify-between items-center">
                                            <span className="text-xl font-bold text-gray-900 dark:text-white">Total a Pagar</span>
                                            <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                                {formatMoney(totalVenta)}
                                            </span>
                                        </div>
                                    </div>

                                    {esEfectivo && (
                                        <div className="flex justify-between items-center pt-2 text-sm">
                                            <span className="font-medium text-gray-700 dark:text-gray-300">Vuelto:</span>
                                            <span className={`font-bold text-lg ${vuelto < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                {formatMoney(vuelto > 0 ? vuelto : 0)}
                                            </span>
                                        </div>
                                    )}

                                    <Button 
                                        variant="primary" 
                                        fullWidth 
                                        className="mt-6 py-3 text-lg shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                                        onClick={handleConfirmVenta}
                                        disabled={carrito.length === 0 || loading || pagoInsuficiente}
                                    >
                                        {loading ? "Procesando..." : "Confirmar Venta"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default CarritoScreen;