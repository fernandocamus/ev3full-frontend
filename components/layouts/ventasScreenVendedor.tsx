import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import VentasTable from "../organisms/ventasTable";
import Spinner from "../atoms/spinner";
import Card from "../atoms/card";
import Alert from "../atoms/alert";
import Button from "../atoms/button";
import { HiReceiptTax, HiCurrencyDollar, HiClipboardList } from "react-icons/hi";

interface Venta {
    id: number;
    fechaHora: string;
    vendedor: {
        nombre: string;
    };
    total: number;
    metodoPago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
}

const VentasScreenVendedor = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<any>(null);
    const [ventas, setVentas] = useState<Venta[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            const user = JSON.parse(userStr);
            setUsuario(user);
        } else {
            navigate("/login");
            return;
        }

        fetchMisVentas();
    }, [navigate]);

    const fetchMisVentas = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/ventas/mis-ventas", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar ventas");

            const data = await response.json();
            setVentas(data);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo cargar tu historial de ventas.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleViewDetalle = (ventaId: number) => {
        navigate(`/boleta/${ventaId}`);
    };

    const ventasHoy = ventas.filter((v) => {
        const hoy = new Date().toDateString();
        const fechaVenta = new Date(v.fechaHora).toDateString();
        return hoy === fechaVenta;
    });

    const totalVentasHoy = ventasHoy.length;
    const totalVendidoHoy = ventasHoy.reduce((sum, v) => sum + v.total, 0);

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
                <div className="mb-6 flex items-center gap-2">
                    <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
                        <HiClipboardList className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mis Ventas</h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Historial de tus ventas realizadas
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <Card className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Ventas de hoy
                            </p>
                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                {totalVentasHoy}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-full text-blue-500">
                            <HiReceiptTax className="w-8 h-8" />
                        </div>
                    </Card>

                    <Card className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                                Total vendido hoy
                            </p>
                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                ${totalVendidoHoy.toLocaleString("es-CL")}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-50 rounded-full text-purple-500">
                            <HiCurrencyDollar className="w-8 h-8" />
                        </div>
                    </Card>
                </div>

                {error && (
                    <div className="flex flex-col items-center justify-center py-8">
                        <Alert type="error" title="Error">{error}</Alert>
                        <Button variant="secondary" onClick={fetchMisVentas} className="mt-4">
                            Reintentar
                        </Button>
                    </div>
                )}

                {!loading && !error && (
                    <VentasTable
                        ventas={ventas}
                        onViewDetalle={handleViewDetalle}
                        loading={loading}
                        showVendedor={false}
                    />
                )}

                {loading && (
                    <div className="flex justify-center py-12">
                        <Spinner size="lg" />
                    </div>
                )}
            </main>
        </div>
    );
};

export default VentasScreenVendedor;