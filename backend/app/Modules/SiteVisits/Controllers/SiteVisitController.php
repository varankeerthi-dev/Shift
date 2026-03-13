<?php

namespace App\Modules\SiteVisits\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\SiteVisits\Models\SiteVisit;
use App\Modules\SiteVisits\Requests\SiteVisitCreateRequest;
use App\Modules\SiteVisits\Requests\SiteVisitUpdateRequest;
use App\Modules\SiteVisits\Services\SiteVisitService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SiteVisitController extends Controller
{
    public function __construct(
        private readonly SiteVisitService $siteVisitService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $siteVisits = $this->siteVisitService->getVisits(
            $request->get('search'),
            $request->get('status'),
            $request->get('client_id'),
            $request->get('project_id'),
            $request->get('per_page', 15)
        );

        return response()->json($siteVisits);
    }

    public function store(SiteVisitCreateRequest $request): JsonResponse
    {
        $siteVisit = $this->siteVisitService->createSiteVisit($request->validated());

        return response()->json($siteVisit, 201);
    }

    public function show(SiteVisit $siteVisit): JsonResponse
    {
        $this->authorizeOrganization($siteVisit);
        
        return response()->json($siteVisit->load(['client', 'project', 'visitor']));
    }

    public function update(SiteVisitUpdateRequest $request, SiteVisit $siteVisit): JsonResponse
    {
        $this->authorizeOrganization($siteVisit);
        
        $siteVisit = $this->siteVisitService->updateSiteVisit($siteVisit, $request->validated());

        return response()->json($siteVisit);
    }

    public function destroy(SiteVisit $siteVisit): JsonResponse
    {
        $this->authorizeOrganization($siteVisit);
        
        $this->siteVisitService->deleteSiteVisit($siteVisit);

        return response()->json(['message' => 'Site visit deleted successfully']);
    }

    private function authorizeOrganization(SiteVisit $siteVisit): void
    {
        $organizationId = session('current_organization_id');
        
        if ($siteVisit->organization_id !== $organizationId) {
            abort(403, 'Access denied');
        }
    }
}