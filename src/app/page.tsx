"use client";

import { useState } from "react";

interface CryptoResult {
  pay_to_address: string;
  amount: string;
  chain: string;
  token: string;
  expires_at: string;
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [crypto, setCrypto] = useState<CryptoResult | null>(null);
  const [loading, setLoading] = useState<"merchant" | "crypto" | null>(null);

  async function payMerchant() {
    setError(null);
    setLoading("merchant");
    try {
      const res = await fetch("/api/checkout/merchant", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Checkout failed");
        return;
      }
      window.location.href = data.payment_url;
    } finally {
      setLoading(null);
    }
  }

  async function payCrypto() {
    setError(null);
    setCrypto(null);
    setLoading("crypto");
    try {
      const res = await fetch("/api/checkout/crypto", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create a crypto payment request");
        return;
      }
      setCrypto(data);
    } finally {
      setLoading(null);
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: "48px auto", padding: "0 16px", fontFamily: "sans-serif" }}>
      <h1>Adeptix + Next.js example</h1>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!crypto && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <button onClick={payMerchant} disabled={loading !== null}>
            {loading === "merchant" ? "Starting checkout..." : "Pay $49.00 with card (Stripe)"}
          </button>
          <button onClick={payCrypto} disabled={loading !== null}>
            {loading === "crypto" ? "Creating deposit request..." : "Pay 49.00 USDC on Polygon"}
          </button>
        </div>
      )}

      {crypto && (
        <div>
          <h2>
            Send exactly {crypto.amount} {crypto.token}
          </h2>
          <p>
            On {crypto.chain} to: <code>{crypto.pay_to_address}</code>
          </p>
          <p>This request expires at {crypto.expires_at}.</p>
        </div>
      )}
    </main>
  );
}
