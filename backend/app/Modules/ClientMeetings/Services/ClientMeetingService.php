<?php

namespace App\Modules\ClientMeetings\Services;

use App\Modules\ClientMeetings\Models\ClientMeeting;

class ClientMeetingService
{
    public function getMeetings(?string $search = null, ?string $status = null, ?string $clientId = null, ?string $meetingType = null, int $perPage = 15)
    {
        $organizationId = session('current_organization_id');
        
        $query = ClientMeeting::where('organization_id', $organizationId)
            ->with(['client', 'organizer'])
            ->orderBy('meeting_date', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('meeting_title', 'like', "%{$search}%")
                  ->orWhere('location', 'like', "%{$search}%")
                  ->orWhere('agenda', 'like', "%{$search}%");
            });
        }

        if ($status) {
            $query->where('status', $status);
        }

        if ($clientId) {
            $query->where('client_id', $clientId);
        }

        if ($meetingType) {
            $query->where('meeting_type', $meetingType);
        }

        return $query->paginate($perPage);
    }

    public function createMeeting(array $data): ClientMeeting
    {
        $organizationId = session('current_organization_id');
        
        return ClientMeeting::create([
            ...$data,
            'organization_id' => $organizationId,
        ]);
    }

    public function updateMeeting(ClientMeeting $meeting, array $data): ClientMeeting
    {
        $meeting->update($data);
        
        return $meeting->fresh(['client', 'organizer']);
    }

    public function deleteMeeting(ClientMeeting $meeting): void
    {
        $meeting->delete();
    }
}