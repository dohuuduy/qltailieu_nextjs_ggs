'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Trash2, Edit, Download, ArrowUpDown, CheckSquare, Square } from 'lucide-react'
import { useToast } from '@/components/ui/toast'

interface TaiLieuCon {
  id: string
  tai_lieu_cha_id: string
  ten_tai_lieu_con: string
  mo_ta: string
  loai_tai_lieu: string
  trang_thai: string
  thu_tu: number
  nguoi_tao: string
  ngay_tao: string
  nguoi_cap_nhat: string
  ngay_cap_nhat: string
  url_file?: string
  ghi_chu?: string
}

interface BulkOperationsProps {
  subDocuments: TaiLieuCon[]
  selectedIds: string[]
  onSelectionChange: (selectedIds: string[]) => void
  onBulkAction: (action: string, data?: any) => Promise<void>
  documentId: string
}

export default function BulkOperations({ 
  subDocuments, 
  selectedIds, 
  onSelectionChange, 
  onBulkAction,
  documentId 
}: BulkOperationsProps) {
  const { addToast } = useToast()
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Bulk edit states
  const [bulkEditData, setBulkEditData] = useState({
    loai_tai_lieu: '',
    ghi_chu: '',
    action: 'update_type' // 'update_type', 'update_note', 'update_status'
  })

  const selectedDocuments = subDocuments.filter(doc => selectedIds.includes(doc.id))
  const isAllSelected = subDocuments.length > 0 && selectedIds.length === subDocuments.length
  const isPartialSelected = selectedIds.length > 0 && selectedIds.length < subDocuments.length

  // Toggle select all
  const handleSelectAll = () => {
    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(subDocuments.map(doc => doc.id))
    }
  }

  // Bulk delete
  const handleBulkDelete = async () => {
    setIsProcessing(true)
    setProgress(0)
    
    try {
      const total = selectedIds.length
      let completed = 0

      for (const id of selectedIds) {
        await fetch(`/api/documents/${documentId}/sub-documents/${id}`, {
          method: 'DELETE'
        })
        completed++
        setProgress((completed / total) * 100)
      }

      await onBulkAction('delete', { ids: selectedIds })
      onSelectionChange([])
      setIsDeleteDialogOpen(false)
      
      addToast({
        type: 'success',
        title: 'Thành công!',
        description: `Đã xóa ${selectedIds.length} tài liệu con`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi xóa tài liệu con'
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Bulk edit
  const handleBulkEdit = async () => {
    setIsProcessing(true)
    setProgress(0)
    
    try {
      const total = selectedIds.length
      let completed = 0

      for (const id of selectedIds) {
        const updateData: any = {}
        
        if (bulkEditData.action === 'update_type' && bulkEditData.loai_tai_lieu) {
          updateData.loai_tai_lieu = bulkEditData.loai_tai_lieu
        }
        
        if (bulkEditData.action === 'update_note' && bulkEditData.ghi_chu) {
          updateData.ghi_chu = bulkEditData.ghi_chu
        }

        await fetch(`/api/documents/${documentId}/sub-documents/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData)
        })
        
        completed++
        setProgress((completed / total) * 100)
      }

      await onBulkAction('edit', bulkEditData)
      onSelectionChange([])
      setIsEditDialogOpen(false)
      
      addToast({
        type: 'success',
        title: 'Thành công!',
        description: `Đã cập nhật ${selectedIds.length} tài liệu con`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi cập nhật tài liệu con'
      })
    } finally {
      setIsProcessing(false)
      setProgress(0)
    }
  }

  // Export to CSV
  const handleExport = () => {
    const csvContent = [
      ['STT', 'Tên tài liệu con', 'Loại', 'Mô tả', 'URL File', 'Ghi chú', 'Ngày tạo'],
      ...selectedDocuments.map(doc => [
        doc.thu_tu,
        doc.ten_tai_lieu_con,
        doc.loai_tai_lieu,
        doc.mo_ta,
        doc.url_file || '',
        doc.ghi_chu || '',
        doc.ngay_tao
      ])
    ].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `tai-lieu-con-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    addToast({
      type: 'success',
      title: 'Thành công!',
      description: `Đã export ${selectedIds.length} tài liệu con`
    })
  }

  // Auto reorder
  const handleAutoReorder = async () => {
    setIsProcessing(true)
    
    try {
      const reorderedDocs = selectedDocuments
        .sort((a, b) => a.ten_tai_lieu_con.localeCompare(b.ten_tai_lieu_con))
        .map((doc, index) => ({
          id: doc.id,
          thu_tu: doc.thu_tu + index
        }))

      await onBulkAction('reorder', { subDocuments: reorderedDocs })
      onSelectionChange([])
      
      addToast({
        type: 'success',
        title: 'Thành công!',
        description: `Đã sắp xếp lại ${selectedIds.length} tài liệu con theo tên`
      })
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi sắp xếp lại'
      })
    } finally {
      setIsProcessing(false)
    }
  }

  if (selectedIds.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSelectAll}
          className="text-gray-600"
        >
          {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          <span className="ml-2">Chọn tất cả ({subDocuments.length})</span>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="text-blue-700"
          >
            {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
          </Button>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedIds.length} đã chọn
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isProcessing}
          >
            <Edit className="w-4 h-4 mr-1" />
            Sửa hàng loạt
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            disabled={isProcessing}
          >
            <Download className="w-4 h-4 mr-1" />
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleAutoReorder}
            disabled={isProcessing}
          >
            <ArrowUpDown className="w-4 h-4 mr-1" />
            Sắp xếp
          </Button>
          
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isProcessing}
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Xóa
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSelectionChange([])}
          >
            Hủy chọn
          </Button>
        </div>
      </div>

      {/* Progress bar khi đang xử lý */}
      {isProcessing && (
        <div className="p-3 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Đang xử lý...</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}

      {/* Bulk Delete Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa hàng loạt</AlertDialogTitle>
            <AlertDialogDescription>
              <div className="space-y-3">
                <p>Bạn có chắc chắn muốn xóa <strong>{selectedIds.length}</strong> tài liệu con sau:</p>
                <div className="max-h-32 overflow-y-auto bg-gray-50 p-2 rounded">
                  {selectedDocuments.map(doc => (
                    <div key={doc.id} className="text-sm py-1">
                      • {doc.ten_tai_lieu_con}
                    </div>
                  ))}
                </div>
                <p className="text-red-600 font-medium">Các tài liệu sẽ được chuyển vào thùng rác.</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            {isProcessing ? (
              <Button variant="destructive" disabled>
                Đang xóa...
              </Button>
            ) : (
              <AlertDialogAction 
                variant="destructive"
                onClick={handleBulkDelete}
              >
                Xóa tất cả
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bulk Edit Dialog */}
      <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sửa hàng loạt</AlertDialogTitle>
            <AlertDialogDescription>
              Cập nhật thông tin cho <strong>{selectedIds.length}</strong> tài liệu con đã chọn
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Thao tác:</label>
              <Select value={bulkEditData.action} onValueChange={(value) => setBulkEditData({...bulkEditData, action: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="update_type">Thay đổi loại tài liệu</SelectItem>
                  <SelectItem value="update_note">Cập nhật ghi chú</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {bulkEditData.action === 'update_type' && (
              <div>
                <label className="text-sm font-medium">Loại tài liệu mới:</label>
                <Select value={bulkEditData.loai_tai_lieu} onValueChange={(value) => setBulkEditData({...bulkEditData, loai_tai_lieu: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại tài liệu" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bieu_mau">Biểu Mẫu</SelectItem>
                    <SelectItem value="huong_dan">Hướng Dẫn</SelectItem>
                    <SelectItem value="checklist">Checklist</SelectItem>
                    <SelectItem value="bao_cao">Báo Cáo</SelectItem>
                    <SelectItem value="tai_lieu_tham_khao">Tài Liệu Tham Khảo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {bulkEditData.action === 'update_note' && (
              <div>
                <label className="text-sm font-medium">Ghi chú mới:</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={bulkEditData.ghi_chu}
                  onChange={(e) => setBulkEditData({...bulkEditData, ghi_chu: e.target.value})}
                  placeholder="Nhập ghi chú chung cho tất cả tài liệu"
                />
              </div>
            )}
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            {isProcessing || 
              (bulkEditData.action === 'update_type' && !bulkEditData.loai_tai_lieu) ||
              (bulkEditData.action === 'update_note' && !bulkEditData.ghi_chu) ? (
              <Button disabled>
                {isProcessing ? 'Đang cập nhật...' : 'Cập nhật'}
              </Button>
            ) : (
              <AlertDialogAction onClick={handleBulkEdit}>
                Cập nhật
              </AlertDialogAction>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}