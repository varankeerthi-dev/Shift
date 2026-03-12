import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subcontractsApi } from '@/modules/subcontracts/api/subcontractsApi'
import { useToast } from '@/hooks/use-toast'

export function useSubcontracts(filters?: { search?: string; status?: string; per_page?: number }) {
  return useQuery({ queryKey: ['subcontracts', filters], queryFn: () => subcontractsApi.getSubcontracts(filters) })
}

export function useSubcontract(id: string) {
  return useQuery({ queryKey: ['subcontract', id], queryFn: () => subcontractsApi.getSubcontract(id), enabled: !!id })
}

export function useCreateSubcontract() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: subcontractsApi.createSubcontract,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcontracts'] }); toast({ title: 'Success', description: 'Subcontract created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateSubcontract() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Subcontract> }) => subcontractsApi.updateSubcontract(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcontracts'] }); toast({ title: 'Success', description: 'Subcontract updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteSubcontract() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: subcontractsApi.deleteSubcontract,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subcontracts'] }); toast({ title: 'Success', description: 'Subcontract deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}
