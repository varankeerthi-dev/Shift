import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, Truck, MoreHorizontal, Trash2, Eye, Pencil } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useDeliveryChallans, useDeleteDeliveryChallan } from '@/modules/delivery-challans/hooks/useDeliveryChallans'
import { formatDate } from '@/lib/utils'

const statusColors: Record<string, string> = { pending: 'bg-yellow-100 text-yellow-800', dispatched: 'bg-blue-100 text-blue-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-gray-100 text-gray-800' }

export default function DeliveryChallansPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const deleteChallan = useDeleteDeliveryChallan()
  const { data, isLoading } = useDeliveryChallans({ search: search || undefined, status: status || undefined, per_page: 10, page })
  const handleDelete = async (id: string) => { if (confirm('Delete this challan?')) { try { await deleteChallan.mutateAsync(id) } catch (e) {} } }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Delivery Challans</h1><p className="text-muted-foreground">Manage delivery challans</p></div><Button asChild><Link to="/delivery-challans/new"><Plus className="mr-2 h-4 w-4" />Create Challan</Link></Button></div>
      <div className="grid gap-4 md:grid-cols-4">
        {['pending', 'dispatched', 'delivered', 'cancelled'].map((s) => (<Card key={s} className="cursor-pointer hover:bg-muted/50" onClick={() => setStatus(status === s ? '' : s)}><CardContent className="pt-6"><div className="flex items-center justify-between"><div><p className="text-sm text-muted-foreground capitalize">{s}</p><p className="text-2xl font-bold">{data?.data?.filter((c) => c.status === s).length || 0}</p></div><Truck className={`h-8 w-8 ${statusColors[s].split(' ')[1]} opacity-50`} /></div></CardContent></Card>))}
      </div>
      <Card>
        <CardHeader><div className="flex items-center justify-between"><CardTitle>All Challans</CardTitle><div className="flex gap-2"><div className="relative w-64"><Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" /></div><select className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm" value={status} onChange={(e) => setStatus(e.target.value)}><option value="">All</option><option value="pending">Pending</option><option value="dispatched">Dispatched</option><option value="delivered">Delivered</option></select></div></div></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
            <Table><TableHeader><TableRow><TableHead>Challan #</TableHead><TableHead>Client</TableHead><TableHead>Project</TableHead><TableHead>Issue Date</TableHead><TableHead>Transport</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{data?.data?.map((challan) => (<TableRow key={challan.id}><TableCell className="font-medium">{challan.challan_number}</TableCell><TableCell>{challan.client?.name || '-'}</TableCell><TableCell>{challan.project?.name || '-'}</TableCell><TableCell>{formatDate(challan.issue_date)}</TableCell><TableCell>{challan.transport_name || '-'}</TableCell><TableCell><span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[challan.status]}`}>{challan.status}</span></TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem asChild><Link to={`/delivery-challans/${challan.id}`}><Eye className="mr-2 h-4 w-4" />View</Link></DropdownMenuItem><DropdownMenuItem onClick={() => handleDelete(challan.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table>)}
        </CardContent>
      </Card>
    </div>
  )
}
