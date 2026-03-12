import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Search, Folder, Pencil, Trash2, MoreHorizontal, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useProjects, useDeleteProject } from '@/modules/projects/hooks/useProjects'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  planning: 'bg-gray-100 text-gray-800',
  in_progress: 'bg-blue-100 text-blue-800',
  on_hold: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const navigate = useNavigate()
  const deleteProject = useDeleteProject()

  const { data, isLoading } = useProjects({ search: search || undefined, status: status || undefined, per_page: 10, page })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try { await deleteProject.mutateAsync(id) } catch (e) { /* handled */ }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Projects</h1>
          <p className="text-muted-foreground">Manage your projects</p>
        </div>
        <Button asChild><Link to="/projects/new"><Plus className="mr-2 h-4 w-4" />Create Project</Link></Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Projects</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search projects..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="on_hold">On Hold</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Budget</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((project) => (
                    <TableRow key={project.id}>
                      <TableCell className="font-medium">{project.name}</TableCell>
                      <TableCell>{project.client?.name || '-'}</TableCell>
                      <TableCell>{project.budget ? formatCurrency(project.budget) : '-'}</TableCell>
                      <TableCell><div className="flex items-center gap-2"><div className="w-16 h-2 bg-gray-200 rounded-full"><div className="h-2 bg-primary rounded-full" style={{ width: `${project.progress}%` }} /></div><span className="text-xs">{project.progress}%</span></div></TableCell>
                      <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[project.status]}`}>{project.status.replace('_', ' ')}</span></TableCell>
                      <TableCell>{project.start_date ? formatDate(project.start_date) : '-'}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild><Link to={`/projects/${project.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
                            <DropdownMenuItem asChild><Link to={`/projects/${project.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDelete(project.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {data?.data?.length === 0 && <div className="flex flex-col items-center justify-center h-32 gap-4 text-muted-foreground"><Folder className="h-8 w-8" /><p>No projects found</p></div>}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
