import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, User, Building2, Briefcase } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Select, Table, Badge, Pagination } from '../../components/common';
import { employeeService, clientService } from '../../services';
import type { Employee, Client } from '../../types';
import toast from 'react-hot-toast';

const employmentStatusOptions = [
  { value: '', label: 'All Status' },
  { value: 'Active', label: 'Active' },
  { value: 'Terminated', label: 'Terminated' },
  { value: 'Resigned', label: 'Resigned' },
  { value: 'On Leave', label: 'On Leave' },
];

export default function EmployeesList() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [clientId, setClientId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [searchTerm, employmentStatus, clientId, currentPage]);

  const fetchClients = async () => {
    try {
      const response = await clientService.getAll();
      setClients(response);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    }
  };

  const fetchEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await employeeService.getAll({
        search: searchTerm || undefined,
        employment_status: employmentStatus || undefined,
        client_id: clientId ? Number(clientId) : undefined,
        page: currentPage,
        per_page: 15,
      });
      setEmployees(response.data);
      setTotalPages(response.meta.last_page);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
      toast.error('Failed to load employees');
    } finally {
      setIsLoading(false);
    }
  };

  const clientOptions = [
    { value: '', label: 'All Clients' },
    ...clients.map(client => ({
      value: client.id.toString(),
      label: client.name,
    })),
  ];

  const columns = [
    {
      key: 'employee',
      header: 'Employee',
      render: (employee: Employee) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <User className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-medium text-gray-900">{employee.name}</p>
            <p className="text-sm text-gray-500">{employee.employee_code}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'contact',
      header: 'Contact',
      render: (employee: Employee) => (
        <div>
          <p className="text-sm text-gray-900">{employee.email}</p>
          <p className="text-sm text-gray-500">{employee.phone}</p>
        </div>
      ),
    },
    {
      key: 'client',
      header: 'Client',
      render: (employee: Employee) => (
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-900">{employee.client?.name || 'N/A'}</span>
        </div>
      ),
    },
    {
      key: 'position',
      header: 'Position',
      render: (employee: Employee) => (
        <div>
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-900">{employee.designation}</span>
          </div>
          <p className="text-sm text-gray-500">{employee.department}</p>
        </div>
      ),
    },
    {
      key: 'joining_date',
      header: 'Joining Date',
      render: (employee: Employee) => (
        <span className="text-sm text-gray-900">
          {new Date(employee.joining_date).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'assets',
      header: 'Assets',
      render: (employee: Employee) => (
        <div className="text-center">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm font-medium text-gray-900">
            {employee.active_asset_count || 0}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (employee: Employee) => (
        <Badge
          variant={
            employee.employment_status === 'Active' ? 'success' :
            employee.employment_status === 'On Leave' ? 'warning' :
            'danger'
          }
        >
          {employee.employment_status}
        </Badge>
      ),
    },
  ];

  return (
    <div>
      <Header
        title="Employees"
        subtitle="Manage employee records and assignments"
      >
        <Button
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => navigate('/employees/new')}
        >
          Add Employee
        </Button>
      </Header>

      <Card>
        <div className="p-6">
          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, code, email..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <Select
              value={employmentStatus}
              onChange={(e) => {
                setEmploymentStatus(e.target.value);
                setCurrentPage(1);
              }}
              options={employmentStatusOptions}
            />

            <Select
              value={clientId}
              onChange={(e) => {
                setClientId(e.target.value);
                setCurrentPage(1);
              }}
              options={clientOptions}
            />
          </div>

          {/* Table */}
          <Table
            columns={columns}
            data={employees}
            isLoading={isLoading}
            onRowClick={(employee) => navigate(`/employees/${employee.id}`)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
