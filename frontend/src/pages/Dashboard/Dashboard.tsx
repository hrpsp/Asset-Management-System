import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Laptop,
  Users,
  Building2,
  Wrench,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, CardHeader, StatsCard, Badge, getStatusBadgeVariant } from '../../components/common';
import { dashboardService } from '../../services';
import { DashboardStats } from '../../types';

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<any>({});
  const [recentActivity, setRecentActivity] = useState<any>({});
  const [assetsByClient, setAssetsByClient] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, alertsData, activityData, clientsData] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getAlerts(),
          dashboardService.getRecentActivity(),
          dashboardService.getAssetsByClient(),
        ]);
        setStats(statsData);
        setAlerts(alertsData);
        setRecentActivity(activityData);
        setAssetsByClient(clientsData);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div>
      <Header
        title="Dashboard"
        subtitle="Overview of your asset management system"
      />

      <div className="p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total Assets"
            value={stats?.assets.total || 0}
            icon={<Laptop className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Available"
            value={stats?.assets.available || 0}
            icon={<Laptop className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Assigned"
            value={stats?.assets.assigned || 0}
            icon={<Users className="w-6 h-6" />}
            color="purple"
          />
          <StatsCard
            title="In Repair"
            value={stats?.assets.in_repair || 0}
            icon={<Wrench className="w-6 h-6" />}
            color="yellow"
          />
        </div>

        {/* Second Row Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Active Clients"
            value={stats?.clients || 0}
            icon={<Building2 className="w-6 h-6" />}
            color="blue"
          />
          <StatsCard
            title="Active Employees"
            value={stats?.employees || 0}
            icon={<Users className="w-6 h-6" />}
            color="green"
          />
          <StatsCard
            title="Pending Repairs"
            value={stats?.pending_repairs || 0}
            icon={<Wrench className="w-6 h-6" />}
            color="yellow"
          />
          <StatsCard
            title="Pending Transfers"
            value={stats?.pending_transfers || 0}
            icon={<RotateCcw className="w-6 h-6" />}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Alerts Section */}
          <Card>
            <CardHeader
              title="Alerts"
              subtitle="Items requiring attention"
              action={
                <Link
                  to="/repairs"
                  className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                >
                  View all <ArrowRight className="w-4 h-4" />
                </Link>
              }
            />

            {Object.keys(alerts).length === 0 ? (
              <p className="text-gray-500 text-center py-8">No alerts at this time</p>
            ) : (
              <div className="space-y-3">
                {alerts.overdue_installments?.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">
                        {alerts.overdue_installments.length} Overdue Installment(s)
                      </p>
                      <p className="text-sm text-red-600">
                        Employees with pending payments
                      </p>
                    </div>
                  </div>
                )}

                {alerts.overdue_transfers?.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                    <RotateCcw className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">
                        {alerts.overdue_transfers.length} Overdue Transfer(s)
                      </p>
                      <p className="text-sm text-yellow-600">
                        Asset recoveries past deadline
                      </p>
                    </div>
                  </div>
                )}

                {alerts.warranty_expiring?.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">
                        {alerts.warranty_expiring.length} Warranty Expiring
                      </p>
                      <p className="text-sm text-blue-600">
                        Assets with warranty expiring in 30 days
                      </p>
                    </div>
                  </div>
                )}

                {alerts.critical_repairs?.length > 0 && (
                  <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                    <Wrench className="w-5 h-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">
                        {alerts.critical_repairs.length} Critical Repair(s)
                      </p>
                      <p className="text-sm text-red-600">
                        High priority repairs pending
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Assets by Client */}
          <Card>
            <CardHeader
              title="Assets by Client"
              subtitle="Distribution of assigned assets"
            />

            {assetsByClient.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No data available</p>
            ) : (
              <div className="space-y-3">
                {assetsByClient.map((item) => (
                  <div
                    key={item.code}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{item.client}</p>
                        <p className="text-sm text-gray-500">{item.code}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{item.count}</p>
                      <p className="text-xs text-gray-500">assets</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Recent Allocations */}
        <Card className="mt-6">
          <CardHeader
            title="Recent Allocations"
            subtitle="Latest asset assignments"
            action={
              <Link
                to="/allocations"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            }
          />

          {recentActivity.allocations?.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No recent allocations</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Asset
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Employee
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Client
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Type
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentActivity.allocations?.slice(0, 5).map((allocation: any) => (
                    <tr key={allocation.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {allocation.asset?.asset_tag}
                        </p>
                        <p className="text-sm text-gray-500">
                          {allocation.asset?.brand} {allocation.asset?.model}
                        </p>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {allocation.employee?.name}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {allocation.client?.code}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <Badge variant={allocation.allocation_type === 'Installment' ? 'info' : 'success'}>
                          {allocation.allocation_type}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-500">
                        {allocation.allocation_date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
