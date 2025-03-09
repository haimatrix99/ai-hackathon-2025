import {
  ActionBarPrimitive,
  BranchPickerPrimitive,
  ComposerPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
} from "@assistant-ui/react";
import { FC } from "react";
import {
  ArrowDownIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  PencilIcon,
  RefreshCwIcon,
  SendHorizontalIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { ComposerAddAttachment, ComposerAttachments } from "./attachment";
import { ToolFallback } from "../tools/ToolFallback";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="bg-background box-border flex h-full flex-col overflow-hidden"
      style={{
        ["--thread-max-width" as string]: "42rem",
      }}
    >
      <ThreadPrimitive.Viewport className="flex h-full flex-col items-center overflow-y-scroll scroll-smooth bg-inherit px-4 pt-8">
        <ThreadWelcome />

        <ThreadPrimitive.Messages
          components={{
            UserMessage: UserMessage,
            EditComposer: EditComposer,
            AssistantMessage: AssistantMessage,
          }}
        />

        <ThreadPrimitive.If empty={false}>
          <div className="min-h-8 flex-grow" />
        </ThreadPrimitive.If>

        <div className="sticky bottom-0 mt-3 flex w-full max-w-[var(--thread-max-width)] flex-col items-center justify-end rounded-t-lg bg-inherit pb-4">
          <ThreadScrollToBottom />
          <Composer />
        </div>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip="Scroll to bottom"
        variant="outline"
        className="absolute -top-8 rounded-full disabled:invisible"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ThreadWelcome = () => {
  return (
    <ThreadPrimitive.Empty>
      <div className="flex w-full max-w-[var(--thread-max-width)] flex-grow flex-col">
        <div className="flex w-full flex-grow flex-col items-center justify-center">
          <p className="mt-4 font-medium text-center">
            Welcome to the world of blockchain – where trust is built with code,
            transactions are transparent, and the future is decentralized! 🚀
            Let&apos;s dive in and unravel the magic behind this game-changing
            technology!
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
          <Popover>
            <PopoverTrigger className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center">
              <span className="mr-2">💡</span> Common Questions
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <CommonQuestionsSuggestions />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center">
              <span className="mr-2">📰</span> Latest News
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <LatestNewsSuggestions />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium flex items-center justify-center">
              <span className="mr-2">💲</span> Current Prices
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <CurrentPriceSuggestions />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="w-full px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center">
              <span className="mr-2">📊</span> Historical Charts
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <HistoricalChartSuggestions />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger className="w-full px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium flex items-center justify-center">
              <span className="mr-2">🧠</span> Investment Advice
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <InvestmentAdviceSuggestions />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </ThreadPrimitive.Empty>
  );
};

const SuggestionTemplate = ({ prompt, children }) => {
  return (
    <ThreadPrimitive.Suggestion
      className="hover:bg-muted/80 flex w-full flex-col items-start justify-center rounded-lg border p-3 mb-2 transition-colors ease-in"
      prompt={prompt}
      method="replace"
      autoSend
    >
      <span className="line-clamp-2 text-ellipsis text-sm font-semibold">
        {children}
      </span>
    </ThreadPrimitive.Suggestion>
  );
};

const CommonQuestionsSuggestions = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-bold text-center mb-2">Blockchain Basics</h3>
      <SuggestionTemplate prompt="What is blockchain, and how does it work?">
        What is blockchain, and how does it work?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="What are smart contracts and why are they important?">
        What are smart contracts and why are they important?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="What's the difference between proof of work and proof of stake?">
        What&#39;s the difference between proof of work and proof of stake?
      </SuggestionTemplate>
    </div>
  );
};

const LatestNewsSuggestions = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-bold text-center mb-2">Crypto Headlines</h3>
      <SuggestionTemplate prompt="What are the biggest blockchain developments of 2025?">
        What are the biggest blockchain developments of 2025?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="How is blockchain regulation evolving globally?">
        How is blockchain regulation evolving globally?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="What are the latest developments in DeFi?">
        What are the latest developments in DeFi?
      </SuggestionTemplate>
    </div>
  );
};

const CurrentPriceSuggestions = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-bold text-center mb-2">Market Prices</h3>
      <SuggestionTemplate prompt="What is the latest price of Bitcoin?">
        What is the latest price of Bitcoin?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="How are Ethereum prices looking today?">
        How are Ethereum prices looking today?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="Which top 10 cryptocurrencies have gained the most this week?">
        Which top 10 cryptocurrencies have gained the most this week?
      </SuggestionTemplate>
    </div>
  );
};

const HistoricalChartSuggestions = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-bold text-center mb-2">Market Analysis</h3>
      <SuggestionTemplate prompt="Show me Bitcoin's price history for the past 5 years">
        Show me Bitcoin&apos;s price history for the past 5 years
      </SuggestionTemplate>
      <SuggestionTemplate prompt="How has Ethereum performed compared to Bitcoin since 2021?">
        How has Ethereum performed compared to Bitcoin since 2021?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="What were the major market cycles in crypto history?">
        What were the major market cycles in crypto history?
      </SuggestionTemplate>
    </div>
  );
};

