"use client";

import { BuyCoinPending } from "./buy-coin-form";
import { makeAssistantToolUI } from "@assistant-ui/react";

type BuyCoinArgs = {
  fiat_amount: number;
  fiat_currency: "USD" | "VND";
  coin: string;
  wallet_address: string;
};

type BuyCoinResult = {
  approve?: boolean;
  cancelled?: boolean;
  error?: string;
};

export const useBuyCoinTool = makeAssistantToolUI<BuyCoinArgs, string>({
  toolName: "buy-coin",
  render: function BuyCoin({ args, result, status, addResult }) {
    let resultObj: BuyCoinResult;
    try {
      resultObj = result ? JSON.parse(result) : {};
    } catch (e) {
      resultObj = { error: result! };
    }

    const handleReject = () => {
      addResult({ cancelled: true });
    };

    const handleConfirm = async () => {
      addResult({ approve: true });
    };

    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        {!result && status.type !== "running" && (
          <BuyCoinPending
            {...args}
            onConfirm={handleConfirm}
            onReject={handleReject}
          />
        )}
        {resultObj.approve === false && (
          <pre className="font-bold text-red-600">User rejected purchase</pre>
        )}
        {resultObj.cancelled && (
          <pre className="font-bold text-red-600">Cancelled</pre>
        )}
      </div>
    );
  },
});
