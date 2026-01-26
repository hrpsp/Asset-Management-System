import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowRightLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Table, Badge, Pagination } from '../../components/common';
import { transferService } from '../../services';
import type { TransferRequest } from '../../types';
import toast from 'react-hot-toast';

export default function TransfersList() {
  const navigate = useNavigate();
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchTransfers();
  }, [currentPage]);

  const fetchTransfers = async () => {
    setIsLoading(true);
    try {
      const response = await transferService.getAll({ page: currentPage, per_page: 15 });
      setTransfers(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch transfers:', error);
      toast.error('Failed to load transfers');
    } finally {
      setIsLoading(false);
    }
  };

  const columns = [
    {
      key: 'transfer',
      header: 'Transfer',
      render: (transfer: TransferRequest) => (
        <div className="flex items-center gap-3">
          <ArrowRightLeft className="w-5 h-5 text-gray-400" />
          <div>
            <p className="font-medium text-gray-900">{transfer.transfer_id}</p>
            <p className="text-sm text-gray-500">{transfer.asset?.display_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'from',
      header: 'From',
      render: (transfer: TransferRequest) => (
        <span className="text-sm text-gray-900">{transfer.from_employee?.name}</span>
      ),
    },
    {
      key: 'to',
      header: 'To',
      render: (transfer: TransferRequest) => (
        <span className="text-sm text-gray-900">{transfer.to_employee?.name}</span>
      ),
    },
    {
      key: 'reason',
      header: 'Reason',
      render: (transfer: TransferRequest) => (
        <span className="text-sm text-gray-900">{transfer.transfer_reason}</span>
      ),
    },
    {
      key: 'date',
      header: 'Request Date',
      render: (transfer: TransferRequest) => (
        <span className="text-sm text-gray-900">{new Date(transfer.request_date).toLocaleDateString()}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (transfer: TransferRequest) => (
        <Badge variant={transfer.approval_status === 'Approved' ? 'success' : transfer.approval_status === 'Pending' ? 'warning' : 'danger'}>
          {transfer.approval_status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Header title="Transfers" subtitle="Manage asset transfers between employees">
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/transfers/new')}>
          New Transfer
        </Button>
      </Header>

      <Card>
        <div className="p-6">
          <Table columns={columns} data={transfers} isLoading={isLoading} onRowClick={(transfer) => navigate(`/transfers/${transfer.id}`)} />
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
