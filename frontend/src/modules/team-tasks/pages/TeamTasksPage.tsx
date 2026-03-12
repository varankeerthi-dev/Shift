import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, CheckSquare, MoreHorizontal, Trash2, Eye, Pencil, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useTeamTasks, useDeleteTeamTask } from '@/modules/team-tasks/hooks/useTeamTasks'
import { formatDate } from '@/lib/utils'

const priorityColors: Record<string, string> = { low: 'bg-gray-100 text-gray-800', medium: 'bg-blue-100 text-blue-800', high: 'bg-orange-100 text-orange-800', urgent: 'bg-red-100 text-red-800' }
const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', in_progress: 'bg-blue-100 text-blue-800', completed: 'bg-green-100 text-green-800', cancelled: 'bg-gray-100 text-gray-800' }

export default function TeamTasksPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')
  const [page, setPage] = useState(1)
  const deleteTask = useDeleteTeamTask()
  const { data, isLoading } = useTeamTasks({ search: search || undefined, status: status || undefined, priority: priority || undefined, per_page: 10, page })
  const handleDelete = async (id: string) => { if (confirm('Delete this task?')) { try { await deleteTask.mutateAsync(id) } catch (e) {} } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Team Tasks</h1><p className="text-muted-foreground">Manage team tasks</p></div><Button asChild><Link to="/team-tasks/new"><Plus className="mr-2 h-4 w-4" />Create Task</Link></Button></div>
      <div className="grid gap-4 md:grid-cols-4">
        {['pending', 'in_progress', 'completed', 'cancelled'].map((s) => (<Card key={s} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatus(status === s ? '' : s)}><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground capitalize">{s.replace('_', ' ')}</p><p className="text-2xl font-bold">{data?.data?.filter((t) => t.status === s).length || 0}</p></div><CheckSquare className={`h-8 w-8 ${statusColors[s].split(' ')[1]} opacity-50`} /></div></CardContent></Card>))}
      </div>
      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle>All Tasks</CardTitle><div className="flex gap-2"><div className="relative w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div><select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All Status</option><option value="pending">Pending</option><option value="in_progress">In Progress</option><option value="completed">Completed</option></select><select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={priority} onChange={(e) => setPriority(e.target.value)}><option value="">All Priority</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option></select></div></div></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
            <Table><TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Project</TableHead><TableHead>Assigned To</TableHead><TableHead>Due Date</TableHead><TableHead>Priority</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{data?.data?.map((task) => (<TableRow key={task.id}><TableCell className="font-medium">{task.title}</TableCell><TableCell>{task.project?.name || '-'}</TableCell><TableCell>{task.assignee?.name || '-'}</TableCell><TableCell>{task.due_date ? formatDate(task.due_date) : '-'}</TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${priorityColors[task.priority]}`}>{task.priority}</span></TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[task.status]}`}>{task.status.replace('_', ' ')}</span></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/team-tasks/${task.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem><DropdownMenuItem onClick={() => handleDelete(task.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table>)}
        </CardContent>
      </Card>
    </div>
  )
}
