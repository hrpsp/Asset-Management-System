import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Wrench } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Select, Badge, getStatusBadgeVariant, Table, Pagination } from '../../components/common';
import { repairService } from '../../services';
import { RepairRequest } from '../../types';
import toast from 'react-hot-toast';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Reported', label: 'Reported' },
  { value: 'Diagnosed', label: 'Diagnosed' },
  { value: 'Sent for Repair', label: 'Sent for Repair' },
  { value: 'Repaired', label: 'Repaired' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Cannot Repair', label: 'Cannot Repair' },
];

const priorityOptions = [
  { value: '', label: 'All Priority' },
  { value: 'Critical', label: 'Critical' },
  { value: 'High', label: 'High' },
  { value: 'Medium', label: 'Medium' },
  { value: 'Low', label: 'Low' },
];

export default function RepairsList() {
  const navigate = useNavigate();
  const [repairs, setRepairs] = useState<RepairRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchRepairs();
  }, [status, priority, currentPage]);

  const fetchRepairs = async () => {
    setIsLoading(true);
    try {
      const response = await repairService.getAll({
        status: status || undefined,
        priority: priority || undefined,
        page: currentPage,
        per_page: 10,
      });
      setRepairs(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch repairs:', error);
      toast.error('Failed to load repair requests');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'id',
      header: 'ID',
      render: (repair: RepairRequest) => (
        <span className="font-mono text-gray-600">#{repair.id}</span>
      ),
    },
    {
      key: 'asset',
      header: 'Asset',
      render: (repair: RepairRequest) => (
        <div>
          <p className="font-medium text-gray-900">{repair.asset?.asset_tag}</p>
          <p className="text-sm text-gray-500">
            {repair.asset?.brand} {repair.asset?.model}
          </p>
        </div>
      ),
    },
    {
      key: 'issue',
      header: 'Issue',
      render: (repair: RepairRequest) => (
        <div className="max-w-xs">
          <Badge variant="default" size="sm">{repair.issue_category}</Badge>
          <p className="text-sm text-gray-600 mt-1 truncate">{repair.issue_description}</p>
        </div>
      ),
    },
    {
      key: 'priority',
      header: 'Priority',
      render: (repair: RepairRequest) => (
        <Badge variant={getStatusBadgeVariant(repair.priority)}>
          {repair.priority}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (repair: RepairRequest) => (
        <Badge variant={getStatusBadgeVariant(repair.status)}>
          {repair.status}
        </Badge>
      ),
    },
    {
      key: 'reported',
      header: 'Reported',
      render: (repair: RepairRequest) => (
        <div>
          <p className="text-gray-600">{repair.reported_date}</p>
          <p className="text-xs text-gray-500">{repair.days_open} days</p>
        </div>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Repair Requests"
        subtitle="Track and manage asset repairs"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/repairs/new')}>
            New Request
          </Button>
        }
      />

      <div className="p-6">
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[180px]"
            />
            <Select
              options={priorityOptions}
              value={priority}
              onChange={(e) => {
                setPriority(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[150px]"
            />
          </div>
        </Card>

        <Card padding="none">
          <Table
            columns={columns}
            data={repairs}
            keyExtractor={(repair) => repair.id}
            onRowClick={(repair) => navigate(`/repairs/${repair.id}`)}
            isLoading={isLoading}
            emptyMessage="No repair requests found."
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
