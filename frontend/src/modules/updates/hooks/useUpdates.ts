import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { updatesApi } from '@/modules/updates/api/updatesApi'
import { useToast } from '@/hooks/use-toast'

export function useUpdates(filters?: { search?: string; type?: string; project_id?: string; per_page?: number }) {
  return useQuery({ queryKey: ['updates', filters], queryFn: () => updatesApi.getUpdates(filters) })
}

export function useUpdate(id: string) {
  return useQuery({ queryKey: ['update', id], queryFn: () => updatesApi.getUpdate(id), enabled: !!id })
}

export function useCreateUpdate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: updatesApi.createUpdate,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['updates'] }); toast({ title: 'Success', description: 'Update created successfully' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to create update' })
    },
  })
}

export function useUpdateUpdate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').ProjectUpdate> }) => updatesApi.updateUpdate(id, data),
    onSuccess: (_, { id }) => { queryClient.invalidateQueries({ queryKey: ['updates'] }); queryClient.invalidateQueries({ queryKey: ['update', id] }); toast({ title: 'Success', description: 'Update updated successfully' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to update' })
    },
  })
}

export function useDeleteUpdate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: updatesApi.deleteUpdate,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['updates'] }); toast({ title: 'Success', description: 'Update deleted successfully' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to delete' })
    },
  })
}
