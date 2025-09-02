'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/toast'
import { CheckCircle, XCircle, Edit, Send, Calendar, Clock } from 'lucide-react'
import { DatePicker } from '@/components/ui/date-picker'
import { DocumentLifecycle, getApprovalStatusName } from '@/lib/types/document-lifecycle'

interface ApprovalActionsProps {
  document: DocumentLifecycle
  onUpdate: () => void
  currentUser?: {
    id: string
    ho_ten: string
    phong_ban: string
    quyen_phe_duyet: string[]
  }
}

export default function ApprovalActions({ document, onUpdate, currentUser }: ApprovalActionsProps) {
  const { addToast } = useToast()
  const [loading, setLoading] = useState(false)
  const [actionDialogOpen, setActionDialogOpen] = useState(false)
  const [currentAction, setCurrentAction] = useState<string>('')
  const [comment, setComment] = useState('')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)

  const handleAction = async (action: string, comment?: string, date?: Date) => {
    try {
      setLoading(true)
      
      const requestBody: any = {
        action,
        ghi_chu_phe_duyet: comment,
        nguoi_cap_nhat: currentUser?.ho_ten || 'System'
      }

      // Add date for specific actions
      if (action === 'mark_for_review' && date) {
        requestBody.ngay_soat_xet_gan_nhat = date.toISOString().split('T')[0]
      } else if (action === 'extend_validity' && date) {
        requestBody.ngay_ket_thuc_hieu_luc = date.toISOString().split('T')[0]
      } else if (action === 'approve') {
        requestBody.ngay_phe_duyet = new Date().toISOString().split('T')[0]
      }
      
      const response = await fetch(`/api/documents/lifecycle/${document.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
      })

      const result = await response.json()

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Thành công!',
          description: result.message
        })
        onUpdate()
        setActionDialogOpen(false)
        setComment('')
        setSelectedDate(undefined)
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Lỗi!',
        description: 'Có lỗi xảy ra khi thực hiện thao tác'
      })
    } finally {
      setLoading(false)
    }
  }

  const openActionDialog = (action: string) => {
    setCurrentAction(action)
    setComment('')
    setSelectedDate(undefined)
    
    // Set default dates for specific actions
    if (action === 'mark_for_review') {
      setSelectedDate(new Date())
    } else if (action === 'extend_validity' && document.ngay_ket_thuc_hieu_luc) {
      // Default to 1 year extension
      const currentEnd = new Date(document.ngay_ket_thuc_hieu_luc)
      const newEnd = new Date(currentEnd)
      newEnd.setFullYear(newEnd.getFullYear() + 1)
      setSelectedDate(newEnd)
    }
    
    setActionDialogOpen(true)
  }

  const getActionTitle = (action: string) => {
    const titles: Record<string, string> = {
      'approve': 'Phê duyệt tài liệu',
      'reject': 'Từ chối tài liệu',
      'request_changes': 'Yêu cầu chỉnh sửa',
      'submit_for_approval': 'Gửi phê duyệt',
      'mark_for_review': 'Đánh dấu đã soát xét',
      'extend_validity': 'Gia hạn hiệu lực'
    }
    return titles[action] || 'Thao tác'
  }

  const getActionDescription = (action: string) => {
    const descriptions: Record<string, string> = {
      'approve': 'Phê duyệt tài liệu này và đưa vào trạng thái hiệu lực',
      'reject': 'Từ chối phê duyệt tài liệu này',
      'request_changes': 'Yêu cầu tác giả chỉnh sửa tài liệu',
      'submit_for_approval': 'Gửi tài liệu để phê duyệt',
      'mark_for_review': 'Đánh dấu đã hoàn thành soát xét định kỳ',
      'extend_validity': 'Gia hạn thời gian hiệu lực của tài liệu'
    }
    return descriptions[action] || 'Thực hiện thao tác này'
  }

  const canApprove = currentUser?.quyen_phe_duyet?.includes(document.cap_do_tai_lieu || 'C')
  const isAuthor = currentUser?.ho_ten === document.nguoi_soan_thao
  const isApprover = currentUser?.ho_ten === document.nguoi_phe_duyet

  return (
    <div className="space-y-4">
      {/* Current Status */}
      <div className="flex items-center gap-2">
        <Label>Trạng thái phê duyệt:</Label>
        <Badge variant="outline">
          {getApprovalStatusName(document.trang_thai_phe_duyet || 'chua_gui')}
        </Badge>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {/* Submit for Approval - Only author can do this */}
        {isAuthor && document.trang_thai_phe_duyet === 'chua_gui' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('submit_for_approval')}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Gửi phê duyệt
          </Button>
        )}

        {/* Approval Actions - Only approver can do this */}
        {isApprover && document.trang_thai_phe_duyet === 'cho_phe_duyet' && canApprove && (
          <>
            <Button
              size="sm"
              onClick={() => openActionDialog('approve')}
              disabled={loading}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="w-4 h-4" />
              Phê duyệt
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => openActionDialog('request_changes')}
              disabled={loading}
              className="flex items-center gap-2 text-orange-600 border-orange-600 hover:bg-orange-50"
            >
              <Edit className="w-4 h-4" />
              Yêu cầu sửa
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => openActionDialog('reject')}
              disabled={loading}
              className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50"
            >
              <XCircle className="w-4 h-4" />
              Từ chối
            </Button>
          </>
        )}

        {/* Review Action - Anyone can mark as reviewed */}
        {document.trang_thai === 'hieu_luc' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openActionDialog('mark_for_review')}
            disabled={loading}
            className="flex items-center gap-2 text-purple-600 border-purple-600 hover:bg-purple-50"
          >
            <Calendar className="w-4 h-4" />
            Đánh dấu đã soát xét
          </Button>
        )}

        {/* Extend Validity - Only approver can do this */}
        {(isApprover || canApprove) && document.trang_thai === 'hieu_luc' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => openActionDialog('extend_validity')}
            disabled={loading}
            className="flex items-center gap-2 text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            <Clock className="w-4 h-4" />
            Gia hạn
          </Button>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{getActionTitle(currentAction)}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              {getActionDescription(currentAction)}
            </p>
            
            {/* Date picker for specific actions */}
            {(currentAction === 'mark_for_review' || currentAction === 'extend_validity') && (
              <div>
                <Label>
                  {currentAction === 'mark_for_review' ? 'Ngày soát xét' : 'Ngày kết thúc hiệu lực mới'}
                </Label>
                <DatePicker
                  date={selectedDate}
                  onDateChange={setSelectedDate}
                  placeholder={
                    currentAction === 'mark_for_review' 
                      ? 'Chọn ngày soát xét'
                      : 'Chọn ngày kết thúc hiệu lực mới'
                  }
                  minDate={currentAction === 'extend_validity' ? new Date() : undefined}
                />
              </div>
            )}

            <div>
              <Label htmlFor="comment">
                Ghi chú {currentAction === 'approve' ? '(tùy chọn)' : '(bắt buộc)'}
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  currentAction === 'approve' 
                    ? 'Ghi chú phê duyệt...'
                    : currentAction === 'reject'
                    ? 'Lý do từ chối...'
                    : currentAction === 'request_changes'
                    ? 'Yêu cầu chỉnh sửa...'
                    : currentAction === 'mark_for_review'
                    ? 'Ghi chú soát xét...'
                    : currentAction === 'extend_validity'
                    ? 'Lý do gia hạn...'
                    : 'Ghi chú...'
                }
                rows={3}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setActionDialogOpen(false)}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button
                onClick={() => handleAction(currentAction, comment, selectedDate)}
                disabled={
                  loading || 
                  (currentAction !== 'approve' && !comment.trim()) ||
                  ((currentAction === 'mark_for_review' || currentAction === 'extend_validity') && !selectedDate)
                }
              >
                {loading ? 'Đang xử lý...' : 'Xác nhận'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Approval History */}
      {document.ghi_chu_phe_duyet && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <Label className="text-sm font-medium">Ghi chú phê duyệt:</Label>
          <p className="text-sm text-gray-700 mt-1">{document.ghi_chu_phe_duyet}</p>
          {document.ngay_phe_duyet && (
            <p className="text-xs text-gray-500 mt-1">
              Ngày: {new Date(document.ngay_phe_duyet).toLocaleDateString('vi-VN')}
            </p>
          )}
        </div>
      )}
    </div>
  )
}