import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Input, Select } from '../../components/common';
import { clientService } from '../../services';
import toast from 'react-hot-toast';

export default function ClientForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    contract_reference: '',
    primary_contact_name: '',
    primary_contact_email: '',
    primary_contact_phone: '',
    is_active: true,
    notes: '',
    // Asset Policies
    allowed_asset_types: [] as string[],
    approved_brands: [] as string[],
    max_asset_value: '',
    replacement_policy: '',
    data_wipe_required: true,
  });

  useEffect(() => {
    if (isEdit) {
      fetchClient();
    }
  }, [id]);

  const fetchClient = async () => {
    setIsLoading(true);
    try {
      const client = await clientService.getById(Number(id));
      setFormData({
        name: client.name || '',
        code: client.code || '',
        contract_reference: client.contract_reference || '',
        primary_contact_name: client.primary_contact_name || '',
        primary_contact_email: client.primary_contact_email || '',
        primary_contact_phone: client.primary_contact_phone || '',
        is_active: client.is_active !== undefined ? client.is_active : true,
        notes: client.notes || '',
        allowed_asset_types: client.asset_policies?.allowed_asset_types || [],
        approved_brands: client.asset_policies?.approved_brands || [],
        max_asset_value: client.asset_policies?.max_asset_value?.toString() || '',
        replacement_policy: client.asset_policies?.replacement_policy || '',
        data_wipe_required: client.asset_policies?.data_wipe_required !== undefined ? client.asset_policies.data_wipe_required : true,
      });
    } catch (error: any) {
      toast.error('Failed to load client');
      console.error(error);
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

  const handleMultiSelect = (name: string, value: string) => {
    const values = value.split(',').map(v => v.trim()).filter(Boolean);
    setFormData(prev => ({ ...prev, [name]: values }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const asset_policies = {
        allowed_asset_types: formData.allowed_asset_types,
        approved_brands: formData.approved_brands,
        max_asset_value: formData.max_asset_value ? Number(formData.max_asset_value) : null,
        replacement_policy: formData.replacement_policy,
        data_wipe_required: formData.data_wipe_required,
      };

      const payload = {
        name: formData.name,
        code: formData.code,
        contract_reference: formData.contract_reference,
        primary_contact_name: formData.primary_contact_name,
        primary_contact_email: formData.primary_contact_email,
        primary_contact_phone: formData.primary_contact_phone,
        is_active: formData.is_active,
        notes: formData.notes,
        asset_policies,
      };

      if (isEdit) {
        await clientService.update(Number(id), payload);
        toast.success('Client updated successfully');
      } else {
        await clientService.create(payload);
        toast.success('Client created successfully');
      }

      navigate('/clients');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} client`);
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
        title={isEdit ? 'Edit Client' : 'Create Client'}
        subtitle={isEdit ? 'Update client information' : 'Add a new client organization'}
      >
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/clients')}
        >
          Back to Clients
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
                  label="Client Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Zong (CMPak)"
                />

                <Input
                  label="Client Code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ZONG"
                />

                <Input
                  label="Contract Reference"
                  name="contract_reference"
                  value={formData.contract_reference}
                  onChange={handleChange}
                  placeholder="e.g., HRPSP/ZONG/2024/001"
                />

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="is_active"
                    name="is_active"
                    checked={formData.is_active}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="is_active" className="text-sm font-medium text-gray-700">
                    Active Client
                  </label>
                </div>
              </div>
            </div>
          </Card>

          {/* Primary Contact */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Contact Name"
                  name="primary_contact_name"
                  value={formData.primary_contact_name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Ali Ahmed"
                />

                <Input
                  label="Email Address"
                  name="primary_contact_email"
                  type="email"
                  value={formData.primary_contact_email}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ali.ahmed@zong.com.pk"
                />

                <Input
                  label="Phone Number"
                  name="primary_contact_phone"
                  type="tel"
                  value={formData.primary_contact_phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g., +92-321-1234567"
                />
              </div>
            </div>
          </Card>

          {/* Asset Policies */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Policies</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Allowed Asset Types
                  </label>
                  <input
                    type="text"
                    name="allowed_asset_types"
                    value={formData.allowed_asset_types.join(', ')}
                    onChange={(e) => handleMultiSelect('allowed_asset_types', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Laptop, Mobile, Tablet"
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate with commas</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved Brands
                  </label>
                  <input
                    type="text"
                    name="approved_brands"
                    value={formData.approved_brands.join(', ')}
                    onChange={(e) => handleMultiSelect('approved_brands', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Dell, HP, Lenovo"
                  />
                  <p className="mt-1 text-xs text-gray-500">Separate with commas</p>
                </div>

                <Input
                  label="Maximum Asset Value (PKR)"
                  name="max_asset_value"
                  type="number"
                  step="0.01"
                  value={formData.max_asset_value}
                  onChange={handleChange}
                  placeholder="e.g., 300000"
                />

                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="data_wipe_required"
                    name="data_wipe_required"
                    checked={formData.data_wipe_required}
                    onChange={handleChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="data_wipe_required" className="text-sm font-medium text-gray-700">
                    Data Wipe Required on Return
                  </label>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Replacement Policy
                  </label>
                  <textarea
                    name="replacement_policy"
                    value={formData.replacement_policy}
                    onChange={handleChange}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Replace if repair cost > 40% of value"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Notes */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Notes</h3>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Additional notes about this client..."
              />
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
            >
              {isEdit ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
