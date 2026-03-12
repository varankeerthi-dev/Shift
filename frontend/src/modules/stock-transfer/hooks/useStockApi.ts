import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { stockApi } from '@/modules/stock-transfer/api/stockApi'
import { useToast } from '@/hooks/use-toast'

export function useWarehouses() {
  return useQuery({ queryKey: ['warehouses'], queryFn: () => stockApi.getWarehouses() })
}

export function useWarehouseStocks(warehouseId?: string) {
  return useQuery({ queryKey: ['warehouse-stocks', warehouseId], queryFn: () => stockApi.getWarehouseStocks(warehouseId) })
}

export function useStockSummary() {
  return useQuery({ queryKey: ['stock-summary'], queryFn: () => stockApi.getStockSummary() })
}

export function useCreateWarehouse() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: stockApi.createWarehouse,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['warehouses'] }); toast({ title: 'Success', description: 'Warehouse created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useStockTransfers(filters?: { search?: string; status?: string; per_page?: number }) {
  return useQuery({ queryKey: ['stock-transfers', filters], queryFn: () => stockApi.getStockTransfers(filters) })
}

export function useStockTransfer(id: string) {
  return useQuery({ queryKey: ['stock-transfer', id], queryFn: () => stockApi.getStockTransfer(id), enabled: !!id })
}

export function useCreateStockTransfer() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: stockApi.createStockTransfer,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stock-transfers'] }); toast({ title: 'Success', description: 'Stock transfer created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useApproveStockTransfer() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: stockApi.approveStockTransfer,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stock-transfers'] }); toast({ title: 'Success', description: 'Transfer approved' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useCompleteStockTransfer() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: stockApi.completeStockTransfer,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['stock-transfers'] }); queryClient.invalidateQueries({ queryKey: ['stock-summary'] }); toast({ title: 'Success', description: 'Transfer completed' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}
