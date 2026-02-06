import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Admin Dashboard - APE",
  description: "Manage website content",
}

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
