import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("login", "routes/login.tsx"),
    route("dashboard", "routes/dashboard.tsx"),
    route("venta", "routes/venta.tsx"),
    route("misVentas", "routes/misVentas.tsx"),
    route("productos", "routes/productos.tsx"),
    route("ventas", "routes/ventas.tsx"),
    route("dias", "routes/dias.tsx"),
    route("detalleDia/:id", "routes/detalleDia.tsx"),
    route("cerrarDia", "routes/cerrarDia.tsx"),
    route("boleta/:id", "routes/boleta.tsx"),
] satisfies RouteConfig;