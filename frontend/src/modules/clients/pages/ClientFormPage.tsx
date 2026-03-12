import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useClient, useCreateClient, useUpdateClient } from '@/modules/clients/hooks/useClients'

const clientSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  postal_code: z.string().optional(),
  country: z.string().optional(),
  tax_number: z.string().optional(),
  notes: z.string().optional(),
  is_active: z.boolean().default(true),
})

type ClientFormData = z.infer<typeof clientSchema>

export default function ClientFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = Boolean(id)

  const { data: client, isLoading } = useClient(id || '')
  const createClient = useCreateClient()
  const updateClient = useUpdateClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      is_active: true,
    },
  })

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (isEdit && id) {
        await updateClient.mutateAsync({ id, data })
      } else {
        await createClient.mutateAsync(data)
      }
      navigate('/clients')
    } catch (error) {
      // Error handled in mutation
    }
  }

  if (isEdit && isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-3xl font-bold">{isEdit ? 'Edit Client' : 'New Client'}</h1>
        <p className="text-muted-foreground">
          {isEdit ? 'Update client information' : 'Add a new client to your database'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle>Client Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" {...register('phone')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax_number">Tax Number</Label>
                <Input id="tax_number" {...register('tax_number')} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" {...register('address')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" {...register('city')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input id="state" {...register('state')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code">Postal Code</Label>
                <Input id="postal_code" {...register('postal_code')} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input id="country" {...register('country')} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  {...register('notes')}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => navigate('/clients')}>
            Cancel
          </Button>
          <Button type="submit" disabled={createClient.isPending || updateClient.isPending}>
            {createClient.isPending || updateClient.isPending
              ? 'Saving...'
              : isEdit
              ? 'Update Client'
              : 'Create Client'}
          </Button>
        </div>
      </form>
    </div>
  )
}
