import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { AdeptixApiError } from "adeptix";
import { adeptixClient } from "@/lib/adeptix";
import { createOrder } from "@/lib/orders";

export async function POST() {
  const orderRef = `order_${randomUUID()}`;
  createOrder(orderRef);

  try {
    const payment = await adeptixClient.payments.create({
      amount: "49.00",
      currency: "USD",
      email: "customer@example.com",
      provider: "stripe",
      orderRef,
    });
    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    if (err instanceof AdeptixApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: err.status });
    }
    throw err;
  }
}
