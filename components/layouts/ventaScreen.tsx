import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import SearchBar from "../molecules/searchBar";
import ProductCard from "../molecules/productCard";
import CarritoCompra from "../organisms/carritoCompra";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";

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

interface ItemCarrito {
    producto: Producto;
    cantidad: number;
}

const VentaScreen = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<any>(null);
    const [productos, setProductos] = useState<Producto[]>([]);
    const [carrito, setCarrito] = useState<ItemCarrito[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUsuario(JSON.parse(userStr));
        } else {
            navigate("/login");
            return;
        }
        fetchProductos();
    }, [navigate]);

    const fetchProductos = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/productos", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Error al cargar productos");
            setProductos(await response.json());
        } catch (err) {
            console.error(err);
            setError("No se pudo cargar el catálogo de productos.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const addToCart = (producto: Producto) => {
        setCarrito((prev) => {
            const existing = prev.find((item) => item.producto.id === producto.id);
            if (existing) {
                if (existing.cantidad < producto.stockActual) {
                    return prev.map((item) =>
                        item.producto.id === producto.id
                            ? { ...item, cantidad: item.cantidad + 1 }
                            : item
                    );
                }
                return prev;
            }
            return [...prev, { producto, cantidad: 1 }];
        });
    };

    const removeFromCart = (productoId: number) => {
        setCarrito((prev) => prev.filter((item) => item.producto.id !== productoId));
    };

    const updateQuantity = (productoId: number, cantidad: number) => {
        if (cantidad <= 0) {
            removeFromCart(productoId);
            return;
        }
        setCarrito((prev) =>
            prev.map((item) =>
                item.producto.id === productoId ? { ...item, cantidad } : item
            )
        );
    };

    const handleConfirmVenta = async () => {
        console.log("Venta confirmada", carrito);
        setCarrito([]);
        alert("Venta registrada con éxito (Simulación)");
    };

    const productosFiltrados = productos.filter((p) => {
        const matchSearch = p.nombre.toLowerCase().includes(searchValue.toLowerCase());
        const matchFilter = !filterValue || p.categoria.nombre === filterValue;
        return matchSearch && matchFilter;
    });

    const categorias = Array.from(new Set(productos.map((p) => p.categoria.nombre))).map(c => ({ value: c, label: c }));

    if (!usuario) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-6">
                    
                    <div className="lg:w-2/3 space-y-6">
                        {error && <Alert type="error" title="Error">{error}</Alert>}
                        
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Catálogo</h2>
                            <SearchBar
                                searchValue={searchValue}
                                onSearchChange={setSearchValue}
                                filterValue={filterValue}
                                onFilterChange={setFilterValue}
                                filterOptions={[{ value: "", label: "Todas" }, ...categorias]}
                                placeholder="Buscar producto..."
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-[600px] overflow-y-auto pr-2">
                            {loading ? (
                                <div className="col-span-full flex justify-center pt-20"><Spinner /></div>
                            ) : (
                                productosFiltrados.map((producto) => (
                                    <ProductCard
                                        key={producto.id}
                                        producto={producto}
                                        onAdd={addToCart}
                                        disabled={
                                            producto.stockActual <= (carrito.find(i => i.producto.id === producto.id)?.cantidad || 0)
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>

                    <div className="lg:w-1/3">
                        <div className="sticky top-24">
                            <CarritoCompra
                                carrito={carrito}
                                onChangeQuantity={updateQuantity}
                                onRemove={removeFromCart}
                                onConfirm={handleConfirmVenta}
                                onCancel={() => setCarrito([])}
                            />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default VentaScreen;