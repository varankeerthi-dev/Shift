<?php

namespace App\Modules\ClientMeetings\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\ClientMeetings\Models\ClientMeeting;
use App\Modules\ClientMeetings\Requests\ClientMeetingCreateRequest;
use App\Modules\ClientMeetings\Requests\ClientMeetingUpdateRequest;
use App\Modules\ClientMeetings\Services\ClientMeetingService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientMeetingController extends Controller
{
    public function __construct(
        private readonly ClientMeetingService $clientMeetingService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $meetings = $this->clientMeetingService->getMeetings(
            $request->get('search'),
            $request->get('status'),
            $request->get('client_id'),
            $request->get('meeting_type'),
            $request->get('per_page', 15)
        );

        return response()->json($meetings);
    }

    public function store(ClientMeetingCreateRequest $request): JsonResponse
    {
        $meeting = $this->clientMeetingService->createMeeting($request->validated());

        return response()->json($meeting, 201);
    }

    public function show(ClientMeeting $clientMeeting): JsonResponse
    {
        $this->authorizeOrganization($clientMeeting);
        
        return response()->json($clientMeeting->load(['client', 'organizer']));
    }

    public function update(ClientMeetingUpdateRequest $request, ClientMeeting $clientMeeting): JsonResponse
    {
        $this->authorizeOrganization($clientMeeting);
        
        $meeting = $this->clientMeetingService->updateMeeting($clientMeeting, $request->validated());

        return response()->json($meeting);
    }

    public function destroy(ClientMeeting $clientMeeting): JsonResponse
    {
        $this->authorizeOrganization($clientMeeting);
        
        $this->clientMeetingService->deleteMeeting($clientMeeting);

        return response()->json(['message' => 'Meeting deleted successfully']);
    }

    private function authorizeOrganization(ClientMeeting $clientMeeting): void
    {
        $organizationId = session('current_organization_id');
        
        if ($clientMeeting->organization_id !== $organizationId) {
            abort(403, 'Access denied');
        }
    }
}