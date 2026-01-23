<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreAssetRequest;
use App\Http\Requests\UpdateAssetRequest;
use App\Http\Resources\AssetResource;
use App\Models\Asset;
use App\Models\AssetPhoto;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class AssetController extends Controller
{
    public function index(Request $request)
    {
        $query = Asset::with(['activeAllocation.employee', 'activeAllocation.client', 'photos'])
            ->withCount(['allocations', 'repairs']);

        // Filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('asset_type')) {
            $query->where('asset_type', $request->asset_type);
        }

        if ($request->filled('client_id')) {
            $query->byClient($request->client_id);
        }

        if ($request->filled('brand')) {
            $query->where('brand', $request->brand);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('asset_tag', 'like', "%{$search}%")
                    ->orWhere('brand', 'like', "%{$search}%")
                    ->orWhere('model', 'like', "%{$search}%")
                    ->orWhere('serial_number', 'like', "%{$search}%");
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $perPage = $request->get('per_page', 15);
        $assets = $query->paginate($perPage);

        return $this->paginatedResponse($assets, AssetResource::class);
    }

    public function store(StoreAssetRequest $request)
    {
        $asset = Asset::create($request->validated());

        ActivityLog::log('created', 'Asset', $asset->id, null, $asset->toArray());

        return $this->createdResponse(
            new AssetResource($asset->load('photos')),
            'Asset created successfully'
        );
    }

    public function show(Asset $asset)
    {
        $asset->load([
            'photos',
            'activeAllocation.employee',
            'activeAllocation.client',
            'activeAllocation.installmentPlan.schedules',
            'activeAllocation.rentalAgreement.periods',
        ]);

        return $this->successResponse(new AssetResource($asset));
    }

    public function update(UpdateAssetRequest $request, Asset $asset)
    {
        $oldValues = $asset->toArray();
        $asset->update($request->validated());

        ActivityLog::log('updated', 'Asset', $asset->id, $oldValues, $asset->toArray());

        return $this->successResponse(
            new AssetResource($asset->load('photos')),
            'Asset updated successfully'
        );
    }

    public function destroy(Asset $asset)
    {
        if ($asset->status === 'Assigned') {
            return $this->errorResponse('Cannot delete an assigned asset. Return it first.', 400);
        }

        $oldValues = $asset->toArray();
        $asset->delete();

        ActivityLog::log('deleted', 'Asset', $asset->id, $oldValues, null);

        return $this->successResponse(null, 'Asset deleted successfully');
    }

    public function updateStatus(Request $request, Asset $asset)
    {
        $request->validate([
            'status' => 'required|in:Available,Assigned,In Repair,Retired,Lost,Transferred',
        ]);

        $oldStatus = $asset->status;
        $asset->update(['status' => $request->status]);

        ActivityLog::log('status_changed', 'Asset', $asset->id,
            ['status' => $oldStatus],
            ['status' => $request->status]
        );

        return $this->successResponse(
            new AssetResource($asset),
            'Asset status updated successfully'
        );
    }

    public function available(Request $request)
    {
        $query = Asset::available();

        if ($request->filled('asset_type')) {
            $query->where('asset_type', $request->asset_type);
        }

        $assets = $query->orderBy('brand')->orderBy('model')->get();

        return $this->successResponse(AssetResource::collection($assets));
    }

    public function history(Asset $asset)
    {
        $asset->load([
            'allocations' => function ($q) {
                $q->with(['employee', 'client', 'installmentPlan', 'rentalAgreement'])
                    ->orderBy('allocation_date', 'desc');
            },
            'repairs' => function ($q) {
                $q->orderBy('reported_date', 'desc');
            },
        ]);

        return $this->successResponse([
            'asset' => new AssetResource($asset),
            'allocations' => $asset->allocations,
            'repairs' => $asset->repairs,
        ]);
    }

    public function uploadPhotos(Request $request, Asset $asset)
    {
        $request->validate([
            'photos' => 'required|array',
            'photos.*' => 'image|max:5120', // 5MB max
            'photo_type' => 'nullable|in:Front,Back,Tag,Damage,Other',
        ]);

        $uploadedPhotos = [];
        $photoType = $request->get('photo_type', 'Other');

        foreach ($request->file('photos') as $photo) {
            $path = $photo->store('assets/' . $asset->id, 'public');

            $assetPhoto = AssetPhoto::create([
                'asset_id' => $asset->id,
                'photo_type' => $photoType,
                'file_path' => $path,
                'uploaded_at' => now(),
            ]);

            $uploadedPhotos[] = $assetPhoto;
        }

        return $this->successResponse(
            AssetResource::collection($uploadedPhotos),
            count($uploadedPhotos) . ' photo(s) uploaded successfully'
        );
    }

    public function deletePhoto(Asset $asset, AssetPhoto $photo)
    {
        if ($photo->asset_id !== $asset->id) {
            return $this->errorResponse('Photo does not belong to this asset', 404);
        }

        Storage::disk('public')->delete($photo->file_path);
        $photo->delete();

        return $this->successResponse(null, 'Photo deleted successfully');
    }

    public function generateTag(Asset $asset)
    {
        // Generate barcode using picqer/php-barcode-generator
        $generator = new \Picqer\Barcode\BarcodeGeneratorPNG();
        $barcode = $generator->getBarcode($asset->asset_tag, $generator::TYPE_CODE_128);

        return response($barcode)
            ->header('Content-Type', 'image/png')
            ->header('Content-Disposition', 'inline; filename="' . $asset->asset_tag . '.png"');
    }

    public function warrantyExpiring(Request $request)
    {
        $days = $request->get('days', 30);

        $assets = Asset::warrantyExpiringSoon($days)
            ->with(['activeAllocation.employee', 'activeAllocation.client'])
            ->orderBy('warranty_expiry')
            ->get();

        return $this->successResponse(AssetResource::collection($assets));
    }
}
