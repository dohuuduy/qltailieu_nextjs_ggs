'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import ApprovalTest from '@/components/ApprovalTest'
import DocumentLifecycleFormNew from '@/components/DocumentLifecycleFormNew'
import DocumentLifecycleDashboard from '@/components/DocumentLifecycleDashboard'
import { DocumentLifecycle } from '@/lib/types/document-lifecycle'
import { FileText, Shield, Calendar, TestTube } from 'lucide-react'

export default function TestApprovalPage() {
  const [activeTab, setActiveTab] = useState('approval-test')
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingDocument, setEditingDocument] = useState<DocumentLifecycle | null>(null)

  // Mock current user
  const mockUser = {
    id: '1',
    ho_ten: 'Nguyễn Văn A',
    phong_ban: 'IT',
    quyen_phe_duyet: ['A', 'B', 'C'] as any
  }

  const handleCreateDocument = () => {
    setEditingDocument(null)
    setShowCreateForm(true)
  }

  const handleEditDocument = (document: DocumentLifecycle) => {
    setEditingDocument(document)
    setShowCreateForm(true)
  }

  const handleSaveDocument = async (data: Partial<DocumentLifecycle>) => {
    try {
      const url = editingDocument 
        ? `/api/documents/lifecycle/${editingDocument.id}`
        : '/api/documents/lifecycle'
      
      const method = editingDocument ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          nguoi_cap_nhat: mockUser.ho_ten
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to save document')
      }

      setShowCreateForm(false)
      setEditingDocument(null)
      
      // Refresh the page or trigger a refresh
      window.location.reload()
    } catch (error) {
      console.error('Error saving document:', error)
      throw error
    }
  }

  const handleCancelForm = () => {
    setShowCreateForm(false)
    setEditingDocument(null)
  }

  if (showCreateForm) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">
            {editingDocument ? 'Chỉnh sửa tài liệu' : 'Tạo tài liệu mới'}
          </h1>
          <p className="text-gray-600 mt-2">
            {editingDocument ? 'Cập nhật thông tin và vòng đời tài liệu' : 'Tạo tài liệu mới với đầy đủ thông tin vòng đời'}
          </p>
        </div>

        <DocumentLifecycleFormNew
          document={editingDocument || undefined}
          onSave={handleSaveDocument}
          onCancel={handleCancelForm}
          mode={editingDocument ? 'edit' : 'create'}
          currentUser={mockUser}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <TestTube className="w-8 h-8" />
          Test Approval & Review System
        </h1>
        <p className="text-gray-600 mt-2">
          Kiểm tra các tính năng phê duyệt và soát xét tài liệu
        </p>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Thao tác nhanh</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Button onClick={handleCreateDocument} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tạo tài liệu test
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Refresh dữ liệu
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="approval-test" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Test Approval Actions
          </TabsTrigger>
          <TabsTrigger value="lifecycle-dashboard" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Lifecycle Dashboard
          </TabsTrigger>
          <TabsTrigger value="api-test" className="flex items-center gap-2">
            <TestTube className="w-4 h-4" />
            API Test
          </TabsTrigger>
        </TabsList>

        <TabsContent value="approval-test" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Approval Actions</CardTitle>
              <p className="text-sm text-gray-600">
                Kiểm tra các thao tác phê duyệt, từ chối, yêu cầu chỉnh sửa, soát xét và gia hạn
              </p>
            </CardHeader>
            <CardContent>
              <ApprovalTest />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lifecycle-dashboard" className="space-y-6">
          <DocumentLifecycleDashboard
            onCreateDocument={handleCreateDocument}
            onEditDocument={handleEditDocument}
          />
        </TabsContent>

        <TabsContent value="api-test" className="space-y-6">
          <APITestPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// API Test Panel Component
function APITestPanel() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runAPITest = async (endpoint: string, method: string = 'GET', body?: any) => {
    try {
      setLoading(true)
      const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' }
      }
      
      if (body) {
        options.body = JSON.stringify(body)
      }

      const response = await fetch(endpoint, options)
      const data = await response.json()
      
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: response.status,
        success: response.ok,
        data,
        timestamp: new Date().toLocaleTimeString()
      }])
    } catch (error) {
      setTestResults(prev => [...prev, {
        endpoint,
        method,
        status: 'ERROR',
        success: false,
        data: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toLocaleTimeString()
      }])
    } finally {
      setLoading(false)
    }
  }

  const clearResults = () => {
    setTestResults([])
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>API Endpoints Test</CardTitle>
          <p className="text-sm text-gray-600">
            Test các API endpoints cho lifecycle management
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button 
                size="sm" 
                onClick={() => runAPITest('/api/documents/lifecycle')}
                disabled={loading}
              >
                GET /api/documents/lifecycle
              </Button>
              <Button 
                size="sm" 
                onClick={() => runAPITest('/api/documents')}
                disabled={loading}
              >
                GET /api/documents
              </Button>
              <Button 
                size="sm" 
                onClick={() => runAPITest('/api/users')}
                disabled={loading}
              >
                GET /api/users
              </Button>
              <Button 
                size="sm" 
                onClick={() => runAPITest('/api/departments')}
                disabled={loading}
              >
                GET /api/departments
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={clearResults}
              >
                Clear Results
              </Button>
            </div>

            {/* Test Results */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded border ${
                    result.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-sm">
                      {result.method} {result.endpoint}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded text-xs ${
                        result.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {result.status}
                      </span>
                      <span className="text-xs text-gray-500">{result.timestamp}</span>
                    </div>
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
                    {JSON.stringify(result.data, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}