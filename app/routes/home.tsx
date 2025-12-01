import type { Route } from "./+types/home";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/atoms/spinner";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Sistema POS" },
    { name: "description", content: "Sistema de punto de venta" },
  ];
}

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      const user = JSON.parse(userStr);
      // Redirigir según el rol
      if (user.rol === "ADMIN") {
        navigate("/dashboard");
      } else {
        navigate("/productos");
      }
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}