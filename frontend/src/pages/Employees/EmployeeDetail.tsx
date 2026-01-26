import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, User, Mail, Phone, Building2, Briefcase, Calendar } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge } from '../../components/common';
import { employeeService } from '../../services';
import type { Employee } from '../../types';
import toast from 'react-hot-toast';

export default function EmployeeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchEmployee();
  }, [id]);

  const fetchEmployee = async () => {
    try {
      const data = await employeeService.getById(Number(id));
      setEmployee(data);
    } catch (error) {
      toast.error('Failed to load employee');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this employee?')) return;
    
    try {
      await employeeService.delete(Number(id));
      toast.success('Employee deleted successfully');
      navigate('/employees');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete employee');
    }
  };

  if (isLoading || !employee) {
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
      <Header title={employee.name} subtitle={employee.employee_code}>
        <div className="flex gap-2">
          <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/employees')}>
            Back
          </Button>
          <Button variant="secondary" leftIcon={<Edit className="w-4 h-4" />} onClick={() => navigate(`/employees/${id}/edit`)}>
            Edit
          </Button>
          <Button variant="danger" leftIcon={<Trash2 className="w-4 h-4" />} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employee Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 uppercase">Name</label><p className="mt-1">{employee.name}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Employee Code</label><p className="mt-1 font-mono">{employee.employee_code}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">CNIC</label><p className="mt-1">{employee.cnic}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Status</label><Badge variant={employee.employment_status === 'Active' ? 'success' : 'danger'}>{employee.employment_status}</Badge></div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-gray-400" /><a href={`mailto:${employee.email}`} className="text-primary-600">{employee.email}</a></div>
                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-gray-400" /><a href={`tel:${employee.phone}`} className="text-primary-600">{employee.phone}</a></div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div><label className="text-xs font-medium text-gray-500 uppercase">Client</label><p className="mt-1">{employee.client?.name}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Department</label><p className="mt-1">{employee.department}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Designation</label><p className="mt-1">{employee.designation}</p></div>
                <div><label className="text-xs font-medium text-gray-500 uppercase">Joining Date</label><p className="mt-1">{new Date(employee.joining_date).toLocaleDateString()}</p></div>
              </div>
            </div>
          </Card>
        </div>

        <div>
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="text-center"><span className="text-3xl font-bold text-primary-600">{employee.active_asset_count || 0}</span><p className="text-sm text-gray-600 mt-1">Active Assets</p></div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
