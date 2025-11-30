import type { Route } from "./+types/boleta";
import BoletasScreen from "../../components/layouts/boletasScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Boleta - Sistema POS" },
    { name: "description", content: "Ver boleta de venta" },
  ];
}

export default function Boleta() {
  return <BoletasScreen />;
}