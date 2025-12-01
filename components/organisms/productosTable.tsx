import React, { useState } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Badge from "../atoms/badge";
import SearchBar from "../molecules/searchBar";
import Pagination from "../molecules/pagination";
import EmptyState from "../molecules/emptyState";
import ConfirmDialog from "../molecules/confirmDialog";
import Spinner from "../atoms/spinner";
import { HiPencil, HiTrash, HiShoppingBag, HiPhotograph, HiCube, HiExclamationCircle, HiShoppingCart } from "react-icons/hi";

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
        nombre: string;
    };
}

interface ProductosTableProps {
    productos: Producto[];
    onEdit: (productoId: number) => void;
    onDelete: (productoId: number) => Promise<void>;
    onSell?: (producto: Producto) => void;
    loading?: boolean;
    itemsPerPage?: number;
    className?: string;
    readOnly?: boolean;
}

const ProductosTable = ({
    productos,
    onEdit,
    onDelete,
    onSell,
    loading = false,
    itemsPerPage = 10,
    className = "",
    readOnly = false,
}: ProductosTableProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [error, setError] = useState("");
    const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; productoId: number | null; productoNombre?: string }>({
        isOpen: false,
        productoId: null,
    });
    const [deleting, setDeleting] = useState(false);

    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;
    
    const getStockVariant = (stock: number) => {
        if (stock === 0) return "gray";
        if (stock <= 5) return "yellow";
        return "green";
    };

    const productosFiltrados = productos.filter((p) => {
        const matchSearch = p.nombre.toLowerCase().includes(searchValue.toLowerCase());
        const matchFilter = !filterValue || p.categoria.nombre === filterValue;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

    const categoriasUnicas = Array.from(new Set(productos.map((p) => p.categoria.nombre)));
    const filterOptions = [
        { value: "", label: "Todas las categorías" },
        ...categoriasUnicas.map(c => ({ value: c, label: c }))
    ];

    const handleDeleteClick = (producto: Producto) => {
        setDeleteDialog({
            isOpen: true,
            productoId: producto.id,
            productoNombre: producto.nombre
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteDialog.productoId) return;

        setDeleting(true);
        setError("");
        try {
            await onDelete(deleteDialog.productoId);
            setDeleteDialog({ isOpen: false, productoId: null });
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo eliminar el producto. Intente nuevamente.");
        } finally {
            setDeleting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <>
            <Card className={className}>
                <div className="flex items-center gap-2 mb-6">
                    <HiCube className="w-6 h-6 text-purple-600" />
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                        {readOnly ? "Catálogo de Productos" : "Gestión de Productos"}
                    </h2>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                        <HiExclamationCircle className="w-5 h-5" />
                        {error}
                    </div>
                )}

                <SearchBar
                    searchValue={searchValue}
                    onSearchChange={setSearchValue}
                    filterValue={filterValue}
                    onFilterChange={setFilterValue}
                    filterOptions={filterOptions}
                    placeholder="Buscar producto..."
                    className="mb-6"
                />

                {productosPaginados.length === 0 ? (
                    <EmptyState icon={<HiShoppingBag className="w-16 h-16" />} title="No se encontraron productos" />
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Imagen</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Nombre</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Categoría</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Precio</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Stock</th>
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosPaginados.map((producto) => (
                                        <tr key={producto.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded flex items-center justify-center overflow-hidden text-gray-400">
                                                    {producto.ruta_imagen && producto.ruta_imagen !== "sin-imagen.jpg" ? (
                                                        <img src={producto.ruta_imagen} alt={producto.nombre} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                                                    ) : (<HiPhotograph className="w-6 h-6 opacity-50" />)}
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900 dark:text-white">{producto.nombre}</td>
                                            <td className="px-4 py-3"><Badge variant="gray">{producto.categoria.nombre}</Badge></td>
                                            <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">{formatMoney(producto.precio_con_iva)}</td>
                                            <td className="px-4 py-3"><Badge variant={getStockVariant(producto.stock_actual)}>{producto.stock_actual} uds</Badge></td>
                                            
                                            <td className="px-4 py-3">
                                                {!readOnly ? (
                                                    // Botones de ADMIN
                                                    <div className="flex gap-2">
                                                        <Button variant="secondary" onClick={() => onEdit(producto.id)} className="p-1.5 h-auto" ><HiPencil className="w-4 h-4" /></Button>
                                                        <Button variant="danger" onClick={() => handleDeleteClick(producto)} className="p-1.5 h-auto" ><HiTrash className="w-4 h-4" /></Button>
                                                    </div>
                                                ) : (
                                                    // Botón de VENDEDOR (Agregar al carrito)
                                                    <Button 
                                                        variant="primary" 
                                                        onClick={() => onSell && onSell(producto)} 
                                                        className="text-xs py-1.5 px-3 flex items-center gap-1"
                                                        disabled={producto.stock_actual <= 0}
                                                    >
                                                        <HiShoppingCart className="w-4 h-4" /> Agregar al carrito
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-6" />}
                        
                        {/* Resumen de Stock */}
                        <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-100 dark:border-gray-700">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div><p className="text-gray-500 mb-1">Total productos</p><p className="text-lg font-bold text-gray-900 dark:text-white">{productosFiltrados.length}</p></div>
                                <div><p className="text-gray-500 mb-1">Con stock</p><p className="text-lg font-bold text-green-600">{productosFiltrados.filter(p => p.stock_actual > 0).length}</p></div>
                                <div><p className="text-gray-500 mb-1">Sin stock</p><p className="text-lg font-bold text-red-600">{productosFiltrados.filter(p => p.stock_actual === 0).length}</p></div>
                                <div><p className="text-gray-500 mb-1">Stock total</p><p className="text-lg font-bold text-gray-900 dark:text-white">{productosFiltrados.reduce((sum, p) => sum + p.stock_actual, 0)} uds</p></div>
                            </div>
                        </div>
                    </>
                )}
            </Card>

            <ConfirmDialog
                isOpen={deleteDialog.isOpen}
                onClose={() => setDeleteDialog({ isOpen: false, productoId: null })}
                onConfirm={handleDeleteConfirm}
                title="Eliminar Producto"
                message={`¿Estás seguro que deseas eliminar "${deleteDialog.productoNombre}"? Esta acción no se puede deshacer.`}
                confirmText="Eliminar"
                cancelText="Cancelar"
                variant="danger"
                loading={deleting}
            />
        </>
    );
};

export default ProductosTable;