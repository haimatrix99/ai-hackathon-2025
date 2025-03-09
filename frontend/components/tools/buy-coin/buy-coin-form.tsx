"use client";

import { CheckIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type BuyCoinPendingProps = {
  fiat_amount: number;
  fiat_currency: "USD" | "VND";
  coin: string;
  wallet_address: string;
  onConfirm: () => void;
  onReject: () => void;
};

export function BuyCoinPending(props: BuyCoinPendingProps) {
  const {
    fiat_amount,
    fiat_currency,
    coin,
    wallet_address,
    onConfirm,
    onReject,
  } = props;

  const isValidWalletAddress = /^0x[a-fA-F0-9]{40}$/.test(wallet_address);

  return (
    <Card className="mx-auto w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-2xl font-bold capitalize">
          Confirm Buy Coin {coin}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2">
          <p className="text-muted-foreground text-sm font-medium">
            Fiat Amount:
          </p>
          <p className="text-sm capitalize font-semibold">
            {fiat_amount} {fiat_currency}
          </p>
          <p className="text-muted-foreground text-sm font-medium">
            Wallet Address:
          </p>
          <div className="space-y-1">
            <p className="text-sm font-semibold">{wallet_address}</p>
            {!isValidWalletAddress && (
              <p className="text-red-500 text-xs">Wallet address needed.</p>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <Button variant="outline" onClick={onReject}>
          <XIcon className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button onClick={onConfirm} disabled={!isValidWalletAddress}>
          <CheckIcon className="mr-2 h-4 w-4" />
          Continue
        </Button>
      </CardFooter>
    </Card>
  );
}
