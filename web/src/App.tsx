import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/layout/AppLayout";

import DashboardPage from "./pages/Dashboard/DashboardPage";
import TripsPage from "./pages/Operations/TripsPage";
import TripDetailsPage from "./pages/Operations/TripDetailsPage";

import VehiclesPage from "./pages/Fleet/VehiclesPage";
import VehicleDetailsPage from "./pages/Fleet/VehicleDetailsPage";
import CreateVehiclePage from "./pages/Fleet/CreateVehiclePage";
import VehicleTypesPage from "./pages/Fleet/VehicleTypesPage";

import MaintenancePage from "./pages/Fleet/MaintenancePage";

import FuelPage from "./pages/Fleet/FuelPage";

import DriversPage from "./pages/Drivers/DriversPage";
import DriverDetailsPage from "./pages/Drivers/DriverDetailsPage";
import EmployeesPage from "./pages/Employees/EmployeesPage";

import CustomersPage from "./pages/Customers/CustomersPage";
import CustomerDetailsPage from "./pages/Customers/CustomerDetailsPage";
import CustomerOrdersPage from "./pages/Customers/CustomerOrdersPage";
import CustomerOrderDetailsPage from "./pages/Customers/CustomerOrderDetailsPage";



import WorkOrdersPage from "./pages/Operations/WorkOrdersPage";
import WorkOrderDetailsPage from "./pages/Operations/WorkOrderDetailsPage";
import RoutePlanningPage from "./pages/Operations/RoutePlanningPage";
import RouteDetailsPage from "./pages/Operations/RouteDetailsPage";

import DispatchBoardPage from "./pages/Operations/DispatchBoardPage";
import DispatchAssignmentPage from "./pages/Operations/DispatchAssignmentPage";

import TripExecutionPage from "./pages/Operations/TripExecutionPage";

import TripPodPage from "./pages/Operations/TripPodPage";

import InvoicesPage from "./pages/Finance/InvoicesPage";
import InvoiceDetailsPage from "./pages/Finance/InvoiceDetailsPage";

import PaymentsPage from "./pages/Finance/PaymentsPage";
import PaymentDetailsPage from "./pages/Finance/PaymentDetailsPage";

import RevenuePage from "./pages/Finance/RevenuePage";

import RevenueDetailsPage from "./pages/Finance/RevenueDetailsPage";

import CostsPage from "./pages/Finance/CostsPage";

import CostDetailsPage from "./pages/Finance/CostDetailsPage";

import ProfitabilityPage from "./pages/Finance/ProfitabilityPage";

import UsersPage from "./pages/Administration/UsersPage";
import UserDetailsPage from "./pages/Administration/UserDetailsPage";

import RolesPage from "./pages/Administration/RolesPage";
import RoleDetailsPage from "./pages/Administration/RoleDetailsPage";

import AuditLogsPage from "./pages/Administration/AuditLogsPage";


function PlaceholderPage({
  title,
}: {
  title: string;
}) {
  return (
    <div>
      <h1>{title}</h1>

      <p
        style={{
          color: "#6b7280",
        }}
      >
        This module will be built next.
      </p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<AppLayout />}
        >
          {/* Dashboard */}

          <Route
            path="/"
            element={<DashboardPage />}
          />

          {/* Operations */}

          <Route
            path="/operations/trips"
            element={<TripsPage />}
          />

          <Route
            path="/operations/trips/:tripId"
            element={<TripDetailsPage />}
          />

          <Route
            path="/operations/trips/:tripId/execute"
            element={<TripExecutionPage />}
          />

          <Route
            path="/operations/trips/:tripId/pod"
            element={<TripPodPage />}
          />

          <Route
            path="/operations/work-orders"
            element={<WorkOrdersPage />}
          />

          <Route
            path="/operations/work-orders/:workOrderId"
            element={<WorkOrderDetailsPage />}
          />

          <Route
            path="/operations/routes"
            element={<RoutePlanningPage />}
          />

          <Route
            path="/operations/routes/:routeId"
            element={<RouteDetailsPage />}
          />

          <Route
            path="/operations/dispatch"
            element={<DispatchBoardPage />}
          />

          <Route
            path="/operations/dispatch/:workOrderId/assign"
            element={<DispatchAssignmentPage />}
          />

          {/* Fleet */}

          <Route path="/fleet/vehicles" element={<VehiclesPage />} />

          <Route
            path="/fleet/vehicles/new"
            element={<CreateVehiclePage />}
          />

          <Route
            path="/fleet/vehicles/:vehicleId"
            element={<VehicleDetailsPage />}
          />

          <Route
            path="/fleet/types"
            element={<VehicleTypesPage />}
          />

          <Route
            path="/fleet/maintenance"
            element={<MaintenancePage />}
          />

          <Route
            path="/fleet/fuel"
            element={<FuelPage />}
          />

          

          {/* People */}

          <Route path="/drivers" element={<DriversPage />} />

          <Route
            path="/drivers/:driverId"
            element={<DriverDetailsPage />}
          />

          <Route
            path="/employees"
            element={<EmployeesPage />}
          />

          {/* Customers */}

          <Route
            path="/customers"
            element={<CustomersPage />}
          />

          <Route
            path="/customers/:customerId"
            element={<CustomerDetailsPage />}
          />

          <Route
            path="/customers/orders"
            element={<CustomerOrdersPage />}
          />

          <Route
            path="/customers/orders/:orderId"
            element={<CustomerOrderDetailsPage />}
          />

          {/* Finance */}

          <Route
            path="/finance/revenue"
            element={
              <RevenuePage />
            }
          />

          <Route
            path="/finance/revenue/:revenueId"
            element={<RevenueDetailsPage />}
          />

          <Route
            path="/finance/costs"
            element={
              <CostsPage />
            }
          />

          <Route
            path="/finance/costs/:costId"
            element={<CostDetailsPage />}
          />

          <Route
            path="/finance/invoices"
            element={
              <InvoicesPage />
            }
          />

          <Route
            path="/finance/invoices/:invoiceId"
            element={
              <InvoiceDetailsPage />
            }
          />

          <Route
            path="/finance/payments"
            element={
              <PaymentsPage />
            }
          />

          <Route
            path="/finance/payments/:paymentId"
            element={
              <PaymentDetailsPage />
            }
          />

          <Route
            path="/finance/profitability"
            element={<ProfitabilityPage />}
          />

          {/* Reports */}

          <Route
            path="/reports"
            element={
              <PlaceholderPage
                title="Reports & Analytics"
              />
            }
          />

          {/* Administration */}

          <Route
            path="/administration/users"
            element={<UsersPage />}
          />

          <Route
            path="/administration/users/:userId"
            element={<UserDetailsPage />}
          />

          <Route
            path="/administration/roles"
            element={<RolesPage />}
          />


          <Route
            path="/administration/roles/:roleId"
            element={<RoleDetailsPage />}
          />


          <Route
            path="/administration/audit-logs"
            element={
              <AuditLogsPage />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
