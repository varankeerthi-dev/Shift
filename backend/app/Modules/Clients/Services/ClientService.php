<?php

namespace App\Modules\Clients\Services;

use App\Modules\Clients\Models\Client;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\LengthAwarePaginator;

class ClientService
{
    public function getClients(?string $search = null, ?bool $isActive = null, int $perPage = 15): LengthAwarePaginator
    {
        $organizationId = $this->getCurrentOrganizationId();
        
        $query = Client::where('organization_id', $organizationId)
            ->when($search, fn($q) => $q->where('name', 'ilike', "%{$search}%")
                ->orWhere('email', 'ilike', "%{$search}%")
                ->orWhere('phone', 'ilike', "%{$search}%"))
            ->when(!is_null($isActive), fn($q) => $q->where('is_active', $isActive))
            ->orderBy('name');

        return $query->paginate($perPage);
    }

    public function createClient(array $data): Client
    {
        $organizationId = $this->getCurrentOrganizationId();
        
        return Client::create([
            ...$data,
            'organization_id' => $organizationId
        ]);
    }

    public function updateClient(Client $client, array $data): Client
    {
        $client->update($data);
        return $client->fresh();
    }

    public function deleteClient(Client $client): void
    {
        $client->delete();
    }

    public function getActiveClients(): \Illuminate\Database\Eloquent\Collection
    {
        $organizationId = $this->getCurrentOrganizationId();
        
        return Client::where('organization_id', $organizationId)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    private function getCurrentOrganizationId(): string
    {
        $organizationId = session('current_organization_id');
        
        if (!$organizationId) {
            $user = Auth::user();
            $organizationId = $user?->organizations()->first()?->id;
            session(['current_organization_id' => $organizationId]);
        }

        return $organizationId;
    }
}
