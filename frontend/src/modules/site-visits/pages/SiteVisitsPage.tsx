import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin, MoreHorizontal, Trash2, Eye, Pencil, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSiteVisits, useDeleteSiteVisit } from '@/modules/site-visits/hooks/useSiteVisits'
import { formatDate } from '@/lib/utils'

const statusColors: Record<string, string> = { 
  scheduled: 'bg-blue-100 text-blue-800', 
  in_progress: 'bg-yellow-100 text-yellow-800', 
  completed: 'bg-green-100 text-green-800', 
  cancelled: 'bg-gray-100 text-gray-800' 
}

export default function SiteVisitsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const deleteVisit = useDeleteSiteVisit()
  const { data, isLoading } = useSiteVisits({ search: search || undefined, status: status || undefined, per_page: 10, page })
  const handleDelete = async (id: string) => { if (confirm('Delete this site visit?')) { try { await deleteVisit.mutateAsync(id) } catch (e) {} } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Site Visits</h1>
          <p className="text-muted-foreground">Manage site visits</p>
        </div>
        <Button asChild>
          <Link to="/site-visits/new"><Plus className="mr-2 h-4 w-4" />Schedule Visit</Link>
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-4">
        {['scheduled', 'in_progress', 'completed', 'cancelled'].map((s) => (
          <Card key={s} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatus(status === s ? '' : s)}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground capitalize">{s.replace('_', ' ')}</p>
                  <p className="text-2xl font-bold">{data?.data?.filter((v) => v.status === s).length || 0}</p>
                </div>
                <MapPin className={`h-8 w-8 ${statusColors[s].split(' ')[1]} opacity-50`} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Site Visits</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
              </div>
              <select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Visited By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{visit.visit_date ? formatDate(visit.visit_date) : '-'}</TableCell>
                    <TableCell>{visit.client?.name || '-'}</TableCell>
                    <TableCell>{visit.project?.name || '-'}</TableCell>
                    <TableCell>{visit.location || '-'}</TableCell>
                    <TableCell>{visit.purpose || '-'}</TableCell>
                    <TableCell>{visit.visitor?.name || '-'}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[visit.status]}`}>
                        {visit.status.replace('_', ' ')}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/site-visits/${visit.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
                          <DropdownMenuItem asChild><Link to={`/site-visits/${visit.id}/edit`}><Pencil className="mr-2 h-4 w-4" />Edit</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(visit.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}