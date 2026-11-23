import type { ComponentPropsWithoutRef } from "react";

type ContainerProps = ComponentPropsWithoutRef<"div">;

/** Shared horizontal rhythm for every section on the page. */
export function Container({ className = "", ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-[1152px] px-5 sm:px-6 lg:px-8 ${className}`}
      {...props}
    />
  );
}
