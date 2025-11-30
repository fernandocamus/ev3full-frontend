import type { Route } from "./+types/ventas";
import HistorialVentasScreenAdmin from "../../components/layouts/historialVentasScreenAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Historial de Ventas - Sistema POS" },
    { name: "description", content: "Ver todas las ventas registradas" },
  ];
}

export default function Ventas() {
  return <HistorialVentasScreenAdmin />;
}