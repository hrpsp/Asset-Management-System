import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Laptop, Tablet, Smartphone } from 'lucide-react';
import Header from '../../components/layout/Header';
import {
  Card,
  Button,
  Select,
  Table,
  Badge,
  getStatusBadgeVariant,
  Pagination,
} from '../../components/common';
import { assetService, clientService } from '../../services';
import type { Asset, Client } from '../../types';
import toast from 'react-hot-toast';

const assetTypeOptions = [
  { value: '', label: 'All Types' },
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Accessory', label: 'Accessory' },
];

const statusOptions = [
  { value: '', label: 'All Statuses' },
  { value: 'Available', label: 'Available' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Repair', label: 'In Repair' },
  { value: 'Retired', label: 'Retired' },
  { value: 'Lost', label: 'Lost' },
  { value: 'Transferred', label: 'Transferred' },
];

export default function AssetsList() {
  const navigate = useNavigate();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [assetType, setAssetType] = useState('');
  const [status, setStatus] = useState('');
  const [clientId, setClientId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchAssets();
  }, [search, assetType, status, clientId, currentPage]);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchAssets = async () => {
    setIsLoading(true);
    try {
      const response = await assetService.getAll({
        search,
        asset_type: assetType,
        status,
        client_id: clientId ? Number(clientId) : undefined,
        page: currentPage,
        per_page: 10,
      });
      setAssets(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      toast.error('Failed to load assets');
    } finally {
      setIsLoading(false);
    }
  };

  const getAssetIcon = (type: string) => {
    switch (type) {
      case 'Laptop':
        return <Laptop className="w-5 h-5" />;
      case 'Tablet':
        return <Tablet className="w-5 h-5" />;
      case 'Mobile':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Laptop className="w-5 h-5" />;
    }
  };

  const columns = [
    {
      key: 'asset',
      header: 'Asset',
      render: (asset: Asset) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600">
            {getAssetIcon(asset.asset_type)}
          </div>
          <div>
            <p className="font-medium text-gray-900">{asset.asset_tag}</p>
            <p className="text-sm text-gray-500">
              {asset.brand} {asset.model}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'type',
      header: 'Type',
      render: (asset: Asset) => (
        <Badge variant="default" size="sm">
          {asset.asset_type}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (asset: Asset) => (
        <Badge variant={getStatusBadgeVariant(asset.status)} size="sm">
          {asset.status}
        </Badge>
      ),
    },
    {
      key: 'condition',
      header: 'Condition',
      render: (asset: Asset) => (
        <Badge variant={getStatusBadgeVariant(asset.condition_status)} size="sm">
          {asset.condition_status}
        </Badge>
      ),
    },
    {
      key: 'holder',
      header: 'Current Holder',
      render: (asset: Asset) =>
        asset.current_holder ? (
          <div>
            <p className="text-gray-900">{asset.current_holder.name}</p>
            <p className="text-xs text-gray-500">{asset.current_client?.code}</p>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
    {
      key: 'warranty',
      header: 'Warranty',
      render: (asset: Asset) =>
        asset.warranty_expiry ? (
          <div>
            <p className={asset.is_under_warranty ? 'text-green-600' : 'text-red-600'}>
              {asset.warranty_expiry}
            </p>
            <p className="text-xs text-gray-500">
              {asset.is_under_warranty ? 'Active' : 'Expired'}
            </p>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        ),
    },
  ];

  const clientOptions = [
    { value: '', label: 'All Clients' },
    ...clients.map((c) => ({ value: String(c.id), label: c.name })),
  ];

  return (
    <div>
      <Header
        title="Assets"
        subtitle="Manage all electronic assets"
        actions={
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => navigate('/assets/new')}>
            Add Asset
          </Button>
        }
      />

      <div className="p-6">
        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by tag, brand, model, serial..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                />
              </div>
            </div>
            <Select
              options={assetTypeOptions}
              value={assetType}
              onChange={(e) => {
                setAssetType(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[150px]"
            />
            <Select
              options={statusOptions}
              value={status}
              onChange={(e) => {
                setStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[150px]"
            />
            <Select
              options={clientOptions}
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[180px]"
            />
          </div>
        </Card>

        {/* Table */}
        <Card padding="none">
          <Table
            columns={columns}
            data={assets}
            keyExtractor={(asset) => asset.id}
            onRowClick={(asset) => navigate(`/assets/${asset.id}`)}
            isLoading={isLoading}
            emptyMessage="No assets found. Try adjusting your filters."
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
