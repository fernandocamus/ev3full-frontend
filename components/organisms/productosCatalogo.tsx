import React, { useState } from "react";
import SearchBar from "../molecules/searchBar";
import ProductCard from "../molecules/productCard";
import Pagination from "../molecules/pagination";
import EmptyState from "../molecules/emptyState";
import Spinner from "../atoms/spinner";
import { HiShoppingCart } from "react-icons/hi";

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

interface ProductosCatalogoProps {
    productos: Producto[];
    onSelectProduct: (producto: Producto) => void;
    loading?: boolean;
    itemsPerPage?: number;
    className?: string;
}

const ProductosCatalogo = ({
    productos,
    onSelectProduct,
    loading = false,
    itemsPerPage = 9,
    className = "",
}: ProductosCatalogoProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    const productosFiltrados = productos.filter((p) => {
        const matchSearch = p.nombre.toLowerCase().includes(searchValue.toLowerCase());
        const matchFilter = !filterValue || p.categoria.nombre === filterValue;
        return matchSearch && matchFilter;
    });

    const totalPages = Math.ceil(productosFiltrados.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const productosPaginados = productosFiltrados.slice(startIndex, endIndex);

    const categorias = Array.from(new Set(productos.map((p) => p.categoria.nombre))).map((cat) => ({
        value: cat,
        label: cat,
    }));

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className={className}>
            <SearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
                filterOptions={[{ value: "", label: "Todas las categorías" }, ...categorias]}
                placeholder="Buscar producto..."
                className="mb-6"
            />

            {productosPaginados.length === 0 ? (
                <EmptyState
                    icon={<HiShoppingCart className="w-16 h-16" />}
                    title="No se encontraron productos"
                    description={
                        searchValue || filterValue
                            ? "Intenta con otros filtros de búsqueda"
                            : "No hay productos disponibles"
                    }
                />
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                        {productosPaginados.map((producto) => (
                            <ProductCard
                                key={producto.id}
                                producto={producto}
                                onAdd={onSelectProduct}
                            />
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
            )}

            <div className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                Mostrando {productosPaginados.length} de {productosFiltrados.length} productos
            </div>
        </div>
    );
};

export default ProductosCatalogo;