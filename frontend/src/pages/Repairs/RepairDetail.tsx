import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Wrench } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge } from '../../components/common';
import { repairService } from '../../services';
import type { RepairRequest } from '../../types';
import toast from 'react-hot-toast';

export default function RepairDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repair, setRepair] = useState<RepairRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchRepair();
  }, [id]);

  const fetchRepair = async () => {
    try {
      const data = await repairService.getById(Number(id));
      setRepair(data);
    } catch (error) {
      toast.error('Failed to load repair request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this repair request?')) return;
    try {
      await repairService.delete(Number(id));
      toast.success('Repair request deleted successfully');
      navigate('/repairs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete repair request');
    }
  };

  if (isLoading || !repair) {
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
      <Header title={`Repair Request #${repair.repair_id}`} subtitle={repair.issue_category}>
        <div className="flex gap-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/repairs')}>Back</Button>
          <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/repairs/${id}/edit`)}>Edit</Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>Delete</Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Issue Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 uppercase">Repair ID</label><p className="mt-1 font-mono">{repair.repair_id}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Category</label><Badge variant="info">{repair.issue_category}</Badge></div>
                <div className="col-span-2"><label className="text-xs font-medium text-gray-500 uppercase">Description</label><p className="mt-1 text-gray-700">{repair.issue_description}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Priority</label><Badge variant={repair.priority === 'High' ? 'danger' : repair.priority === 'Medium' ? 'warning' : 'default'}>{repair.priority}</Badge></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Status</label><Badge>{repair.status}</Badge></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Reported Date</label><p className="mt-1">{new Date(repair.reported_date).toLocaleDateString()}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Days Open</label><p className="mt-1">{repair.days_open} days</p></div>
              </div>
            </div>
          </Card>

          {repair.repair_cost && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Cost Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-gray-500 uppercase">Repair Cost</label><p className="mt-1">PKR {repair.repair_cost.toLocaleString()}</p></div>
                  <div><label className="text-xs font-medium text-gray-500 uppercase">Vendor</label><p className="mt-1">{repair.vendor_name || 'N/A'}</p></div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset</h3>
              {repair.asset && <p className="text-gray-900">{repair.asset.display_name}</p>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
