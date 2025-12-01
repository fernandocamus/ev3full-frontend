import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import VentasTable from "../organisms/ventasTable";
import Spinner from "../atoms/spinner";
import Button from "../atoms/button";
import Alert from "../atoms/alert"; 
import { HiDownload, HiRefresh } from "react-icons/hi";

interface Venta {
    id: number;
    fecha_hora: string;
    usuario: {
        nombre: string;
    };
    total: number;
    metodo_pago: "EFECTIVO" | "TARJETA" | "TRANSFERENCIA";
}

const HistorialVentasScreenAdmin = () => {
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

            if (user.rol !== "ADMIN") {
                navigate("/venta");
                return;
            }
        } else {
            navigate("/login");
            return;
        }

        fetchVentas();
    }, [navigate]);

    const fetchVentas = async () => {
        setLoading(true);
        setError(""); 
        try {
            const response = await fetch("http://localhost:8080/api/ventas", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar ventas");

            const data = await response.json();
            setVentas(data);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudieron cargar las ventas. Verifique su conexión.");
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

    const handleDescargarReporte = async () => {
        setError(""); 
        try {
            const response = await fetch("http://localhost:8080/api/ventas/reporte", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al generar reporte");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `reporte-ventas-${new Date().toISOString().split("T")[0]}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo descargar el reporte. Intente nuevamente.");
            setTimeout(() => setError(""), 5000);
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Historial de Ventas
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Todas las ventas registradas en el sistema
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="secondary" onClick={fetchVentas} disabled={loading}>
                            <HiRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                        </Button>
                        <Button variant="secondary" onClick={handleDescargarReporte}>
                            <HiDownload className="w-5 h-5 mr-2" />
                            Descargar Reporte
                        </Button>
                    </div>
                </div>

                {error && (
                    <Alert type="error" title="Atención" className="mb-6">
                        {error}
                        {!error.includes("descargar") && (
                            <div className="mt-2">
                                <Button variant="secondary" onClick={fetchVentas} className="text-sm py-1">
                                    Reintentar carga
                                </Button>
                            </div>
                        )}
                    </Alert>
                )}

                {(!error || error.includes("descargar")) && (
                    <VentasTable
                        ventas={ventas}
                        onViewDetalle={handleViewDetalle}
                        loading={loading}
                        showVendedor={true}
                    />
                )}
            </main>
        </div>
    );
};

export default HistorialVentasScreenAdmin;