import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../organisms/navBar";
import BoletaView from "../organisms/boletaView";
import Button from "../atoms/button";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import { HiArrowLeft } from "react-icons/hi";

interface DetalleVenta {
    id: number;
    producto: { nombre: string };
    cantidad: number;
    precio_unitario_base: number;
    iva: number;
    precio_unitario_con_iva: number;
    subtotal_con_iva: number;
}

interface Venta {
    id: number;
    fecha_hora: string;
    usuario: { nombre: string };
    subtotal: number;
    total_iva: number;
    total: number;
    metodo_pago: string;
    detalles: DetalleVenta[];
    montoPagado?: number;
    vuelto?: number;
}

const BoletaScreen = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const [usuario, setUsuario] = useState<any>(null);
    const [venta, setVenta] = useState<Venta | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const userStr = localStorage.getItem("user");
        if (userStr) {
            setUsuario(JSON.parse(userStr));
        } else {
            navigate("/login");
            return;
        }

        if (id) {
            fetchVenta(parseInt(id));
        }
    }, [id, navigate]);

    const fetchVenta = async (ventaId: number) => {
        try {
            const response = await fetch(`http://localhost:8080/api/ventas/${ventaId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar la venta");

            const data = await response.json();
            setVenta(data);
        } catch (error) {
            console.error("Error:", error);
            setError("No se pudo cargar la información de la boleta.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleImprimir = () => {
        window.print();
    };

    const handleDescargar = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/ventas/${id}/pdf`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al generar PDF");

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `boleta-${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error("Error:", error);
            setError("Error al descargar el PDF. Intente nuevamente.");
        }
    };

    const handleVolver = () => {
        if (usuario?.rol === "ADMIN") {
            navigate("/ventas");
        } else {
            navigate("/mis-ventas");
        }
    };

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-6">
                    <Button 
                        variant="secondary" 
                        onClick={handleVolver} 
                        className="flex items-center gap-2 pl-2 pr-4"
                    >
                        <HiArrowLeft className="w-5 h-5" />
                        Volver al listado
                    </Button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                        <Spinner size="lg" />
                        <p className="mt-4 text-gray-500 dark:text-gray-400">Cargando boleta...</p>
                    </div>
                ) : error ? (
                    <Alert type="error" title="Ha ocurrido un error">
                        {error}
                        <div className="mt-4">
                            <Button variant="secondary" onClick={() => window.location.reload()}>
                                Reintentar
                            </Button>
                        </div>
                    </Alert>
                ) : venta ? (
                    <BoletaView
                        venta={venta}
                        montoPagado={venta.montoPagado}
                        vuelto={venta.vuelto}
                        showActions={true}
                        onImprimir={handleImprimir}
                        onDescargar={handleDescargar}
                        className="shadow-lg"
                    />
                ) : null}
            </main>
        </div>
    );
};

export default BoletaScreen;