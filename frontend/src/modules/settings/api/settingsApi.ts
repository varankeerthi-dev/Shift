import api from '@/services/api'
import { DocumentSetting, TemplateSettings } from '@/types'

export const settingsApi = {
  getSettings: async (): Promise<DocumentSetting[]> => {
    const { data } = await api.get<DocumentSetting[]>('/settings')
    return data
  },
  getSetting: async (key: string): Promise<DocumentSetting> => {
    const { data } = await api.get<DocumentSetting>(`/settings/${key}`)
    return data
  },
  updateSetting: async (key: string, value: Record<string, unknown>): Promise<DocumentSetting> => {
    const { data } = await api.put<DocumentSetting>(`/settings/${key}`, { value })
    return data
  },
  getDocumentSettings: async (type: string): Promise<Record<string, unknown>> => {
    const { data } = await api.get<Record<string, unknown>>(`/settings/document/${type}`)
    return data
  },
  updateDocumentSettings: async (type: string, settings: Record<string, unknown>): Promise<void> => {
    await api.put(`/settings/document/${type}`, settings)
  },
  getTemplateSettings: async (type: string): Promise<TemplateSettings> => {
    const { data } = await api.get<TemplateSettings>(`/settings/templates/${type}`)
    return data
  },
  updateTemplateSettings: async (type: string, settings: { selected_template_id?: string; default_template_id?: string }): Promise<void> => {
    await api.put(`/settings/templates/${type}`, settings)
  },
  previewTemplate: async (type: string, templateId: string): Promise<{ preview_url: string }> => {
    const { data } = await api.get<{ preview_url: string }>(`/settings/templates/${type}/preview`, { 
      params: { template_id: templateId },
      responseType: 'blob'
    })
    return data as unknown as { preview_url: string }
  },
  uploadTemplate: async (type: string, file: File): Promise<{ success: boolean }> => {
    const formData = new FormData()
    formData.append('template', file)
    const { data } = await api.post<{ success: boolean }>(`/settings/templates/${type}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    return data
  },
}