import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Input, Select } from '../../components/common';
import { allocationService, assetService, employeeService, clientService } from '../../services';
import type { Asset, Employee, Client } from '../../types';
import toast from 'react-hot-toast';

const allocationTypeOptions = [
  { value: 'Installment', label: 'Installment' },
  { value: 'Rental', label: 'Rental' },
];

const conditionOptions = [
  { value: 'Excellent', label: 'Excellent' },
  { value: 'Good', label: 'Good' },
  { value: 'Fair', label: 'Fair' },
  { value: 'Poor', label: 'Poor' },
];

export default function AllocationForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState({
    asset_id: '',
    employee_id: '',
    client_id: '',
    allocation_type: 'Installment',
    allocation_date: new Date().toISOString().split('T')[0],
    handover_condition: 'Excellent',
    handover_notes: '',
    is_active: true,
  });

  useEffect(() => {
    fetchAssets();
    fetchEmployees();
    fetchClients();
    if (isEdit) fetchAllocation();
  }, [id]);

  const fetchAssets = async () => {
    try {
      const response = await assetService.getAvailable();
      setAssets(response);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await employeeService.getAll({ employment_status: 'Active' });
      setEmployees(response.data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    }
  };

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchAllocation = async () => {
    setIsLoading(true);
    try {
      const allocation = await allocationService.getById(Number(id));
      setFormData({
        asset_id: allocation.asset_id?.toString() || '',
        employee_id: allocation.employee_id?.toString() || '',
        client_id: allocation.client_id?.toString() || '',
        allocation_type: allocation.allocation_type || 'Installment',
        allocation_date: allocation.allocation_date || '',
        handover_condition: allocation.handover_condition || 'Excellent',
        handover_notes: allocation.handover_notes || '',
        is_active: allocation.is_active,
      });
    } catch (error: any) {
      toast.error('Failed to load allocation');
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
      const payload = {
        ...formData,
        asset_id: Number(formData.asset_id),
        employee_id: Number(formData.employee_id),
        client_id: Number(formData.client_id),
      };

      if (isEdit) {
        await allocationService.update(Number(id), payload);
        toast.success('Allocation updated successfully');
      } else {
        await allocationService.create(payload);
        toast.success('Allocation created successfully');
      }

      navigate('/allocations');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} allocation`);
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
  const employeeOptions = employees.map(e => ({ value: e.id.toString(), label: `${e.name} (${e.employee_code})` }));
  const clientOptions = clients.map(c => ({ value: c.id.toString(), label: c.name }));

  return (
    <div>
      <Header
        title={isEdit ? 'Edit Allocation' : 'Create Allocation'}
        subtitle={isEdit ? 'Update allocation details' : 'Allocate asset to employee'}
      >
        <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/allocations')}>
          Back
        </Button>
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Allocation Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select label="Asset" name="asset_id" value={formData.asset_id} onChange={handleChange} options={assetOptions} required />
                <Select label="Employee" name="employee_id" value={formData.employee_id} onChange={handleChange} options={employeeOptions} required />
                <Select label="Client" name="client_id" value={formData.client_id} onChange={handleChange} options={clientOptions} required />
                <Select label="Allocation Type" name="allocation_type" value={formData.allocation_type} onChange={handleChange} options={allocationTypeOptions} required />
                <Input label="Allocation Date" name="allocation_date" type="date" value={formData.allocation_date} onChange={handleChange} required />
                <Select label="Handover Condition" name="handover_condition" value={formData.handover_condition} onChange={handleChange} options={conditionOptions} required />
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Handover Notes</label>
                  <textarea name="handover_notes" value={formData.handover_notes} onChange={handleChange} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Notes about handover..." />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => navigate('/allocations')}>Cancel</Button>
            <Button type="submit" leftIcon={<Save className="w-4 h-4" />} isLoading={isSaving}>
              {isEdit ? 'Update' : 'Create'} Allocation
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
