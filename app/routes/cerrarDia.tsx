import type { Route } from "./+types/cerrarDia";
import CerrarDiaScreenAdmin from "../../components/layouts/cerrarDiaScreenAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Cerrar Día - Sistema POS" },
    { name: "description", content: "Cerrar el día actual y generar reporte" },
  ];
}

export default function CerrarDia() {
  return <CerrarDiaScreenAdmin />;
}