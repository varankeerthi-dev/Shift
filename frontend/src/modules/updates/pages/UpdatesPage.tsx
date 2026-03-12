import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, MapPin, Calendar, User, MoreHorizontal, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useUpdates, useDeleteUpdate } from '@/modules/updates/hooks/useUpdates'
import { formatDate } from '@/lib/utils'

const typeColors: Record<string, string> = {
  site_visit: 'bg-purple-100 text-purple-800',
  daily_update: 'bg-blue-100 text-blue-800',
  progress: 'bg-green-100 text-green-800',
  issue: 'bg-red-100 text-red-800',
}

const typeLabels: Record<string, string> = {
  site_visit: 'Site Visit',
  daily_update: 'Daily Update',
  progress: 'Progress',
  issue: 'Issue',
}

export default function UpdatesPage() {
  const [search, setSearch] = useState('')
  const [type, setType] = useState('')
  const [page, setPage] = useState(1)
  const deleteUpdate = useDeleteUpdate()

  const { data, isLoading } = useUpdates({ search: search || undefined, type: type || undefined, per_page: 10, page })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure?')) { try { await deleteUpdate.mutateAsync(id) } catch (e) { /* handled */ } }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold">Updates</h1><p className="text-muted-foreground">Site visits and daily updates</p></div>
        <Button asChild><Link to="/updates/new"><Plus className="mr-2 h-4 w-4" />Add Update</Link></Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {['site_visit', 'daily_update', 'progress', 'issue'].map((t) => (
          <Card key={t} className="cursor-pointer hover:bg-muted/50" onClick={() => setType(type === t ? '' : t)}>
            <CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground">{typeLabels[t]}</p><p className="text-2xl font-bold">{data?.data?.filter((u) => u.type === t).length || 0}</p></div><MapPin className={`h-8 w-8 ${typeColors[t].split(' ')[1]} opacity-50`} /></div></CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Updates</CardTitle>
            <div className="relative w-72"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search updates..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow><TableHead>Type</TableHead><TableHead>Title</TableHead><TableHead>Project</TableHead><TableHead>Location</TableHead><TableHead>Visited By</TableHead><TableHead>Date</TableHead><TableHead className="text-right">Actions</TableHead></TableRow>
              </TableHeader>
              <TableBody>
                {data?.data?.map((update) => (
                  <TableRow key={update.id}>
                    <TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${typeColors[update.type]}`}>{typeLabels[update.type]}</span></TableCell>
                    <TableCell className="font-medium">{update.title}</TableCell>
                    <TableCell>{update.project?.name || '-'}</TableCell>
                    <TableCell>{update.location || '-'}</TableCell>
                    <TableCell>{update.visitor?.name || '-'}</TableCell>
                    <TableCell>{update.visited_at ? formatDate(update.visited_at) : '-'}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild><Link to={`/updates/${update.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDelete(update.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
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
