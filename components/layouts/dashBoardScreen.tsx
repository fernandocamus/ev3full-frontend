import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import Button from "../atoms/button";
import Spinner from "../atoms/spinner";
import ConsolidadoDia from "../organisms/consolidadoDia";
import AlertasStock from "../organisms/alertasStock";
import { HiShoppingCart, HiCash, HiPlus } from "react-icons/hi";

interface ConsolidadoDia {
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

interface TopProducto {
    id: number;
    nombre: string;
    cantidad: number;
    total: number;
}

interface AlertaStock {
    id: number;
    nombre: string;
    stock: number;
}

const DashBoardScreen = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [usuario, setUsuario] = useState<any>(null);
    const [consolidado, setConsolidado] = useState<ConsolidadoDia | null>(null);
    const [alertasStock, setAlertasStock] = useState<AlertaStock[]>([]);

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

        fetchDashboardData();
    }, [navigate]);

    const fetchDashboardData = async () => {
        try {
            const [consolidadoRes, alertasRes] = await Promise.all([
                fetch("http://localhost:8080/api/dashboard/consolidado", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }),
                fetch("http://localhost:8080/api/productos/alertas-stock", { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } })
            ]);

            if (consolidadoRes.ok) setConsolidado(await consolidadoRes.json());
            if (alertasRes.ok) setAlertasStock(await alertasRes.json());

        } catch (error) {
            console.error("Error cargando dashboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleViewProducto = (productoId: number) => {
        navigate(`/productos?edit=${productoId}`);
    };

    if (loading || !usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                
                <div className="flex flex-wrap items-center justify-end gap-3 mb-8">
                    <Button variant="secondary" onClick={() => navigate("/ventas")} className="flex items-center gap-2">
                        <HiShoppingCart className="w-5 h-5" />
                        Ver Ventas
                    </Button>
                    <Button variant="danger" onClick={() => navigate("/cerrarDia")} className="flex items-center gap-2">
                        <HiCash className="w-5 h-5" />
                        Cerrar Día
                    </Button>
                </div>

                <ConsolidadoDia consolidado={consolidado} loading={false} className="mb-8" />

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-8">
                    <AlertasStock alertas={alertasStock} onViewProducto={handleViewProducto} />
                </div>
            </main>
        </div>
    );
};

export default DashBoardScreen;