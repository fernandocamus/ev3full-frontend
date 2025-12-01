import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../atoms/input";
import Button from "../atoms/button";
import Alert from "../atoms/alert";
import Card from "../atoms/card";
import Label from "../atoms/label";
import { HiEye, HiEyeOff, HiShoppingBag } from "react-icons/hi";

const LoginScreen = () => {
    const navigate = useNavigate();
    const [correo, setCorreo] = useState("");
    const [contrasena, setContrasena] = useState("");
    const [mostrarPassword, setMostrarPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!correo || !contrasena) {
            setError("Por favor completa todos los campos");
            return;
        }

        setLoading(true);

        
        try {
            const response = await fetch("http://localhost:8080/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    correo,
                    contrasena,
                }),
            });

            if (!response.ok) {
                throw new Error("Credenciales incorrectas");
            }

            

            const data = await response.json();
            localStorage.setItem("token", data.access_token);

            const usuarioParaGuardar = {
                nombre: data.nombre,
                correo: data.correo,
                rol: data.rol
            }

            localStorage.setItem("user", JSON.stringify(usuarioParaGuardar));

            console.log("LOGIN EXITOSO:", data);

            if (data.rol === "ADMIN") {
                navigate("/dashboard");
            } else if (data.rol === "VENDEDOR") {
                navigate("/productos");
            } else {
                navigate("/");
            }
        
       /*
        try {
            // Simulación de espera de red
            await new Promise(resolve => setTimeout(resolve, 1500));

            if (correo === "admin@test.com" && contrasena === "1234") {
                
                const mockData = {
                    token: "token-falso-123456",
                    usuario: {
                        nombre: "Admin",
                        email: "admin@test.com",
                        rol: "VENDEDOR"
                    }
                };

                localStorage.setItem("token", mockData.token);
                localStorage.setItem("user", JSON.stringify(mockData.usuario));

                switch (mockData.usuario.rol) {
                    case "ADMIN": navigate("/dashboard"); break;
                    case "VENDEDOR": navigate("/venta"); break;
                    default: navigate("/");
                }

            } else {
                setError("El correo o la contraseña son incorrectos.");
            }
        */
        } catch (err) {
            console.error(err);
            setError("Hubo un problema de conexión. Intenta nuevamente.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 px-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600 rounded-full mb-4 text-white">
                        <HiShoppingBag className="w-10 h-10" />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        Sistema POS
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Ingresa tus credenciales para continuar
                    </p>
                </div>

                <Card>
                    <form onSubmit={handleLogin} className="space-y-6">
                        {error && (
                            <Alert type="error" title="Error de acceso">
                                {error}
                            </Alert>
                        )}

                        <div>
                            <Label htmlFor="correo" required>
                                Correo electrónico
                            </Label>
                            <Input
                                type="email"
                                value={correo}
                                onChange={setCorreo}
                                placeholder="ejemplo@correo.com"
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <Label htmlFor="contrasena" required>
                                Contraseña
                            </Label>

                            <div className="relative">
                                <Input
                                    type={mostrarPassword ? "text" : "password"}
                                    value={contrasena}
                                    onChange={setContrasena}
                                    placeholder="••••••••"
                                    disabled={loading}
                                    className="pr-10"
                                />

                                <button
                                    type="button"
                                    onClick={() => setMostrarPassword(!mostrarPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                >
                                    {mostrarPassword ? (
                                        <HiEyeOff className="w-5 h-5" />
                                    ) : (
                                        <HiEye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        <Button type="submit" variant="primary" fullWidth loading={loading}>
                            Iniciar Sesión
                        </Button>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default LoginScreen;