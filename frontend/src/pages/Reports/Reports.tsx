import { BarChart3, FileText, Download, TrendingUp } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button } from '../../components/common';

export default function Reports() {
  return (
    <div>
      <Header title="Reports" subtitle="Generate and export reports">
        <Button leftIcon={<Download className="w-4 h-4" />}>Export All</Button>
      </Header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Asset Utilization</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">View asset allocation and utilization rates across clients</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Client Summary</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Client-wise asset allocation and employee summary</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Repair Analysis</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Repair costs and warranty claim analysis</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Employee Asset History</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Track asset allocation history per employee</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Installment/Rental</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Payment tracking and outstanding balances</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>

        <Card>
          <div className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Warranty Expiry</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">Assets with expiring warranties</p>
            <Button variant="secondary" size="sm" leftIcon={<FileText className="w-4 h-4" />}>Generate Report</Button>
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Custom Report Builder</h3>
          <p className="text-gray-600 mb-4">Create custom reports with specific filters and date ranges</p>
          <div className="flex gap-3">
            <Button variant="primary">Build Custom Report</Button>
            <Button variant="secondary">Saved Reports</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
