import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import NotFound from "./pages/NotFound";
import TableReservations from './pages/table-reservations';
import InventoryManagement from './pages/inventory-management';
import LoginPage from './pages/login';
import EmployeeManagement from './pages/employee-management';
import SalesReports from './pages/sales-reports';
import PointOfSale from './pages/point-of-sale';
import KitchenOrders from './pages/kitchen-orders';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<EmployeeManagement />} />
        <Route path="/table-reservations" element={<TableReservations />} />
        <Route path="/inventory-management" element={<InventoryManagement />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-management" element={<EmployeeManagement />} />
        <Route path="/sales-reports" element={<SalesReports />} />
        <Route path="/point-of-sale" element={<PointOfSale />} />
        <Route path="/kitchen-orders" element={<KitchenOrders />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
