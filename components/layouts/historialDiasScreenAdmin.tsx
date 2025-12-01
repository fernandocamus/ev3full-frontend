import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import DiasTable from "../organisms/diasTable";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import Button from "../atoms/button";
import { HiRefresh } from "react-icons/hi";

interface VentaDiaria {
    id: number;
    fecha: string;
    cantidad_ventas: number;
    total_vendido: number;
    total_productos_vendidos: number;
}

const HistorialDiasScreenAdmin = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<any>(null);
    const [VentaDiaria, setVentaDiaria] = useState<VentaDiaria[]>([]);
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

        fetchVentaDiarias();
    }, [navigate]);

    const fetchVentaDiarias = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/venta-diaria", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar días");

            const data = await response.json();
            setVentaDiaria(data);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudo cargar el historial. Verifique su conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleViewDetalle = (VentaDiariaId: number) => {
        navigate(`/detalle-VentaDiaria/${VentaDiariaId}`);
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
                <div className="mb-6 flex justify-between items-end">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Historial de Días
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                            Consulta los días cerrados y sus estadísticas
                        </p>
                    </div>
                    <Button variant="secondary" onClick={fetchVentaDiarias} disabled={loading} className="p-2">
                        <HiRefresh className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
                    </Button>
                </div>

                {error ? (
                    <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <Alert type="error" title="Ocurrió un error">
                            {error}
                        </Alert>
                        <Button onClick={fetchVentaDiarias} variant="primary">
                            Reintentar Carga
                        </Button>
                    </div>
                ) : (
                    <DiasTable 
                        dias={VentaDiaria} 
                        onViewDetalle={handleViewDetalle} 
                        loading={loading} 
                    />
                )}
            </main>
        </div>
    );
};

export default HistorialDiasScreenAdmin;