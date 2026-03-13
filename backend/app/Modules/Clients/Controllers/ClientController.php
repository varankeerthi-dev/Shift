<?php

namespace App\Modules\Clients\Controllers;

use App\Http\Controllers\Controller;
use App\Modules\Clients\Models\Client;
use App\Modules\Clients\Requests\ClientCreateRequest;
use App\Modules\Clients\Requests\ClientUpdateRequest;
use App\Modules\Clients\Services\ClientService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ClientController extends Controller
{
    public function __construct(
        private readonly ClientService $clientService
    ) {}

    public function index(Request $request): JsonResponse
    {
        $clients = $this->clientService->getClients(
            $request->get('search'),
            $request->get('is_active'),
            $request->get('per_page', 15)
        );

        return response()->json($clients);
    }

    public function store(ClientCreateRequest $request): JsonResponse
    {
        $client = $this->clientService->createClient($request->validated());

        return response()->json($client, 201);
    }

    public function show(Client $client): JsonResponse
    {
        $this->authorizeOrganization($client);
        
        return response()->json($client->load(['invoices', 'quotations']));
    }

    public function update(ClientUpdateRequest $request, Client $client): JsonResponse
    {
        $this->authorizeOrganization($client);
        
        $client = $this->clientService->updateClient($client, $request->validated());

        return response()->json($client);
    }

    public function destroy(Client $client): JsonResponse
    {
        $this->authorizeOrganization($client);
        
        $this->clientService->deleteClient($client);

        return response()->json(['message' => 'Client deleted successfully']);
    }

    private function authorizeOrganization(Client $client): void
    {
        $organizationId = session('current_organization_id');
        
        if ($client->organization_id !== $organizationId) {
            abort(403, 'Access denied');
        }
    }
}
