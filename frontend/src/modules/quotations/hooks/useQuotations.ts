import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { quotationsApi } from '@/modules/quotations/api/quotationsApi'
import { useToast } from '@/hooks/use-toast'

export function useQuotations(filters?: { search?: string; status?: string; client_id?: string; per_page?: number }) {
  return useQuery({
    queryKey: ['quotations', filters],
    queryFn: () => quotationsApi.getQuotations(filters),
  })
}

export function useQuotation(id: string) {
  return useQuery({
    queryKey: ['quotation', id],
    queryFn: () => quotationsApi.getQuotation(id),
    enabled: !!id,
  })
}

export function useCreateQuotation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: quotationsApi.createQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      toast({
        title: 'Success',
        description: 'Quotation created successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to create quotation',
      })
    },
  })
}

export function useUpdateQuotation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').Quotation> }) =>
      quotationsApi.updateQuotation(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['quotation', id] })
      toast({
        title: 'Success',
        description: 'Quotation updated successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to update quotation',
      })
    },
  })
}

export function useDeleteQuotation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: quotationsApi.deleteQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      toast({
        title: 'Success',
        description: 'Quotation deleted successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to delete quotation',
      })
    },
  })
}

export function useSendQuotation() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: quotationsApi.sendQuotation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      toast({
        title: 'Success',
        description: 'Quotation sent successfully',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to send quotation',
      })
    },
  })
}

export function useConvertToInvoice() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  return useMutation({
    mutationFn: quotationsApi.convertToInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['quotations'] })
      queryClient.invalidateQueries({ queryKey: ['invoices'] })
      toast({
        title: 'Success',
        description: 'Quotation converted to invoice',
      })
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err.response?.data?.message || 'Failed to convert quotation',
      })
    },
  })
}
