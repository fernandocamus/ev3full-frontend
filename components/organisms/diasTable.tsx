import React, { useState } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Badge from "../atoms/badge";
import Pagination from "../molecules/pagination";
import EmptyState from "../molecules/emptyState";
import Spinner from "../atoms/spinner";
import { HiEye, HiCalendar, HiChartBar, HiTrendingUp, HiTrendingDown } from "react-icons/hi";

interface Dia {
    id: number;
    fecha: string;
    cantidad_ventas: number;
    total_vendido: number;
    total_productos_vendidos: number;
}

interface DiasTableProps {
    dias: Dia[];
    onViewDetalle: (diaId: number) => void;
    loading?: boolean;
    itemsPerPage?: number;
    className?: string;
}

const DiasTable = ({
    dias,
    onViewDetalle,
    loading = false,
    itemsPerPage = 10,
    className = "",
}: DiasTableProps) => {
    const [currentPage, setCurrentPage] = useState(1);

    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;
    const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("es-CL", {
        weekday: "short", day: "2-digit", month: "short", year: "numeric"
    });

    const totalPages = Math.ceil(dias.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const diasPaginados = dias.slice(startIndex, endIndex);

    const totalVendidoMes = dias.reduce((sum, d) => sum + d.total_vendido, 0);
    const promedioDiario = dias.length > 0 ? totalVendidoMes / dias.length : 0;
    const mejorDia = dias.length > 0 ? dias.reduce((max, d) => d.total_vendido > max.total_vendido ? d : max) : null;
    const peorDia = dias.length > 0 ? dias.reduce((min, d) => d.total_vendido < min.total_vendido ? d : min) : null;
    const totalProductos = dias.reduce((sum, d) => sum + d.total_productos_vendidos, 0);
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
                <HiCalendar className="w-6 h-6 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    Historial de Días Cerrados
                </h2>
            </div>

            {diasPaginados.length === 0 ? (
                <EmptyState
                    icon={<HiCalendar className="w-16 h-16" />}
                    title="No hay días registrados"
                    description="Aún no se ha cerrado ningún día"
                />
            ) : (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Fecha</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Ventas</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Total Vendido</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Productos</th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 dark:text-gray-300">Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {diasPaginados.map((dia) => (
                                    <tr
                                        key={dia.id}
                                        className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            {formatDate(dia.fecha)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Badge variant="blue">{dia.cantidad_ventas}</Badge>
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-gray-900 dark:text-white">
                                            {formatMoney(dia.total_vendido)}
                                        </td>
                                        <td className="px-4 py-3 text-sm">
                                            <Badge variant="green">{dia.total_productos_vendidos} uds</Badge>
                                        </td>
                                        <td className="px-4 py-3">
                                            <Button
                                                variant="primary"
                                                onClick={() => onViewDetalle(dia.id)}
                                                className="text-sm py-1 px-3 flex items-center gap-1"
                                            >
                                                <HiEye className="w-4 h-4" /> Ver
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                            className="mt-6"
                        />
                    )}

                    <div className="mt-8 p-5 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                        <h3 className="flex items-center gap-2 font-bold text-gray-900 dark:text-white mb-4">
                            <HiChartBar className="w-5 h-5 text-gray-500" />
                            Resumen del período:
                        </h3>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm mb-6">
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Total días</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">{dias.length}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Total vendido</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatMoney(totalVendidoMes)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Promedio diario</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {formatMoney(Math.round(promedioDiario))}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 mb-1">Total productos</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">
                                    {totalProductos} uds
                                </p>
                            </div>
                        </div>

                        {mejorDia && peorDia && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg flex items-center gap-3">
                                        <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600">
                                            <HiTrendingUp className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-purple-700 dark:text-purple-300 font-semibold uppercase tracking-wide">Mejor día</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formatDate(mejorDia.fecha)}
                                            </p>
                                            <p className="text-sm font-semibold text-purple-600 dark:text-purple-400">
                                                {formatMoney(mejorDia.total_vendido)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-center gap-3">
                                        <div className="p-2 bg-red-100 dark:bg-red-900/40 rounded-full text-red-600">
                                            <HiTrendingDown className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-red-700 dark:text-red-300 font-semibold uppercase tracking-wide">Día más bajo</p>
                                            <p className="font-bold text-gray-900 dark:text-white">
                                                {formatDate(peorDia.fecha)}
                                            </p>
                                            <p className="text-sm font-semibold text-red-600 dark:text-red-400">
                                                {formatMoney(peorDia.total_vendido)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </Card>
    );
};

export default DiasTable;