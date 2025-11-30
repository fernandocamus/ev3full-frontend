import React from "react";
import Card from "../atoms/card";
import StatCard from "../molecules/statCard";
import Spinner from "../atoms/spinner";
import { HiCash, HiCreditCard, HiCurrencyDollar, HiTrendingUp, HiChartPie, HiArchive } from "react-icons/hi";

interface ConsolidadoDiaData {
    totalEfectivo: number;
    totalTarjeta: number;
    totalTransferencia: number;
    totalCaja: number;
    cantidadVentas: number;
    totalVendido: number;
    productosVendidos: number;
    ticketPromedio: number;
    ventasEfectivo?: number;
    ventasTarjeta?: number;
    ventasTransferencia?: number;
}

interface ConsolidadoDiaProps {
    consolidado: ConsolidadoDiaData | null;
    loading?: boolean;
    className?: string;
}

const ConsolidadoDia = ({ consolidado, loading = false, className = "" }: ConsolidadoDiaProps) => {
    
    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;

    if (loading || !consolidado) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className={className}>
            <div className="flex items-center gap-2 mb-4">
                <HiArchive className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Caja del Día
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
                <StatCard
                    title="Efectivo"
                    value={formatMoney(consolidado.totalEfectivo)}
                    subtitle={`${consolidado.ventasEfectivo || 0} ventas`}
                    icon={<HiCash className="w-6 h-6" />}
                    variant="green"
                />

                <StatCard
                    title="Tarjeta"
                    value={formatMoney(consolidado.totalTarjeta)}
                    subtitle={`${consolidado.ventasTarjeta || 0} ventas`}
                    icon={<HiCreditCard className="w-6 h-6" />}
                    variant="blue"
                />

                <StatCard
                    title="Transferencia"
                    value={formatMoney(consolidado.totalTransferencia)}
                    subtitle={`${consolidado.ventasTransferencia || 0} ventas`}
                    icon={<HiCurrencyDollar className="w-6 h-6" />}
                    variant="purple"
                />
            </div>

            <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-lg opacity-90 mb-1">Total en Caja</p>
                        <p className="text-4xl font-bold">
                            {formatMoney(consolidado.totalCaja)}
                        </p>
                    </div>
                    <HiTrendingUp className="w-16 h-16 opacity-50" />
                </div>
            </Card>

            <div className="flex items-center gap-2 mb-4">
                <HiChartPie className="w-6 h-6 text-purple-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    Resumen de Ventas
                </h2>
            </div>
            
            <Card>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Cantidad de ventas</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {consolidado.cantidadVentas}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total vendido</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {formatMoney(consolidado.totalVendido)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Productos vendidos</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {consolidado.productosVendidos}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Ticket promedio</p>
                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                            {formatMoney(consolidado.ticketPromedio)}
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ConsolidadoDia;