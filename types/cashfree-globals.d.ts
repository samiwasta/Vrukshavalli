export {};

declare global {
  interface Window {
    Cashfree?: CashfreeSDKConstructor;
  }
}

type CashfreeMode = "production" | "sandbox";

interface CashfreeSDKConstructor {
  new (options: { mode: CashfreeMode }): CashfreeSDKInstance;
}

interface CashfreeSDKInstance {
  checkout(options: { paymentSessionId: string }): void;
}
