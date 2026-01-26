import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Building2, Mail, Phone, FileText, Users, Laptop } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button, Badge } from '../../components/common';
import { clientService } from '../../services';
import type { Client, Asset } from '../../types';
import toast from 'react-hot-toast';

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState<Client | null>(null);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchClient();
    fetchClientAssets();
  }, [id]);

  const fetchClient = async () => {
    try {
      const data = await clientService.getById(Number(id));
      setClient(data);
    } catch (error) {
      toast.error('Failed to load client');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientAssets = async () => {
    try {
      const data = await clientService.getAssets(Number(id));
      setAssets(data);
    } catch (error) {
      console.error('Failed to load client assets:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }

    try {
      await clientService.delete(Number(id));
      toast.success('Client deleted successfully');
      navigate('/clients');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete client');
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

  if (!client) {
    return (
      <div>
        <Header title="Client Not Found" />
        <Card>
          <div className="p-6 text-center">
            <p className="text-gray-500">Client not found</p>
            <Button onClick={() => navigate('/clients')} className="mt-4">
              Back to Clients
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Header
        title={client.name}
        subtitle={`Client Code: ${client.code}`}
      >
        <div className="flex gap-2">
          <Button
            variant="ghost"
            leftIcon={<ArrowLeft className="w-4 h-4" />}
            onClick={() => navigate('/clients')}
          >
            Back
          </Button>
          <Button
            variant="secondary"
            leftIcon={<Edit className="w-4 h-4" />}
            onClick={() => navigate(`/clients/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            leftIcon={<Trash2 className="w-4 h-4" />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </div>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Details */}
          <Card>
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
                  <p className="text-sm text-gray-500">Basic details and contact information</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Client Name</label>
                  <p className="mt-1 text-gray-900">{client.name}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Client Code</label>
                  <p className="mt-1 text-gray-900 font-mono">{client.code}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Contract Reference</label>
                  <p className="mt-1 text-gray-900">{client.contract_reference || 'N/A'}</p>
                </div>

                <div>
                  <label className="text-xs font-medium text-gray-500 uppercase">Status</label>
                  <div className="mt-1">
                    <Badge variant={client.is_active ? 'success' : 'danger'}>
                      {client.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Primary Contact */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Primary Contact</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-xs font-medium text-gray-500">Name</label>
                    <p className="text-gray-900">{client.primary_contact_name}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-xs font-medium text-gray-500">Email</label>
                    <a href={`mailto:${client.primary_contact_email}`} className="text-primary-600 hover:underline">
                      {client.primary_contact_email}
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-gray-400" />
                  <div>
                    <label className="text-xs font-medium text-gray-500">Phone</label>
                    <a href={`tel:${client.primary_contact_phone}`} className="text-primary-600 hover:underline">
                      {client.primary_contact_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Asset Policies */}
          {client.asset_policies && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Asset Policies</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Allowed Asset Types</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {client.asset_policies.allowed_asset_types?.map((type) => (
                        <Badge key={type} variant="info">{type}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Approved Brands</label>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {client.asset_policies.approved_brands?.map((brand) => (
                        <Badge key={brand} variant="default">{brand}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Max Asset Value</label>
                    <p className="mt-1 text-gray-900">
                      PKR {client.asset_policies.max_asset_value?.toLocaleString() || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Replacement Policy</label>
                    <p className="mt-1 text-gray-900">{client.asset_policies.replacement_policy || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-gray-500 uppercase">Data Wipe Required</label>
                    <div className="mt-1">
                      <Badge variant={client.asset_policies.data_wipe_required ? 'warning' : 'default'}>
                        {client.asset_policies.data_wipe_required ? 'Yes' : 'No'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Client Assets */}
          <Card>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Assets ({assets.length})</h3>
              </div>

              {assets.length > 0 ? (
                <div className="space-y-3">
                  {assets.map((asset) => (
                    <Link
                      key={asset.id}
                      to={`/assets/${asset.id}`}
                      className="block p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Laptop className="w-5 h-5 text-gray-400" />
                          <div>
                            <p className="font-medium text-gray-900">{asset.display_name}</p>
                            <p className="text-sm text-gray-500">{asset.asset_tag}</p>
                          </div>
                        </div>
                        <Badge variant={asset.status === 'Available' ? 'success' : 'info'}>
                          {asset.status}
                        </Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Laptop className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No assets allocated to this client</p>
                </div>
              )}
            </div>
          </Card>

          {/* Notes */}
          {client.notes && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{client.notes}</p>
              </div>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Stats */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Total Assets</span>
                    <span className="text-2xl font-bold text-gray-900">{assets.length}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Active Assets</span>
                    <span className="text-2xl font-bold text-green-600">
                      {assets.filter(a => a.status === 'Assigned').length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${(assets.filter(a => a.status === 'Assigned').length / Math.max(assets.length, 1)) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Documents */}
          <Card>
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Documents</h3>
              <div className="space-y-2">
                {client.sla_document_path ? (
                  <a
                    href={client.sla_document_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-primary-600">SLA Document</span>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No SLA document</p>
                )}

                {client.tor_document_path ? (
                  <a
                    href={client.tor_document_path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2 rounded hover:bg-gray-50"
                  >
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-primary-600">TOR Document</span>
                  </a>
                ) : (
                  <p className="text-sm text-gray-500">No TOR document</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
