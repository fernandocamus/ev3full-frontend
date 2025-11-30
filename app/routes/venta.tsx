import type { Route } from "./+types/venta";
import VentaScreen from "../../components/layouts/misVentasScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nueva Venta - Sistema POS" },
    { name: "description", content: "Terminal de punto de venta" },
  ];
}

export default function Venta() {
  return <VentaScreen />;
}