import type { Route } from "./+types/login";
import LoginScreen from "../../components/layouts/loginScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Iniciar Sesión - Sistema POS" },
    { name: "description", content: "Inicia sesión en el sistema de punto de venta" },
  ];
}

export default function Login() {
  return <LoginScreen />;
}