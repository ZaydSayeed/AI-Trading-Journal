import { createBrowserRouter, Navigate } from "react-router-dom";
import Dashboard from "@/pages/Dashboard";
import AddTrade from "@/pages/AddTrade";
import History from "@/pages/History";
import Chat from "@/pages/Chat";
import Settings from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  {
    path: "/add-trade",
    element: <AddTrade />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/chat",
    element: <Chat />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

