"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  isOnline = false,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & { isOnline?: boolean }) {
  return (
    <div className="relative">
      {isOnline && (
        <div className="absolute bg-emerald-400 z-10 rounded-full border-slate-300 size-3 bottom-0.5 right-0"></div>
      )}
      <AvatarPrimitive.Root
        data-slot="avatar"
        className={cn(
          "relative flex size-8 shrink-0 overflow-hidden rounded-full",
          className
        )}
        {...props}
      />
    </div>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
