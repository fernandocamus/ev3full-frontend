import type { Route } from "./+types/dias";
import HistorialDiasScreenAdmin from "../../components/layouts/historialDiasScreenAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Historial de Días - Sistema POS" },
    { name: "description", content: "Ver días cerrados y estadísticas" },
  ];
}

export default function Dias() {
  return <HistorialDiasScreenAdmin />;
}