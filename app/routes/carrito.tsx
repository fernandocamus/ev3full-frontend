import type { Route } from "./+types/carrito";
import CarritoScreen from "../../components/layouts/carritoScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Nueva Venta - Sistema POS" },
    { name: "description", content: "Terminal de punto de venta" },
  ];
}

export default function Venta() {
  return <CarritoScreen />;
}