import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Input, Select } from '../../components/common';
import { repairService, assetService } from '../../services';
import type { Asset } from '../../types';
import toast from 'react-hot-toast';

const categoryOptions = [
  { value: 'Hardware Failure', label: 'Hardware Failure' },
  { value: 'Software Issue', label: 'Software Issue' },
  { value: 'Physical Damage', label: 'Physical Damage' },
  { value: 'Performance Issue', label: 'Performance Issue' },
  { value: 'Other', label: 'Other' },
];

const priorityOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
  { value: 'Critical', label: 'Critical' },
];

const statusOptions = [
  { value: 'Reported', label: 'Reported' },
  { value: 'Diagnosed', label: 'Diagnosed' },
  { value: 'Sent for Repair', label: 'Sent for Repair' },
  { value: 'Repaired', label: 'Repaired' },
  { value: 'Closed', label: 'Closed' },
  { value: 'Cannot Repair', label: 'Cannot Repair' },
];

export default function RepairForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);

  const [formData, setFormData] = useState({
    asset_id: '',
    issue_category: 'Hardware Failure',
    issue_description: '',
    priority: 'Medium',
    status: 'Reported',
    reported_date: new Date().toISOString().split('T')[0],
    vendor_name: '',
    repair_cost: '',
    is_warranty_claim: false,
  });

  useEffect(() => {
    fetchAssets();
    if (isEdit) fetchRepair();
  }, [id]);

  const fetchAssets = async () => {
    try {
      const response = await assetService.getAll({});
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const fetchRepair = async () => {
    setIsLoading(true);
    try {
      const repair = await repairService.getById(Number(id));
      setFormData({
        asset_id: repair.asset_id?.toString() || '',
        issue_category: repair.issue_category || 'Hardware Failure',
        issue_description: repair.issue_description || '',
        priority: repair.priority || 'Medium',
        status: repair.status || 'Reported',
        reported_date: repair.reported_date || '',
        vendor_name: repair.vendor_name || '',
        repair_cost: repair.repair_cost?.toString() || '',
        is_warranty_claim: repair.is_warranty_claim || false,
      });
    } catch (error: any) {
      toast.error('Failed to load repair request');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        asset_id: Number(formData.asset_id),
        repair_cost: formData.repair_cost ? Number(formData.repair_cost) : null,
      };

      if (isEdit) {
        await repairService.update(Number(id), payload);
        toast.success('Repair request updated successfully');
      } else {
        await repairService.create(payload);
        toast.success('Repair request created successfully');
      }

      navigate('/repairs');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} repair request`);
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

  const assetOptions = assets.map(a => ({ value: a.id.toString(), label: a.display_name }));

  return (
    <div>
      <Header
        title={isEdit ? 'Edit Repair Request' : 'Create Repair Request'}
        subtitle={isEdit ? 'Update repair details' : 'Report a new repair request'}
      >
        <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/repairs')}>Back</Button>
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Repair Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Asset" name="asset_id" value={formData.asset_id} onChange={handleChange} options={assetOptions} required />
                <Select label="Issue Category" name="issue_category" value={formData.issue_category} onChange={handleChange} options={categoryOptions} required />
                <Select label="Priority" name="priority" value={formData.priority} onChange={handleChange} options={priorityOptions} required />
                <Select label="Status" name="status" value={formData.status} onChange={handleChange} options={statusOptions} required />
                <Input label="Reported Date" name="reported_date" type="date" value={formData.reported_date} onChange={handleChange} required />
                <div className="flex items-center gap-2 pt-6">
                  <input type="checkbox" id="is_warranty_claim" name="is_warranty_claim" checked={formData.is_warranty_claim} onChange={handleChange} className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500" />
                  <label htmlFor="is_warranty_claim" className="text-sm font-medium text-gray-700">Warranty Claim</label>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description</label>
                  <textarea name="issue_description" value={formData.issue_description} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Describe the issue..." required />
                </div>
                <Input label="Vendor Name" name="vendor_name" value={formData.vendor_name} onChange={handleChange} placeholder="Repair vendor" />
                <Input label="Repair Cost (PKR)" name="repair_cost" type="number" step="0.01" value={formData.repair_cost} onChange={handleChange} placeholder="0.00" />
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/repairs')}>Cancel</Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />} isLoading={isSaving}>
              {isEdit ? 'Update' : 'Create'} Repair Request
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
