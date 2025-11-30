import React, { useState } from "react";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Alert from "../atoms/alert";
import Spinner from "../atoms/spinner";
import { HiExclamation, HiChartBar, HiCash, HiCreditCard, HiDeviceMobile, HiInformationCircle, HiCurrencyDollar } from "react-icons/hi";

interface ConsolidadoDia {
    cantidadVentas: number;
    totalVendido: number;
    productosVendidos: number;
    totalEfectivo: number;
    totalTarjeta: number;
    totalTransferencia: number;
}

interface CerrarDiaFormProps {
    consolidado: ConsolidadoDia | null;
    onConfirm: (observaciones: string) => Promise<void>;
    onCancel: () => void;
    loading?: boolean;
    className?: string;
}

const CerrarDiaForm = ({
    consolidado,
    onConfirm,
    onCancel,
    loading = false,
    className = "",
}: CerrarDiaFormProps) => {
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState("");

    const fechaActual = new Date().toLocaleDateString("es-CL", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const handleConfirm = async () => {
        setConfirming(true);
        setError("");
        try {
            await onConfirm("");
        } catch (error) {
            console.error("Error al cerrar día:", error);
            setError("Hubo un problema al cerrar el día. Intenta nuevamente.");
        } finally {
            setConfirming(false);
        }
    };

    if (loading || !consolidado) {
        return (
            <div className="flex items-center justify-center py-12">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <Card className={className}>
            <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                    <HiExclamation className="w-8 h-8 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Cerrar Día
                    </h2>
                </div>
                <p className="text-gray-600 dark:text-gray-400 capitalize ml-10">
                    {fechaActual}
                </p>
            </div>

            <Alert type="info" title="Importante" className="mb-6">
                Esta acción no se puede deshacer. Se generará el reporte del día y se iniciará un nuevo turno automáticamente.
            </Alert>

            <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                    <HiChartBar className="w-5 h-5 text-gray-500" />
                    Resumen del día:
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ventas</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {consolidado.cantidadVentas}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total Vendido</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            ${consolidado.totalVendido.toLocaleString("es-CL")}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Productos</p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                            {consolidado.productosVendidos}
                        </p>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <h3 className="flex items-center gap-2 font-semibold text-gray-900 dark:text-white mb-4">
                    <HiCurrencyDollar className="w-5 h-5 text-gray-500" />
                    Arqueo de Caja:
                </h3>
                <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiCash className="w-5 h-5" />
                            <span>Efectivo:</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${consolidado.totalEfectivo.toLocaleString("es-CL")}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiCreditCard className="w-5 h-5" />
                            <span>Tarjeta:</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${consolidado.totalTarjeta.toLocaleString("es-CL")}
                        </span>
                    </div>

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                            <HiDeviceMobile className="w-5 h-5" />
                            <span>Transferencia:</span>
                        </div>
                        <span className="font-semibold text-gray-900 dark:text-white">
                            ${consolidado.totalTransferencia.toLocaleString("es-CL")}
                        </span>
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t-2 border-gray-200 dark:border-gray-600 mt-2">
                        <span className="font-bold text-gray-900 dark:text-white text-lg">Total Recaudado:</span>
                        <span className="font-bold text-purple-600 dark:text-purple-400 text-2xl">
                            ${consolidado.totalVendido.toLocaleString("es-CL")}
                        </span>
                    </div>
                </div>
            </div>

            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800">
                <p className="text-sm text-blue-800 dark:text-blue-300 mb-2 font-semibold flex items-center gap-2">
                    <HiInformationCircle className="w-5 h-5" />
                    Al confirmar el cierre:
                </p>
                <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-disc list-inside ml-7">
                    <li>Se generará el reporte diario final.</li>
                    <li>Los contadores de caja volverán a cero.</li>
                    <li>Se cerrará la sesión actual.</li>
                </ul>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg text-center font-medium">
                    {error}
                </div>
            )}

            <div className="flex gap-3">
                <Button
                    variant="secondary"
                    fullWidth
                    onClick={onCancel}
                    disabled={confirming}
                >
                    Cancelar
                </Button>
                <Button
                    variant="danger"
                    fullWidth
                    onClick={handleConfirm}
                    loading={confirming}
                >
                    {confirming ? "Cerrando..." : "Confirmar Cierre ✓"}
                </Button>
            </div>
        </Card>
    );
};

export default CerrarDiaForm;