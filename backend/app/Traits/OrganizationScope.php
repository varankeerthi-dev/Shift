<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;

trait OrganizationScope
{
    public function scopeOrganization(Builder $query, ?string $organizationId = null): Builder
    {
        $orgId = $organizationId ?? $this->getOrganizationIdFromAuth();
        
        if (!$orgId) {
            return $query;
        }
        
        return $query->where('organization_id', $orgId);
    }

    protected function getOrganizationIdFromAuth(): ?string
    {
        if (!$user = Auth::user()) {
            return null;
        }

        $organizationId = session('current_organization_id');
        
        if (!$organizationId) {
            $firstOrganization = $user->organizations()->first();
            $organizationId = $firstOrganization?->id;
            session(['current_organization_id' => $organizationId]);
        }

        return $organizationId;
    }

    public function scopeForOrganization(Builder $query, string $organizationId): Builder
    {
        return $query->where('organization_id', $organizationId);
    }
}
