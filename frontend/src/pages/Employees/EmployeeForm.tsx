import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Input, Select } from '../../components/common';
import { employeeService, clientService } from '../../services';
import type { Client } from '../../types';
import toast from 'react-hot-toast';

const employmentStatusOptions = [
  { value: 'Active', label: 'Active' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Resigned', label: 'Resigned' },
  { value: 'On Leave', label: 'On Leave' },
];

export default function EmployeeForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);

  const [formData, setFormData] = useState({
    employee_code: '',
    name: '',
    cnic: '',
    email: '',
    phone: '',
    client_id: '',
    department: '',
    designation: '',
    employment_status: 'Active',
    joining_date: '',
    exit_date: '',
  });

  useEffect(() => {
    fetchClients();
    if (isEdit) {
      fetchEmployee();
    }
  }, [id]);

  const fetchClients = async () => {
    try {
      const data = await clientService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchEmployee = async () => {
    setIsLoading(true);
    try {
      const employee = await employeeService.getById(Number(id));
      setFormData({
        employee_code: employee.employee_code || '',
        name: employee.name || '',
        cnic: employee.cnic || '',
        email: employee.email || '',
        phone: employee.phone || '',
        client_id: employee.client_id?.toString() || '',
        department: employee.department || '',
        designation: employee.designation || '',
        employment_status: employee.employment_status || 'Active',
        joining_date: employee.joining_date || '',
        exit_date: employee.exit_date || '',
      });
    } catch (error: any) {
      toast.error('Failed to load employee');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const payload = {
        ...formData,
        client_id: Number(formData.client_id),
        exit_date: formData.exit_date || null,
      };

      if (isEdit) {
        await employeeService.update(Number(id), payload);
        toast.success('Employee updated successfully');
      } else {
        await employeeService.create(payload);
        toast.success('Employee created successfully');
      }

      navigate('/employees');
    } catch (error: any) {
      toast.error(error.response?.data?.message || `Failed to ${isEdit ? 'update' : 'create'} employee`);
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const clientOptions = clients.map(client => ({
    value: client.id.toString(),
    label: client.name,
  }));

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
        title={isEdit ? 'Edit Employee' : 'Create Employee'}
        subtitle={isEdit ? 'Update employee information' : 'Add a new employee'}
      >
        <Button
          variant="ghost"
          leftIcon={<ArrowLeft className="w-4 h-4" />}
          onClick={() => navigate('/employees')}
        >
          Back to Employees
        </Button>
      </Header>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Employee Code"
                  name="employee_code"
                  value={formData.employee_code}
                  onChange={handleChange}
                  required
                  placeholder="e.g., ZONG-001"
                />

                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Muhammad Hassan"
                />

                <Input
                  label="CNIC"
                  name="cnic"
                  value={formData.cnic}
                  onChange={handleChange}
                  required
                  placeholder="e.g., 35201-1234567-1"
                />

                <Input
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="e.g., hassan@hrpsp.com"
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="e.g., +92-300-1111111"
                />
              </div>
            </div>
          </Card>

          {/* Employment Information */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="Client"
                  name="client_id"
                  value={formData.client_id}
                  onChange={handleChange}
                  options={clientOptions}
                  required
                />

                <Input
                  label="Department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Call Center"
                />

                <Input
                  label="Designation"
                  name="designation"
                  value={formData.designation}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Customer Service Representative"
                />

                <Select
                  label="Employment Status"
                  name="employment_status"
                  value={formData.employment_status}
                  onChange={handleChange}
                  options={employmentStatusOptions}
                  required
                />

                <Input
                  label="Joining Date"
                  name="joining_date"
                  type="date"
                  value={formData.joining_date}
                  onChange={handleChange}
                  required
                />

                {(formData.employment_status === 'Terminated' || formData.employment_status === 'Resigned') && (
                  <Input
                    label="Exit Date"
                    name="exit_date"
                    type="date"
                    value={formData.exit_date}
                    onChange={handleChange}
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/employees')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              leftIcon={<Save className="w-4 h-4" />}
              isLoading={isSaving}
            >
              {isEdit ? 'Update Employee' : 'Create Employee'}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
