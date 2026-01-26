import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Laptop, User, Building2, Calendar, CreditCard, FileText } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge } from '../../components/common';
import { allocationService } from '../../services';
import type { Allocation } from '../../types';
import toast from 'react-hot-toast';

export default function AllocationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allocation, setAllocation] = useState<Allocation | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAllocation();
  }, [id]);

  const fetchAllocation = async () => {
    try {
      const data = await allocationService.getById(Number(id));
      setAllocation(data);
    } catch (error) {
      toast.error('Failed to load allocation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this allocation?')) return;

    try {
      await allocationService.delete(Number(id));
      toast.success('Allocation deleted successfully');
      navigate('/allocations');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete allocation');
    }
  };

  if (isLoading || !allocation) {
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
      <Header
        title={`Allocation #${allocation.id}`}
        subtitle={allocation.allocation_type}
      >
        <div className="flex gap-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/allocations')}>
            Back
          </Button>
          <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/allocations/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Laptop className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Asset Information</h3>
              </div>
              {allocation.asset && (
                <Link to={`/assets/${allocation.asset.id}`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{allocation.asset.display_name}</p>
                      <p className="text-sm text-gray-500">{allocation.asset.asset_tag}</p>
                    </div>
                    <Badge variant="info">{allocation.asset.status}</Badge>
                  </div>
                </Link>
              )}
            </div>
          </Card>

          {/* Employee Information */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <User className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Employee Information</h3>
              </div>
              {allocation.employee && (
                <Link to={`/employees/${allocation.employee.id}`} className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-gray-50">
                  <div>
                    <p className="font-medium text-gray-900">{allocation.employee.name}</p>
                    <p className="text-sm text-gray-500">{allocation.employee.employee_code}</p>
                    <p className="text-sm text-gray-500 mt-1">{allocation.employee.designation} - {allocation.employee.department}</p>
                  </div>
                </Link>
              )}
            </div>
          </Card>

          {/* Allocation Details */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Type</label>
                  <div className="mt-1">
                    <Badge variant={allocation.is_installment ? 'info' : 'success'}>
                      {allocation.allocation_type}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                  <div className="mt-1">
                    <Badge variant={allocation.is_active ? 'success' : 'default'}>
                      {allocation.is_active ? 'Active' : 'Returned'}
                    </Badge>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Allocation Date</label>
                  <p className="mt-1 text-gray-900">{new Date(allocation.allocation_date).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Duration</label>
                  <p className="mt-1 text-gray-900">{allocation.duration_days} days</p>
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-medium text-gray-500 uppercase">Handover Condition</label>
                  <p className="mt-1 text-gray-900">{allocation.handover_condition}</p>
                </div>
                {allocation.handover_notes && (
                  <div className="col-span-2">
                    <label className="text-xs font-medium text-gray-500 uppercase">Handover Notes</label>
                    <p className="mt-1 text-gray-700">{allocation.handover_notes}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Return Information */}
          {!allocation.is_active && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Return Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Return Date</label>
                    <p className="mt-1 text-gray-900">
                      {allocation.return_date ? new Date(allocation.return_date).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Return Condition</label>
                    <p className="mt-1 text-gray-900">{allocation.return_condition || 'N/A'}</p>
                  </div>
                  {allocation.return_notes && (
                    <div className="col-span-2">
                      <label className="text-xs font-medium text-gray-500 uppercase">Return Notes</label>
                      <p className="mt-1 text-gray-700">{allocation.return_notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Client Info */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Client</h3>
              </div>
              {allocation.client && (
                <Link to={`/clients/${allocation.client.id}`} className="text-primary-600 hover:underline">
                  {allocation.client.name}
                </Link>
              )}
            </div>
          </Card>

          {/* Documents */}
          {allocation.handover_document_path && (
            <Card>
              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-gray-400" />
                  <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                </div>
                <a
                  href={allocation.handover_document_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 hover:underline text-sm"
                >
                  Handover Document
                </a>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
