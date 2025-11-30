import type { Route } from "./+types/dashboard";
import DashboardScreen from "../../components/layouts/dashBoardScreen";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dashboard - Sistema POS" },
    { name: "description", content: "Panel de control administrativo" },
  ];
}

export default function Dashboard() {
  return <DashboardScreen />;
}