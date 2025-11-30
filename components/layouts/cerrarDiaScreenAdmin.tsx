import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../organisms/navBar";
import CerrarDiaForm from "../organisms/cerrarDiaForm";
import Spinner from "../atoms/spinner";
import Alert from "../atoms/alert";
import Button from "../atoms/button";

interface ConsolidadoDia {
    cantidadVentas: number;
    totalVendido: number;
    productosVendidos: number;
    totalEfectivo: number;
    totalTarjeta: number;
    totalTransferencia: number;
}

const CerrarDiaScreenAdmin = () => {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState<any>(null);
    const [consolidado, setConsolidado] = useState<ConsolidadoDia | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

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

        fetchConsolidado();
    }, [navigate]);

    const fetchConsolidado = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetch("http://localhost:8080/api/dashboard/consolidado", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            });

            if (!response.ok) throw new Error("Error al cargar consolidado");

            const data = await response.json();
            setConsolidado(data);
        } catch (err) {
            console.error("Error:", err);
            setError("No se pudieron cargar los datos del cierre. Por favor, revisa tu conexión.");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
    };

    const handleConfirm = async (observaciones: string) => {
        const response = await fetch("http://localhost:8080/api/dias/cerrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify({ observaciones }),
        });

        if (!response.ok) throw new Error("Error al cerrar el día");

        setSuccess(true);

        setTimeout(() => {
            navigate("/dashboard");
        }, 2000);
    };

    const handleCancel = () => {
        navigate("/dashboard");
    };

    if (!usuario) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <Navbar usuario={usuario} onLogout={handleLogout} />

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {success ? (
                    <Alert type="success" title="¡Día cerrado exitosamente!">
                        El día se ha cerrado correctamente. Redirigiendo al dashboard...
                    </Alert>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12">
                        <Alert type="error" title="Error de carga" className="mb-4 w-full max-w-lg">
                            {error}
                        </Alert>
                        <Button onClick={fetchConsolidado} variant="secondary">
                            Reintentar Carga
                        </Button>
                    </div>
                ) : (
                    <CerrarDiaForm
                        consolidado={consolidado}
                        onConfirm={handleConfirm}
                        onCancel={handleCancel}
                        loading={loading}
                    />
                )}
            </main>
        </div>
    );
};

export default CerrarDiaScreenAdmin;