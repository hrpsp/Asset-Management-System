<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Allocation;
use App\Models\Client;
use App\Models\Employee;
use App\Models\RepairRequest;
use App\Models\InstallmentPlan;
use App\Models\RentalAgreement;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Asset Utilization Report
     * Shows asset allocation statistics and utilization rates
     */
    public function assetUtilization(Request $request)
    {
        $query = Asset::query();

        if ($request->filled('client_id')) {
            $query->whereHas('activeAllocation', function($q) use ($request) {
                $q->where('client_id', $request->client_id);
            });
        }

        if ($request->filled('asset_type')) {
            $query->where('asset_type', $request->asset_type);
        }

        $totalAssets = $query->count();
        $availableAssets = (clone $query)->where('status', 'Available')->count();
        $assignedAssets = (clone $query)->where('status', 'Assigned')->count();
        $inRepairAssets = (clone $query)->where('status', 'In Repair')->count();
        $retiredAssets = (clone $query)->where('status', 'Retired')->count();

        $utilizationRate = $totalAssets > 0 ? round(($assignedAssets / $totalAssets) * 100, 2) : 0;

        // Assets by type
        $assetsByType = Asset::select('asset_type', DB::raw('count(*) as count'))
            ->groupBy('asset_type')
            ->get();

        // Assets by status
        $assetsByStatus = Asset::select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Top allocated asset types
        $topAllocatedTypes = Allocation::select('assets.asset_type', DB::raw('count(*) as allocation_count'))
            ->join('assets', 'allocations.asset_id', '=', 'assets.id')
            ->where('allocations.is_active', true)
            ->groupBy('assets.asset_type')
            ->orderByDesc('allocation_count')
            ->limit(5)
            ->get();

        return $this->successResponse([
            'summary' => [
                'total_assets' => $totalAssets,
                'available' => $availableAssets,
                'assigned' => $assignedAssets,
                'in_repair' => $inRepairAssets,
                'retired' => $retiredAssets,
                'utilization_rate' => $utilizationRate,
            ],
            'by_type' => $assetsByType,
            'by_status' => $assetsByStatus,
            'top_allocated_types' => $topAllocatedTypes,
        ]);
    }

    /**
     * Client Summary Report
     * Shows client-wise asset allocation and financial summary
     */
    public function clientSummary(Request $request)
    {
        $query = Client::query();

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        $clients = $query->with(['allocations' => function($q) {
            $q->where('is_active', true)->with('asset');
        }])->get();

        $clientSummaries = $clients->map(function($client) {
            $activeAllocations = $client->allocations;
            $totalAssetValue = $activeAllocations->sum(function($allocation) {
                return $allocation->asset->purchase_price ?? 0;
            });

            $installmentCount = $activeAllocations->where('allocation_type', 'Installment')->count();
            $rentalCount = $activeAllocations->where('allocation_type', 'Rental')->count();

            return [
                'client_id' => $client->id,
                'client_name' => $client->name,
                'client_code' => $client->code,
                'is_active' => $client->is_active,
                'total_assets' => $activeAllocations->count(),
                'total_asset_value' => round($totalAssetValue, 2),
                'installment_allocations' => $installmentCount,
                'rental_allocations' => $rentalCount,
                'asset_types' => $activeAllocations->pluck('asset.asset_type')->unique()->values(),
            ];
        });

        return $this->successResponse([
            'clients' => $clientSummaries,
            'totals' => [
                'total_clients' => $clients->count(),
                'active_clients' => $clients->where('is_active', true)->count(),
                'total_allocations' => $clientSummaries->sum('total_assets'),
                'total_value' => round($clientSummaries->sum('total_asset_value'), 2),
            ],
        ]);
    }

    /**
     * Repair Analysis Report
     * Shows repair costs, frequency, and analysis by category/priority
     */
    public function repairAnalysis(Request $request)
    {
        $startDate = $request->filled('start_date')
            ? Carbon::parse($request->start_date)
            : Carbon::now()->subMonths(6);

        $endDate = $request->filled('end_date')
            ? Carbon::parse($request->end_date)
            : Carbon::now();

        $query = RepairRequest::whereBetween('reported_date', [$startDate, $endDate]);

        if ($request->filled('asset_id')) {
            $query->where('asset_id', $request->asset_id);
        }

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $totalRepairs = $query->count();
        $totalCost = $query->sum('repair_cost');
        $averageCost = $totalRepairs > 0 ? round($totalCost / $totalRepairs, 2) : 0;

        // Repairs by category
        $byCategory = (clone $query)
            ->select('issue_category', DB::raw('count(*) as count'), DB::raw('sum(repair_cost) as total_cost'))
            ->groupBy('issue_category')
            ->get();

        // Repairs by priority
        $byPriority = (clone $query)
            ->select('priority', DB::raw('count(*) as count'))
            ->groupBy('priority')
            ->get();

        // Repairs by status
        $byStatus = (clone $query)
            ->select('status', DB::raw('count(*) as count'))
            ->groupBy('status')
            ->get();

        // Warranty claims
        $warrantyClaims = (clone $query)->where('is_warranty_claim', true)->count();
        $warrantyApproved = (clone $query)
            ->where('is_warranty_claim', true)
            ->where('warranty_claim_status', 'Approved')
            ->count();

        // Most repaired assets
        $mostRepairedAssets = RepairRequest::select('asset_id', DB::raw('count(*) as repair_count'))
            ->whereBetween('reported_date', [$startDate, $endDate])
            ->with('asset')
            ->groupBy('asset_id')
            ->orderByDesc('repair_count')
            ->limit(10)
            ->get()
            ->map(function($item) {
                return [
                    'asset_id' => $item->asset_id,
                    'asset_tag' => $item->asset->asset_tag ?? 'N/A',
                    'display_name' => $item->asset->display_name ?? 'N/A',
                    'repair_count' => $item->repair_count,
                ];
            });

        return $this->successResponse([
            'summary' => [
                'total_repairs' => $totalRepairs,
                'total_cost' => round($totalCost, 2),
                'average_cost' => $averageCost,
                'warranty_claims' => $warrantyClaims,
                'warranty_approved' => $warrantyApproved,
            ],
            'by_category' => $byCategory,
            'by_priority' => $byPriority,
            'by_status' => $byStatus,
            'most_repaired_assets' => $mostRepairedAssets,
            'date_range' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
            ],
        ]);
    }

    /**
     * Employee Asset History Report
     * Shows employee-wise asset allocation history
     */
    public function employeeAssetHistory(Request $request)
    {
        $query = Employee::query();

        if ($request->filled('employment_status')) {
            $query->where('employment_status', $request->employment_status);
        }

        if ($request->filled('client_id')) {
            $query->where('client_id', $request->client_id);
        }

        $employees = $query->with(['allocations' => function($q) {
            $q->with('asset')->latest('allocation_date');
        }])->get();

        $employeeHistories = $employees->map(function($employee) {
            $allocations = $employee->allocations;
            $activeAllocations = $allocations->where('is_active', true);

            return [
                'employee_id' => $employee->id,
                'employee_name' => $employee->full_name,
                'employee_code' => $employee->employee_code,
                'employment_status' => $employee->employment_status,
                'client_name' => $employee->client->name ?? 'N/A',
                'total_allocations' => $allocations->count(),
                'active_allocations' => $activeAllocations->count(),
                'current_assets' => $activeAllocations->map(function($allocation) {
                    return [
                        'asset_tag' => $allocation->asset->asset_tag ?? 'N/A',
                        'asset_type' => $allocation->asset->asset_type ?? 'N/A',
                        'allocation_date' => $allocation->allocation_date,
                        'allocation_type' => $allocation->allocation_type,
                    ];
                })->values(),
                'allocation_history' => $allocations->where('is_active', false)->map(function($allocation) {
                    return [
                        'asset_tag' => $allocation->asset->asset_tag ?? 'N/A',
                        'asset_type' => $allocation->asset->asset_type ?? 'N/A',
                        'allocation_date' => $allocation->allocation_date,
                        'return_date' => $allocation->return_date,
                        'allocation_type' => $allocation->allocation_type,
                    ];
                })->values(),
            ];
        });

        return $this->successResponse([
            'employees' => $employeeHistories,
            'summary' => [
                'total_employees' => $employees->count(),
                'active_employees' => $employees->where('employment_status', 'Active')->count(),
                'total_active_allocations' => $employeeHistories->sum('active_allocations'),
            ],
        ]);
    }

    /**
     * Installment and Rental Report
     * Shows payment tracking and outstanding amounts
     */
    public function installmentRental(Request $request)
    {
        // Installment Plans
        $installmentQuery = InstallmentPlan::with(['allocation.asset', 'allocation.employee', 'schedules']);

        if ($request->filled('status')) {
            $installmentQuery->where('status', $request->status);
        }

        $installmentPlans = $installmentQuery->get();

        $installmentSummary = [
            'total_plans' => $installmentPlans->count(),
            'active_plans' => $installmentPlans->where('status', 'Active')->count(),
            'completed_plans' => $installmentPlans->where('status', 'Completed')->count(),
            'defaulted_plans' => $installmentPlans->where('status', 'Defaulted')->count(),
            'total_financed' => round($installmentPlans->sum('financed_amount'), 2),
            'total_collected' => round($installmentPlans->sum(function($plan) {
                return $plan->schedules->where('status', 'Paid')->sum('amount');
            }), 2),
            'total_outstanding' => round($installmentPlans->sum(function($plan) {
                return $plan->schedules->whereIn('status', ['Pending', 'Overdue'])->sum('amount');
            }), 2),
        ];

        // Overdue installments
        $overdueInstallments = $installmentPlans->flatMap(function($plan) {
            return $plan->schedules->where('status', 'Overdue')->map(function($schedule) use ($plan) {
                return [
                    'plan_id' => $plan->id,
                    'employee' => $plan->allocation->employee->full_name ?? 'N/A',
                    'asset_tag' => $plan->allocation->asset->asset_tag ?? 'N/A',
                    'installment_number' => $schedule->installment_number,
                    'due_date' => $schedule->due_date,
                    'amount' => $schedule->amount,
                    'days_overdue' => Carbon::parse($schedule->due_date)->diffInDays(now()),
                ];
            });
        })->sortByDesc('days_overdue')->values();

        // Rental Agreements
        $rentalQuery = RentalAgreement::with(['allocation.asset', 'allocation.employee', 'periods']);

        if ($request->filled('rental_status')) {
            $rentalQuery->where('status', $request->rental_status);
        }

        $rentalAgreements = $rentalQuery->get();

        $rentalSummary = [
            'total_agreements' => $rentalAgreements->count(),
            'active_agreements' => $rentalAgreements->where('status', 'Active')->count(),
            'terminated_agreements' => $rentalAgreements->where('status', 'Terminated')->count(),
            'total_monthly_rental' => round($rentalAgreements->where('status', 'Active')->sum('monthly_rental'), 2),
            'total_security_deposits' => round($rentalAgreements->sum('security_deposit'), 2),
        ];

        return $this->successResponse([
            'installments' => [
                'summary' => $installmentSummary,
                'overdue' => $overdueInstallments->take(20),
            ],
            'rentals' => [
                'summary' => $rentalSummary,
                'active_agreements' => $rentalAgreements->where('status', 'Active')->map(function($rental) {
                    return [
                        'rental_id' => $rental->id,
                        'employee' => $rental->allocation->employee->full_name ?? 'N/A',
                        'asset_tag' => $rental->allocation->asset->asset_tag ?? 'N/A',
                        'monthly_rental' => $rental->monthly_rental,
                        'start_date' => $rental->rental_start_date,
                        'billing_day' => $rental->billing_day,
                    ];
                })->values(),
            ],
        ]);
    }

    /**
     * Warranty Expiry Report
     * Shows assets with expiring or expired warranties
     */
    public function warrantyExpiry(Request $request)
    {
        $daysAhead = $request->get('days_ahead', 90);
        $expiryDate = Carbon::now()->addDays($daysAhead);

        $query = Asset::whereNotNull('warranty_expiry')
            ->where('warranty_expiry', '<=', $expiryDate)
            ->where('status', '!=', 'Retired');

        if ($request->filled('asset_type')) {
            $query->where('asset_type', $request->asset_type);
        }

        $assets = $query->with('activeAllocation.employee')->get();

        $expiredAssets = $assets->filter(function($asset) {
            return Carbon::parse($asset->warranty_expiry)->isPast();
        });

        $expiringAssets = $assets->filter(function($asset) {
            return Carbon::parse($asset->warranty_expiry)->isFuture();
        });

        $assetsData = $assets->map(function($asset) {
            $warrantyExpiry = Carbon::parse($asset->warranty_expiry);
            $isExpired = $warrantyExpiry->isPast();
            $daysUntilExpiry = $isExpired
                ? -1 * $warrantyExpiry->diffInDays(now())
                : $warrantyExpiry->diffInDays(now());

            return [
                'asset_id' => $asset->id,
                'asset_tag' => $asset->asset_tag,
                'display_name' => $asset->display_name,
                'asset_type' => $asset->asset_type,
                'brand' => $asset->brand,
                'model' => $asset->model,
                'warranty_expiry' => $asset->warranty_expiry,
                'is_expired' => $isExpired,
                'days_until_expiry' => $daysUntilExpiry,
                'status' => $asset->status,
                'allocated_to' => $asset->activeAllocation
                    ? $asset->activeAllocation->employee->full_name
                    : 'Not Allocated',
                'purchase_price' => $asset->purchase_price,
            ];
        })->sortBy('days_until_expiry')->values();

        return $this->successResponse([
            'summary' => [
                'total_assets' => $assets->count(),
                'expired' => $expiredAssets->count(),
                'expiring_soon' => $expiringAssets->count(),
                'total_value_at_risk' => round($assets->sum('purchase_price'), 2),
            ],
            'assets' => $assetsData,
            'date_range' => [
                'current_date' => now()->toDateString(),
                'check_until' => $expiryDate->toDateString(),
                'days_ahead' => $daysAhead,
            ],
        ]);
    }
}
