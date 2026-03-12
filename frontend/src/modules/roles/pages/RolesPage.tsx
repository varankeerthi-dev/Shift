import { useState } from 'react'
import { Shield, Plus, MoreHorizontal, Trash2, Pencil, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useRoles, useCreateRole, useDeleteRole, usePermissions } from '@/modules/roles/hooks/useRoles'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const roleSchema = z.object({ name: z.string().min(2, 'Name required'), description: z.string().optional(), permissions: z.array(z.string()) })

export default function RolesPage() {
  const [open, setOpen] = useState(false)
  const { data: roles, isLoading } = useRoles()
  const { data: permissions } = usePermissions()
  const createRole = useCreateRole()
  const deleteRole = useDeleteRole()
  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm<z.infer<typeof roleSchema>>({ resolver: zodResolver(roleSchema), defaultValues: { permissions: [] } })
  const selectedPermissions = watch('permissions')

  const onSubmit = async (data: z.infer<typeof roleSchema>) => { await createRole.mutateAsync(data); setOpen(false); reset() }
  const togglePermission = (perm: string) => { const current = selectedPermissions; setValue('permissions', current.includes(perm) ? current.filter((p) => p !== perm) : [...current, perm]) }

  const modules = [...new Set(permissions?.map((p) => p.module) || [])]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between"><div><h1 className="text-3xl font-bold">Roles & Permissions</h1><p className="text-muted-foreground">Manage user roles and permissions</p></div><Button onClick={() => setOpen(true)}><Plus className="mr-2 h-4 w-4" />Create Role</Button></div>
      <Card>
        <CardHeader><CardTitle>All Roles</CardTitle></CardHeader>
        <CardContent>
          {isLoading ? <div className="flex h-64 items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div> : (
            <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Description</TableHead><TableHead>Permissions</TableHead><TableHead>Default</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>{roles?.map((role) => (<TableRow key={role.id}><TableCell className="font-medium">{role.name}</TableCell><TableCell>{role.description || '-'}</TableCell><TableCell><span className="text-sm text-muted-foreground">{role.permissions?.length || 0} permissions</span></TableCell><TableCell>{role.is_default && <Check className="h-4 w-4 text-green-500" />}</TableCell><TableCell className="text-right"><DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuItem><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem><DropdownMenuItem onClick={() => deleteRole.mutate(role.id)} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem></DropdownMenuContent></DropdownMenu></TableCell></TableRow>))}</TableBody></Table>)}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader><DialogTitle>Create New Role</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2"><div className="space-y-2"><Label>Role Name</Label><Input {...register('name')} /><p className="text-sm text-red-500">{errors.name?.message}</p></div><div className="space-y-2"><Label>Description</Label><Input {...register('description')} /></div></div>
            <div className="space-y-2"><Label>Permissions</Label><div className="grid gap-4 md:grid-cols-3">{modules.map((module) => (<div key={module} className="border rounded-lg p-3"><p className="font-medium mb-2 capitalize">{module}</p>{permissions?.filter((p) => p.module === module).map((p) => (<label key={p.id} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selectedPermissions.includes(p.slug)} onChange={() => togglePermission(p.slug)} />{p.name}</label>))}</div>))}</div></div>
            <DialogFooter><Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button><Button type="submit" disabled={createRole.isPending}>Create Role</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
