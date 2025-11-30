import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../organisms/navBar";
import Card from "../atoms/card";
import Button from "../atoms/button";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import TopProductos from "../organisms/topProductos";
import VentasTable from "../organisms/ventasTable";
import { 
    HiArrowLeft, 
    HiDownload, 
    HiCreditCard, 
    HiCurrencyDollar, 
    HiChartBar, 
    HiCash 
} from "react-icons/hi";

interface DetalleDia {
    id: number;
    fecha: string;
    cantidadVentas: number;
    totalVendido: number;
    totalProductosVendidos: number;
    totalEfectivo: number;
    totalTarjeta: number;
    totalTransferencia: number;
    observaciones: string;
    topProductos: Array<any>;
    ventas: Array<any>;
}

const DetalleDiaScreenAdmin = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [usuario, setUsuario] = useState<any>(null);
    const [detalle, setDetalle] = useState<DetalleDia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const formatMoney = (val: number) => `$${val.toLocaleString("es-CL")}`;

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUsuario(user);
            if (user.rol !== "ADMIN") {
                navigate("/venta");
                return;
            }
        } else {
            navigate("/login");
            return;
        }

        if (id) fetchDetalleDia(parseInt(id));
    }, [id, navigate]);

    const fetchDetalleDia = async (diaId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/dias/${diaId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error("Error al cargar detalle");
            setDetalle(await response.json());
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo cargar el detalle del día");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleDownload = async (type: "pdf" | "excel") => {
        try {
            const response = await fetch(`http://localhost:8080/api/dias/${id}/${type}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            if (!response.ok) throw new Error(`Error al generar ${type.toUpperCase()}`);
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `dia-${detalle?.fecha}-reporte.${type === "excel" ? "xlsx" : "pdf"}`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error:", err);
            setError(`Error al descargar el archivo ${type.toUpperCase()}`);
        }
    };

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Button variant="secondary" onClick={() => navigate("/dias")} className="flex items-center gap-2 pl-2 pr-4">
                        <HiArrowLeft className="w-5 h-5" /> Volver al Historial
                    </Button>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : error ? (
                    <Alert type="error" title="Error">{error}</Alert>
                ) : detalle ? (
                    <>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Detalle del Día</h1>
                                <p className="text-gray-500 dark:text-gray-400 mt-1 capitalize">
                                    {new Date(detalle.fecha).toLocaleDateString("es-CL", {
                                        weekday: "long", day: "numeric", month: "long", year: "numeric"
                                    })}
                                </p>
                            </div>
                            <div className="flex gap-3">
                                <Button variant="secondary" onClick={() => handleDownload("pdf")} className="flex items-center gap-2">
                                    <HiDownload className="w-5 h-5" /> PDF
                                </Button>
                                <Button variant="secondary" onClick={() => handleDownload("excel")} className="flex items-center gap-2">
                                    <HiDownload className="w-5 h-5" /> Excel
                                </Button>
                            </div>
                        </div>

                        <Card className="mb-8">
                            <div className="flex items-center gap-2 mb-6">
                                <HiChartBar className="w-6 h-6 text-purple-600" />
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Resumen General</h2>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ventas</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{detalle.cantidadVentas}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Total vendido</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatMoney(detalle.totalVendido)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Productos</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{detalle.totalProductosVendidos}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Ticket promedio</p>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                        {formatMoney(detalle.cantidadVentas > 0 ? Math.round(detalle.totalVendido / detalle.cantidadVentas) : 0)}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            <Card>
                                <div className="flex items-center gap-2 mb-6">
                                    <HiCurrencyDollar className="w-6 h-6 text-green-600" />
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Métodos de Pago</h2>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <HiCash className="w-6 h-6 text-green-500" />
                                            <span className="font-medium">Efectivo</span>
                                        </div>
                                        <span className="font-bold">{formatMoney(detalle.totalEfectivo)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <HiCreditCard className="w-6 h-6 text-blue-500" />
                                            <span className="font-medium">Tarjeta</span>
                                        </div>
                                        <span className="font-bold">{formatMoney(detalle.totalTarjeta)}</span>
                                    </div>
                                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <HiCurrencyDollar className="w-6 h-6 text-purple-500" />
                                            <span className="font-medium">Transferencia</span>
                                        </div>
                                        <span className="font-bold">{formatMoney(detalle.totalTransferencia)}</span>
                                    </div>
                                </div>
                            </Card>

                            <TopProductos productos={detalle.topProductos} />
                        </div>

                        {detalle.observaciones && (
                            <Card className="mb-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-100 dark:border-yellow-900/30">
                                <h2 className="font-bold text-yellow-800 dark:text-yellow-500 mb-2">📝 Observaciones del Cierre</h2>
                                <p className="text-yellow-700 dark:text-yellow-400">{detalle.observaciones}</p>
                            </Card>
                        )}

                        <div className="mb-4">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Detalle de Ventas</h2>
                            <VentasTable 
                                ventas={detalle.ventas} 
                                onViewDetalle={(id) => navigate(`/boleta/${id}`)}
                                showVendedor={true}
                            />
                        </div>
                    </>
                ) : null}
            </main>
        </div>
    );
};

export default DetalleDiaScreenAdmin;