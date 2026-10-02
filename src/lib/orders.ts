// Stand-in for your own database. A real integration looks up/updates a real orders table by
// order_ref (or transaction_id / payment_request_id) instead of this in-memory Map, but the shape
// of the lookups is exactly what you'd do against a real one. Module-level state like this only
// works for local dev with a single server process - use a real datastore in production.
interface Order {
  orderRef: string;
  status: "pending" | "paid";
  paidVia: "merchant" | "crypto" | null;
}

export const orders = new Map<string, Order>();

export function createOrder(orderRef: string): void {
  orders.set(orderRef, { orderRef, status: "pending", paidVia: null });
}

export function markOrderPaid(orderRef: string, paidVia: "merchant" | "crypto"): Order | null {
  const order = orders.get(orderRef);
  if (!order) return null;
  order.status = "paid";
  order.paidVia = paidVia;
  return order;
}
