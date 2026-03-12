import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search, FileText, Send, Check, MoreHorizontal, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useInvoices, useDeleteInvoice, useSendInvoice, useMarkAsPaid } from '@/modules/invoices/hooks/useInvoices'
import { formatDate, formatCurrency } from '@/lib/utils'

const statusColors: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-800',
  sent: 'bg-blue-100 text-blue-800',
  viewed: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  partial: 'bg-orange-100 text-orange-800',
  overdue: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-100 text-gray-500',
}

export default function InvoicesPage() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [page, setPage] = useState(1)
  const deleteInvoice = useDeleteInvoice()
  const sendInvoice = useSendInvoice()
  const markAsPaid = useMarkAsPaid()

  const { data, isLoading } = useInvoices({ 
    search: search || undefined, 
    status: status || undefined,
    per_page: 10,
    page 
  })

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this invoice?')) {
      try {
        await deleteInvoice.mutateAsync(id)
      } catch (error) {
        // Error handled in mutation
      }
    }
  }

  const handleSend = async (id: string) => {
    try {
      await sendInvoice.mutateAsync(id)
    } catch (error) {
      // Error handled in mutation
    }
  }

  const handleMarkPaid = async (id: string) => {
    try {
      await markAsPaid.mutateAsync(id)
    } catch (error) {
      // Error handled in mutation
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">Manage your invoices</p>
        </div>
        <Button asChild>
          <Link to="/invoices/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Invoice
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Invoices</CardTitle>
            <div className="flex gap-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search invoices..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <select
                className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="draft">Draft</option>
                <option value="sent">Sent</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="overdue">Overdue</option>
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
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Issue Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data?.data?.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                      <TableCell>{invoice.client?.name || '-'}</TableCell>
                      <TableCell>{formatDate(invoice.issue_date)}</TableCell>
                      <TableCell>{formatDate(invoice.due_date)}</TableCell>
                      <TableCell>{formatCurrency(invoice.total)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[invoice.status]}`}>
                          {invoice.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link to={`/invoices/${invoice.id}`}>
                                <FileText className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            {invoice.status === 'draft' && (
                              <DropdownMenuItem onClick={() => handleSend(invoice.id)}>
                                <Send className="mr-2 h-4 w-4" />
                                Send
                              </DropdownMenuItem>
                            )}
                            {(invoice.status === 'sent' || invoice.status === 'partial') && (
                              <DropdownMenuItem onClick={() => handleMarkPaid(invoice.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                Mark as Paid
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(invoice.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {data?.data?.length === 0 && (
                <div className="flex flex-col items-center justify-center h-32 gap-4 text-muted-foreground">
                  <FileText className="h-8 w-8" />
                  <p>No invoices found</p>
                </div>
              )}

              {data && data.last_page > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Showing {((data.current_page - 1) * data.per_page) + 1} to{' '}
                    {Math.min(data.current_page * data.per_page, data.total)} of{' '}
                    {data.total} results
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setPage(page - 1)} disabled={page === 1}>
                      Previous
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setPage(page + 1)} disabled={page === data.last_page}>
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
