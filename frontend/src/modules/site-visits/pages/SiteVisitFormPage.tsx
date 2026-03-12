import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useSiteVisit, useCreateSiteVisit, useUpdateSiteVisit } from '@/modules/site-visits/hooks/useSiteVisits'
import { useClients } from '@/modules/clients/hooks/useClients'
import { useProjects } from '@/modules/projects/hooks/useProjects'
import { useAuth } from '@/hooks/useAuth'

export default function SiteVisitFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    client_id: '',
    project_id: '',
    visit_date: '',
    visit_time: '',
    location: '',
    purpose: '',
    visited_by: '',
    status: 'scheduled',
    notes: '',
    remarks: '',
    next_action: '',
    follow_up_date: '',
  })

  const { data: visitData, isLoading: visitLoading } = useSiteVisit(id || '')
  const { data: clientsData } = useClients({ per_page: 100 })
  const { data: projectsData } = useProjects({ per_page: 100 })
  const { user } = useAuth()
  
  const createVisit = useCreateSiteVisit()
  const updateVisit = useUpdateSiteVisit()

  useEffect(() => {
    if (visitData && isEdit) {
      setFormData({
        client_id: visitData.client_id || '',
        project_id: visitData.project_id || '',
        visit_date: visitData.visit_date?.split('T')[0] || '',
        visit_time: visitData.visit_time || '',
        location: visitData.location || '',
        purpose: visitData.purpose || '',
        visited_by: visitData.visited_by || '',
        status: visitData.status || 'scheduled',
        notes: visitData.notes || '',
        remarks: visitData.remarks || '',
        next_action: visitData.next_action || '',
        follow_up_date: visitData.follow_up_date?.split('T')[0] || '',
      })
    }
  }, [visitData, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateVisit.mutateAsync({ id, data: formData })
      } else {
        await createVisit.mutateAsync(formData)
      }
      navigate('/site-visits')
    } catch (error) {}
  }

  if (isEdit && visitLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/site-visits')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-3xl font-bold">{isEdit ? 'Edit Site Visit' : 'Schedule Site Visit'}</h1><p className="text-muted-foreground">{isEdit ? 'Update site visit details' : 'Create a new site visit'}</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Visit Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Client</Label>
                <Select value={formData.client_id} onValueChange={(v) => setFormData({ ...formData, client_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select client" /></SelectTrigger>
                  <SelectContent>
                    {clientsData?.data?.map((client) => (<SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Project</Label>
                <Select value={formData.project_id} onValueChange={(v) => setFormData({ ...formData, project_id: v })}>
                  <SelectTrigger><SelectValue placeholder="Select project" /></SelectTrigger>
                  <SelectContent>
                    {projectsData?.data?.map((project) => (<SelectItem key={project.id} value={project.id}>{project.name}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Visit Date</Label>
                  <Input type="date" value={formData.visit_date} onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Visit Time</Label>
                  <Input type="time" value={formData.visit_time} onChange={(e) => setFormData({ ...formData, visit_time: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label>Purpose</Label>
                <Input value={formData.purpose} onChange={(e) => setFormData({ ...formData, purpose: e.target.value })} placeholder="Visit purpose" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Visited By</Label>
                <Input value={formData.visited_by || user?.name || ''} onChange={(e) => setFormData({ ...formData, visited_by: e.target.value })} placeholder="Enter visitor name" />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="in_progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes" />
              </div>
              <div className="space-y-2">
                <Label>Remarks</Label>
                <Input value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} placeholder="Remarks" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Next Action</Label>
                  <Input value={formData.next_action} onChange={(e) => setFormData({ ...formData, next_action: e.target.value })} placeholder="Next action" />
                </div>
                <div className="space-y-2">
                  <Label>Follow-up Date</Label>
                  <Input type="date" value={formData.follow_up_date} onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/site-visits')}>Cancel</Button>
          <Button type="submit" disabled={createVisit.isPending || updateVisit.isPending}>
            <Save className="mr-2 h-4 w-4" />{createVisit.isPending || updateVisit.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}