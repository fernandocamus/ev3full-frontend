import type { Route } from "./+types/productos";
import ProductosScreenAdmin from "../../components/layouts/productosScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Gestión de Productos - Sistema POS" },
    { name: "description", content: "Administrar catálogo de productos" },
  ];
}

export default function Productos() {
  return <ProductosScreenAdmin />;
}