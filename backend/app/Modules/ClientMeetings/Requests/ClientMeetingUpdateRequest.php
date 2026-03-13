<?php

namespace App\Modules\ClientMeetings\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ClientMeetingUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'nullable|uuid|exists:clients,id',
            'meeting_title' => 'sometimes|string|max:255',
            'meeting_type' => 'sometimes|in:initial,follow_up,discussion,presentation,negotiation,other',
            'meeting_date' => 'sometimes|date',
            'meeting_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'agenda' => 'nullable|string',
            'attendees' => 'nullable|array',
            'organized_by' => 'nullable|string|max:255',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled,rescheduled',
            'notes' => 'nullable|string',
            'outcome' => 'nullable|string',
            'action_items' => 'nullable|array',
            'follow_up_required' => 'nullable|boolean',
            'follow_up_date' => 'nullable|date',
        ];
    }
}