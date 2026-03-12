<?php

namespace App\Modules\SiteVisits\Services;

use App\Modules\SiteVisits\Models\SiteVisit;
use Illuminate\Support\Facades\Auth;

class SiteVisitService
{
    public function getVisits(?string $search = null, ?string $status = null, ?string $clientId = null, ?string $projectId = null, int $perPage = 15)
    {
        $organizationId = session('current_organization_id');
        
        $query = SiteVisit::where('organization_id', $organizationId)
            ->with(['client', 'project', 'visitor'])
            ->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('location', 'like', "%{$search}%")
                  ->orWhere('purpose', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        if ($projectId) {
            $query->where('project_id', $projectId);
        }

        return $query->paginate($perPage);
    }

    public function createSiteVisit(array $data): SiteVisit
    {
        $organizationId = session('current_organization_id');
        
        return SiteVisit::create([
            ...$data,
            'organization_id' => $organizationId,
        ]);
    }

    public function updateSiteVisit(SiteVisit $siteVisit, array $data): SiteVisit
    {
        $siteVisit->update($data);
        
        return $siteVisit->fresh(['client', 'project', 'visitor']);
    }

    public function deleteSiteVisit(SiteVisit $siteVisit): void
    {
        $siteVisit->delete();
    }
}