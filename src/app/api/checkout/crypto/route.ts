import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { AdeptixApiError } from "adeptix";
import { adeptixClient } from "@/lib/adeptix";
import { createOrder } from "@/lib/orders";

export async function POST() {
  const orderRef = `order_${randomUUID()}`;
  createOrder(orderRef);

  try {
    const request = await adeptixClient.crypto.createPaymentRequest({
      chain: "polygon",
      token: "USDC",
      amount: "49.00",
      orderRef,
    });
    // request.amount may differ slightly from "49.00" - always show the customer this exact
    // value, never the amount you originally requested. See docs.adeptix.app/crypto-payments.
    return NextResponse.json(request, { status: 201 });
  } catch (err) {
    if (err instanceof AdeptixApiError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: err.status });
    }
    throw err;
  }
}
