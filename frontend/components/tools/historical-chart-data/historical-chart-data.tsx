"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Format date to be more readable
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Format price with thousands separator and two decimal places
const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
};

interface HistoricalChartDataProps {
  crypto_name: string;
  days: number;
  record: { datetime: string; price: number }[];
}

export function HistoricalChartData({
  crypto_name,
  days,
  record,
}: HistoricalChartDataProps) {
  // Prepare data with formatted dates
  const formattedData = record.map((item) => ({
    ...item,
    formattedDate: formatDate(item.datetime),
  }));

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold capitalize">
          Historical Price Chart Of {crypto_name}
        </CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          Historical price data for the last {days} days
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={formattedData}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 20,
              }}
            >
              <defs>
                <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="hsl(var(--chart-1))"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                opacity={0.2}
              />
              <XAxis
                dataKey="formattedDate"
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => value.split(",")[0]}
              />
              <YAxis
                dataKey="price"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                width={60}
                tick={{ fontSize: 12 }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="font-medium">Date</div>
                          <div>{payload[0].payload.formattedDate}</div>
                          <div className="font-medium">Price</div>
                          <div className="font-medium text-chart-1">
                            ${formatPrice(payload[0].value as number)}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="price"
                stroke="hsl(var(--chart-1))"
                fillOpacity={1}
                fill="url(#colorPrice)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
