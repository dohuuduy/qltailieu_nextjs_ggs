import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Hệ Thống Quản Lý Tài Liệu',
  description: 'Hệ thống quản lý tài liệu với kiểm soát phiên bản, lịch sử thay đổi và tiêu chuẩn áp dụng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={inter.className}>{children}</body>
    </html>
  )
}