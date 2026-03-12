import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { deliveryChallansApi } from '@/modules/delivery-challans/api/deliveryChallansApi'
import { useToast } from '@/hooks/use-toast'

export function useDeliveryChallans(filters?: { search?: string; status?: string; per_page?: number }) {
  return useQuery({ queryKey: ['delivery-challans', filters], queryFn: () => deliveryChallansApi.getChallans(filters) })
}

export function useDeliveryChallan(id: string) {
  return useQuery({ queryKey: ['delivery-challan', id], queryFn: () => deliveryChallansApi.getChallan(id), enabled: !!id })
}

export function useCreateDeliveryChallan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deliveryChallansApi.createChallan,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['delivery-challans'] }); toast({ title: 'Success', description: 'Challan created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateDeliveryChallan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').DeliveryChallan> }) => deliveryChallansApi.updateChallan(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['delivery-challans'] }); toast({ title: 'Success', description: 'Challan updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteDeliveryChallan() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: deliveryChallansApi.deleteChallan,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['delivery-challans'] }); toast({ title: 'Success', description: 'Challan deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}
