import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Auth
import Login from './pages/Auth/Login';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Assets
import AssetsList from './pages/Assets/AssetsList';
import AssetDetail from './pages/Assets/AssetDetail';
import AssetForm from './pages/Assets/AssetForm';

// Clients
import ClientsList from './pages/Clients/ClientsList';
import ClientDetail from './pages/Clients/ClientDetail';
import ClientForm from './pages/Clients/ClientForm';

// Employees
import EmployeesList from './pages/Employees/EmployeesList';
import EmployeeDetail from './pages/Employees/EmployeeDetail';
import EmployeeForm from './pages/Employees/EmployeeForm';

// Allocations
import AllocationsList from './pages/Allocations/AllocationsList';
import AllocationDetail from './pages/Allocations/AllocationDetail';
import AllocationForm from './pages/Allocations/AllocationForm';

// Repairs
import RepairsList from './pages/Repairs/RepairsList';
import RepairDetail from './pages/Repairs/RepairDetail';
import RepairForm from './pages/Repairs/RepairForm';

// Transfers
import TransfersList from './pages/Transfers/TransfersList';
import TransferDetail from './pages/Transfers/TransferDetail';
import TransferForm from './pages/Transfers/TransferForm';

// Reports
import Reports from './pages/Reports/Reports';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />

              {/* Assets */}
              <Route path="/assets" element={<AssetsList />} />
              <Route path="/assets/new" element={<AssetForm />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
              <Route path="/assets/:id/edit" element={<AssetForm />} />

              {/* Clients */}
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ClientForm />} />
              <Route path="/clients/:id" element={<ClientDetail />} />
              <Route path="/clients/:id/edit" element={<ClientForm />} />

              {/* Employees */}
              <Route path="/employees" element={<EmployeesList />} />
              <Route path="/employees/new" element={<EmployeeForm />} />
              <Route path="/employees/:id" element={<EmployeeDetail />} />
              <Route path="/employees/:id/edit" element={<EmployeeForm />} />

              {/* Allocations */}
              <Route path="/allocations" element={<AllocationsList />} />
              <Route path="/allocations/new" element={<AllocationForm />} />
              <Route path="/allocations/:id" element={<AllocationDetail />} />
              <Route path="/allocations/:id/edit" element={<AllocationForm />} />

              {/* Repairs */}
              <Route path="/repairs" element={<RepairsList />} />
              <Route path="/repairs/new" element={<RepairForm />} />
              <Route path="/repairs/:id" element={<RepairDetail />} />
              <Route path="/repairs/:id/edit" element={<RepairForm />} />

              {/* Transfers */}
              <Route path="/transfers" element={<TransfersList />} />
              <Route path="/transfers/new" element={<TransferForm />} />
              <Route path="/transfers/:id" element={<TransferDetail />} />
              <Route path="/transfers/:id/edit" element={<TransferForm />} />

              {/* Reports */}
              <Route path="/reports" element={<Reports />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#333',
              color: '#fff',
            },
          }}
        />
      </AuthProvider>
    </QueryClientProvider>
  );
}

// Placeholder component for pages not yet implemented
function ComingSoon({ title }: { title: string }) {
  return (
    <div className="p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">This page is under development...</p>
        <p className="text-sm text-gray-400 mt-4">
          Follow the same patterns from existing pages to implement this.
        </p>
      </div>
    </div>
  );
}

export default App;
