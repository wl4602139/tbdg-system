import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '特变电工（电装集团）· 能源管理与双中心平台 v1.01',
  description: '特变电工（电装集团）零碳园区集控中心与产品碳足迹集采中心高保真产品原型系统 v1.01',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground antialiased font-sans selection:bg-blue-100 selection:text-blue-700">
        {children}
      </body>
    </html>
  )
}
