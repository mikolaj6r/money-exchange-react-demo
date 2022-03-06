import React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

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

interface ConvertedMoneyModalProps {
  open: boolean;
  onClose: () => void;
  data: { from: string; to: string } | null;
}

export default function ConvertedMoneyModal({
  open,
  onClose,
  data,
}: ConvertedMoneyModalProps) {
  const Dialog = DialogPrimitive.Root;
  const DialogContent = Content;
  const DialogTitle = DialogPrimitive.Title;
  const DialogClose = DialogPrimitive.Close;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="inline-block align-bottom bg-slate-700 rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full p-8">
        <DialogTitle className="text-blue-400 text-2xl font-bold ">
          Successfully converted!
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
        {data && (
          <p className="text-white text-base my-2">
            You sold{" "}
            <span className="text-rose-500 font-bold text-xl">{data.from}</span>{" "}
            for{" "}
            <span className="text-rose-500 font-bold text-xl">{data.to}</span>
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
