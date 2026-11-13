import React, { Suspense } from "react";
import { SEED_ORDERS } from "@/lib/api/seedData";
import { OrdersManager } from "@/components/admin/OrdersManager";

export function generateStaticParams() {
  return SEED_ORDERS.map((ord) => ({
    id: ord.id,
  }));
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-xs text-muted-token">
          Loading order details...
        </div>
      }
    >
      <OrdersManager />
    </Suspense>
  );
}
