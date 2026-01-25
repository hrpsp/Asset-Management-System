import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Building2, Users, Laptop } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge, Table } from '../../components/common';
import { clientService } from '../../services';
import type { Client } from '../../types';
import toast from 'react-hot-toast';

export default function ClientsList() {
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchClients();
  }, [search]);

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await clientService.getAll(search);
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Failed to load clients');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'client',
      header: 'Client',
      render: (client: Client) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{client.name}</p>
            <p className="text-sm text-gray-500">{client.code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Primary Contact',
      render: (client: Client) => (
        <div>
          <p className="text-gray-900">{client.primary_contact_name || '—'}</p>
          <p className="text-sm text-gray-500">{client.primary_contact_email || ''}</p>
        </div>
      ),
    },
    {
      key: 'employees',
      header: 'Employees',
      render: (client: Client) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>{client.active_employee_count || 0}</span>
        </div>
      ),
    },
    {
      key: 'assets',
      header: 'Assets',
      render: (client: Client) => (
        <div className="flex items-center gap-2">
          <Laptop className="w-4 h-4 text-gray-400" />
          <span>{client.active_asset_count || 0}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (client: Client) => (
        <Badge variant={client.is_active ? 'success' : 'default'}>
          {client.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Clients"
        subtitle="Manage client organizations"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/clients/new')}>
            Add Client
          </Button>
        }
      />

      <div className="p-6">
        <Card className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search clients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
        </Card>

        <Card padding="none">
          <Table
            columns={columns}
            data={clients}
            keyExtractor={(client) => client.id}
            onRowClick={(client) => navigate(`/clients/${client.id}`)}
            isLoading={isLoading}
            emptyMessage="No clients found."
          />
        </Card>
      </div>
    </div>
  );
}
