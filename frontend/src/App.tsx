import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import AssetsList from './pages/Assets/AssetsList';
import AssetDetail from './pages/Assets/AssetDetail';

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
            <Route path="/login" element={<Login />} />
            <Route element={<Layout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/assets" element={<AssetsList />} />
              <Route path="/assets/:id" element={<AssetDetail />} />
              {/* Add more routes as pages are created */}
              <Route path="/clients" element={<ComingSoon title="Clients" />} />
              <Route path="/employees" element={<ComingSoon title="Employees" />} />
              <Route path="/allocations" element={<ComingSoon title="Allocations" />} />
              <Route path="/repairs" element={<ComingSoon title="Repairs" />} />
              <Route path="/transfers" element={<ComingSoon title="Transfers" />} />
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
        <p className="text-gray-500">This page is coming soon...</p>
      </div>
    </div>
  );
}

export default App;
