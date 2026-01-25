import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, ArrowRightLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Select, Badge, getStatusBadgeVariant, Table, Pagination } from '../../components/common';
import { allocationService, clientService } from '../../services';
import { Allocation, Client } from '../../types';
import toast from 'react-hot-toast';

export default function AllocationsList() {
  const navigate = useNavigate();
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isActive, setIsActive] = useState<string>('true');
  const [allocationType, setAllocationType] = useState('');
  const [clientId, setClientId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchAllocations();
  }, [isActive, allocationType, clientId, currentPage]);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchAllocations = async () => {
    setIsLoading(true);
    try {
      const response = await allocationService.getAll({
        is_active: isActive === '' ? undefined : isActive === 'true',
        allocation_type: allocationType || undefined,
        client_id: clientId ? Number(clientId) : undefined,
        page: currentPage,
        per_page: 10,
      });
      setAllocations(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch allocations:', error);
      toast.error('Failed to load allocations');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'asset',
      header: 'Asset',
      render: (allocation: Allocation) => (
        <div>
          <p className="font-medium text-gray-900">{allocation.asset?.asset_tag}</p>
          <p className="text-sm text-gray-500">
            {allocation.asset?.brand} {allocation.asset?.model}
          </p>
        </div>
      ),
    },
    {
      key: 'employee',
      header: 'Employee',
      render: (allocation: Allocation) => (
        <div>
          <p className="text-gray-900">{allocation.employee?.name}</p>
          <p className="text-sm text-gray-500">{allocation.employee?.employee_code}</p>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (allocation: Allocation) => (
        <span className="text-gray-700">{allocation.client?.code}</span>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (allocation: Allocation) => (
        <Badge variant={allocation.allocation_type === 'Installment' ? 'info' : 'success'}>
          {allocation.allocation_type}
        </Badge>
      ),
    },
    {
      key: 'date',
      header: 'Allocated',
      render: (allocation: Allocation) => (
        <span className="text-gray-600">{allocation.allocation_date}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (allocation: Allocation) => (
        <Badge variant={allocation.is_active ? 'success' : 'default'}>
          {allocation.is_active ? 'Active' : 'Returned'}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Allocations"
        subtitle="Manage asset assignments"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/allocations/new')}>
            New Allocation
          </Button>
        }
      />

      <div className="p-6">
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Select
              options={[
                { value: '', label: 'All Status' },
                { value: 'true', label: 'Active Only' },
                { value: 'false', label: 'Returned Only' },
              ]}
              value={isActive}
              onChange={(e) => {
                setIsActive(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[150px]"
            />
            <Select
              options={[
                { value: '', label: 'All Types' },
                { value: 'Installment', label: 'Installment' },
                { value: 'Rental', label: 'Rental' },
              ]}
              value={allocationType}
              onChange={(e) => {
                setAllocationType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[150px]"
            />
            <Select
              options={[
                { value: '', label: 'All Clients' },
                ...clients.map((c) => ({ value: String(c.id), label: c.name })),
              ]}
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[180px]"
            />
          </div>
        </Card>

        <Card padding="none">
          <Table
            columns={columns}
            data={allocations}
            keyExtractor={(allocation) => allocation.id}
            onRowClick={(allocation) => navigate(`/allocations/${allocation.id}`)}
            isLoading={isLoading}
            emptyMessage="No allocations found."
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </Card>
      </div>
    </div>
  );
}
