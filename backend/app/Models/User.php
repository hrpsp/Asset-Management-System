<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Database\Eloquent\Relations\HasMany;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'is_active',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'is_active' => 'boolean',
        'last_login_at' => 'datetime',
    ];

    // Relationships
    public function activityLogs(): HasMany
    {
        return $this->hasMany(ActivityLog::class);
    }

    public function allocationsCreated(): HasMany
    {
        return $this->hasMany(Allocation::class, 'created_by');
    }

    public function assignedTransfers(): HasMany
    {
        return $this->hasMany(TransferRequest::class, 'assigned_to');
    }

    public function assignedRepairs(): HasMany
    {
        return $this->hasMany(RepairRequest::class, 'assigned_to');
    }

    // Role checks
    public function isAdmin(): bool
    {
        return $this->role === 'Admin';
    }

    public function isITManager(): bool
    {
        return in_array($this->role, ['Admin', 'IT Manager']);
    }

    public function isITSupport(): bool
    {
        return in_array($this->role, ['Admin', 'IT Manager', 'IT Support']);
    }

    public function isHROperations(): bool
    {
        return in_array($this->role, ['Admin', 'HR Operations']);
    }

    public function canManageAssets(): bool
    {
        return in_array($this->role, ['Admin', 'IT Manager', 'IT Support']);
    }

    public function canManageAllocations(): bool
    {
        return in_array($this->role, ['Admin', 'IT Manager', 'HR Operations']);
    }
}
