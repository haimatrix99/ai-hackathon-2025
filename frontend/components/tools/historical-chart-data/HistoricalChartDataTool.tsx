"use client";

import { makeAssistantToolUI } from "@assistant-ui/react";
import { HistoricalChartData } from "./historical-chart-data";

type HistoricalChartDataToolArgs = {
  crypto_name: string;
  days: number;
  interval: "" | "5m" | "hourly" | "daily";
};

type HistoricalChartDataToolResutl = {
  record: { datetime: string; price: number }[];
};

export const useHistoricalChartDataTool = makeAssistantToolUI<
  HistoricalChartDataToolArgs,
  string | undefined
>({
  toolName: "get-historical-chart-data",
  render: function HistoricalChartDataUI({ args, result }) {
    let resultObj: HistoricalChartDataToolResutl | { error: string };
    try {
      resultObj = result ? JSON.parse(result) : {};
      console.log(resultObj);
    } catch {
      resultObj = { error: result! };
    }
    return (
      <div className="mb-4 flex flex-col items-center gap-2">
        {"record" in resultObj && (
          <HistoricalChartData
            crypto_name={args.crypto_name}
            days={args.days}
            record={resultObj.record}
          />
        )}
        {"error" in resultObj && (
          <p className="text-red-500">{resultObj.error}</p>
        )}
      </div>
    );
  },
});
