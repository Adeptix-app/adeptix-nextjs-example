import { NextResponse, type NextRequest } from "next/server";
import { parseWebhookEvent } from "adeptix";
import { ADEPTIX_WEBHOOK_SECRET } from "@/lib/adeptix";
import { markOrderPaid } from "@/lib/orders";

export async function POST(request: NextRequest) {
  // IMPORTANT: read the raw text body - verification must happen BEFORE any JSON parsing, since
  // signing covers the exact bytes received, not whatever a parser normalizes them to.
  const rawBody = await request.text();
  const signature = request.headers.get("x-adeptix-signature");

  let event;
  try {
    event = parseWebhookEvent(rawBody, signature, ADEPTIX_WEBHOOK_SECRET);
  } catch {
    return new NextResponse(null, { status: 401 });
  }

  if (event.event === "payment.paid" && event.order_ref) {
    markOrderPaid(event.order_ref, "merchant");
  } else if (event.event === "crypto_payment.matched" && event.order_ref) {
    markOrderPaid(event.order_ref, "crypto");
  }

  return new NextResponse(null, { status: 200 });
}
