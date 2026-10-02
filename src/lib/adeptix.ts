import { AdeptixClient } from "adeptix";

// A single shared client instance - AdeptixClient holds no per-request state, so this is safe to
// reuse across requests/route handlers.
export const adeptixClient = new AdeptixClient({
  apiKey: process.env.ADEPTIX_API_KEY ?? "ak_live_replace_me",
});

export const ADEPTIX_WEBHOOK_SECRET = process.env.ADEPTIX_WEBHOOK_SECRET ?? "whsec_replace_me";
