<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Allocation;
use App\Models\Client;
use App\Models\Employee;
use App\Models\RepairRequest;
use App\Models\TransferRequest;
use App\Models\InstallmentSchedule;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function stats()
    {
        $stats = [
            'assets' => [
                'total' => Asset::count(),
                'available' => Asset::where('status', 'Available')->count(),
                'assigned' => Asset::where('status', 'Assigned')->count(),
                'in_repair' => Asset::where('status', 'In Repair')->count(),
                'retired' => Asset::where('status', 'Retired')->count(),
            ],
            'allocations' => [
                'active' => Allocation::where('is_active', true)->count(),
                'installments' => Allocation::where('is_active', true)->where('allocation_type', 'Installment')->count(),
                'rentals' => Allocation::where('is_active', true)->where('allocation_type', 'Rental')->count(),
            ],
            'by_type' => Asset::select('asset_type', DB::raw('count(*) as count'))
                ->groupBy('asset_type')
                ->pluck('count', 'asset_type'),
            'clients' => Client::where('is_active', true)->count(),
            'employees' => Employee::where('employment_status', 'Active')->count(),
            'pending_repairs' => RepairRequest::open()->count(),
            'pending_transfers' => TransferRequest::pending()->count(),
            'overdue_installments' => InstallmentSchedule::where('status', 'Overdue')->count(),
        ];

        return $this->successResponse($stats);
    }

    public function recentActivity()
    {
        $recentAllocations = Allocation::with(['asset', 'employee', 'client'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentRepairs = RepairRequest::with(['asset'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        $recentTransfers = TransferRequest::with(['allocation.asset', 'allocation.employee'])
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return $this->successResponse([
            'allocations' => $recentAllocations,
            'repairs' => $recentRepairs,
            'transfers' => $recentTransfers,
        ]);
    }

    public function alerts()
    {
        $alerts = [];

        // Overdue installments
        $overdueInstallments = InstallmentSchedule::with(['plan.allocation.employee', 'plan.allocation.asset'])
            ->where('status', 'Overdue')
            ->orderBy('due_date')
            ->limit(10)
            ->get();

        if ($overdueInstallments->count() > 0) {
            $alerts['overdue_installments'] = $overdueInstallments;
        }

        // Pending recoveries past deadline
        $overdueTransfers = TransferRequest::with(['allocation.employee', 'allocation.asset'])
            ->pending()
            ->where('deadline_date', '<', now())
            ->get();

        if ($overdueTransfers->count() > 0) {
            $alerts['overdue_transfers'] = $overdueTransfers;
        }

        // Warranty expiring in 30 days
        $warrantyExpiring = Asset::where('status', '!=', 'Retired')
            ->whereNotNull('warranty_expiry')
            ->whereBetween('warranty_expiry', [now(), now()->addDays(30)])
            ->orderBy('warranty_expiry')
            ->get();

        if ($warrantyExpiring->count() > 0) {
            $alerts['warranty_expiring'] = $warrantyExpiring;
        }

        // Critical repairs
        $criticalRepairs = RepairRequest::with(['asset'])
            ->open()
            ->where('priority', 'Critical')
            ->get();

        if ($criticalRepairs->count() > 0) {
            $alerts['critical_repairs'] = $criticalRepairs;
        }

        return $this->successResponse($alerts);
    }

    public function assetsByClient()
    {
        $data = Client::where('is_active', true)
            ->withCount(['allocations' => function ($q) {
                $q->where('is_active', true);
            }])
            ->orderBy('allocations_count', 'desc')
            ->get()
            ->map(function ($client) {
                return [
                    'client' => $client->name,
                    'code' => $client->code,
                    'count' => $client->allocations_count,
                ];
            });

        return $this->successResponse($data);
    }
}
