import React, { useState } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Badge from "../atoms/badge";
import SearchBar from "../molecules/searchBar";
import Pagination from "../molecules/pagination";
import EmptyState from "../molecules/emptyState";
import Spinner from "../atoms/spinner";
import { HiEye, HiShoppingBag, HiCash } from "react-icons/hi";

interface Venta {
    id: number;
    fecha_hora: string;
    usuario: {
        nombre: string;
    };
    total: number;
    metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
}

interface VentasTableProps {
    ventas: Venta[];
    onViewDetalle: (ventaId: number) => void;
    loading?: boolean;
    itemsPerPage?: number;
    showVendedor?: boolean;
    className?: string;
}

const VentasTable = ({
    ventas,
    onViewDetalle,
    loading = false,
    itemsPerPage = 10,
    showVendedor = true,
    className = "",
}: VentasTableProps) => {
    const [searchValue, setSearchValue] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Helpers (Código Limpio)
    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;
    
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleString("es-CL", {
        day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit"
    });

    // Lógica de colores (Sin usar 'any')
    const getmetodo_pagoVariant = (metodo: string) => {
        switch (metodo) {
            case "EFECTIVO": return "green";
            case "TARJETA": return "blue";
            case "TRANSFERENCIA": return "blue"; 
            default: return "gray";
        }
    };

    // Filtrar ventas
    const ventasFiltradas = ventas.filter((v) => {
        const matchSearch =
            v.id.toString().includes(searchValue) ||
            v.usuario?.nombre.toLowerCase().includes(searchValue.toLowerCase());
        const matchFilter = !filterValue || v.metodo_pago === filterValue;
        return matchSearch && matchFilter;
    });

    // Paginación
    const totalPages = Math.ceil(ventasFiltradas.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const ventasPaginadas = ventasFiltradas.slice(startIndex, startIndex + itemsPerPage);

    // Cálculo Total (Fuera del JSX)
    const totalMostrado = ventasFiltradas.reduce((sum, v) => sum + v.total, 0);

    const metodo_pagoOptions = [
        { value: "", label: "Todos los métodos" },
        { value: "EFECTIVO", label: "Efectivo" },
        { value: "TARJETA", label: "Tarjeta" },
        { value: "TRANSFERENCIA", label: "Transferencia" },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Card className={className}>
            <div className="flex items-center gap-2 mb-6">
                <HiCash className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Registro de Ventas
                </h2>
            </div>

            {/* Filtros */}
            <SearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
                filterValue={filterValue}
                onFilterChange={setFilterValue}
                filterOptions={metodo_pagoOptions}
                placeholder="Buscar por # o vendedor..."
                className="mb-6"
            />

            {/* Tabla */}
            {ventasPaginadas.length === 0 ? (
                <EmptyState
                    icon={<HiShoppingBag className="w-16 h-16" />}
                    title="No se encontraron ventas"
                    description="No hay ventas que coincidan con los filtros"
                />
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">#</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha/Hora</th>
                                    {showVendedor && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Vendedor</th>
                                    )}
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Método</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventasPaginadas.map((venta) => (
                                    <tr
                                        key={venta.id}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            #{venta.id}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                            {formatDate(venta.fecha_hora)}
                                        </td>
                                        {showVendedor && (
                                            <td className="px-4 py-3 text-sm text-gray-900 dark:text-gray-100">
                                                {venta.usuario?.nombre}
                                            </td>
                                        )}
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            {formatMoney(venta.total)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <Badge variant={getmetodo_pagoVariant(venta.metodo_pago)}>
                                                {venta.metodo_pago}
                                            </Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                variant="primary"
                                                onClick={() => onViewDetalle(venta.id)}
                                                // Ajuste visual para mejor clic
                                                className="text-sm py-1.5 px-3 flex items-center gap-1"
                                            >
                                                <HiEye className="w-4 h-4" /> Ver
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Paginación */}
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-6"
                        />
                    )}

                    {/* Resumen al pie */}
                    <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
                        Mostrando {ventasPaginadas.length} de {ventasFiltradas.length} ventas
                        {ventasFiltradas.length > 0 && (
                            <span className="ml-2 font-medium text-purple-600 dark:text-purple-400">
                                | Total: {formatMoney(totalMostrado)}
                            </span>
                        )}
                    </div>
                </>
            )}
        </Card>
    );
};

export default VentasTable;