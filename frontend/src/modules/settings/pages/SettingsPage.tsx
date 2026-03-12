import { useState } from 'react'
import { FileText, Layout, Save, Percent, Eye, CheckCircle, FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useDocumentSettings, useUpdateDocumentSettings, useTemplateSettings, useUpdateTemplateSettings, usePreviewTemplate } from '@/modules/settings/hooks/useSettings'

const documentTypes = [
  { id: 'invoice', name: 'Invoice', description: 'Configure invoice layout and fields' },
  { id: 'quotation', name: 'Quotation', description: 'Configure quotation layout and fields' },
  { id: 'delivery_challan', name: 'Delivery Challan', description: 'Configure delivery challan layout' },
  { id: 'proforma_invoice', name: 'Proforma Invoice', description: 'Configure proforma invoice layout' },
  { id: 'credit_note', name: 'Credit Note', description: 'Configure credit note layout' },
  { id: 'debit_note', name: 'Debit Note', description: 'Configure debit note layout' },
  { id: 'project', name: 'Project', description: 'Configure project document layout' },
]

const availableTemplates = [
  { id: 'default', name: 'Standard Template', description: 'Clean and professional layout' },
  { id: 'apf', name: 'APF Template', description: 'APF style with company branding' },
  { id: 'modern', name: 'Modern Template', description: 'Contemporary design with highlights' },
  { id: 'minimal', name: 'Minimal Template', description: 'Simple and compact layout' },
  { id: 'detailed', name: 'Detailed Template', description: 'Comprehensive with all details' },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('document')
  const updateSettings = useUpdateDocumentSettings()

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold">Settings</h1><p className="text-muted-foreground">Configure your application settings</p></div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="document"><FileText className="mr-2 h-4 w-4" />Document Settings</TabsTrigger>
          <TabsTrigger value="discount"><Percent className="mr-2 h-4 w-4" />Discount Settings</TabsTrigger>
          <TabsTrigger value="template"><Layout className="mr-2 h-4 w-4" />Print Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="document">
          <Card>
            <CardHeader><CardTitle>Document Settings</CardTitle><CardDescription>Configure default values for documents</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              {documentTypes.filter(d => !['proforma_invoice', 'credit_note', 'debit_note'].includes(d.id)).map((doc) => (
                <DocumentSettings key={doc.id} type={doc.id} name={doc.name} description={doc.description} updateSettings={updateSettings} />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="discount">
          <Card>
            <CardHeader><CardTitle>Discount Settings</CardTitle><CardDescription>Configure default discount settings for invoices and quotations</CardDescription></CardHeader>
            <CardContent className="space-y-6">
              <DiscountSettings updateSettings={updateSettings} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="template">
          <TemplateSettingsPage />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function TemplateSettingsPage() {
  const [activeTemplateTab, setActiveTemplateTab] = useState('invoice')
  const [previewTemplate, setPreviewTemplate] = useState<string | null>(null)
  const { data: templateSettings, isLoading } = useTemplateSettings(activeTemplateTab)
  const updateTemplateSettings = useUpdateTemplateSettings()
  const previewMutation = usePreviewTemplate()

  const handlePreview = async (templateId: string) => {
    setPreviewTemplate(templateId)
    await previewMutation.mutateAsync({ type: activeTemplateTab, templateId })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Print Template Settings</CardTitle>
          <CardDescription>Select and manage print templates for each document type</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-2">
            {documentTypes.map((doc) => (
              <Button
                key={doc.id}
                variant={activeTemplateTab === doc.id ? 'default' : 'outline'}
                onClick={() => setActiveTemplateTab(doc.id)}
                className="gap-2"
              >
                <FilePlus className="h-4 w-4" />
                {doc.name}
              </Button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex h-32 items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{documentTypes.find(d => d.id === activeTemplateTab)?.name} Templates</h3>
                  <p className="text-sm text-muted-foreground">Select default template and preview options</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {availableTemplates.map((template) => {
                  const isSelected = templateSettings?.selected_template_id === template.id
                  const isDefault = templateSettings?.default_template_id === template.id

                  return (
                    <Card key={template.id} className={`cursor-pointer transition-all ${isSelected ? 'border-primary ring-2 ring-primary/20' : 'hover:border-gray-300'}`}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{template.name}</h4>
                              {isDefault && <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Default</span>}
                            </div>
                            <p className="text-sm text-muted-foreground">{template.description}</p>
                          </div>
                          {isSelected && <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />}
                        </div>
                        <div className="mt-4 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handlePreview(template.id)}
                            disabled={previewMutation.isPending}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            {previewMutation.isPending && previewTemplate === template.id ? 'Loading...' : 'Preview'}
                          </Button>
                          <Button 
                            variant={isDefault ? 'default' : 'outline'} 
                            size="sm" 
                            className="flex-1"
                            onClick={() => updateTemplateSettings.mutate({ 
                              type: activeTemplateTab, 
                              selected_template_id: template.id,
                              default_template_id: isDefault ? undefined : template.id
                            })}
                            disabled={updateTemplateSettings.isPending}
                          >
                            {isDefault ? 'Default' : 'Set Default'}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="border-t pt-6">
                <h4 className="font-medium mb-4">Upload Custom Template</h4>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <Input type="file" accept=".html,.pdf" placeholder="Upload custom template file" />
                  </div>
                  <Button variant="outline">
                    <FilePlus className="mr-2 h-4 w-4" />
                    Upload
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Supported formats: HTML, PDF. Max file size: 5MB
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DocumentSettings({ type, name, description, updateSettings }: { type: string; name: string; description: string; updateSettings: any }) {
  const { data: settings, isLoading } = useDocumentSettings(type)
  const [localSettings, setLocalSettings] = useState<Record<string, unknown>>({})

  if (isLoading) return <div className="p-4"><div className="h-4 bg-muted animate-pulse rounded" /></div>

  return (
    <div className="border rounded-lg p-4 space-y-4">
      <div><h3 className="font-medium">{name}</h3><p className="text-sm text-muted-foreground">{description}</p></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2"><Label>Prefix</Label><Input value={(localSettings.prefix as string) || settings?.prefix || ''} onChange={(e) => setLocalSettings({ ...localSettings, prefix: e.target.value })} placeholder="INV-" /></div>
        <div className="space-y-2"><Label>Next Number</Label><Input type="number" value={(localSettings.nextNumber as number) || settings?.nextNumber || 1} onChange={(e) => setLocalSettings({ ...localSettings, nextNumber: parseInt(e.target.value) })} /></div>
        <div className="space-y-2"><Label>Default Due Days</Label><Input type="number" value={(localSettings.dueDays as number) || settings?.dueDays || 30} onChange={(e) => setLocalSettings({ ...localSettings, dueDays: parseInt(e.target.value) })} /></div>
        <div className="space-y-2"><Label>Default Tax Rate %</Label><Input type="number" value={(localSettings.taxRate as number) || settings?.taxRate || 0} onChange={(e) => setLocalSettings({ ...localSettings, taxRate: parseFloat(e.target.value) })} /></div>
      </div>
      <div className="flex items-center space-x-2"><Switch id={`auto-${type}`} defaultChecked={(localSettings.autoNumber as boolean) ?? settings?.autoNumber ?? true} onCheckedChange={(checked) => setLocalSettings({ ...localSettings, autoNumber: checked })} /><Label htmlFor={`auto-${type}`}>Auto-generate document number</Label></div>
      <Button size="sm" onClick={() => updateSettings.mutate({ type, settings: localSettings })} disabled={updateSettings.isPending}><Save className="mr-2 h-4 w-4" />Save</Button>
    </div>
  )
}

function DiscountSettings({ updateSettings }: { updateSettings: any }) {
  const [discountSettings, setDiscountSettings] = useState({
    allowDiscount: true,
    defaultDiscountType: 'percentage',
    defaultDiscountValue: 0,
    maxDiscountPercentage: 100,
    discountOnSubtotal: true,
    discountOnTax: false,
    showDiscountColumn: true,
    discountTerms: '',
  })

  const handleSave = () => {
    updateSettings.mutate({ type: 'discount', settings: discountSettings })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label>Allow Discounts</Label>
            <p className="text-sm text-muted-foreground">Enable discount functionality on invoices and quotations</p>
          </div>
          <Switch 
            checked={discountSettings.allowDiscount}
            onCheckedChange={(checked) => setDiscountSettings({ ...discountSettings, allowDiscount: checked })}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Default Discount Type</Label>
            <Select 
              value={discountSettings.defaultDiscountType}
              onValueChange={(value) => setDiscountSettings({ ...discountSettings, defaultDiscountType: value })}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
                <SelectItem value="fixed">Fixed Amount</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Default Discount Value</Label>
            <Input type="number" value={discountSettings.defaultDiscountValue} onChange={(e) => setDiscountSettings({ ...discountSettings, defaultDiscountValue: parseFloat(e.target.value) })} />
          </div>

          <div className="space-y-2">
            <Label>Maximum Discount Percentage</Label>
            <Input type="number" value={discountSettings.maxDiscountPercentage} onChange={(e) => setDiscountSettings({ ...discountSettings, maxDiscountPercentage: parseFloat(e.target.value) })} />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Default Discount Terms</Label>
          <Input placeholder="e.g., 10% discount for early payment within 15 days" value={discountSettings.discountTerms} onChange={(e) => setDiscountSettings({ ...discountSettings, discountTerms: e.target.value })} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Switch checked={discountSettings.showDiscountColumn} onCheckedChange={(checked) => setDiscountSettings({ ...discountSettings, showDiscountColumn: checked })} />
            <div className="space-y-0.5">
              <Label>Show Discount Column</Label>
              <p className="text-sm text-muted-foreground">Display discount column in line items</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={discountSettings.discountOnSubtotal} onCheckedChange={(checked) => setDiscountSettings({ ...discountSettings, discountOnSubtotal: checked })} />
            <div className="space-y-0.5">
              <Label>Apply on Subtotal</Label>
              <p className="text-sm text-muted-foreground">Calculate discount on subtotal</p>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={updateSettings.isPending}>
        <Save className="mr-2 h-4 w-4" />
        {updateSettings.isPending ? 'Saving...' : 'Save Discount Settings'}
      </Button>
    </div>
  )
}