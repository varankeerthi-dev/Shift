import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { invoicesApi } from '@/modules/invoices/api/invoicesApi'
import { useToast } from '@/hooks/use-toast'

export function useInvoices(filters?: { search?: string; status?: string; client_id?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['invoices', filters],
    queryFn: () => invoicesApi.getInvoices(filters),
  })
}

export function useInvoice(id: string) {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: () => invoicesApi.getInvoice(id),
    enabled: !!id,
  })
}

export function useCreateInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: invoicesApi.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: 'Success',
        description: 'Invoice created successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create invoice',
      })
    },
  })
}

export function useUpdateInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Invoice> }) =>
      invoicesApi.updateInvoice(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      queryClient.invalidateQueries({ queryKey: ['invoice', id] })
      toast({
        title: 'Success',
        description: 'Invoice updated successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update invoice',
      })
    },
  })
}

export function useDeleteInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: invoicesApi.deleteInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete invoice',
      })
    },
  })
}

export function useSendInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: invoicesApi.sendInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: 'Success',
        description: 'Invoice sent successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send invoice',
      })
    },
  })
}

export function useMarkAsPaid() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: invoicesApi.markAsPaid,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: 'Success',
        description: 'Invoice marked as paid',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update invoice',
      })
    },
  })
}
