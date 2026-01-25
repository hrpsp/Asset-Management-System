import React from 'react';
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

// Clients
import ClientsList from './pages/Clients/ClientsList';

// Allocations
import AllocationsList from './pages/Allocations/AllocationsList';

// Repairs
import RepairsList from './pages/Repairs/RepairsList';

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
              <Route path="/assets/new" element={<ComingSoon title="Create Asset" />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
              <Route path="/assets/:id/edit" element={<ComingSoon title="Edit Asset" />} />

              {/* Clients */}
              <Route path="/clients" element={<ClientsList />} />
              <Route path="/clients/new" element={<ComingSoon title="Create Client" />} />
              <Route path="/clients/:id" element={<ComingSoon title="Client Details" />} />

              {/* Employees */}
              <Route path="/employees" element={<ComingSoon title="Employees" />} />
              <Route path="/employees/new" element={<ComingSoon title="Create Employee" />} />
              <Route path="/employees/:id" element={<ComingSoon title="Employee Details" />} />

              {/* Allocations */}
              <Route path="/allocations" element={<AllocationsList />} />
              <Route path="/allocations/new" element={<ComingSoon title="New Allocation" />} />
              <Route path="/allocations/:id" element={<ComingSoon title="Allocation Details" />} />

              {/* Repairs */}
              <Route path="/repairs" element={<RepairsList />} />
              <Route path="/repairs/new" element={<ComingSoon title="New Repair Request" />} />
              <Route path="/repairs/:id" element={<ComingSoon title="Repair Details" />} />

              {/* Transfers */}
              <Route path="/transfers" element={<ComingSoon title="Transfers" />} />
              <Route path="/transfers/new" element={<ComingSoon title="New Transfer" />} />
              <Route path="/transfers/:id" element={<ComingSoon title="Transfer Details" />} />

              {/* Reports */}
              <Route path="/reports" element={<ComingSoon title="Reports" />} />
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
