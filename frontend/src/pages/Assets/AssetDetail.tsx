import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Shield,
  User,
  Building2,
  Wrench,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, CardHeader, Button, Badge, getStatusBadgeVariant } from '../../components/common';
import { assetService } from '../../services';
import type { Asset } from '../../types';
import toast from 'react-hot-toast';

export default function AssetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [asset, setAsset] = useState<Asset | null>(null);
  const [history, setHistory] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchAsset();
      fetchHistory();
    }
  }, [id]);

  const fetchAsset = async () => {
    try {
      const data = await assetService.getById(Number(id));
      setAsset(data);
    } catch (error) {
      console.error('Failed to fetch asset:', error);
      toast.error('Failed to load asset');
      navigate('/assets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const data = await assetService.getHistory(Number(id));
      setHistory(data);
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this asset?')) return;

    try {
      await assetService.delete(Number(id));
      toast.success('Asset deleted successfully');
      navigate('/assets');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete asset');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!asset) return null;

  return (
    <div>
      <Header
        title={asset.display_name}
        subtitle={`Asset Tag: ${asset.asset_tag}`}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              leftIcon={<ArrowLeft className="w-4 h-4" />}
              onClick={() => navigate('/assets')}
            >
              Back
            </Button>
            <Button
              variant="secondary"
              leftIcon={<Edit className="w-4 h-4" />}
              onClick={() => navigate(`/assets/${id}/edit`)}
            >
              Edit
            </Button>
            <Button
              variant="danger"
              leftIcon={<Trash2 className="w-4 h-4" />}
              onClick={handleDelete}
              disabled={asset.status === 'Assigned'}
            >
              Delete
            </Button>
          </div>
        }
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Details */}
            <Card>
              <CardHeader title="Asset Details" />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium">{asset.asset_type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Brand</p>
                  <p className="font-medium">{asset.brand}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Model</p>
                  <p className="font-medium">{asset.model}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Serial Number</p>
                  <p className="font-medium">{asset.serial_number || '—'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge variant={getStatusBadgeVariant(asset.status)}>
                    {asset.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Condition</p>
                  <Badge variant={getStatusBadgeVariant(asset.condition_status)}>
                    {asset.condition_status}
                  </Badge>
                </div>
              </div>

              {/* Specifications */}
              {asset.specifications && Object.keys(asset.specifications).length > 0 && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="font-medium mb-3">Specifications</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(asset.specifications).map(([key, value]) => (
                      <div key={key}>
                        <p className="text-sm text-gray-500 capitalize">
                          {key.replace(/_/g, ' ')}
                        </p>
                        <p className="font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Purchase & Warranty */}
            <Card>
              <CardHeader title="Purchase & Warranty" />
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Purchase Date</p>
                    <p className="font-medium">{asset.purchase_date || '—'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Purchase Price</p>
                  <p className="font-medium">
                    {asset.purchase_price
                      ? `PKR ${asset.purchase_price.toLocaleString()}`
                      : '—'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-medium">{asset.vendor || '—'}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Warranty Expiry</p>
                    <p
                      className={`font-medium ${
                        asset.is_under_warranty ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {asset.warranty_expiry || '—'}
                    </p>
                    {asset.warranty_expiry && (
                      <p className="text-xs text-gray-500">
                        {asset.is_under_warranty ? 'Active' : 'Expired'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            {/* Allocation History */}
            <Card>
              <CardHeader
                title="Allocation History"
                subtitle={`${history?.allocations?.length || 0} total allocation(s)`}
              />
              {history?.allocations?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No allocation history</p>
              ) : (
                <div className="space-y-3">
                  {history?.allocations?.map((allocation: any) => (
                    <div
                      key={allocation.id}
                      className={`p-4 rounded-lg border ${
                        allocation.is_active
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">{allocation.employee?.name}</span>
                        </div>
                        <Badge
                          variant={allocation.is_active ? 'success' : 'default'}
                          size="sm"
                        >
                          {allocation.is_active ? 'Active' : 'Returned'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{allocation.allocation_type}</span>
                        <span>•</span>
                        <span>{allocation.allocation_date}</span>
                        {allocation.return_date && (
                          <>
                            <span>→</span>
                            <span>{allocation.return_date}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Repair History */}
            <Card>
              <CardHeader
                title="Repair History"
                subtitle={`${history?.repairs?.length || 0} repair(s)`}
              />
              {history?.repairs?.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No repair history</p>
              ) : (
                <div className="space-y-3">
                  {history?.repairs?.map((repair: any) => (
                    <div
                      key={repair.id}
                      className="p-4 rounded-lg border border-gray-200 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Badge
                          variant={getStatusBadgeVariant(repair.status)}
                          size="sm"
                        >
                          {repair.status}
                        </Badge>
                        <Badge
                          variant={getStatusBadgeVariant(repair.priority)}
                          size="sm"
                        >
                          {repair.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {repair.issue_description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Reported: {repair.reported_date}</span>
                        {repair.closed_date && <span>Closed: {repair.closed_date}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current Holder */}
            {asset.active_allocation && (
              <Card>
                <CardHeader title="Currently Assigned To" />
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium">{asset.current_holder?.name}</p>
                    <p className="text-sm text-gray-500">
                      {asset.current_holder?.designation}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4" />
                    <span>{asset.current_client?.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>Since {asset.active_allocation.allocation_date}</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <Badge
                    variant={
                      asset.active_allocation.allocation_type === 'Installment'
                        ? 'info'
                        : 'success'
                    }
                  >
                    {asset.active_allocation.allocation_type}
                  </Badge>
                </div>
                <Link
                  to={`/allocations/${asset.active_allocation.id}`}
                  className="block mt-4 text-center text-sm text-primary-600 hover:text-primary-700"
                >
                  View Allocation Details →
                </Link>
              </Card>
            )}

            {/* Location */}
            <Card>
              <CardHeader title="Location" />
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-gray-400" />
                <p className="text-gray-700">{asset.current_location || 'Not specified'}</p>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader title="Quick Actions" />
              <div className="space-y-2">
                {asset.status === 'Available' && (
                  <Button
                    variant="primary"
                    className="w-full"
                    onClick={() => navigate(`/allocations/new?asset_id=${asset.id}`)}
                  >
                    Assign Asset
                  </Button>
                )}
                <Button
                  variant="secondary"
                  className="w-full"
                  leftIcon={<Wrench className="w-4 h-4" />}
                  onClick={() => navigate(`/repairs/new?asset_id=${asset.id}`)}
                >
                  Create Repair Request
                </Button>
              </div>
            </Card>

            {/* Notes */}
            {asset.notes && (
              <Card>
                <CardHeader title="Notes" />
                <p className="text-gray-600 text-sm">{asset.notes}</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
