import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Briefcase, MoreHorizontal, Trash2, Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useSubcontracts, useDeleteSubcontract } from '@/modules/subcontracts/hooks/useSubcontracts'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = { draft: 'bg-gray-100 text-gray-800', active: 'bg-green-100 text-green-800', completed: 'bg-blue-100 text-blue-800', terminated: 'bg-red-100 text-red-800' }

export default function SubcontractsPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const deleteSubcontract = useDeleteSubcontract()
  const { data, isLoading } = useSubcontracts({ search: search || undefined, status: status || undefined, per_page: 10, page })
  const handleDelete = async (id: string) => { if (confirm('Delete this subcontract?')) { try { await deleteSubcontract.mutateAsync(id) } catch (e) {} } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Subcontracts</h1><p className="text-muted-foreground">Manage subcontracts</p></div><Button asChild><Link to="/subcontracts/new"><Plus className="mr-2 h-4 w-4" />Create Subcontract</Link></Button></div>
      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle>All Subcontracts</CardTitle><div className="flex gap-2"><div className="relative w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div><select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option value="draft">Draft</option><option value="active">Active</option><option value="completed">Completed</option></select></div></div></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
            <Table><TableHeader><TableRow><TableHead>Contractor</TableHead><TableHead>Project</TableHead><TableHead>Value</TableHead><TableHead>Start</TableHead><TableHead>End</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{data?.data?.map((sc) => (<TableRow key={sc.id}><TableCell className="font-medium">{sc.contractor_name}</TableCell><TableCell>{sc.project?.name || '-'}</TableCell><TableCell>{sc.contract_value ? formatCurrency(sc.contract_value) : '-'}</TableCell><TableCell>{sc.start_date ? formatDate(sc.start_date) : '-'}</TableCell><TableCell>{sc.end_date ? formatDate(sc.end_date) : '-'}</TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[sc.status]}`}>{sc.status}</span></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/subcontracts/${sc.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem><DropdownMenuItem onClick={() => handleDelete(sc.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table>)}
        </CardContent>
      </Card>
    </div>
  )
}
