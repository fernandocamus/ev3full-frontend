import type { Route } from "./+types/misVentas";
import VentasScreenVendedor from "../../components/layouts/ventasScreenVendedor";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Mis Ventas - Sistema POS" },
    { name: "description", content: "Historial de ventas del vendedor" },
  ];
}

export default function MisVentas() {
  return <VentasScreenVendedor />;
}