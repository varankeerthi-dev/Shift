import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useClientMeeting, useCreateClientMeeting, useUpdateClientMeeting } from '@/modules/client-meetings/hooks/useClientMeetings'
import { useClients } from '@/modules/clients/hooks/useClients'
import { useAuth } from '@/hooks/useAuth'

export default function ClientMeetingFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)
  
  const [formData, setFormData] = useState({
    client_id: '',
    meeting_title: '',
    meeting_type: 'discussion',
    meeting_date: '',
    meeting_time: '',
    location: '',
    agenda: '',
    organized_by: '',
    status: 'scheduled',
    notes: '',
    outcome: '',
    follow_up_required: false,
    follow_up_date: '',
  })

  const { data: meetingData, isLoading: meetingLoading } = useClientMeeting(id || '')
  const { data: clientsData } = useClients({ per_page: 100 })
  const { user } = useAuth()
  
  const createMeeting = useCreateClientMeeting()
  const updateMeeting = useUpdateClientMeeting()

  useEffect(() => {
    if (meetingData && isEdit) {
      setFormData({
        client_id: meetingData.client_id || '',
        meeting_title: meetingData.meeting_title || '',
        meeting_type: meetingData.meeting_type || 'discussion',
        meeting_date: meetingData.meeting_date?.split('T')[0] || '',
        meeting_time: meetingData.meeting_time || '',
        location: meetingData.location || '',
        agenda: meetingData.agenda || '',
        organized_by: meetingData.organized_by || '',
        status: meetingData.status || 'scheduled',
        notes: meetingData.notes || '',
        outcome: meetingData.outcome || '',
        follow_up_required: meetingData.follow_up_required || false,
        follow_up_date: meetingData.follow_up_date?.split('T')[0] || '',
      })
    }
  }, [meetingData, isEdit])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      if (isEdit && id) {
        await updateMeeting.mutateAsync({ id, data: formData })
      } else {
        await createMeeting.mutateAsync(formData)
      }
      navigate('/client-meetings')
    } catch (error) {}
  }

  if (isEdit && meetingLoading) {
    return <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/client-meetings')}><ArrowLeft className="h-5 w-5" /></Button>
        <div><h1 className="text-3xl font-bold">{isEdit ? 'Edit Meeting' : 'Schedule Meeting'}</h1><p className="text-muted-foreground">{isEdit ? 'Update meeting details' : 'Schedule a new client meeting'}</p></div>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader><CardTitle>Meeting Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Meeting Title</Label>
                <Input value={formData.meeting_title} onChange={(e) => setFormData({ ...formData, meeting_title: e.target.value })} placeholder="Enter meeting title" required />
              </div>
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
                <Label>Meeting Type</Label>
                <Select value={formData.meeting_type} onValueChange={(v) => setFormData({ ...formData, meeting_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Initial</SelectItem>
                    <SelectItem value="follow_up">Follow Up</SelectItem>
                    <SelectItem value="discussion">Discussion</SelectItem>
                    <SelectItem value="presentation">Presentation</SelectItem>
                    <SelectItem value="negotiation">Negotiation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Meeting Date</Label>
                  <Input type="date" value={formData.meeting_date} onChange={(e) => setFormData({ ...formData, meeting_date: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Meeting Time</Label>
                  <Input type="time" value={formData.meeting_time} onChange={(e) => setFormData({ ...formData, meeting_time: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Location</Label>
                <Input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} placeholder="Enter location" />
              </div>
              <div className="space-y-2">
                <Label>Agenda</Label>
                <Input value={formData.agenda} onChange={(e) => setFormData({ ...formData, agenda: e.target.value })} placeholder="Meeting agenda" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Organized By</Label>
                <Input value={formData.organized_by || user?.name || ''} onChange={(e) => setFormData({ ...formData, organized_by: e.target.value })} placeholder="Organizer name" />
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
                    <SelectItem value="rescheduled">Rescheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Input value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} placeholder="Additional notes" />
              </div>
              <div className="space-y-2">
                <Label>Outcome</Label>
                <Input value={formData.outcome} onChange={(e) => setFormData({ ...formData, outcome: e.target.value })} placeholder="Meeting outcome" />
              </div>
              <div className="flex items-center gap-2">
                <input 
                  type="checkbox" 
                  id="follow_up_required" 
                  checked={formData.follow_up_required}
                  onChange={(e) => setFormData({ ...formData, follow_up_required: e.target.checked })}
                  className="h-4 w-4"
                />
                <Label htmlFor="follow_up_required">Follow-up Required</Label>
              </div>
              {formData.follow_up_required && (
                <div className="space-y-2">
                  <Label>Follow-up Date</Label>
                  <Input type="date" value={formData.follow_up_date} onChange={(e) => setFormData({ ...formData, follow_up_date: e.target.value })} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/client-meetings')}>Cancel</Button>
          <Button type="submit" disabled={createMeeting.isPending || updateMeeting.isPending}>
            <Save className="mr-2 h-4 w-4" />{createMeeting.isPending || updateMeeting.isPending ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </form>
    </div>
  )
}