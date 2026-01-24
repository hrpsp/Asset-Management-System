<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AssetController;
use App\Http\Controllers\Api\ClientController;
use App\Http\Controllers\Api\EmployeeController;
use App\Http\Controllers\Api\AllocationController;
use App\Http\Controllers\Api\InstallmentController;
use App\Http\Controllers\Api\RentalController;
use App\Http\Controllers\Api\TransferController;
use App\Http\Controllers\Api\RepairController;
use App\Http\Controllers\Api\DashboardController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Public routes
Route::post('/auth/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
    });

    // Dashboard
    Route::prefix('dashboard')->group(function () {
        Route::get('/stats', [DashboardController::class, 'stats']);
        Route::get('/recent-activity', [DashboardController::class, 'recentActivity']);
        Route::get('/alerts', [DashboardController::class, 'alerts']);
        Route::get('/assets-by-client', [DashboardController::class, 'assetsByClient']);
    });

    // Assets
    Route::prefix('assets')->group(function () {
        Route::get('/', [AssetController::class, 'index']);
        Route::post('/', [AssetController::class, 'store']);
        Route::get('/available', [AssetController::class, 'available']);
        Route::get('/warranty-expiring', [AssetController::class, 'warrantyExpiring']);
        Route::get('/{asset}', [AssetController::class, 'show']);
        Route::put('/{asset}', [AssetController::class, 'update']);
        Route::delete('/{asset}', [AssetController::class, 'destroy']);
        Route::patch('/{asset}/status', [AssetController::class, 'updateStatus']);
        Route::get('/{asset}/history', [AssetController::class, 'history']);
        Route::post('/{asset}/photos', [AssetController::class, 'uploadPhotos']);
        Route::delete('/{asset}/photos/{photo}', [AssetController::class, 'deletePhoto']);
        Route::get('/{asset}/tag', [AssetController::class, 'generateTag']);
        Route::get('/{asset}/repairs', [RepairController::class, 'assetHistory']);
    });

    // Clients
    Route::prefix('clients')->group(function () {
        Route::get('/', [ClientController::class, 'index']);
        Route::post('/', [ClientController::class, 'store']);
        Route::get('/{client}', [ClientController::class, 'show']);
        Route::put('/{client}', [ClientController::class, 'update']);
        Route::delete('/{client}', [ClientController::class, 'destroy']);
        Route::get('/{client}/assets', [ClientController::class, 'assets']);
        Route::post('/{client}/documents', [ClientController::class, 'uploadDocument']);
    });

    // Employees
    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index']);
        Route::post('/', [EmployeeController::class, 'store']);
        Route::get('/active', [EmployeeController::class, 'active']);
        Route::get('/{employee}', [EmployeeController::class, 'show']);
        Route::put('/{employee}', [EmployeeController::class, 'update']);
        Route::delete('/{employee}', [EmployeeController::class, 'destroy']);
        Route::get('/{employee}/assets', [EmployeeController::class, 'assets']);
    });

    // Allocations
    Route::prefix('allocations')->group(function () {
        Route::get('/', [AllocationController::class, 'index']);
        Route::post('/', [AllocationController::class, 'store']);
        Route::get('/{allocation}', [AllocationController::class, 'show']);
        Route::post('/{allocation}/return', [AllocationController::class, 'processReturn']);
        Route::post('/{allocation}/photos', [AllocationController::class, 'uploadPhotos']);
    });

    // Installment Plans
    Route::prefix('installment-plans')->group(function () {
        Route::get('/', [InstallmentController::class, 'index']);
        Route::get('/overdue', [InstallmentController::class, 'overdue']);
        Route::get('/{installmentPlan}', [InstallmentController::class, 'show']);
        Route::patch('/{plan}/schedule/{installmentNumber}', [InstallmentController::class, 'updateScheduleStatus']);
    });

    // Rentals
    Route::prefix('rentals')->group(function () {
        Route::get('/', [RentalController::class, 'index']);
        Route::get('/{rental}', [RentalController::class, 'show']);
        Route::post('/{rental}/terminate', [RentalController::class, 'terminate']);
        Route::post('/{rental}/mark-period', [RentalController::class, 'markPeriodComplete']);
    });

    // Transfers
    Route::prefix('transfers')->group(function () {
        Route::get('/', [TransferController::class, 'index']);
        Route::post('/', [TransferController::class, 'store']);
        Route::get('/pending', [TransferController::class, 'pending']);
        Route::get('/{transfer}', [TransferController::class, 'show']);
        Route::patch('/{transfer}/status', [TransferController::class, 'updateStatus']);
        Route::patch('/{transfer}/checklist', [TransferController::class, 'updateChecklist']);
    });

    // Repairs
    Route::prefix('repairs')->group(function () {
        Route::get('/', [RepairController::class, 'index']);
        Route::post('/', [RepairController::class, 'store']);
        Route::get('/queue', [RepairController::class, 'queue']);
        Route::get('/{repair}', [RepairController::class, 'show']);
        Route::patch('/{repair}/status', [RepairController::class, 'updateStatus']);
        Route::post('/{repair}/spare', [RepairController::class, 'issueSpare']);
    });

});
