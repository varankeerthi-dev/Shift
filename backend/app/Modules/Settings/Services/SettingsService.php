<?php

namespace App\Modules\Settings\Services;

use App\Modules\Settings\Models\DocumentSetting;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SettingsService
{
    protected array $templateDefaults = [
        'invoice' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'apf', 'name' => 'APF Template', 'description' => 'APF style with company branding', 'is_default' => false],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
                ['id' => 'minimal', 'name' => 'Minimal Template', 'description' => 'Simple and compact layout', 'is_default' => false],
                ['id' => 'detailed', 'name' => 'Detailed Template', 'description' => 'Comprehensive with all details', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'quotation' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'apf', 'name' => 'APF Template', 'description' => 'APF style with company branding', 'is_default' => false],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
                ['id' => 'minimal', 'name' => 'Minimal Template', 'description' => 'Simple and compact layout', 'is_default' => false],
                ['id' => 'detailed', 'name' => 'Detailed Template', 'description' => 'Comprehensive with all details', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'delivery_challan' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'apf', 'name' => 'APF Template', 'description' => 'APF style with company branding', 'is_default' => false],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
                ['id' => 'minimal', 'name' => 'Minimal Template', 'description' => 'Simple and compact layout', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'proforma_invoice' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'apf', 'name' => 'APF Template', 'description' => 'APF style with company branding', 'is_default' => false],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'credit_note' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'debit_note' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'modern', 'name' => 'Modern Template', 'description' => 'Contemporary design with highlights', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
        'project' => [
            'templates' => [
                ['id' => 'default', 'name' => 'Standard Template', 'description' => 'Clean and professional layout', 'is_default' => true],
                ['id' => 'detailed', 'name' => 'Detailed Template', 'description' => 'Comprehensive with all details', 'is_default' => false],
            ],
            'selected_template_id' => 'default',
            'default_template_id' => 'default',
        ],
    ];

    public function getTemplateSettings(string $type): array
    {
        $key = "template_settings_{$type}";
        $organizationId = session('current_organization_id');
        
        $settings = DocumentSetting::getSetting($key, $organizationId);
        
        if (!$settings) {
            return $this->templateDefaults[$type] ?? $this->templateDefaults['invoice'];
        }

        return array_merge(
            $this->templateDefaults[$type] ?? $this->templateDefaults['invoice'],
            $settings
        );
    }

    public function updateTemplateSettings(string $type, array $data): array
    {
        $key = "template_settings_{$type}";
        $organizationId = session('current_organization_id');
        
        DocumentSetting::setSetting($key, $data, 'template', $organizationId);
        
        return $this->getTemplateSettings($type);
    }

    public function previewTemplate(string $type, string $templateId): array
    {
        $baseUrl = config('app.url');
        
        return [
            'preview_url' => "{$baseUrl}/api/settings/templates/{$type}/preview-pdf?template_id={$templateId}",
        ];
    }

    public function uploadTemplate(string $type, $file): array
    {
        $organizationId = session('current_organization_id');
        $filename = sprintf('%s_%s_%s.%s', 
            $organizationId, 
            $type, 
            Str::random(8),
            $file->getClientOriginalExtension()
        );
        
        $path = $file->storeAs('templates', $filename, 'local');
        
        return [
            'success' => true,
            'path' => $path,
            'filename' => $filename,
        ];
    }

    public function getDocumentSettings(string $type): array
    {
        $key = "document_settings_{$type}";
        $organizationId = session('current_organization_id');
        
        $settings = DocumentSetting::getSetting($key, $organizationId);
        
        $defaults = match($type) {
            'invoice' => [
                'prefix' => 'INV-',
                'nextNumber' => 1,
                'dueDays' => 30,
                'taxRate' => 0,
                'autoNumber' => true,
            ],
            'quotation' => [
                'prefix' => 'QUO-',
                'nextNumber' => 1,
                'validityDays' => 30,
                'taxRate' => 0,
                'autoNumber' => true,
            ],
            'delivery_challan' => [
                'prefix' => 'DC-',
                'nextNumber' => 1,
                'taxRate' => 0,
                'autoNumber' => true,
            ],
            default => [
                'prefix' => strtoupper(substr($type, 0, 3)) . '-',
                'nextNumber' => 1,
                'autoNumber' => true,
            ],
        };

        return $settings ?? $defaults;
    }

    public function updateDocumentSettings(string $type, array $data): array
    {
        $key = "document_settings_{$type}";
        $organizationId = session('current_organization_id');
        
        DocumentSetting::setSetting($key, $data, 'document', $organizationId);
        
        return $this->getDocumentSettings($type);
    }
}