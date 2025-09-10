"use client";

import { Label as LabelPrimitive } from "radix-ui";
import * as React from "react";

import { cn } from "@/lib/utils";

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  isRequired?: boolean;
}

function Label({ className, isRequired, ...props }: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "text-cinza-chumbo text-sm leading-4 font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className,
        isRequired && "after:content-['*'] after:text-red-500 after:ml-1"
      )}
      {...props}
      {...(isRequired && { "aria-required": true })}
    />
  );
}

export { Label };
