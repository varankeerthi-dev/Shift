import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { siteVisitsApi } from '@/modules/site-visits/api/siteVisitsApi'
import { useToast } from '@/hooks/use-toast'

export function useSiteVisits(filters?: { search?: string; status?: string; client_id?: string; project_id?: string; per_page?: number; page?: number }) {
  return useQuery({ queryKey: ['site-visits', filters], queryFn: () => siteVisitsApi.getVisits(filters) })
}

export function useSiteVisit(id: string) {
  return useQuery({ queryKey: ['site-visit', id], queryFn: () => siteVisitsApi.getVisit(id), enabled: !!id })
}

export function useCreateSiteVisit() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: siteVisitsApi.createVisit,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site-visits'] }); toast({ title: 'Success', description: 'Site visit created' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateSiteVisit() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').SiteVisit> }) => siteVisitsApi.updateVisit(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site-visits'] }); toast({ title: 'Success', description: 'Site visit updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteSiteVisit() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: siteVisitsApi.deleteVisit,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['site-visits'] }); toast({ title: 'Success', description: 'Site visit deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}