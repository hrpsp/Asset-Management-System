import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Input, Select } from '../../components/common';
import { assetService } from '../../services';
import type { Asset } from '../../types';
import toast from 'react-hot-toast';

const assetTypeOptions = [
  { value: 'Laptop', label: 'Laptop' },
  { value: 'Mobile', label: 'Mobile' },
  { value: 'Tablet', label: 'Tablet' },
  { value: 'Desktop', label: 'Desktop' },
  { value: 'Monitor', label: 'Monitor' },
  { value: 'Printer', label: 'Printer' },
  { value: 'Other', label: 'Other' },
];

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Assigned', label: 'Assigned' },
  { value: 'In Repair', label: 'In Repair' },
  { value: 'Retired', label: 'Retired' },
];

const conditionOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

export default function AssetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    asset_tag: '',
    asset_type: 'Laptop',
    brand: '',
    model: '',
    serial_number: '',
    purchase_date: '',
    purchase_price: '',
    vendor: '',
    warranty_expiry: '',
    status: 'Available',
    condition_status: 'Excellent',
    current_location: '',
    notes: '',
    // Specifications
    processor: '',
    ram: '',
    storage: '',
    display: '',
    os: '',
  });

  useEffect(() => {
    if (isEdit) {
      fetchAsset();
    }
  }, [id]);

  const fetchAsset = async () => {
    setIsLoading(true);
    try {
      const asset = await assetService.getById(Number(id));
      setFormData({
        asset_tag: asset.asset_tag || '',
        asset_type: asset.asset_type || 'Laptop',
        brand: asset.brand || '',
        model: asset.model || '',
        serial_number: asset.serial_number || '',
        purchase_date: asset.purchase_date || '',
        purchase_price: asset.purchase_price || '',
        vendor: asset.vendor || '',
        warranty_expiry: asset.warranty_expiry || '',
        status: asset.status || 'Available',
        condition_status: asset.condition_status || 'Excellent',
        current_location: asset.current_location || '',
        notes: asset.notes || '',
        processor: asset.specifications?.processor || '',
        ram: asset.specifications?.ram || '',
        storage: asset.specifications?.storage || '',
        display: asset.specifications?.display || '',
        os: asset.specifications?.os || '',
      });
    } catch (error: any) {
      toast.error('Failed to load asset');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const specifications = {
        processor: formData.processor,
        ram: formData.ram,
        storage: formData.storage,
        display: formData.display,
        os: formData.os,
      };

      const payload = {
        asset_tag: formData.asset_tag,
        asset_type: formData.asset_type,
        brand: formData.brand,
        model: formData.model,
        serial_number: formData.serial_number,
        purchase_date: formData.purchase_date,
        purchase_price: formData.purchase_price,
        vendor: formData.vendor,
        warranty_expiry: formData.warranty_expiry,
        status: formData.status,
        condition_status: formData.condition_status,
        current_location: formData.current_location,
        notes: formData.notes,
        specifications,
      };

      if (isEdit) {
        await assetService.update(Number(id), payload);
        toast.success('Asset updated successfully');
      } else {
        await assetService.create(payload);
        toast.success('Asset created successfully');
      }

      navigate('/assets');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} asset`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
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
        title={isEdit ? 'Edit Asset' : 'Create Asset'}
        subtitle={isEdit ? 'Update asset information' : 'Add a new asset to inventory'}
      >
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/assets')}
        >
          Back to Assets
        </Button>
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Asset Tag"
                  name="asset_tag"
                  value={formData.asset_tag}
                  onChange={handleChange}
                  required
                  placeholder="e.g., HRPSP-LT-001"
                />

                <Select
                  label="Asset Type"
                  name="asset_type"
                  value={formData.asset_type}
                  onChange={handleChange}
                  options={assetTypeOptions}
                  required
                />

                <Input
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Dell, HP, Lenovo"
                />

                <Input
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Latitude 5540"
                />

                <Input
                  label="Serial Number"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  required
                  placeholder="e.g., DL5540-2024-001"
                />

                <Input
                  label="Current Location"
                  name="current_location"
                  value={formData.current_location}
                  onChange={handleChange}
                  placeholder="e.g., HRPSP Office"
                />
              </div>
            </div>
          </Card>

          {/* Purchase Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Purchase Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Purchase Date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Purchase Price"
                  name="purchase_price"
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 185000.00"
                />

                <Input
                  label="Vendor"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Tech Zone Lahore"
                />

                <Input
                  label="Warranty Expiry"
                  name="warranty_expiry"
                  type="date"
                  value={formData.warranty_expiry}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </Card>

          {/* Specifications */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Processor"
                  name="processor"
                  value={formData.processor}
                  onChange={handleChange}
                  placeholder="e.g., Intel Core i5-1345U"
                />

                <Input
                  label="RAM"
                  name="ram"
                  value={formData.ram}
                  onChange={handleChange}
                  placeholder="e.g., 16GB DDR4"
                />

                <Input
                  label="Storage"
                  name="storage"
                  value={formData.storage}
                  onChange={handleChange}
                  placeholder="e.g., 512GB NVMe SSD"
                />

                <Input
                  label="Display"
                  name="display"
                  value={formData.display}
                  onChange={handleChange}
                  placeholder="e.g., 15.6&quot; FHD"
                />

                <Input
                  label="Operating System"
                  name="os"
                  value={formData.os}
                  onChange={handleChange}
                  placeholder="e.g., Windows 11 Pro"
                />
              </div>
            </div>
          </Card>

          {/* Status Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={statusOptions}
                  required
                />

                <Select
                  label="Condition"
                  name="condition_status"
                  value={formData.condition_status}
                  onChange={handleChange}
                  options={conditionOptions}
                  required
                />

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Additional notes about this asset..."
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/assets')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
            >
              {isEdit ? 'Update Asset' : 'Create Asset'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
