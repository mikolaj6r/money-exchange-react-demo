import React, { MouseEventHandler } from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import classnames from "classnames";

function Content({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className: string;
}) {
  return (
    <DialogPrimitive.Portal>
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div
          className="flex min-h-screen text-center md:block md:px-2 lg:px-4"
          style={{ fontSize: 0 }}
        >
          <DialogPrimitive.Overlay className="hidden fixed inset-0 bg-gray-900 bg-opacity-75 transition-opacity md:block" />
          <span
            className="hidden md:inline-block md:align-middle md:h-screen"
            aria-hidden="true"
          >
            &#8203;
          </span>

          <DialogPrimitive.Content className={className} {...props}>
            {children}
          </DialogPrimitive.Content>
        </div>
      </div>
    </DialogPrimitive.Portal>
  );
}

interface CurrenciesModalProps {
  open: boolean;
  onItemSelected: (arg0?: string) => void;
  data: Array<{
    balance: number | undefined;
    fullName: string;
    shortcut: string;
    symbol: string;
  }>;
}

export default function CurrenciesModal({ open, onItemSelected, data }: CurrenciesModalProps) {
  const Dialog = DialogPrimitive.Root;
  const DialogContent = Content;
  const DialogTitle = DialogPrimitive.Title;
  const DialogClose = DialogPrimitive.Close;

  const onListItemClicked: MouseEventHandler<HTMLLIElement> = (event) => {
    const chosenCurrency = event.currentTarget.dataset.currency;

    if (!chosenCurrency) return;

    onItemSelected(chosenCurrency);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onItemSelected()}>
      <DialogContent className="inline-block align-bottom bg-slate-700 rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-8">
        <DialogTitle className="text-blue-400 text-2xl font-bold ">
          Choose source
        </DialogTitle>
        <DialogClose asChild>
          <button
            type="button"
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
          >
            <span className="sr-only">Close</span>
            <svg
              className="h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </DialogClose>
        <ScrollArea.Root className="h-72">
          <ScrollArea.Viewport className="w-full h-full">
            <ul className="text-base text-white">
              {data.map((item) => (
                <li
                  key={item.shortcut}
                  data-currency={item.shortcut}
                  onClick={onListItemClicked}
                  className={classnames(
                    "rounded-xl",
                    "m-4",
                    "p-4",
                    "flex",
                    "flex-row",
                    "flex-wrap",
                    "justify-between",
                    "gap-1",
                    "bg-slate-800"
                  )}
                >
                  <span>{item.fullName}</span>
                  {item.balance !== undefined && (
                    <span className="text-white text-lg text-right basis-1/2">
                      {item.symbol} {item.balance.toFixed(2)}
                    </span>
                  )}
                  <span className="text-base text-gray-400 basis-full shrink">
                    {item.shortcut}
                  </span>
                </li>
              ))}
            </ul>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="horizontal">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
          <ScrollArea.Corner />
        </ScrollArea.Root>
      </DialogContent>
    </Dialog>
  );
}
