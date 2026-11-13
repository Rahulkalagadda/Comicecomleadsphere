import { SEED_ORDERS } from "@/lib/api/seedData";
import { OrderReceiptClient } from "@/components/orders/OrderReceiptClient";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return SEED_ORDERS.map((ord) => ({
    id: ord.id,
  }));
}

export default async function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = SEED_ORDERS.find((o) => o.id === id);

  if (!order) {
    notFound();
  }

  return <OrderReceiptClient order={order} />;
}
