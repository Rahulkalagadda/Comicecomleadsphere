import React, { Suspense } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function RootAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-main">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}
