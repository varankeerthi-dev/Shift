<?php

namespace App\Modules\SiteVisits\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SiteVisitUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'client_id' => 'nullable|uuid|exists:clients,id',
            'project_id' => 'nullable|uuid|exists:projects,id',
            'visit_date' => 'sometimes|date',
            'visit_time' => 'nullable',
            'location' => 'nullable|string|max:255',
            'purpose' => 'nullable|string|max:255',
            'visited_by' => 'nullable|string|max:255',
            'status' => 'sometimes|in:scheduled,in_progress,completed,cancelled',
            'notes' => 'nullable|string',
            'remarks' => 'nullable|string',
            'next_action' => 'nullable|string|max:255',
            'follow_up_date' => 'nullable|date',
        ];
    }
}