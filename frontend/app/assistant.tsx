"use client";

import { useState } from "react";
import { ThreadList } from "@/components/assistant-ui/thread-list";
import { Thread } from "@/components/assistant-ui/thread";
import { useHistoricalChartDataTool } from "@/components/tools/historical-chart-data/HistoricalChartDataTool";
import { useBuyCoinTool } from "@/components/tools/buy-coin/BuyCoinTool";
import { Menu, PenTool, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// import { AssistantModal } from "@/components/assistant-ui/assistant-modal";

export const Assistant = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useHistoricalChartDataTool({});
  useBuyCoinTool({});

  const tools = [
    {
      name: "Get Crypto Price",
      description: "Fetches current cryptocurrency prices",
    },
    {
      name: "Get Trending Coin",
      description: "Gets currently trending cryptocurrencies",
    },
    {
      name: "Get Historical Chart Data",
      description: "Retrieves historical price data",
    },
    { name: "Buy Coin", description: "Executes cryptocurrency purchases" },
    {
      name: "Give Advisor",
      description: "Provides cryptocurrency investment advice",
    },
    {
      name: "Search",
      description: "Performs general cryptocurrency-related searches",
    },
  ];

  return (
    <div className="relative h-dvh">
      {/* Mobile sidebar toggle button */}
      <button
        className="fixed top-2 left-2 z-50 p-2 bg-gray-800 text-white rounded-md md:hidden"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar for mobile */}
      <div
        className={`fixed inset-0 z-40 bg-white transform transition-transform duration-300 ease-in-out md:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="pt-16 h-full">
          <ThreadList />
        </div>
      </div>

      {/* Backdrop for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Desktop layout */}
      <div className="grid h-full md:grid-cols-[200px_1fr] gap-x-2 px-4 py-4">
        <div className="hidden md:block">
          <ThreadList />
        </div>
        <Thread />
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed bottom-4 right-4 h-12 w-12 rounded-full"
            >
              <PenTool className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Available Tools</SheetTitle>
            </SheetHeader>
            <div className="mt-4">
              {tools.map((tool, index) => (
                <div key={index} className="m-4 p-4 border rounded-lg">
                  <h3 className="font-medium">{tool.name}</h3>
                  <p className="text-sm text-gray-500">{tool.description}</p>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
