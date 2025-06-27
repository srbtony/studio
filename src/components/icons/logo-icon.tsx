import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 0 0-3.91 19.33 3.56 3.56 0 0 1-2.2-5.11 10 10 0 1 1 12.22 5.11 3.56 3.56 0 0 1-2.2 5.11A10 10 0 0 0 12 2Z" />
      <path d="M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path d="M12 12a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" />
      <path d="M12 12a5 5 0 1 0-5-5" />
      <path d="M12 12a5 5 0 1 1 5-5" />
      <path d="M7 17a5 5 0 0 0 10 0" />
      <path d="M6.67 7.83l1.42-1.42" />
      <path d="M15.91 6.41l1.42 1.42" />
    </svg>
  );
}
