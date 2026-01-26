import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge } from '../../components/common';
import { transferService } from '../../services';
import type { TransferRequest } from '../../types';
import toast from 'react-hot-toast';

export default function TransferDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [transfer, setTransfer] = useState<TransferRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTransfer();
  }, [id]);

  const fetchTransfer = async () => {
    try {
      const data = await transferService.getById(Number(id));
      setTransfer(data);
    } catch (error) {
      toast.error('Failed to load transfer');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !transfer) {
    return (
      <div>
        <Header title="Loading..." />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header title={`Transfer ${transfer.transfer_id}`} subtitle={transfer.transfer_reason}>
        <div className="flex gap-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/transfers')}>Back</Button>
          <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/transfers/${id}/edit`)}>Edit</Button>
        </div>
      </Header>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transfer Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-medium text-gray-500 uppercase">Transfer ID</label><p className="mt-1 font-mono">{transfer.transfer_id}</p></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase">Status</label><Badge variant={transfer.approval_status === 'Approved' ? 'success' : 'warning'}>{transfer.approval_status}</Badge></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase">Asset</label><p className="mt-1">{transfer.asset?.display_name}</p></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase">From Employee</label><p className="mt-1">{transfer.from_employee?.name}</p></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase">To Employee</label><p className="mt-1">{transfer.to_employee?.name}</p></div>
            <div><label className="text-xs font-medium text-gray-500 uppercase">Request Date</label><p className="mt-1">{new Date(transfer.request_date).toLocaleDateString()}</p></div>
            <div className="col-span-2"><label className="text-xs font-medium text-gray-500 uppercase">Reason</label><p className="mt-1 text-gray-700">{transfer.transfer_reason}</p></div>
          </div>
        </div>
      </Card>
    </div>
  );
}
