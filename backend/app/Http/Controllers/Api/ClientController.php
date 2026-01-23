<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreClientRequest;
use App\Http\Resources\ClientResource;
use App\Http\Resources\AssetResource;
use App\Models\Client;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class ClientController extends Controller
{
    public function index(Request $request)
    {
        $query = Client::withCount(['employees' => function ($q) {
            $q->where('employment_status', 'Active');
        }])->withCount(['allocations' => function ($q) {
            $q->where('is_active', true);
        }]);

        if ($request->filled('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        $clients = $query->orderBy('name')->get();

        return $this->successResponse(ClientResource::collection($clients));
    }

    public function store(StoreClientRequest $request)
    {
        $client = Client::create($request->validated());

        ActivityLog::log('created', 'Client', $client->id, null, $client->toArray());

        return $this->createdResponse(
            new ClientResource($client),
            'Client created successfully'
        );
    }

    public function show(Client $client)
    {
        $client->load(['employees' => function ($q) {
            $q->where('employment_status', 'Active')->orderBy('name');
        }]);

        return $this->successResponse(new ClientResource($client));
    }

    public function update(Request $request, Client $client)
    {
        $request->validate([
            'name' => 'sometimes|string|max:255',
            'code' => ['sometimes', 'string', 'max:50', Rule::unique('clients')->ignore($client)],
            'contract_reference' => 'nullable|string|max:255',
            'primary_contact_name' => 'nullable|string|max:255',
            'primary_contact_email' => 'nullable|email|max:255',
            'primary_contact_phone' => 'nullable|string|max:50',
            'asset_policies' => 'nullable|array',
            'notes' => 'nullable|string',
            'is_active' => 'sometimes|boolean',
        ]);

        $oldValues = $client->toArray();
        $client->update($request->all());

        ActivityLog::log('updated', 'Client', $client->id, $oldValues, $client->toArray());

        return $this->successResponse(
            new ClientResource($client),
            'Client updated successfully'
        );
    }

    public function destroy(Client $client)
    {
        $activeAllocations = $client->allocations()->where('is_active', true)->count();

        if ($activeAllocations > 0) {
            return $this->errorResponse(
                "Cannot delete client with {$activeAllocations} active allocation(s)",
                400
            );
        }

        $oldValues = $client->toArray();
        $client->delete();

        ActivityLog::log('deleted', 'Client', $client->id, $oldValues, null);

        return $this->successResponse(null, 'Client deleted successfully');
    }

    public function assets(Client $client)
    {
        $assets = $client->allocations()
            ->where('is_active', true)
            ->with(['asset', 'employee'])
            ->get()
            ->pluck('asset');

        return $this->successResponse(AssetResource::collection($assets));
    }

    public function uploadDocument(Request $request, Client $client)
    {
        $request->validate([
            'document' => 'required|file|mimes:pdf,doc,docx|max:10240', // 10MB
            'document_type' => 'required|in:sla,tor',
        ]);

        $path = $request->file('document')->store('clients/' . $client->id, 'public');

        $field = $request->document_type === 'sla' ? 'sla_document_path' : 'tor_document_path';

        // Delete old document if exists
        if ($client->$field) {
            Storage::disk('public')->delete($client->$field);
        }

        $client->update([$field => $path]);

        return $this->successResponse(
            new ClientResource($client),
            ucfirst($request->document_type) . ' document uploaded successfully'
        );
    }
}