const InvestmentAdviceSuggestions = () => {
  return (
    <div className="flex w-full flex-col gap-2">
      <h3 className="font-bold text-center mb-2">Investment Guidance</h3>
      <SuggestionTemplate prompt="What factors should I consider before investing in a cryptocurrency?">
        What factors should I consider before investing in a cryptocurrency?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="How do I create a diversified crypto portfolio?">
        How do I create a diversified crypto portfolio?
      </SuggestionTemplate>
      <SuggestionTemplate prompt="What are the best security practices for storing cryptocurrencies?">
        What are the best security practices for storing cryptocurrencies?
      </SuggestionTemplate>
    </div>
  );
};

const Composer: FC = () => {
  return (
    <ComposerPrimitive.Root className="focus-within:border-ring/20 flex w-full flex-wrap items-center rounded-lg border bg-inherit px-2.5 shadow-sm transition-colors ease-in">
      <ComposerAttachments />
      <ComposerAddAttachment />
      <ComposerPrimitive.Input
        rows={1}
        autoFocus
        placeholder="Write a message..."
        className="placeholder:text-muted-foreground max-h-40 flex-grow resize-none border-none bg-transparent px-2 py-4 text-sm outline-none focus:ring-0 disabled:cursor-not-allowed"
      />
      <ComposerAction />
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  return (
    <>
      <ThreadPrimitive.If running={false}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip="Send"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <SendHorizontalIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </ThreadPrimitive.If>
      <ThreadPrimitive.If running>
        <ComposerPrimitive.Cancel asChild>
          <TooltipIconButton
            tooltip="Cancel"
            variant="default"
            className="my-2.5 size-8 p-2 transition-opacity ease-in"
          >
            <CircleStopIcon />
          </TooltipIconButton>
        </ComposerPrimitive.Cancel>
      </ThreadPrimitive.If>
    </>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid auto-rows-auto grid-cols-[minmax(72px,1fr)_auto] gap-y-2 [&:where(>*)]:col-start-2 w-full max-w-[var(--thread-max-width)] py-4">
      <UserActionBar />

      <div className="bg-muted text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words rounded-3xl px-5 py-2.5 col-start-2 row-start-2">
        <MessagePrimitive.Content />
      </div>

      <BranchPicker className="col-span-full col-start-1 row-start-3 -mr-1 justify-end" />
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="flex flex-col items-end col-start-1 row-start-2 mr-3 mt-2.5"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip="Edit">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  return (
    <ComposerPrimitive.Root className="bg-muted my-4 flex w-full max-w-[var(--thread-max-width)] flex-col gap-2 rounded-xl">
      <ComposerPrimitive.Input className="text-foreground flex h-8 w-full resize-none bg-transparent p-4 pb-0 outline-none" />

      <div className="mx-3 mb-3 flex items-center justify-center gap-2 self-end">
        <ComposerPrimitive.Cancel asChild>
          <Button variant="ghost">Cancel</Button>
        </ComposerPrimitive.Cancel>
        <ComposerPrimitive.Send asChild>
          <Button>Send</Button>
        </ComposerPrimitive.Send>
      </div>
    </ComposerPrimitive.Root>
  );
};

const AssistantMessage: FC = () => {
  return (
    <MessagePrimitive.Root className="grid grid-cols-[auto_auto_1fr] grid-rows-[auto_1fr] relative w-full max-w-[var(--thread-max-width)] py-4">
      <div className="text-foreground max-w-[calc(var(--thread-max-width)*0.8)] break-words leading-7 col-span-2 col-start-2 row-start-1 my-1.5">
        <MessagePrimitive.Content
          components={{ Text: MarkdownText, tools: { Fallback: ToolFallback } }}
        />
      </div>

      <AssistantActionBar />

      <BranchPicker className="col-start-2 row-start-2 -ml-2 mr-2" />
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="text-muted-foreground flex gap-1 col-start-3 row-start-2 -ml-1 data-[floating]:bg-background data-[floating]:absolute data-[floating]:rounded-md data-[floating]:border data-[floating]:p-1 data-[floating]:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip="Copy">
          <MessagePrimitive.If copied>
            <CheckIcon />
          </MessagePrimitive.If>
          <MessagePrimitive.If copied={false}>
            <CopyIcon />
          </MessagePrimitive.If>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip="Refresh">
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
    </ActionBarPrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "text-muted-foreground inline-flex items-center text-xs",
        className
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip="Previous">
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip="Next">
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};

const CircleStopIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 16 16"
      fill="currentColor"
      width="16"
      height="16"
    >
      <rect width="10" height="10" x="3" y="3" rx="2" />
    </svg>
  );
};
