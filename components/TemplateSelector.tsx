'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sparkles, FileText, Search } from 'lucide-react'
import { SUB_DOCUMENT_TEMPLATES, getTemplatesByType, type SubDocumentTemplate } from '@/lib/sub-document-templates'

interface TemplateSelectorProps {
  selectedType: string
  onSelectTemplate: (template: SubDocumentTemplate, customName?: string) => void
  onClose: () => void
}

export default function TemplateSelector({ selectedType, onSelectTemplate, onClose }: TemplateSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<SubDocumentTemplate | null>(null)
  const [customName, setCustomName] = useState('')
  const [isCustomizeDialogOpen, setIsCustomizeDialogOpen] = useState(false)

  const templates = getTemplatesByType(selectedType)
  const filteredTemplates = templates.filter(template =>
    template.ten_mau.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.mo_ta_mau.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleTemplateClick = (template: SubDocumentTemplate) => {
    if (template.ten_mau.includes('[') && template.ten_mau.includes(']')) {
      // Template có placeholder, mở dialog customize
      setSelectedTemplate(template)
      setCustomName('')
      setIsCustomizeDialogOpen(true)
    } else {
      // Template không có placeholder, sử dụng trực tiếp
      onSelectTemplate(template)
      onClose()
    }
  }

  const handleCustomizeConfirm = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate, customName)
      setIsCustomizeDialogOpen(false)
      onClose()
    }
  }

  const getPreviewName = (template: SubDocumentTemplate) => {
    if (customName && template.ten_mau.includes('[') && template.ten_mau.includes(']')) {
      return template.ten_mau.replace(/\[.*?\]/g, customName)
    }
    return template.ten_mau
  }

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Chọn Template</h3>
          <Badge variant="secondary">{templates.length} mẫu có sẵn</Badge>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Tìm kiếm template..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Templates Grid */}
        <ScrollArea className="h-96">
          <div className="grid grid-cols-1 gap-3">
            {filteredTemplates.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                <p>Không tìm thấy template phù hợp</p>
              </div>
            ) : (
              filteredTemplates.map((template) => (
                <Card 
                  key={template.id} 
                  className="cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-blue-500"
                  onClick={() => handleTemplateClick(template)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">{template.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-sm">{template.ten_mau}</h4>
                          <Badge variant="outline" className={template.color}>
                            {template.loai_tai_lieu}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{template.mo_ta_mau}</p>
                        {template.ghi_chu_mau && (
                          <p className="text-xs text-blue-600 italic">💡 {template.ghi_chu_mau}</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Manual option */}
        <div className="border-t pt-4">
          <Button 
            variant="outline" 
            onClick={() => onSelectTemplate({} as SubDocumentTemplate)}
            className="w-full"
          >
            <FileText className="w-4 h-4 mr-2" />
            Tạo thủ công (không dùng template)
          </Button>
        </div>
      </div>

      {/* Customize Dialog */}
      <Dialog open={isCustomizeDialogOpen} onOpenChange={setIsCustomizeDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Tùy chỉnh Template</DialogTitle>
          </DialogHeader>
          {selectedTemplate && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{selectedTemplate.icon}</span>
                  <Badge className={selectedTemplate.color}>
                    {selectedTemplate.loai_tai_lieu}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{selectedTemplate.mo_ta_mau}</p>
              </div>

              <div>
                <Label htmlFor="custom_name">Thay thế phần trong [ ]</Label>
                <Input
                  id="custom_name"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  placeholder="Ví dụ: Sản phẩm A, Bộ phận IT, Ca sáng..."
                />
              </div>

              <div className="p-3 bg-blue-50 rounded-lg">
                <Label className="text-sm font-medium text-blue-800">Preview:</Label>
                <p className="text-sm mt-1 font-medium">{getPreviewName(selectedTemplate)}</p>
              </div>

              {selectedTemplate.ghi_chu_mau && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    💡 <strong>Ghi chú:</strong> {selectedTemplate.ghi_chu_mau}
                  </p>
                </div>
              )}

              <div className="flex space-x-2">
                <Button onClick={handleCustomizeConfirm} className="flex-1" disabled={!customName.trim()}>
                  Sử dụng Template
                </Button>
                <Button variant="outline" onClick={() => setIsCustomizeDialogOpen(false)} className="flex-1">
                  Hủy
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}