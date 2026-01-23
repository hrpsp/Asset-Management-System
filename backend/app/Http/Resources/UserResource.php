<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'role' => $this->role,
            'is_active' => $this->is_active,
            'last_login_at' => $this->last_login_at?->format('Y-m-d H:i:s'),

            // Computed role checks
            'is_admin' => $this->isAdmin(),
            'is_it_manager' => $this->isITManager(),
            'is_it_support' => $this->isITSupport(),
            'is_hr_operations' => $this->isHROperations(),
            'can_manage_assets' => $this->canManageAssets(),
            'can_manage_allocations' => $this->canManageAllocations(),

            'created_at' => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at' => $this->updated_at?->format('Y-m-d H:i:s'),
        ];
    }
}
