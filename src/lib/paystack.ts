// ─── Paystack inline checkout ─────────────────────────────────────────────────

declare global {
  interface Window {
    PaystackPop?: {
      setup: (opts: PaystackSetupOptions) => { openIframe: () => void };
    };
  }
}

interface PaystackSetupOptions {
  key: string;
  email: string;
  amount: number; // kobo
  currency: string;
  name?: string;
  callback: (res: { reference: string }) => void;
  onClose: () => void;
}

let _paystackPromise: Promise<typeof window.PaystackPop> | null = null;

const loadPaystack = (): Promise<typeof window.PaystackPop> => {
  if (_paystackPromise) return _paystackPromise;
  _paystackPromise = new Promise((resolve, reject) => {
    if (window.PaystackPop) {
      resolve(window.PaystackPop);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    const timer = setTimeout(() => reject(new Error("timeout")), 15000);
    script.onload = () => {
      clearTimeout(timer);
      resolve(window.PaystackPop);
    };
    script.onerror = () => {
      clearTimeout(timer);
      _paystackPromise = null;
      reject(new Error("load_failed"));
    };
    document.head.appendChild(script);
  });
  return _paystackPromise;
};

export interface PaystackCheckoutOptions {
  key: string;
  email: string;
  amount: number; // naira
  name?: string;
  onOpen?: () => void;
  onSuccess: (reference: string) => void;
  onClose: () => void;
}

export const openPaystackCheckout = ({
  key,
  email,
  amount,
  name,
  onOpen,
  onSuccess,
  onClose,
}: PaystackCheckoutOptions): void => {
  if (
    !key ||
    key.startsWith("pk_test_xxx") ||
    (!key.startsWith("pk_test_") && !key.startsWith("pk_live_"))
  ) {
    alert(
      "Paystack is not configured.\n\nGo to Admin → Settings → Payment Settings and paste a valid Paystack public key."
    );
    onClose();
    return;
  }

  loadPaystack()
    .then((PaystackPop) => {
      if (onOpen) onOpen();
      try {
        const handler = PaystackPop!.setup({
          key,
          email,
          amount: amount * 100,
          currency: "NGN",
          name,
          callback: (res) => onSuccess(res.reference),
          onClose,
        });
        handler.openIframe();
      } catch (err) {
        console.error("Paystack setup error:", err);
        alert("Could not open Paystack checkout. Please try again or use Bank Transfer.");
        onClose();
      }
    })
    .catch((err) => {
      const msg =
        err.message === "timeout"
          ? "Paystack is taking too long to load. Check your internet and try again."
          : "Could not load Paystack. Check your connection or use Bank Transfer instead.";
      alert(msg);
      onClose();
    });
};
