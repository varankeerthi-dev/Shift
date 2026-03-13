<?php

namespace App\Modules\Settings\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Settings\Services\SettingsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    public function __construct(
        private readonly SettingsService $settingsService
    ) {}

    public function index(): JsonResponse
    {
        $organizationId = session('current_organization_id');
        
        return response()->json([
            'organization_id' => $organizationId,
        ]);
    }

    public function getDocumentSettings(Request $request, string $type): JsonResponse
    {
        $settings = $this->settingsService->getDocumentSettings($type);
        
        return response()->json($settings);
    }

    public function updateDocumentSettings(Request $request, string $type): JsonResponse
    {
        $settings = $this->settingsService->updateDocumentSettings($type, $request->all());
        
        return response()->json($settings);
    }

    public function getTemplateSettings(Request $request, string $type): JsonResponse
    {
        $settings = $this->settingsService->getTemplateSettings($type);
        
        return response()->json($settings);
    }

    public function updateTemplateSettings(Request $request, string $type): JsonResponse
    {
        $settings = $this->settingsService->updateTemplateSettings($type, $request->all());
        
        return response()->json($settings);
    }

    public function previewTemplate(Request $request, string $type): JsonResponse
    {
        $templateId = $request->get('template_id', 'default');
        
        $result = $this->settingsService->previewTemplate($type, $templateId);
        
        return response()->json($result);
    }

    public function uploadTemplate(Request $request, string $type): JsonResponse
    {
        $request->validate([
            'template' => 'required|file|mimes:html,pdf|max:5120',
        ]);
        
        $result = $this->settingsService->uploadTemplate($type, $request->file('template'));
        
        return response()->json($result);
    }
}