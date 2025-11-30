import type { Route } from "./+types/detalleDia";
import DetalleDiaScreenAdmin from "../../components/layouts/detalleDiaScreenAdmin";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Detalle del Día - Sistema POS" },
    { name: "description", content: "Ver detalle de un día específico" },
  ];
}

export default function DetalleDia() {
  return <DetalleDiaScreenAdmin />;
}