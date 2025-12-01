import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import ProductosTable from "../organisms/productosTable";
import ProductoForm from "../organisms/productoForm";
import Button from "../atoms/button";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import { HiPlus, HiX, HiShoppingCart } from "react-icons/hi";

interface Producto {
    id: number;
    nombre: string;
    descripcion: string;
    precio_base: number;
    iva: number;
    precio_con_iva: number;
    stock_actual: number;
    ruta_imagen?: string;
    categoria: {
        id: number;
        nombre: string;
    };
    categoriaId?: number;
}

const ProductosScreen = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<any>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [productoEditar, setProductoEditar] = useState<Producto | undefined>(undefined);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUsuario(user);

            if (user.rol !== "ADMIN" && user.rol !== "VENDEDOR") {
                navigate("/login");
                return;
            }
        } else {
            navigate("/login");
            return;
        }

        fetchProductos();
    }, [navigate]);

    const canEdit = usuario?.rol === "ADMIN";

    const fetchProductos = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/productos", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Error al cargar productos");

            const data = await response.json();
            setProductos(data);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudieron cargar los productos. Verifique su conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleAddProducto = () => {
        setProductoEditar(undefined);
        setShowModal(true);
    };

    const handleEditProducto = (productoId: number) => {
        const producto = productos.find((p) => p.id === productoId);
        if (producto) {
            setProductoEditar(producto);
            setShowModal(true);
        }
    };

    const handleDeleteProducto = async (productoId: number) => {
        setError("");
        try {
            const response = await fetch(`http://localhost:8080/api/productos/${productoId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });

            if (!response.ok) throw new Error("Error al eliminar producto");

            setSuccessMessage("Producto eliminado correctamente");
            setTimeout(() => setSuccessMessage(""), 3000);
            fetchProductos();
        } catch (error) {
            console.error("Error:", error);
            setError("Error al eliminar el producto. Puede que tenga ventas asociadas.");
        }
    };

    const handleSubmitProducto = async (formData: FormData) => {
        try {
            const url = productoEditar
                ? `http://localhost:8080/api/productos/${productoEditar.id}`
                : "http://localhost:8080/api/productos";

            const method = productoEditar ? "PATCH" : "POST";

            const response = await fetch(url, {
                method,
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
                body: formData,
            });

            if (!response.ok) throw new Error("Error al guardar producto");

            setSuccessMessage(
                productoEditar
                    ? "Producto actualizado correctamente"
                    : "Producto creado correctamente"
            );
            setTimeout(() => setSuccessMessage(""), 3000);

            setShowModal(false);
            setProductoEditar(undefined);
            fetchProductos();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    };

    const handleSellProduct = (producto: Producto) => {
        const carritoGuardado = localStorage.getItem("carrito");
        const carritoActual: Array<{ producto: any, cantidad: number }> = carritoGuardado
            ? JSON.parse(carritoGuardado)
            : [];

        const indexExistente = carritoActual.findIndex(
            item => item.producto.id === producto.id
        );

        if (indexExistente >= 0) {
            carritoActual[indexExistente].cantidad += 1;
        } else {
            const nuevoItem = {
                producto: {
                    id: producto.id,
                    nombre: producto.nombre,
                    precioBase: producto.precio_base,
                    iva: producto.iva,
                    precioConIva: producto.precio_con_iva,
                    stockActual: producto.stock_actual,
                    rutaImagen: producto.ruta_imagen,
                    categoria: producto.categoria
                },
                cantidad: 1
            };
            carritoActual.push(nuevoItem);
        }

        localStorage.setItem("carrito", JSON.stringify(carritoActual));

        setSuccessMessage(`"${producto.nombre}" agregado al carrito`);
        setTimeout(() => setSuccessMessage(""), 3000);
    };


    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {successMessage && (
                    <Alert type="success" title="Éxito" className="mb-6">
                        {successMessage}
                    </Alert>
                )}

                {error && (
                    <Alert type="error" title="Atención" className="mb-6">
                        {error}
                        {error.includes("cargar") && (
                            <div className="mt-2">
                                <Button variant="secondary" onClick={fetchProductos} className="text-sm py-1">
                                    Reintentar
                                </Button>
                            </div>
                        )}
                    </Alert>
                )}

                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {canEdit ? "Gestión de Productos" : "Catálogo de Productos"}
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            {canEdit ? "Administra el catálogo de productos" : "Consulta de precios y stock"}
                        </p>
                    </div>

                    {canEdit && (
                        <Button variant="primary" onClick={handleAddProducto} className="flex items-center gap-2">
                            <HiPlus className="w-5 h-5" />
                            Agregar Producto
                        </Button>
                    )}
                </div>

                {!loading && !error.includes("cargar") && (
                    <ProductosTable
                        productos={productos}
                        onEdit={handleEditProducto}
                        onDelete={handleDeleteProducto}
                        loading={loading}
                        readOnly={!canEdit}
                        onSell={handleSellProduct}
                    />
                )}

                {loading && (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}
            </main>

            {canEdit && showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
                        onClick={() => {
                            setShowModal(false);
                            setProductoEditar(undefined);
                        }}
                    />
                    <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 z-10"
                        >
                            <HiX className="w-6 h-6" />
                        </button>

                        <div className="p-1">
                            <ProductoForm
                                producto={productoEditar as any}
                                onSubmit={handleSubmitProducto}
                                onCancel={() => {
                                    setShowModal(false);
                                    setProductoEditar(undefined);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
            {(() => {
                const carritoGuardado = localStorage.getItem("carrito");
                const carritoActual = carritoGuardado ? JSON.parse(carritoGuardado) : [];
                const totalItems = carritoActual.reduce((sum: number, item: any) => sum + item.cantidad, 0);

                return totalItems > 0 ? (
                    <button
                        onClick={() => navigate("/carrito")}
                        className="fixed bottom-6 right-6 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-4 shadow-lg hover:shadow-xl transform hover:scale-110 transition-all duration-200 flex items-center gap-3 z-40"
                    >
                        <HiShoppingCart className="w-6 h-6" />
                        <span className="font-bold">Ver Carrito</span>
                        <span className="bg-white text-purple-600 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            {totalItems}
                        </span>
                    </button>
                ) : null;
            })()}
        </div>

    );
};

export default ProductosScreen;