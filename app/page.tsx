'use client'

import { useState } from 'react'
import Layout from '@/components/Layout'
import Dashboard from '@/components/Dashboard'
import DocumentManager from '@/components/DocumentManager'
import VersionManager from '@/components/VersionManager'
import HistoryViewer from '@/components/HistoryViewer'
import CategoryManager from '@/components/CategoryManager'

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />
      case 'documents':
        return <DocumentManager />
      case 'versions':
        return <VersionManager />
      case 'history':
        return <HistoryViewer />
      case 'standards':
        return <CategoryManager />
      case 'users':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Quản Lý Người Dùng</h2>
            <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
          </div>
        )
      case 'reports':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Báo Cáo & Thống Kê</h2>
            <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
          </div>
        )
      case 'settings':
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-4">Cài Đặt Hệ Thống</h2>
            <p className="text-muted-foreground">Tính năng đang được phát triển...</p>
          </div>
        )
      default:
        return <Dashboard />
    }
  }

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  )
}