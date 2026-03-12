import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { settingsApi } from '@/modules/settings/api/settingsApi'
import { useToast } from '@/hooks/use-toast'
import { TemplateSettings } from '@/types'

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: () => settingsApi.getSettings() })
}

export function useDocumentSettings(type: string) {
  return useQuery({ queryKey: ['document-settings', type], queryFn: () => settingsApi.getDocumentSettings(type), enabled: !!type })
}

export function useUpdateDocumentSettings() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ type, settings }: { type: string; settings: Record<string, unknown> }) => settingsApi.updateDocumentSettings(type, settings),
    onSuccess: (_, { type }) => { queryClient.invalidateQueries({ queryKey: ['document-settings', type] }); toast({ title: 'Success', description: 'Settings updated' }) },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function useTemplateSettings(type: string) {
  return useQuery({ 
    queryKey: ['template-settings', type], 
    queryFn: () => settingsApi.getTemplateSettings(type), 
    enabled: !!type 
  })
}

export function useUpdateTemplateSettings() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ type, selected_template_id, default_template_id }: { type: string; selected_template_id?: string; default_template_id?: string }) => 
      settingsApi.updateTemplateSettings(type, { selected_template_id, default_template_id }),
    onSuccess: (_, { type }) => { 
      queryClient.invalidateQueries({ queryKey: ['template-settings', type] }); 
      toast({ title: 'Success', description: 'Template settings updated' }) 
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed' })
    },
  })
}

export function usePreviewTemplate() {
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ type, templateId }: { type: string; templateId: string }) => settingsApi.previewTemplate(type, templateId),
    onSuccess: (data) => {
      if (data.preview_url) {
        window.open(data.preview_url, '_blank')
      } else {
        toast({ title: 'Preview', description: 'Preview opened in new tab' })
      }
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to generate preview' })
    },
  })
}

export function useUploadTemplate() {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  return useMutation({
    mutationFn: ({ type, file }: { type: string; file: File }) => settingsApi.uploadTemplate(type, file),
    onSuccess: (_, { type }) => { 
      queryClient.invalidateQueries({ queryKey: ['template-settings', type] }); 
      toast({ title: 'Success', description: 'Template uploaded successfully' }) 
    },
    onError: (error: unknown) => {
      const err = error as { response?: { data?: { message?: string } } }
      toast({ variant: 'destructive', title: 'Error', description: err.response?.data?.message || 'Failed to upload template' })
    },
  })
}