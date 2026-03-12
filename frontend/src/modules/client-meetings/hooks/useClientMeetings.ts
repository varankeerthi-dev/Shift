import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { clientMeetingsApi } from '@/modules/client-meetings/api/clientMeetingsApi'
import { useToast } from '@/hooks/use-toast'

export function useClientMeetings(filters?: { search?: string; status?: string; client_id?: string; meeting_type?: string; per_page?: number; page?: number }) {
  return useQuery({ queryKey: ['client-meetings', filters], queryFn: () => clientMeetingsApi.getMeetings(filters) })
}

export function useClientMeeting(id: string) {
  return useQuery({ queryKey: ['client-meeting', id], queryFn: () => clientMeetingsApi.getMeeting(id), enabled: !!id })
}

export function useCreateClientMeeting() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: clientMeetingsApi.createMeeting,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['client-meetings'] }); toast({ title: 'Success', description: 'Meeting scheduled' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useUpdateClientMeeting() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<import('@/types').ClientMeeting> }) => clientMeetingsApi.updateMeeting(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['client-meetings'] }); toast({ title: 'Success', description: 'Meeting updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useDeleteClientMeeting() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: clientMeetingsApi.deleteMeeting,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['client-meetings'] }); toast({ title: 'Success', description: 'Meeting deleted' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}