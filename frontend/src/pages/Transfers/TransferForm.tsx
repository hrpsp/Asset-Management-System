import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Header from '../../components/layout/Header';
import { Card, Button } from '../../components/common';

export default function TransferForm() {
  const navigate = useNavigate();

  return (
    <div>
      <Header title="Create Transfer" subtitle="Transfer asset between employees">
        <Button variant="ghost" leftIcon={<ArrowLeft className="w-4 h-4" />} onClick={() => navigate('/transfers')}>Back</Button>
      </Header>

      <Card>
        <div className="p-12 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Transfer Form</h3>
          <p className="text-gray-500 mb-4">This page is under development</p>
          <p className="text-sm text-gray-400">Follow the AllocationForm pattern to implement asset transfers</p>
        </div>
      </Card>
    </div>
  );
}
