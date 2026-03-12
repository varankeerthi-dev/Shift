import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientsApi } from '@/modules/clients/api/clientsApi'
import { useToast } from '@/hooks/use-toast'

export function useClients(filters?: { search?: string; is_active?: boolean; per_page?: number }) {
  return useQuery({
    queryKey: ['clients', filters],
    queryFn: () => clientsApi.getClients(filters),
  })
}

export function useClient(id: string) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => clientsApi.getClient(id),
    enabled: !!id,
  })
}

export function useActiveClients() {
  return useQuery({
    queryKey: ['clients', 'active'],
    queryFn: () => clientsApi.getActiveClients(),
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: clientsApi.createClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast({
        title: 'Success',
        description: 'Client created successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create client',
      })
    },
  })
}

export function useUpdateClient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Client> }) =>
      clientsApi.updateClient(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', id] })
      toast({
        title: 'Success',
        description: 'Client updated successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update client',
      })
    },
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: clientsApi.deleteClient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      toast({
        title: 'Success',
        description: 'Client deleted successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete client',
      })
    },
  })
}
